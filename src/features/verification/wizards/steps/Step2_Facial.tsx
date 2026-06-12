import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';
import { motion, AnimatePresence } from 'framer-motion';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';

// --- TYPES & ENUMS ---

enum FaceGateState {
    NO_FACE = 'NO_FACE',
    MULTIPLE_FACES = 'MULTIPLE_FACES',
    RULE_FAIL = 'RULE_FAIL',   // Face detected but violates strict rules
    STABLE = 'STABLE',         // Valid for < 500ms
    COUNTDOWN = 'COUNTDOWN',   // Valid for > 500ms, counting down
    CAPTURED = 'CAPTURED'
}

type FailReason =
    | 'NO_FACE'
    | 'MULTIPLE_FACES'
    | 'NOT_FRONTAL'   // Yaw/Roll fail
    | 'OUT_OF_OVAL'   // Geometric check fail
    | 'TOO_CLOSE'
    | 'TOO_FAR'       // Height Ratio fail
    | 'CENTER_FACE'   // Lateral Fit Fail
    | 'NONE';

interface ValidationResult {
    isValid: boolean;
    reason: FailReason;
    details?: any; // For telemetry
}

// Logic Oval Configuration
// Visual is 280w x 380h.
const OVAL_CONFIG = {
    width: 280,
    height: 380,
    rx: 140,
    ry: 190,
    // "dampening" is now handling the Logical Oval size relative to visual.
    // 1.0 = Exact match. 
    dampening: 1.0
};

// RELAXED THRESHOLDS CONSTANTS
const THRESHOLDS = {
    SYMMETRY: 0.25,        // Was 0.10 then 0.15. Now 0.25 (Very permissive)
    ROLL_PX: 10,           // Was 3 then 5. Now 10.
    CENTER_PX: 40,         // Was 5 then 15. Now 40.
    HEIGHT_MIN: 0.35,      // Was 0.50 then 0.45. Now 0.35.
    HEIGHT_MAX: 0.95,      // Was 0.85 then 0.90. Now 0.95.
    WIDTH_RATIO_MIN: 0.40, // Was 0.60 then 0.50. Now 0.40.
    OVAL_TOLERANCE: 1.2    // Was 1.0 (Strict). Now 1.2 (Allows 20% breakout)
};

