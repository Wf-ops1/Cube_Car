import React from 'react';
import { motion } from 'framer-motion';

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

interface SignupDetailsStepProps {
    firstName: string;
    setFirstName: (val: string) => void;
    lastName: string;
    setLastName: (val: string) => void;
    dobDay: string;
    setDobDay: (val: string) => void;
    dobMonth: string;
    setDobMonth: (val: string) => void;
    dobYear: string;
    setDobYear: (val: string) => void;
    marketingOptIn: boolean;
    setMarketingOptIn: (val: boolean) => void;
    isLoading: boolean;
    fieldErrors: Record<string, boolean>;
    setFieldErrors: (val: Record<string, boolean>) => void;
    handleFinalSubmit: (e: React.FormEvent) => void;
    getInputClass: (field: string) => string;
    labelClass: string;
}

const SignupDetailsStep: React.FC<SignupDetailsStepProps> = ({
    firstName,
    setFirstName,
    lastName,
    setLastName,
    dobDay,
    setDobDay,
    dobMonth,
    setDobMonth,
    dobYear,
    setDobYear,
    marketingOptIn,
    setMarketingOptIn,
    isLoading,
    fieldErrors,
    setFieldErrors,
    handleFinalSubmit,
    getInputClass,
    labelClass
}) => {
    return (
        <motion.form
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4 flex-1 flex flex-col pt-2"
            onSubmit={handleFinalSubmit}
        >
            <div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className={labelClass}>NOME</label>
                        <input
                            type="text"
                            className={getInputClass('firstName')}
                            value={firstName}
                            onChange={e => {
                                setFirstName(e.target.value);
                                if (fieldErrors.firstName) setFieldErrors({ ...fieldErrors, firstName: false });
                            }}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>SOBRENOME</label>
                        <input
                            type="text"
                            className={getInputClass('lastName')}
                            value={lastName}
                            onChange={e => {
                                setLastName(e.target.value);
                                if (fieldErrors.lastName) setFieldErrors({ ...fieldErrors, lastName: false });
                            }}
                            disabled={isLoading}
                        />
                    </div>
                </div>
                <p className="text-slate-400 text-xs font-medium mt-1 ml-1">
                    Digite seu nome como aparece na CNH.
                </p>
            </div>

            <div>
                <div className="flex items-center justify-between mb-1.5 ml-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">DATA DE NASCIMENTO</label>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <input
                        type="number"
                        placeholder="Dia"
                        min="1"
                        max="31"
                        className={getInputClass('dobDay')}
                        value={dobDay}
                        onChange={e => {
                            setDobDay(e.target.value);
                            if (fieldErrors.dobDay) setFieldErrors({ ...fieldErrors, dobDay: false });
                        }}
                        disabled={isLoading}
                    />

                    <div className="relative">
                        <select
                            className={`${getInputClass('dobMonth')} appearance-none`}
                            value={dobMonth}
                            onChange={e => {
                                setDobMonth(e.target.value);
                                if (fieldErrors.dobMonth) setFieldErrors({ ...fieldErrors, dobMonth: false });
                            }}
                            disabled={isLoading}
                        >
                            <option value="" disabled>Mês</option>
                            {MONTHS.map((m, idx) => (
                                <option key={idx} value={m}>{m}</option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <i className="fas fa-chevron-down text-xs"></i>
                        </div>
                    </div>

                    <input
                        type="number"
                        placeholder="Ano"
                        min="1900"
                        max={new Date().getFullYear()}
                        className={getInputClass('dobYear')}
                        value={dobYear}
                        onChange={e => {
                            setDobYear(e.target.value);
                            if (fieldErrors.dobYear) setFieldErrors({ ...fieldErrors, dobYear: false });
                        }}
                        disabled={isLoading}
                    />
                </div>

                <div className="mt-2 ml-1 flex flex-col gap-1">
                    <p className="text-slate-400 text-xs font-medium">
                        Por que precisamos da sua data de nascimento?
                    </p>
                    <button type="button" className="text-primary text-xs font-bold text-left hover:underline w-fit">
                        Saiba mais.
                    </button>
                </div>
            </div>

            <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            className="peer sr-only"
                            checked={marketingOptIn}
                            onChange={(e) => setMarketingOptIn(e.target.checked)}
                            disabled={isLoading}
                        />
                        <div className="w-5 h-5 border-2 border-slate-300 rounded-md peer-checked:bg-primary peer-checked:border-primary transition-all"></div>
                        <i className="fas fa-check text-white text-xs absolute left-1 top-1 opacity-0 peer-checked:opacity-100 transition-opacity"></i>
                    </div>
                    <span className="text-xs text-slate-600 font-medium">
                        Receber promoções por email.
                    </span>
                </label>
            </div>

            <div className="pt-3 space-y-3 mt-auto">
                <button
                    className="w-full bg-brand-gradient text-white font-bold py-3.5 rounded-2xl hover:opacity-95 transition-all shadow-glow hover:shadow-glow-hover active:scale-[0.98] border-t border-white/20 flex items-center justify-center min-h-[52px]"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="load-row">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    ) : (
                        'Criar conta'
                    )}
                </button>
            </div>

            <div className="text-center pt-6 pb-2">
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-[280px] mx-auto">
                    Ao selecionar Criar conta, eu concordo com os{' '}
                    <button className="font-bold underline">Termos de Serviço</button>, os{' '}
                    <button className="font-bold underline">Termos de Serviço de Pagamentos</button>, a{' '}
                    <button className="font-bold underline">Política de Privacidade</button> e a{' '}
                    <button className="font-bold underline">Política de Não Discriminação</button> da Cube Car.
                </p>
            </div>
        </motion.form>
    );
};

export default SignupDetailsStep;
