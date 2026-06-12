import React, { FormEvent, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/core/data/auth/auth.types';
import { Spinner } from '@/shared/components/ui/Spinner';
import { AuthMode, FieldErrors, AuthFormData } from '../../types';
import { AUTH_CONFIG } from '../../constants/authConfig';

interface EmailAuthFormProps {
    mode: AuthMode;
    form: AuthFormData;
    updateField: (field: keyof AuthFormData, value: string) => void;
    onSubmit: () => Promise<any>;
    onModeChange: (mode: AuthMode) => void;
    loading: boolean;
    error: string | null;
    fieldErrors: FieldErrors;
}

const EmailAuthForm: React.FC<EmailAuthFormProps> = ({
    mode,
    form,
    updateField,
    onSubmit,
    onModeChange,
    loading,
    error,
    fieldErrors
}) => {
    const isSignup = mode === 'signup';
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

    // Password strength calculation for signup
    const getPasswordStrength = () => {
        if (!isSignup || !form.password) return null;

        const checks = {
            minLength: form.password.length >= AUTH_CONFIG.PASSWORD.MIN_LENGTH_SIGNUP,
            hasLetter: /[a-zA-Z]/.test(form.password),
            hasNumber: /[0-9]/.test(form.password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(form.password),
        };

        const metCount = Object.values(checks).filter(Boolean).length;

        return {
            checks,
            strength: metCount === 4 ? 'forte' : metCount >= 2 ? 'média' : 'fraca',
            color: metCount === 4 ? 'text-green-600' : metCount >= 2 ? 'text-yellow-600' : 'text-red-600',
            bgColor: metCount === 4 ? 'bg-green-500' : metCount >= 2 ? 'bg-yellow-500' : 'bg-red-500'
        };
    };

    const passwordStrength = getPasswordStrength();

    // Shared styling
    const getInputClass = (hasError: boolean) => {
        return `w-full border rounded-xl px-4 py-4 outline-none transition-all duration-200 
                text-slate-900 font-medium placeholder-slate-400
                bg-slate-50 hover:bg-slate-100 focus:bg-white
      ${hasError
                ? 'border-red-500/50 focus:ring-2 focus:ring-red-500/10'
                : 'border-transparent focus:border-slate-200 focus:ring-4 focus:ring-slate-100'}`;
    };

    const labelClass = "block text-[11px] font-extrabold text-slate-500 uppercase mb-2 ml-2 tracking-widest opacity-80";

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        await onSubmit();
    };

    const handleForgotPassword = () => {
        // Simulate sending email
        setForgotPasswordSent(true);
        setTimeout(() => {
            setForgotPasswordSent(false);
            setShowForgotPassword(false);
        }, 3000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                </div>
            )}

            <div>
                <label className={labelClass}>Email</label>
                <input
                    type="email"
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={getInputClass(!!fieldErrors.email)}
                    disabled={loading}
                />
                {fieldErrors.email && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{fieldErrors.email}</p>}
            </div>

            <div>
                <label className={labelClass}>Senha</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => updateField('password', e.target.value)}
                        className={getInputClass(!!fieldErrors.password)}
                        disabled={loading}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-2"
                        tabIndex={-1}
                    >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                </div>

                {fieldErrors.password && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{fieldErrors.password}</p>}

                {/* Compact Password Strength Indicator for Signup */}
                {isSignup && form.password && passwordStrength && (
                    <div className="mt-2 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${passwordStrength.bgColor} transition-all duration-300`}
                                    style={{ width: `${(Object.values(passwordStrength.checks).filter(Boolean).length / 4) * 100}%` }}
                                ></div>
                            </div>
                            <span className={`text-[10px] uppercase font-bold ${passwordStrength.color} tracking-wider`}>
                                {passwordStrength.strength}
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
                            <div className={`flex items-center gap-1 ${passwordStrength.checks.minLength ? 'text-green-600' : 'text-slate-400'}`}>
                                <i className={`fas ${passwordStrength.checks.minLength ? 'fa-check' : 'fa-circle text-[6px]'}`}></i>
                                <span>Mín. 10</span>
                            </div>
                            <div className={`flex items-center gap-1 ${passwordStrength.checks.hasLetter ? 'text-green-600' : 'text-slate-400'}`}>
                                <i className={`fas ${passwordStrength.checks.hasLetter ? 'fa-check' : 'fa-circle text-[6px]'}`}></i>
                                <span>Letras</span>
                            </div>
                            <div className={`flex items-center gap-1 ${passwordStrength.checks.hasNumber ? 'text-green-600' : 'text-slate-400'}`}>
                                <i className={`fas ${passwordStrength.checks.hasNumber ? 'fa-check' : 'fa-circle text-[6px]'}`}></i>
                                <span>Números</span>
                            </div>
                            <div className={`flex items-center gap-1 ${passwordStrength.checks.hasSpecial ? 'text-green-600' : 'text-slate-400'}`}>
                                <i className={`fas ${passwordStrength.checks.hasSpecial ? 'fa-check' : 'fa-circle text-[6px]'}`}></i>
                                <span>Especial</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Enhanced Forgot Password Flow */}
                {!isSignup && !showForgotPassword && (
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-slate-500 text-xs font-semibold hover:text-primary transition-colors"
                            disabled={loading}
                        >
                            Esqueceu a senha?
                        </button>
                    </div>
                )}

                {!isSignup && showForgotPassword && (
                    <div className="mt-4 p-4 rounded-r-xl bg-blue-50/50 border-l-4 border-primary animate-in fade-in slide-in-from-left-2 duration-300">
                        {!forgotPasswordSent ? (
                            <>
                                <div className="flex items-center gap-2 mb-2">
                                    <i className="fas fa-key text-primary text-sm"></i>
                                    <h4 className="text-sm font-bold text-slate-900">Recuperar Senha</h4>
                                </div>
                                <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                                    Enviaremos um link seguro para <span className="font-semibold text-slate-900 block mt-0.5">{form.email || 'seu email'}</span>
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        disabled={!form.email || !form.email.includes('@')}
                                        className="flex-1 bg-primary text-white text-xs font-bold py-2 px-3 rounded-lg hover:brightness-110 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Enviar Link
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowForgotPassword(false)}
                                        className="px-3 text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-lg transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-3 text-green-700 py-1">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <i className="fas fa-check text-sm"></i>
                                </div>
                                <div>
                                    <p className="text-xs font-bold">Email enviado!</p>
                                    <p className="text-[10px] opacity-80">Verifique sua caixa de entrada</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isSignup && (
                <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className={labelClass}>Nome Completo</label>
                    <input
                        type="text"
                        placeholder="Ex: João da Silva"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className={getInputClass(!!fieldErrors.name)}
                        disabled={loading}
                    />
                    {fieldErrors.name && <p className="text-xs text-red-500 mt-1 ml-1 font-medium">{fieldErrors.name}</p>}
                </div>
            )}

            <div className="pt-2">

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl 
                               transition-all duration-300 transform
                               shadow-[0_10px_30px_-10px_rgba(15,23,42,0.4)] hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.5)]
                               active:scale-[0.98] border-t border-white/10
                               disabled:opacity-70 disabled:cursor-not-allowed 
                               flex justify-center items-center gap-2 text-base tracking-wide"
                >
                    {loading && <Spinner size="sm" color="white" />}
                    <span>{isSignup ? 'Concluir Cadastro' : 'Entrar'}</span>
                </button>
            </div>
        </form>
    );
};

export default EmailAuthForm;
