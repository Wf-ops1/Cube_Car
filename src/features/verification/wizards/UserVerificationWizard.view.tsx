import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/core/auth/auth.store';
import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';
import { BackButton } from '@/core/components/buttons/BackButton';

// Steps
import Step1_CNH from './steps/Step1_CNH';
import Step2_Facial from './steps/Step2_Facial';
import Step3_Review from './steps/Step3_Review';

const UserVerificationWizard: React.FC = () => {
    // Note: 'STEPS' constant removed, we use 'steps' from store state now
    const { isOpen, currentStep, steps, closeWizard, getProgress, stepValidity, nextStep, prevStep, reset, context } = useUserVerificationWizardStore();
    const progress = getProgress();
    const { user } = useAuthStore();
    const [isVerifying, setIsVerifying] = useState(false);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    // Auto-close on Success Step
    useEffect(() => {
        if (currentStep === 'success') {
            const timer = setTimeout(() => {
                closeWizard();
                // reset(); // Don't reset here, let parent handle it or reset on next open
                // Optional: Trigger global toast or redirect here
            }, 5000); // 5 seconds delay for reading
            return () => clearTimeout(timer);
        }
    }, [currentStep, closeWizard, reset]);

    const handleNext = async () => {
        if (currentStep === 'facial') {
            setIsVerifying(true);
            // Simulate Network Delay for verification
            await new Promise(resolve => setTimeout(resolve, 2000));

            setIsVerifying(false);
            setIsVerifying(false);
            // Let the store handle the transition and submission trigger
            nextStep();
        } else if (currentStep === 'success') {
            // Manual close if button clicked (though buttons are hidden usually)
            closeWizard();
            reset();
        } else {
            nextStep();
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 'cnh': return <Step1_CNH />;
            case 'facial': return <Step2_Facial />;
            case 'success': return <Step3_Review />;
            default: return <Step1_CNH />;
        }
    };

    const renderButtons = (isFixed: boolean) => (
        <div className={`${isFixed
            ? 'fixed bottom-4 left-0 right-0 z-[1000] flex justify-center pointer-events-none md:hidden'
            : 'hidden md:flex justify-center mt-8 w-full'
            }`}>
            <div className={`bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 rounded-full p-2 pl-6 pr-2 flex items-center gap-6 transform transition-all hover:scale-[1.02] ${isFixed ? 'pointer-events-auto' : ''}`}>

                <BackButton
                    onClick={prevStep}
                    className={steps.indexOf(currentStep) === 0 || isVerifying ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}
                />

                <div className="h-6 w-px bg-slate-200"></div>

                <button
                    onClick={handleNext}
                    disabled={!stepValidity || isVerifying}
                    className={`bg-[#3667AA] text-white px-8 py-3 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 flex items-center gap-3 transition-all ${stepValidity && !isVerifying
                        ? 'hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5'
                        : 'opacity-50 grayscale cursor-not-allowed'
                        }`}
                >
                    {isVerifying ? (
                        <>
                            <i className="fas fa-spinner fa-spin"></i> Verificando...
                        </>
                    ) : (
                        <>
                            {currentStep === 'facial' ? 'Verificar' : 'Continuar'}
                            <i className={`fas ${currentStep === 'facial' ? 'fa-check' : 'fa-arrow-right'}`}></i>
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: context === 'onboarding' ? 1 : 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] bg-slate-50 text-slate-900 overflow-hidden flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900"
                >
                    {/* Immersive Background Blur */}
                    <div className="fixed top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none opacity-20">
                        <div className="absolute inset-0 bg-blue-900/10"></div>
                        {/* Placeholder avatar if user is null during dev */}
                        <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`} alt="" className="w-full h-full object-cover blur-3xl scale-125" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/90 to-[#F8F9FB]"></div>
                    </div>

                    {/* Header */}
                    <div className="hidden md:flex h-20 px-6 items-center justify-center z-20 absolute top-0 left-0 right-0 pointer-events-none md:pointer-events-auto">

                        {/* Desktop Button (Left - Close Only) - REMOVED (Moved to Card) */}
                        <div className="absolute left-6 flex items-center justify-start pointer-events-auto gap-4">
                            {/* Previous button location */}
                        </div>

                        {/* Desktop Progress Bar (Center) - Always show */}
                        <div className="flex flex-col items-center gap-2 w-1/3 relative z-10">
                            <div className="w-full bg-slate-300 h-1 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#3667AA] to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                Passo {steps.indexOf(currentStep) + 1} de {steps.length}
                            </span>
                        </div>

                        {/* Desktop Close Button (Right - Always Visible if not Onboarding/Skip) */}
                        {context !== 'onboarding' && (
                            <div className="absolute right-6 flex items-center justify-end pointer-events-auto">
                                <button onClick={closeWizard} className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all border border-slate-200/60 shadow-sm group backdrop-blur-md">
                                    <i className="fas fa-times text-slate-700 group-hover:text-slate-900 transition-colors"></i>
                                </button>
                            </div>
                        )}

                        {/* Desktop Skip Button (Absolute Right) - Only on first step AND Onboarding */}
                        {context === 'onboarding' && currentStep === 'cnh' && (
                            <div className="absolute right-6 top-3 pointer-events-auto">
                                <button
                                    onClick={closeWizard}
                                    className="hidden md:flex text-slate-500 hover:text-slate-800 font-bold text-sm uppercase tracking-wider transition-colors bg-white/50 hover:bg-white px-6 py-2 rounded-full border border-transparent hover:border-slate-200"
                                >
                                    Pular etapa
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Main Content Layout */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 px-4 pb-32 md:px-6 md:pt-0">

                        {/* Mobile Header */}
                        {/* Mobile Header */}
                        <div className="md:hidden w-full pt-12 mb-8 relative z-30">
                            {/* Left: Close Button (Only if NOT Onboarding) - Absolute Positioning (MATCHING DESKTOP: RIGHT SIDE & DARKER) */}
                            {context !== 'onboarding' && (
                                <button onClick={closeWizard} className="absolute right-0 top-3 z-20 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 shadow-sm flex items-center justify-center active:scale-95 transition-all">
                                    <i className="fas fa-times text-slate-700"></i>
                                </button>
                            )}

                            {/* Right: Skip Button (Only if Onboarding AND first step) - Absolute Positioning */}
                            {context === 'onboarding' && currentStep === 'cnh' && (
                                <button
                                    onClick={closeWizard}
                                    className="absolute right-0 top-3 z-20 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full border border-slate-100 shadow-sm text-slate-600 font-bold text-xs uppercase tracking-wider active:scale-95 transition-all"
                                >
                                    Pular
                                </button>
                            )}

                            {/* Progress Bar - Always Centered */}
                            <div className="absolute left-1/2 -translate-x-1/2 top-14 flex flex-col items-center gap-1">
                                <div className="w-56 bg-slate-300 h-1.5 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#3667AA] to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.5 }}
                                    />
                                </div>
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                                    Passo {steps.indexOf(currentStep) + 1} de {steps.length}
                                </span>
                            </div>
                        </div>

                        <div className="max-w-4xl mx-auto h-full flex flex-col items-center justify-start pt-4 md:pt-24 min-h-[calc(100vh-160px)]">
                            {/* Master Island (Input Focus) - Centered and larger max-width */}
                            <motion.div
                                layout
                                className="w-full max-w-2xl bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-8 md:p-12 border border-white ring-1 ring-slate-100 relative"
                            >
                                {/* Desktop Close Button (Removed from Card - Moved to Header) */}
                                <motion.div
                                    key={currentStep}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    {renderStep()}
                                </motion.div>
                            </motion.div>

                            {/* Desktop Buttons (Static below card) */}
                            {currentStep !== 'success' && renderButtons(false)}
                        </div>
                    </div>

                    {/* Mobile Floating Buttons (Fixed to bottom) */}
                    {currentStep !== 'success' && (
                        <div className="fixed bottom-4 left-0 right-0 z-[1000] flex justify-center pointer-events-none md:hidden">
                            <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 rounded-full p-2 pl-6 pr-2 flex items-center gap-6 pointer-events-auto transform transition-all hover:scale-[1.02]">

                                <BackButton
                                    onClick={prevStep}
                                    className={steps.indexOf(currentStep) === 0 || isVerifying ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}
                                />

                                <div className="h-6 w-px bg-slate-200"></div>

                                <button
                                    onClick={handleNext}
                                    disabled={!stepValidity || isVerifying}
                                    className={`bg-[#3667AA] text-white px-8 py-3 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 flex items-center gap-3 transition-all ${stepValidity && !isVerifying
                                        ? 'hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5'
                                        : 'opacity-50 grayscale cursor-not-allowed'
                                        }`}
                                >
                                    {isVerifying ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i> Verificando...
                                        </>
                                    ) : (
                                        <>
                                            {currentStep === 'facial' ? 'Verificar' : 'Continuar'}
                                            <i className={`fas ${currentStep === 'facial' ? 'fa-check' : 'fa-arrow-right'}`}></i>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                </motion.div>
            )}
        </AnimatePresence>
    );
};
export default UserVerificationWizard;
