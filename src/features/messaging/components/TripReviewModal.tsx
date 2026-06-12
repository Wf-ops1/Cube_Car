import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { useReputationStore } from '../../reputation/stores/reputation.store';
import { ReviewCriterion } from '../../../core/data/reputation/reputation.types';

interface TripReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    carId: string;
    bookingId: string;
    carName: string;
    carImage: string;
    onReviewSubmitted?: (bookingId: string) => void;
}

const generateSafeUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const TripReviewModal: React.FC<TripReviewModalProps> = ({
    isOpen,
    onClose,
    carId,
    bookingId,
    carName,
    carImage,
    onReviewSubmitted
}) => {
    const [rating, setRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);
    const [subRatings, setSubRatings] = useState<Record<'limpeza' | 'manutencao' | 'comunicacao' | 'precisao', number>>({
        limpeza: 0,
        manutencao: 0,
        comunicacao: 0,
        precisao: 0
    });
    const [hoveredSubRatings, setHoveredSubRatings] = useState<Record<'limpeza' | 'manutencao' | 'comunicacao' | 'precisao', number>>({
        limpeza: 0,
        manutencao: 0,
        comunicacao: 0,
        precisao: 0
    });
    const [comment, setComment] = useState('');
    const [isSubmittingLocal, setIsSubmittingLocal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Stable Idempotency Key tied to the mount lifecycle of the Modal instance
    const idempotencyKey = React.useRef(generateSafeUUID());

    const { submitReview, isSubmitting: isStoreSubmitting } = useReputationStore();
    const isSubmitting = isSubmittingLocal || isStoreSubmitting;

    // UX Logic: Only require subratings if overall rating is <= 4
    const isFormValid = rating === 5 || (rating > 0 && rating <= 4 && Object.values(subRatings).every((val: number) => val > 0));

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setIsSubmittingLocal(true);

        try {
            // Build sub-criteria payload
            const subCriteriaPayload = (Object.entries(subRatings) as [ReviewCriterion, number][])
                .filter(([_, score]) => score > 0)
                .map(([criterion, score]) => ({
                    criterion,
                    score
                }));

            await submitReview({
                idempotencyKey: idempotencyKey.current,
                carReferenceId: carId,
                authorId: "user-loggedin", // Mocking current user ID
                overallRating: rating,
                body: comment,
                subCriteria: subCriteriaPayload.length > 0 ? subCriteriaPayload : undefined
            });

            setIsSuccess(true);
            setTimeout(() => {
                if (onReviewSubmitted) {
                    onReviewSubmitted(bookingId);
                } else {
                    onClose();
                }
                // Reset state after closing
                setTimeout(() => {
                    setIsSuccess(false);
                    setRating(0);
                    setSubRatings({ limpeza: 0, manutencao: 0, comunicacao: 0, precisao: 0 });
                    setComment('');
                    idempotencyKey.current = generateSafeUUID(); // Regenerate for the next possible review
                }, 300);
            }, 2000);
        } catch (error) {
            console.error("Erro ao enviar avaliação", error);
        } finally {
            setIsSubmittingLocal(false);
        }
    };

    const criteriaList = [
        { id: 'limpeza', label: 'Limpeza' },
        { id: 'manutencao', label: 'Manutenção' },
        { id: 'comunicacao', label: 'Comunicação' },
        { id: 'precisao', label: 'Precisão' }
    ] as const;

    // ... inside return ...
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Full Screen Backdrop/Container for Mobile & Desktop */}
                    <div className="fixed inset-0 z-[111] flex flex-col justify-end md:justify-center md:items-center bg-transparent pointer-events-none p-0 md:p-4">

                        {/* Background Overlay (Clickable to close on Desktop) */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={!isSubmitting ? onClose : undefined}
                            className="absolute inset-0 z-0 bg-[#1C2230]/60 backdrop-blur-sm pointer-events-auto"
                        />

                        {/* Modal/Drawer Content */}
                        <motion.div
                            initial={{ opacity: 0, y: "100%" }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="bg-white rounded-t-3xl md:rounded-3xl shadow-2xl p-6 w-full max-w-md flex flex-col font-sans overflow-hidden relative pointer-events-auto max-h-[92vh] mt-auto md:mt-0 overflow-y-auto custom-scrollbar"
                        >
                            {/* Ambient Background layer */}
                            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-100 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/3"></div>
                            </div>

                            {/* Drag Handle Indicator (Mobile Only) */}
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-6 md:hidden"></div>

                            {!isSuccess ? (
                                <div className="relative z-10 flex flex-col h-full">
                                    {/* Header / Close */}
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 shadow-sm border border-slate-200/50">
                                                <img src={carImage} alt={carName} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Viagem Concluída</span>
                                                <h3 className="text-base font-bold text-slate-800 leading-tight">Avaliar {carName}</h3>
                                            </div>
                                        </div>
                                        {!isSubmitting && (
                                            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                                <i className="fas fa-times"></i>
                                            </button>
                                        )}
                                    </div>

                                    <div className="mb-8 text-center">
                                        <h2 className="text-2xl font-display font-medium text-[#1C2230] mb-4">
                                            Sua nota geral
                                        </h2>

                                        {/* Star Rating */}
                                        <div className="flex justify-center gap-2 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    disabled={isSubmitting}
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoveredRating(star)}
                                                    onMouseLeave={() => setHoveredRating(0)}
                                                    className="transition-transform hover:scale-110 active:scale-90 p-1"
                                                >
                                                    <i className={`fas fa-star text-5xl transition-colors ${(hoveredRating ? star <= hoveredRating : star <= rating)
                                                        ? 'text-slate-500 drop-shadow-sm'
                                                        : 'text-slate-200'
                                                        }`}></i>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Progressive Disclosure: Only show if rated <= 4 */}
                                    <AnimatePresence>
                                        {rating > 0 && rating <= 4 && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                                animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
                                                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                                            >
                                                <div className="mb-6">
                                                    <p className="text-sm text-slate-500 font-medium mb-4 text-center">O que poderia ter sido melhor?</p>
                                                    <div className="space-y-3 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                                                        {criteriaList.map((criterion) => (
                                                            <div key={criterion.id} className="flex items-center justify-between">
                                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider w-24">{criterion.label}</span>
                                                                <div className="flex gap-1">
                                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                                        <button
                                                                            key={star}
                                                                            type="button"
                                                                            disabled={isSubmitting}
                                                                            onClick={() => setSubRatings(prev => ({ ...prev, [criterion.id]: star }))}
                                                                            onMouseEnter={() => setHoveredSubRatings(prev => ({ ...prev, [criterion.id]: star }))}
                                                                            onMouseLeave={() => setHoveredSubRatings(prev => ({ ...prev, [criterion.id]: 0 }))}
                                                                            className="transition-transform hover:scale-110 active:scale-90 p-1"
                                                                        >
                                                                            <i className={`fas fa-star text-xl transition-colors ${(hoveredSubRatings[criterion.id] ? star <= hoveredSubRatings[criterion.id] : star <= subRatings[criterion.id])
                                                                                ? 'text-slate-500 drop-shadow-sm'
                                                                                : 'text-slate-200'
                                                                                }`}></i>
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Progressive Disclosure: Optional comment to pop up upon 5 stars or general interaction */}
                                    <AnimatePresence>
                                        {rating > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="mb-8">
                                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Comentário (Opcional)</label>
                                                    <textarea
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                        disabled={isSubmitting}
                                                        placeholder={rating === 5 ? "Conte aos outros o que você amou neste carro..." : "Conte mais sobre a sua experiência..."}
                                                        className="w-full bg-[#F8F9FB] border border-slate-200 rounded-2xl p-4 text-sm text-slate-700 outline-none focus:border-[#1C2230] focus:bg-white transition-colors resize-none placeholder:text-slate-400 h-24"
                                                    ></textarea>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="mt-auto pt-4">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!isFormValid || isSubmitting}
                                            className="w-full bg-[#3667AA] text-white py-4 rounded-xl font-bold font-display shadow-[0_4px_15px_-5px_rgba(54,103,170,0.5)] hover:bg-[#2c5691] active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <Spinner size="md" color="white" />
                                            ) : (
                                                'Enviar Avaliação'
                                            )}
                                        </button>
                                        {rating > 0 && rating <= 4 && !isFormValid && (
                                            <p className="text-center text-xs text-rose-500 font-medium mt-3">
                                                Por favor, preencha todos os sub-critérios para nos ajudar a melhorar.
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                // Success State
                                <div className="relative z-10 flex flex-col items-center justify-center text-center py-12 h-full my-auto">
                                    <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6 relative">
                                        <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping"></div>
                                        <i className="fas fa-check text-5xl relative z-10"></i>
                                    </div>
                                    <h2 className="text-2xl font-display font-medium text-[#1C2230] mb-3">Muito Obrigado!</h2>
                                    <p className="text-slate-500">Sua avaliação ajuda a manter a nossa comunidade segura e confiável.</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
