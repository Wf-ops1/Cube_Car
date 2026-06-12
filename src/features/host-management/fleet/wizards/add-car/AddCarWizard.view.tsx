import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackButton } from '@/core/components/buttons/BackButton';
import { useAddCarWizardLogic } from './hooks/useAddCarWizard.logic';
import Step1_Document from './steps/Step1_Document';
import Step2_BasicInfo from './steps/Step2_BasicInfo';
import Step3_Details from './steps/Step3_Details';
import Step4_Photos from './steps/Step4_Photos';
import Step5_Location from './steps/Step5_Location';
import Step6_Pricing from './steps/Step6_Pricing';
import Step7_Review from './steps/Step7_Review';
import { SharedVerificationStepper } from '@/features/verification/components/SharedVerificationStepper';

interface AddCarWizardProps {
    onComplete?: () => void;
    openAuthModal?: (type: 'login' | 'signup') => void;
}

const AddCarWizard: React.FC<AddCarWizardProps> = ({ onComplete, openAuthModal }) => {
    const {
        isOpen,
        currentStep,
        closeWizard,
        progress,
        stepValidity,
        prevStep,
        user,
        isPublishing,
        handleNext,
        STEPS,
        isTopAlignedStep,
        showVerificationPrompt,
        setShowVerificationPrompt,
        handleSaveDraftAndExit,
        handleStartVerification
    } = useAddCarWizardLogic(onComplete, openAuthModal);

    // Lock body scroll
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
    }, [isOpen]);

    const renderStep = () => {
        switch (currentStep) {
            case 'document': return <Step1_Document />;
            case 'basic_info': return <Step2_BasicInfo />;
            case 'details': return <Step3_Details />;
            case 'photos': return <Step4_Photos />;
            case 'location': return <Step5_Location />;
            case 'pricing': return <Step6_Pricing />;
            case 'review': return <Step7_Review />;
            default: return <Step1_Document />;
        }
    };



    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[999] bg-slate-50 text-slate-900 overflow-hidden flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900"
                >
                    {/* Immersive Background Blur (Control Room Style) */}
                    <div className="fixed top-0 left-0 right-0 h-[400px] overflow-hidden pointer-events-none opacity-20">
                        <div className="absolute inset-0 bg-blue-900/10"></div>
                        <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`} alt="" className="w-full h-full object-cover blur-3xl scale-125" />
                        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/90 to-[#F8F9FB]"></div>
                    </div>

                    {/* Header - Minimalist (Floating on Desktop, Hidden on Mobile) */}
                    <div className="hidden md:flex h-20 px-6 items-center justify-between z-20 absolute top-0 left-0 right-0 pointer-events-none md:pointer-events-auto">

                        {/* Desktop Button (Left) */}
                        <div className="flex items-center justify-start pointer-events-auto">
                            <button onClick={closeWizard} className="w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-all border border-slate-200/60 shadow-sm group backdrop-blur-md">
                                <i className="fas fa-times text-slate-400 group-hover:text-slate-900 transition-colors"></i>
                            </button>
                        </div>

                        {/* Desktop Progress Bar (Center) */}
                        <div className="flex flex-col items-center gap-2 w-1/3">
                            <div className="w-full bg-slate-300 h-1 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-[#3667AA] to-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                                Passo {STEPS.indexOf(currentStep) + 1} de {STEPS.length}
                            </span>
                        </div>

                        <div className="w-10"></div> {/* Spacer for symmetry */}
                    </div>

                    {/* Main Content Layout - Split Islands */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-10 px-4 pb-32 md:px-6 md:pt-0">

                        {/* Mobile Header (Static / In-Flow) */}
                        <div className="md:hidden w-full pt-4 mb-8 relative flex items-center justify-between">
                            <button onClick={closeWizard} className="w-10 h-10 rounded-full bg-white flex items-center justify-center transition-all border border-slate-100 shadow-sm active:scale-95 relative z-10">
                                <i className="fas fa-times text-slate-400"></i>
                            </button>

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
                                    Passo {STEPS.indexOf(currentStep) + 1} de {STEPS.length}
                                </span>
                            </div>
                        </div>

                        <div className={`max-w-6xl mx-auto h-full grid md:grid-cols-12 gap-8 min-h-[calc(100vh-160px)] ${isTopAlignedStep ? 'items-start md:pt-16' : 'md:items-center'}`}>
                            {/* Master Island (Input Focus) */}
                            <motion.div
                                layout
                                className="bg-white shadow-2xl shadow-slate-200/50 rounded-[2.5rem] p-8 md:p-12 border border-white ring-1 ring-slate-100 transition-all duration-500 ease-in-out md:col-span-10 lg:col-span-8 md:col-start-2 lg:col-start-3"
                            >
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
                        </div>

                        {/* Spacer for Floating Button */}
                        <div className="h-28 w-full md:h-12 shrink-0"></div>
                    </div>

                    {/* Floating Navigation Bar */}
                    <div className="fixed bottom-4 left-0 right-0 z-[1000] flex justify-center pointer-events-none">
                        <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 rounded-full p-2 pl-6 pr-2 flex items-center gap-6 pointer-events-auto transform transition-all hover:scale-[1.02]">

                            <BackButton
                                onClick={prevStep}
                                className={STEPS.indexOf(currentStep) === 0 || isPublishing ? 'opacity-30 cursor-not-allowed pointer-events-none' : ''}
                            />

                            <div className="h-6 w-px bg-slate-200"></div>

                            <button
                                onClick={handleNext}
                                disabled={!stepValidity || isPublishing}
                                className={`bg-[#3667AA] text-white px-8 py-3 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 flex items-center gap-3 transition-all ${stepValidity && !isPublishing
                                    ? 'hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5'
                                    : 'opacity-50 grayscale cursor-not-allowed'
                                    }`}
                            >
                                {isPublishing ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Publicando...
                                    </>
                                ) : (
                                    <>
                                        {currentStep === 'review' ? (user ? 'Publicar' : 'Criar conta e Salvar') : 'Continuar'}
                                        <i className={`fas ${currentStep === 'review' ? 'fa-rocket' : 'fa-arrow-right'}`}></i>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Internal Verification Modal */}
                    <AnimatePresence>
                        {showVerificationPrompt && (
                            <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setShowVerificationPrompt(false)}
                                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
                                />

                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 lg:p-8 flex flex-col"
                                >
                                    {/* Close button */}
                                    <button
                                        onClick={() => setShowVerificationPrompt(false)}
                                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-20"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>

                                    <SharedVerificationStepper
                                        title="🧩 Falta pouco!"
                                        subtitle="Você está a 2 etapas de publicar seu veículo."
                                        step1Title="Verificação da conta"
                                        step1Status="PENDING"
                                        step1Description="Validamos todos os motoristas e proprietários para proteger seu patrimônio e garantir a segurança na plataforma."
                                        step1Notice="Você poderá finalizar a publicação do seu veículo assim que sua verificação for processada."
                                        step2Title={
                                            <>
                                                Publicar veículo
                                            </>
                                        }
                                        step2Description="Desbloqueado após aprovação da conta."
                                        onStartVerification={handleStartVerification}
                                        actionButtonText="Verificar conta agora"
                                    />
                                    
                                    <div className="mt-6 flex justify-center pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={handleSaveDraftAndExit}
                                            className="flex items-center gap-2 text-slate-600 font-bold text-sm hover:text-blue-700 hover:bg-slate-50 px-6 py-2.5 rounded-xl border border-slate-200 transition-all active:scale-95"
                                        >
                                            <i className="fas fa-bookmark text-slate-400"></i>
                                            Salvar rascunho e ir para a home
                                        </button>
                                    </div>

                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AddCarWizard;
