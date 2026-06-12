import React from 'react';
import { motion } from 'framer-motion';
import SocialAuth from './SocialAuth';
import { AuthView } from '../LoginModal.logic';

interface SignupEmailStepProps {
    email: string;
    setEmail: (val: string) => void;
    fieldErrors: Record<string, boolean>;
    setFieldErrors: (val: Record<string, boolean>) => void;
    handleEmailAdvance: (e: React.FormEvent) => void;
    handleSwitchView: (view: AuthView) => void;
    getInputClass: (field: string) => string;
    labelClass: string;
}

const SignupEmailStep: React.FC<SignupEmailStepProps> = ({
    email,
    setEmail,
    fieldErrors,
    setFieldErrors,
    handleEmailAdvance,
    handleSwitchView,
    getInputClass,
    labelClass
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
        >
            <form onSubmit={handleEmailAdvance} className="space-y-4 pt-2">
                <div>
                    <label className={labelClass}>EMAIL</label>
                    <input
                        type="email"
                        placeholder="Digite seu email"
                        className={getInputClass('email')}
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: false });
                        }}
                        autoFocus
                    />
                    {fieldErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">Email é obrigatório</p>}
                </div>

                <button className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-2xl hover:opacity-95 transition-all shadow-glow hover:shadow-glow-hover active:scale-[0.98] border-t border-white/20">
                    Avançar
                </button>
            </form>

            <div className="relative my-6">
                <SocialAuth />
            </div>

            <div className="mt-auto text-center pt-4">
                <p className="text-sm text-slate-600 font-medium">
                    Já tem uma conta?{' '}
                    <button
                        type="button"
                        onClick={() => handleSwitchView('login')}
                        className="text-primary font-bold hover:underline"
                    >
                        Entrar
                    </button>
                </p>
            </div>
        </motion.div>
    );
};

export default SignupEmailStep;
