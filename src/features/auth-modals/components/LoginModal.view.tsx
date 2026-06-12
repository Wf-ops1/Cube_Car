import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@/core/data/auth/auth.types';
import { useLoginModal } from './LoginModal.logic';
import GoogleAuthButton from './auth-methods/GoogleAuthButton';
import EmailAuthForm from './auth-methods/EmailAuthForm';

interface LoginModalProps {
    onClose: () => void;
    onOpenSignup: () => void;
    onLogin?: (user: User) => void;
}

const LoginModal: React.FC<LoginModalProps> = (props) => {
    const { onClose, onOpenSignup } = props;
    const {
        emailAuth,
        googleAuth,
        isLoading,
        handleSuccess
    } = useLoginModal(props);

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
                initial={{ opacity: 0, scale: 0.95, y: 10, x: -20 }} // Slight slide from left
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10, x: -20 }}
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
                        Bem-vindo de volta
                    </p>
                    <h1 className="font-display text-xl font-bold text-slate-900">
                        Acessar conta
                    </h1>
                </div>

                {/* Body - Scrollable */}
                <div className="px-6 pt-2 pb-24 overflow-hidden flex-1 scrollbar-hide flex flex-col justify-center">
                    <GoogleAuthButton
                        onClick={handleGoogleSubmit}
                        loading={googleAuth.loading}
                        disabled={isLoading}
                    />

                    <div className="relative mt-8 mb-4">
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
                        mode="login"
                        form={emailAuth.form}
                        updateField={emailAuth.updateField}
                        onSubmit={handleEmailSubmit}
                        onModeChange={() => { }} // No-op since we're in dedicated login modal
                        loading={emailAuth.loading}
                        error={emailAuth.error}
                        fieldErrors={emailAuth.fieldErrors}
                    />

                    {/* Switch to Signup Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Não tem conta?{' '}
                            <button
                                onClick={onOpenSignup}
                                className="font-bold text-slate-900 hover:text-blue-600 hover:underline transition-colors"
                            >
                                Criar conta
                            </button>
                        </p>
                    </div>

                    {/* DEV TOOLS - ONLY FOR PREVIEW/TESTING */}
                    <div className="mt-8 pt-4 border-t border-slate-100 opacity-50 hover:opacity-100 transition-opacity">
                        <p className="text-[10px] uppercase font-bold text-slate-400 text-center mb-2 tracking-widest">
                            Ambiente de Desenvolvimento
                        </p>
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => handleSuccess({
                                    id: '1',
                                    email: 'user@test.com',
                                    name: 'Usuário Teste',
                                    role: 'traveler',
                                    avatar: '',
                                    isVerified: false,
                                    verification: {
                                        id: 'mock-ver-1',
                                        userId: '1',
                                        status: 'NOT_STARTED',
                                        documents: []
                                    }
                                })}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-bold transition-colors"
                            >
                                Dev: Traveler
                            </button>
                            <button
                                onClick={() => handleSuccess({
                                    id: 'user-host',
                                    name: 'Anfitrião Elite',
                                    email: 'host@cubecar.com',
                                    avatar: 'https://i.pravatar.cc/150?u=host',
                                    isVerified: true,
                                    verification: {
                                        id: 'host-ver-1',
                                        userId: 'user-host',
                                        status: 'APPROVED',
                                        documents: []
                                    },
                                    role: 'host',
                                    bio: 'Apaixonado por carros e tecnologia.',
                                    city: 'São Paulo, SP'
                                })}
                                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded text-[10px] font-bold transition-colors"
                            >
                                Dev: Host
                            </button>

                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginModal;