const Step2_Facial: React.FC = () => {
    const { updateData, setStepValidity, data } = useUserVerificationWizardStore();
    const videoRef = useRef<HTMLVideoElement>(null);

    // Hardware State
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [cameraError, setCameraError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const streamRef = useRef<MediaStream | null>(null);

    // AI Model
    const [model, setModel] = useState<blazeface.BlazeFaceModel | null>(null);
    const [isModelLoading, setIsModelLoading] = useState(false);

    // Logic State (FSM)
    const [gateState, setGateState] = useState<FaceGateState>(FaceGateState.NO_FACE);
    const [failReason, setFailReason] = useState<FailReason>('NO_FACE');
    const [countdown, setCountdown] = useState<number | null>(null);

    // Telemetry / Timers (Refs)
    const stateRef = useRef<{
        lastValidTime: number | null;
        countdownStartTime: number | null;
    }>({ lastValidTime: null, countdownStartTime: null });

    // --- PURE VALIDATION LOGIC ---

    const validateFace = (
        prediction: blazeface.NormalizedFace,
        videoWidth: number,
        videoHeight: number
    ): ValidationResult => {
        // BlazeFace landmarks: [eyeRight, eyeLeft, nose, mouth, earRight, earLeft]
        const landmarks = prediction.landmarks as [number, number][];
        // Warning: BlazeFace landmark order can be [rightEye, leftEye, nose, mouth, rightEar, leftEar]
        // But "Right" usually means image-right (subject's left).
        // Let's rely on standard index assumptions for now: 0=rightEye, 1=leftEye, 2=nose.
        const rightEye = landmarks[0];
        const leftEye = landmarks[1];
        const nose = landmarks[2];

        // Landscape Bounding Box
        const start = prediction.topLeft as [number, number];
        const end = prediction.bottomRight as [number, number];
        const faceWidth = end[0] - start[0];
        const faceHeight = end[1] - start[1];
        const faceCenterX = start[0] + faceWidth / 2;
        // const faceCenterY = start[1] + faceHeight / 2;

        const cx = videoWidth / 2;
        const cy = videoHeight / 2;

        // --- 1. POSE GATE (Relaxed) ---

        // A. Yaw (Symmetry)
        const distRight = Math.hypot(rightEye[0] - nose[0], rightEye[1] - nose[1]);
        const distLeft = Math.hypot(leftEye[0] - nose[0], leftEye[1] - nose[1]);
        const sumDist = distRight + distLeft;

        // Epsilon Guard
        if (sumDist < 2) return { isValid: false, reason: 'NOT_FRONTAL', details: { msg: "Epsilon Fail" } };

        const diffYaw = Math.abs(distRight - distLeft);
        const symmetryScore = diffYaw / sumDist; // 0 = perfect

        if (symmetryScore > THRESHOLDS.SYMMETRY) {
            return { isValid: false, reason: 'NOT_FRONTAL', details: { type: 'Yaw', val: symmetryScore } };
        }

        // B. Roll (Tilt)
        const rollDiff = Math.abs(leftEye[1] - rightEye[1]);
        if (rollDiff > THRESHOLDS.ROLL_PX) {
            return { isValid: false, reason: 'NOT_FRONTAL', details: { type: 'Roll', val: rollDiff } };
        }

        // C. Centrality (Nose X vs Center)
        const noseOffset = Math.abs(nose[0] - cx);
        if (noseOffset > THRESHOLDS.CENTER_PX) {
            return { isValid: false, reason: 'CENTER_FACE', details: { type: 'NoseCenter', val: noseOffset } };
        }

        // --- 2. FIT GATE (Relaxed) ---

        const videoHeightRatio = faceHeight / videoHeight;

        if (videoHeightRatio < THRESHOLDS.HEIGHT_MIN) {
            return { isValid: false, reason: 'TOO_FAR', details: { ratio: videoHeightRatio } };
        }

        if (videoHeightRatio > THRESHOLDS.HEIGHT_MAX) {
            return { isValid: false, reason: 'TOO_CLOSE', details: { ratio: videoHeightRatio } };
        }

        // Width Fill
        if ((faceWidth / OVAL_CONFIG.width) < THRESHOLDS.WIDTH_RATIO_MIN) {
            return { isValid: false, reason: 'CENTER_FACE', details: { msg: "Width Fail", val: faceWidth } };
        }

        // Center Align (Face Center)
        const faceCenterOffset = Math.abs(faceCenterX - cx);
        if (faceCenterOffset > THRESHOLDS.CENTER_PX) {
            return { isValid: false, reason: 'CENTER_FACE', details: { type: 'FaceCenter', val: faceCenterOffset } };
        }


        // --- 3. GEOMETRIC BINDING (Slightly Permissive) ---
        // Check Points: Nose, Eyes, Chin
        const chin: [number, number] = [start[0] + faceWidth / 2, end[1]];
        const pointsToCheck = [nose, leftEye, rightEye, chin];

        const rx = OVAL_CONFIG.rx * OVAL_CONFIG.dampening;
        const ry = OVAL_CONFIG.ry * OVAL_CONFIG.dampening;

        for (const [px, py] of pointsToCheck) {
            // Ellipse Equation
            const val = (Math.pow(px - cx, 2) / Math.pow(rx, 2)) +
                (Math.pow(py - cy, 2) / Math.pow(ry, 2));

            // Allow values > 1.0 (Breakout) up to TOLERANCE
            if (val > THRESHOLDS.OVAL_TOLERANCE) { // Outside Tolerance
                return { isValid: false, reason: 'OUT_OF_OVAL', details: { val, point: [px, py] } };
            }
        }

        return { isValid: true, reason: 'NONE', details: { sym: symmetryScore } };
    };


    // --- CAMERA ENGINE ---

    const startCamera = async () => {
        setIsCameraOpen(true);
        setIsLoading(true);
        setCameraError(false);
        setGateState(FaceGateState.NO_FACE);

        try {
            if (!model) {
                setIsModelLoading(true);
                await tf.ready();
                const loadedModel = await blazeface.load();
                setModel(loadedModel);
                setIsModelLoading(false);
            }

            if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
                throw new Error("No camera API");
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
                audio: false
            });

            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                // Wait for metadata to ensure dimensions are known
                videoRef.current.onloadedmetadata = () => videoRef.current?.play();
            }
        } catch (err) {
            console.error(err);
            setCameraError(true);
            setIsModelLoading(false);
        } finally {
            setIsLoading(false);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
        setGateState(FaceGateState.NO_FACE);
        setCountdown(null);
        stateRef.current = { lastValidTime: null, countdownStartTime: null };
    };

    // --- MAIN LOOP ---
    useEffect(() => {
        if (!isCameraOpen || cameraError || !model || !videoRef.current || data.selfieImage) return;

        let animationId: number;

        const loop = async () => {
            if (!videoRef.current || videoRef.current.readyState < 2) {
                animationId = requestAnimationFrame(loop);
                return;
            }

            // 1. Detect
            const predictions = await model.estimateFaces(videoRef.current, false);
            const now = Date.now();
            let currentState = FaceGateState.NO_FACE;
            let currentReason: FailReason = 'NO_FACE';

            if (predictions.length === 0) {
                currentState = FaceGateState.NO_FACE;
                currentReason = 'NO_FACE';
            } else if (predictions.length > 1) {
                currentState = FaceGateState.MULTIPLE_FACES;
                currentReason = 'MULTIPLE_FACES';
            } else {
                // Single Face - Strict Validate
                const result = validateFace(
                    predictions[0] as any,
                    videoRef.current.videoWidth,
                    videoRef.current.videoHeight
                );

                // Telemetry (Throttle logic could be added here, currently verbose)
                // console.log(result.details);

                if (!result.isValid) {
                    currentState = FaceGateState.RULE_FAIL;
                    currentReason = result.reason;
                } else {
                    // Valid
                    if (!stateRef.current.lastValidTime) {
                        stateRef.current.lastValidTime = now;
                        currentState = FaceGateState.STABLE;
                        currentReason = 'NONE';
                    } else {
                        const elapsed = now - stateRef.current.lastValidTime;
                        if (elapsed < 500) {
                            currentState = FaceGateState.STABLE;
                            currentReason = 'NONE';
                        } else {
                            currentState = FaceGateState.COUNTDOWN;
                            currentReason = 'NONE';
                        }
                    }
                }
            }

            // 2. Timer Transitions
            // If NOT valid (STABLE or COUNTDOWN), reset EVERYTHING
            if (currentState !== FaceGateState.STABLE && currentState !== FaceGateState.COUNTDOWN) {
                stateRef.current.lastValidTime = null;
                stateRef.current.countdownStartTime = null;
                setCountdown(null);
            }

            // Countdown Tick
            if (currentState === FaceGateState.COUNTDOWN) {
                if (!stateRef.current.countdownStartTime) {
                    stateRef.current.countdownStartTime = now;
                }
                const countElapsed = now - stateRef.current.countdownStartTime;
                const remaining = Math.ceil((3000 - countElapsed) / 1000);

                if (remaining <= 0) {
                    currentState = FaceGateState.CAPTURED;
                    if (!data.selfieImage) capturePhoto(); // Prevent double capture
                } else {
                    setCountdown(remaining);
                }
            }

            setGateState(currentState);
            setFailReason(currentReason);

            animationId = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(animationId);
    }, [isCameraOpen, cameraError, model, data.selfieImage]);


    const capturePhoto = () => {
        if (!videoRef.current) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.translate(canvas.width, 0);
            ctx.scale(-1, 1);
            ctx.drawImage(videoRef.current, 0, 0);
            canvas.toBlob(blob => {
                if (blob) {
                    const file = new File([blob], "selfie_strict.jpg", { type: 'image/jpeg' });
                    updateData({ selfieImage: URL.createObjectURL(blob), selfieFile: file });
                    setStepValidity(true);
                    stopCamera();
                }
            }, 'image/jpeg', 0.9);
        }
    };

    const handleRetake = () => {
        updateData({ selfieImage: undefined });
        setStepValidity(false);
        startCamera();
    };

    // --- RENDER ---
    const getFeedback = () => {
        switch (gateState) {
            case FaceGateState.NO_FACE:
                return { text: "Posicione seu rosto", color: "bg-slate-800/80 text-white", icon: "fa-crop-simple" };
            case FaceGateState.MULTIPLE_FACES:
                return { text: "Apenas uma pessoa", color: "bg-red-500/90 text-white", icon: "fa-users" };
            case FaceGateState.RULE_FAIL:
                if (failReason === 'NOT_FRONTAL') return { text: "Olhe para frente", color: "bg-yellow-500/90 text-white", icon: "fa-eye" };
                if (failReason === 'OUT_OF_OVAL') return { text: "Encaixe no oval", color: "bg-yellow-500/90 text-white", icon: "fa-expand" };
                if (failReason === 'TOO_CLOSE') return { text: "Afaste-se um pouco", color: "bg-yellow-500/90 text-white", icon: "fa-search-minus" };
                if (failReason === 'TOO_FAR') return { text: "Aproxime-se mais", color: "bg-yellow-500/90 text-white", icon: "fa-search-plus" };
                if (failReason === 'CENTER_FACE') return { text: "Centralize o rosto", color: "bg-yellow-500/90 text-white", icon: "fa-arrows-to-dot" };
                return { text: "Ajuste sua posição", color: "bg-yellow-500/90 text-white", icon: "fa-arrows-rotate" };
            case FaceGateState.STABLE:
                return { text: "Não se mexa...", color: "bg-blue-600/90 text-white", icon: "fa-lock" };
            case FaceGateState.COUNTDOWN:
                return { text: "Capturando...", color: "bg-emerald-500/90 text-white", icon: "fa-camera" };
            case FaceGateState.CAPTURED:
                return { text: "Sucesso!", color: "bg-emerald-500 text-white", icon: "fa-check" };
            default:
                return { text: "Carregando...", color: "bg-slate-800/80 text-white", icon: "fa-spinner fa-spin" };
        }
    };

    const feedback = getFeedback();

    const getBorderColor = () => {
        if (gateState === FaceGateState.COUNTDOWN) return 'rgba(16, 185, 129, 1)'; // Emerald
        if (gateState === FaceGateState.STABLE) return 'rgba(37, 99, 235, 1)'; // Blue
        if (gateState === FaceGateState.RULE_FAIL) return 'rgba(234, 179, 8, 0.8)'; // Yellow
        if (gateState === FaceGateState.MULTIPLE_FACES) return 'rgba(239, 68, 68, 0.8)'; // Red
        return 'rgba(255, 255, 255, 0.3)';
    };

    return (
        <div className="flex flex-col h-full justify-center">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-900 mb-2 tracking-tight">
                    Reconhecimento Facial
                </h2>
                <p className="text-slate-500">
                    Posicione seu rosto no centro para validarmos sua identidade.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 max-w-lg mx-auto w-full">
                <div className="bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition-all rounded-[2rem] overflow-hidden flex flex-col items-center justify-center gap-4 relative group border-dashed border-2 h-[450px]">
                    {data.selfieImage ? (
                        <div className="w-full h-full relative group">
                            <img src={data.selfieImage} alt="Preview" className="w-full h-full object-cover" />
                            {/* Positioned TOP-CENTER inside image container - ALWAYS VISIBLE */}
                            <div className="absolute inset-x-0 top-0 flex justify-center pt-8">
                                <button onClick={handleRetake} className="bg-black/40 backdrop-blur-xl border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-base shadow-2xl transition-all duration-300 hover:bg-black/60 hover:scale-105 hover:border-white/50 flex items-center gap-3">
                                    <i className="fas fa-redo text-sm"></i>
                                    <span>Tirar outra foto</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div onClick={startCamera} className="cursor-pointer text-center p-8 group">
                            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-400 group-hover:text-slate-600 transition-colors">
                                <i className="fas fa-camera text-3xl"></i>
                            </div>
                            <h3 className="font-bold text-xl text-slate-700">Iniciar Verificação</h3>
                            <p className="text-slate-400 text-sm">Clique para abrir a câmera</p>
                        </div>
                    )}
                </div>
                {/* E2E Bypass */}
                <button id="e2e-bypass-facial" className="sr-only" onClick={() => {
                    updateData({ selfieImage: 'data:image/jpeg;base64,mock', selfieFile: new File([''], 'mock.jpg') });
                    setStepValidity(true);
                }}>Bypass Facial</button>
            </div>

            {/* FULL SCREEN OVERLAY */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {isCameraOpen && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[99999] bg-black flex flex-col font-sans"
                        >
                            {!cameraError && (
                                <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]" />
                            )}

                            {/* MASK & OVAL */}
                            <div className="absolute inset-0 pointer-events-none z-10">
                                <div className="absolute inset-0 bg-black/60" style={{
                                    maskImage: `radial-gradient(ellipse ${OVAL_CONFIG.width / 2}px ${OVAL_CONFIG.height / 2}px at center, transparent 98%, black 100%)`,
                                    WebkitMaskImage: `radial-gradient(ellipse ${OVAL_CONFIG.width / 2}px ${OVAL_CONFIG.height / 2}px at center, transparent 98%, black 100%)`
                                }} />

                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        animate={{ borderColor: getBorderColor() }}
                                        className="rounded-[50%] border-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative flex items-center justify-center transition-colors duration-200"
                                        style={{ width: OVAL_CONFIG.width, height: OVAL_CONFIG.height }}
                                    >
                                        <AnimatePresence>
                                            {countdown !== null && (
                                                <motion.div
                                                    key={countdown}
                                                    initial={{ scale: 0.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    exit={{ scale: 1.5, opacity: 0 }}
                                                    className="text-8xl font-bold text-white drop-shadow-xl font-display"
                                                >
                                                    {countdown}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                </div>
                            </div>

                            {/* UI CONTROLS */}
                            <div className="relative z-20 flex flex-col h-full justify-between p-6">
                                <div className="flex justify-between items-start pt-4">
                                    <div className="w-10" />
                                    <h3 className="text-white font-medium text-lg drop-shadow-md">Validação de Identidade</h3>
                                    <button onClick={stopCamera} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40"><i className="fas fa-times"></i></button>
                                </div>

                                <div className="absolute top-28 left-0 right-0 flex justify-center pointer-events-none">
                                    <motion.div
                                        key={feedback.text}
                                        initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                                        className={`${feedback.color} backdrop-blur-md px-8 py-4 rounded-full flex items-center gap-4 shadow-xl border border-white/10`}
                                    >
                                        <i className={`fas ${feedback.icon} text-2xl`}></i>
                                        <span className="font-bold text-lg">{feedback.text}</span>
                                    </motion.div>
                                </div>

                                <div className="pb-12 text-center text-white/50 text-xs">
                                    {cameraError && "Camera Error"}
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </div>
    );
};

export default Step2_Facial;
