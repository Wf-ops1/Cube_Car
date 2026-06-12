import React from 'react';
import { motion } from 'framer-motion';
import { useOnboardingModal } from './OnboardingModal.logic';

interface OnboardingModalProps {
    onClose: () => void;
    userName: string;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose, userName }) => {
    const { handleContinue } = useOnboardingModal(onClose);

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
                className="relative w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center border border-white/50 overflow-hidden"
            >
                {/* Decorative Background Blur */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-50 to-transparent -z-10"></div>

                {/* Icon */}
                <div className="flex justify-center mb-6">
                    <i className="fas fa-check text-5xl text-green-500"></i>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">
                    Bem-vindo(a) à Cube Car!
                </h2>

                {/* Description */}
                <p className="text-slate-600 mb-8 leading-relaxed">
                    Olá {userName}, sua conta foi criada com sucesso. Agora você faz parte da comunidade que está mudando a forma de se mover.
                </p>

                {/* Features List */}
                <div className="space-y-4 mb-8 text-left bg-gray-50 p-5 rounded-xl border border-gray-100">
                    <div className="flex items-center gap-3">
                        <i className="fas fa-car text-[#3667AA] w-5 text-center"></i>
                        <span className="text-sm font-medium text-slate-700">Alugue carros sem burocracia</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <i className="fas fa-shield-alt text-[#3667AA] w-5 text-center"></i>
                        <span className="text-sm font-medium text-slate-700">Seguro total incluso em todas as viagens</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <i className="fas fa-money-bill-wave text-[#3667AA] w-5 text-center"></i>
                        <span className="text-sm font-medium text-slate-700">Gere renda extra listando seu veículo</span>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleContinue}
                    className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-xl hover:opacity-95 transition-all shadow-glow hover:shadow-glow-hover active:scale-[0.98]"
                >
                    Continuar
                </button>

            </motion.div>
        </div>
    );
};

export default OnboardingModal;
