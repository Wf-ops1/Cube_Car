import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@/core/data/auth/auth.types';
import { useSignupModal } from './SignupModal.logic';
import GoogleAuthButton from './auth-methods/GoogleAuthButton';
import EmailAuthForm from './auth-methods/EmailAuthForm';

interface SignupModalProps {
    onClose: () => void;
    onOpenLogin: () => void;
    onSignup?: (user: User) => void;
}

const SignupModal: React.FC<SignupModalProps> = (props) => {
    const { onClose, onOpenLogin } = props;
    const {
        emailAuth,
        googleAuth,
        isLoading,
        handleSuccess
    } = useSignupModal(props);

    const handleEmailSubmit = async () => {
        const user = await emailAuth.submit();
        if (user) handleSuccess(user);
    };

    const handleGoogleSubmit = async () => {
        const user = await googleAuth.handleGoogleLogin();
        if (user) handleSuccess(user);
    };

    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content - Premium Glass Bento */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }} // Slight slide from right
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                }}
                className="relative w-full max-w-[480px] flex flex-col overflow-hidden font-sans 
                           bg-white border-none shadow-2xl
                           md:rounded-[2.5rem] rounded-t-[2.5rem] md:rounded-b-[2.5rem] rounded-b-none
                           ring-0
                           max-md:fixed max-md:bottom-0 max-md:h-[98dvh] max-md:w-full max-md:pb-safe"
            >
                {/* Header - Static */}
                <div className="pt-6 pb-2 px-6 text-center relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100/30 text-slate-400 hover:text-slate-800 transition-all duration-300"
                        aria-label="Close modal"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>

                    <p className="text-xs text-slate-500 font-medium mb-1">
                        Seja bem-vindo
                    </p>
                    <h1 className="font-display text-xl font-bold text-slate-900">
                        Criar sua conta
                    </h1>
                </div>

                {/* Body - Scrollable */}
                <div className="px-6 pt-2 pb-24 overflow-y-auto flex-1 scrollbar-hide">
                    <GoogleAuthButton
                        onClick={handleGoogleSubmit}
                        loading={googleAuth.loading}
                        disabled={isLoading}
                    />

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-100"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="px-4 bg-white text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                ou
                            </span>
                        </div>
                    </div>

                    <EmailAuthForm
                        mode="signup"
                        form={emailAuth.form}
                        updateField={emailAuth.updateField}
                        onSubmit={handleEmailSubmit}
                        onModeChange={() => { }} // No-op since we're in dedicated signup modal
                        loading={emailAuth.loading}
                        error={emailAuth.error}
                        fieldErrors={emailAuth.fieldErrors}
                    />

                    {/* Switch to Login Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Já tem uma conta?{' '}
                            <button
                                onClick={onOpenLogin}
                                className="font-bold text-slate-900 hover:text-blue-600 hover:underline transition-colors"
                            >
                                Entrar
                            </button>
                        </p>
                        <p className="text-[10px] text-slate-400 mt-6 max-w-[280px] mx-auto leading-relaxed">
                            Ao continuar, você concorda com os Termos de Serviço e a Política de Privacidade da Cube Car.
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupModal;
