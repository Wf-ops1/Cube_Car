import React from 'react';
import { motion } from 'framer-motion';

interface SignupPasswordStepProps {
    password: string;
    handlePasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    showPassword: boolean;
    setShowPassword: (val: boolean) => void;
    passValidation: any;
    fieldErrors: Record<string, boolean>;
    handlePasswordAdvance: (e: React.FormEvent) => void;
    getInputClass: (field: string) => string;
    labelClass: string;
}

const SignupPasswordStep: React.FC<SignupPasswordStepProps> = ({
    password,
    handlePasswordChange,
    showPassword,
    setShowPassword,
    passValidation,
    fieldErrors,
    handlePasswordAdvance,
    getInputClass,
    labelClass
}) => {
    return (
        <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-3 flex-1 flex flex-col pt-2"
            onSubmit={handlePasswordAdvance}
        >
            <div>
                <label className={labelClass}>SENHA</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Crie sua senha"
                        className={getInputClass('password')}
                        value={password}
                        onChange={handlePasswordChange}
                        autoFocus
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                    >
                        <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                </div>

                <div className="mt-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="space-y-2.5">
                        {[
                            { k: 'minLength', label: 'Mínimo de 10 caracteres' },
                            { k: 'hasNumber', label: '1 número' },
                            { k: 'hasLetter', label: '1 letra' },
                            { k: 'hasSpecial', label: '1 caractere especial (exemplo: # ? ! &)' },
                        ].map((item) => {
                            const isMet = passValidation.criteria[item.k as keyof typeof passValidation.criteria];
                            const isError = !isMet && fieldErrors.password;

                            return (
                                <div key={item.k} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${isMet
                                        ? 'bg-green-100 border-green-500'
                                        : isError
                                            ? 'bg-red-50 border-red-500'
                                            : 'bg-white border-gray-300'
                                        }`}>
                                        <i className={`fas ${isMet ? 'fa-check' : (isError ? 'fa-times' : 'fa-check')} text-[10px] transition-all duration-300 ${isMet || isError ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                                            } ${isMet ? 'text-green-600' : 'text-red-500'}`}></i>
                                    </div>
                                    <span className={`text-sm font-medium transition-colors ${isMet ? 'text-slate-700' : (isError ? 'text-red-500' : 'text-slate-400')
                                        }`}>
                                        {item.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            <div className="pt-3 space-y-3 mt-auto">
                <button className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-2xl hover:opacity-95 transition-all shadow-glow hover:shadow-glow-hover active:scale-[0.98] border-t border-white/20">
                    Avançar
                </button>
            </div>
        </motion.form>
    );
};

export default SignupPasswordStep;
