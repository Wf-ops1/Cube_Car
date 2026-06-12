import React from 'react';
import { motion } from 'framer-motion';
import { AuthView } from '../LoginModal.logic';

interface ForgotPasswordFormProps {
    email: string;
    setEmail: (val: string) => void;
    fieldErrors: Record<string, boolean>;
    setFieldErrors: (val: Record<string, boolean>) => void;
    handleSwitchView: (view: AuthView) => void;
    getInputClass: (field: string) => string;
    labelClass: string;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
    email,
    setEmail,
    fieldErrors,
    setFieldErrors,
    handleSwitchView,
    getInputClass,
    labelClass
}) => {
    return (
        <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6 flex-1 flex flex-col"
            onSubmit={(e) => e.preventDefault()}
        >
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
                />
                {fieldErrors.email && <p className="text-xs text-red-500 mt-1 ml-1">Email é obrigatório</p>}
            </div>

            <div className="mt-auto pt-4 space-y-3">
                <button className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-2xl hover:opacity-95 transition-all shadow-glow hover:shadow-glow-hover active:scale-[0.98] border-t border-white/20">
                    Enviar código
                </button>
                <button
                    type="button"
                    onClick={() => handleSwitchView('login')}
                    className="w-full bg-white border border-slate-200 text-slate-600 font-bold py-3.5 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </motion.form>
    );
};

export default ForgotPasswordForm;
