import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

import { SharedVerificationStepper } from '@/features/verification/components/SharedVerificationStepper';

interface VerificationRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigateToVerification: () => void;
}

export const VerificationRequiredModal: React.FC<VerificationRequiredModalProps> = ({ isOpen, onClose, onNavigateToVerification }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 lg:p-8"
                    >
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-20"
                        >
                            <i className="fas fa-times"></i>
                        </button>

                        <SharedVerificationStepper
                            title="🧩 Comece a anunciar"
                            subtitle="Você está a 2 etapas de publicar seu veículo."
                            step1Title="Verificação da conta"
                            step1Status="PENDING"
                            step1Description="Validamos todos os motoristas e proprietários para proteger seu patrimônio e garantir a segurança na plataforma."
                            step1Notice="Você poderá iniciar o cadastro do seu veículo assim que sua verificação for processada."
                            step2Title={
                                <>
                                    Cadastrar veículo
                                </>
                            }
                            step2Description="Desbloqueado após aprovação da conta."
                            onStartVerification={onNavigateToVerification}
                            actionButtonText="Iniciar verificação"
                        />

                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};
