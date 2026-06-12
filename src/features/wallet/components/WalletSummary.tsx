import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WithdrawalStep, PayoutMethod } from '../types';
import { BackButton } from '@/core/components/buttons/BackButton';

interface WalletSummaryProps {
    available: number;
    pending: number;
    currency: string;
    payoutMethod: PayoutMethod | null;
    currentStep: WithdrawalStep;
    onStartWithdraw: () => void;
    onCancelWithdraw: () => void;
    onConfirmWithdraw: (amount: number) => void;
}

const CountUp: React.FC<{ value: number; currency: string; className?: string }> = ({ value, currency, className }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = 0;
        const duration = 1500; // 1.5s
        const startTime = performance.now();

        const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out expo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

            const currentCount = easeProgress * value;
            setDisplayValue(currentCount);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [value]);

    return (
        <span className={className}>
            <span className="text-xl md:text-2xl mr-2 font-medium opacity-30">{currency}</span>
            {displayValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
    );
};

const WalletSummary: React.FC<WalletSummaryProps> = ({
    available,
    pending,
    currency,
    payoutMethod,
    currentStep,
    onStartWithdraw,
    onCancelWithdraw,
    onConfirmWithdraw
}) => {
    const [withdrawAmount, setWithdrawAmount] = useState<string>('');
    const [showBreakdown, setShowBreakdown] = useState(false);

    return (
        <div className="w-full">
            <AnimatePresence mode="wait">
                {currentStep === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* AVAILABLE CARD (Primary Action Hub) */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#181824] rounded-[3rem] p-8 md:p-10 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] flex flex-col justify-between min-h-[300px] relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 w-80 h-80 bg-[#3667AA]/10 rounded-full blur-[100px] -mr-40 -mt-40 transition-all duration-700 group-hover:scale-110"></div>

                                <div className="relative z-10 space-y-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]"></div>
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Saldo Disponível</span>
                                    </div>

                                    <div className="space-y-2">
                                        <CountUp
                                            value={available}
                                            currency={currency}
                                            className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-white tracking-tighter block"
                                        />
                                        <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
                                            Via {payoutMethod?.type?.toUpperCase() || 'MÉTODO PADRÃO'}
                                        </p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={onStartWithdraw}
                                    className="relative z-10 w-full bg-white text-[#181824] font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all mt-8"
                                >
                                    Solicitar Saque
                                </motion.button>
                            </motion.div>

                            {/* PENDING CARD (Frosted Future Aesthetic) */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                onClick={() => setShowBreakdown(!showBreakdown)}
                                className="bg-white/40 backdrop-blur-xl rounded-[3rem] p-8 md:p-10 border border-white/60 shadow-sm flex flex-col justify-between min-h-[300px] group hover:shadow-xl transition-all cursor-pointer relative"
                            >
                                <div className="space-y-8 relative z-10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Em Trânsito</span>
                                        </div>
                                        <motion.i
                                            animate={{ rotate: showBreakdown ? 180 : 0 }}
                                            className="fas fa-chevron-down text-[10px] text-gray-300"
                                        ></motion.i>
                                    </div>

                                    <div className="space-y-2">
                                        <CountUp
                                            value={pending}
                                            currency={currency}
                                            className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-[#181824] tracking-tighter block opacity-60"
                                        />
                                        <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] font-medium flex items-center gap-2">
                                            <i className="fas fa-shield-alt text-[8px] opacity-30"></i>
                                            Aguardando Conciliação
                                        </p>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {showBreakdown ? (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden mt-6"
                                        >
                                            <div className="bg-white/40 rounded-2xl p-4 space-y-3 border border-white/40">
                                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                                    <span>Bruto</span>
                                                    <span className="text-gray-600">{(pending * 1.2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                </div>
                                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-[#3667AA]">
                                                    <span>Taxa Cube (20%)</span>
                                                    <span>-{(pending * 0.2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                </div>
                                                <div className="h-px bg-gray-100"></div>
                                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-[#181824]">
                                                    <span>Líquido</span>
                                                    <span>{pending.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100/50 mt-8 flex items-center justify-between group-hover:bg-white/50 transition-colors">
                                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400">Próximo Lote</span>
                                            <span className="text-[10px] font-black text-[#181824] uppercase tracking-wider">7 dias</span>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {/* WITHDRAWAL RITUAL (Enhanced) */}
                {(currentStep === 'amount' || currentStep === 'processing' || currentStep === 'success') && (
                    <motion.div
                        key="flow"
                        initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                        className="bg-white/90 backdrop-blur-3xl rounded-[4rem] p-10 md:p-20 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-white/50 flex flex-col items-center justify-center min-h-[500px]"
                    >
                        {currentStep === 'amount' && (
                            <div className="flex flex-col items-center space-y-16 w-full max-w-lg">
                                <div className="text-center space-y-4">
                                    <span className="text-[10px] uppercase tracking-[0.5em] text-[#3667AA] font-black">Sacar Saldo</span>
                                    <h2 className="text-4xl md:text-5xl font-display font-bold text-[#181824] tracking-tight">Valor do Resgate</h2>
                                </div>

                                <div className="relative flex items-center justify-center w-full group">
                                    <span className="absolute left-0 md:left-4 text-3xl md:text-5xl font-display text-gray-200 font-medium tracking-tighter">R$</span>
                                    <input
                                        type="number"
                                        autoFocus
                                        value={withdrawAmount}
                                        onChange={e => setWithdrawAmount(e.target.value)}
                                        className="w-full text-center bg-transparent border-b-2 border-[#181824]/5 focus:border-[#3667AA] outline-none text-7xl md:text-9xl font-display font-bold text-[#181824] pb-8 transition-all px-12 md:px-0 placeholder:text-gray-100"
                                        placeholder="0"
                                    />
                                </div>

                                <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => onConfirmWithdraw(parseFloat(withdrawAmount))}
                                        disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > available}
                                        className="w-full bg-[#181824] text-white font-black py-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all disabled:opacity-10 text-[11px] uppercase tracking-[0.3em]"
                                    >
                                        Seguir para Pix
                                    </motion.button>
                                    <div className="flex justify-center w-full pt-4">
                                        <BackButton onClick={onCancelWithdraw} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 'processing' && (
                            <div className="flex flex-col items-center space-y-12">
                                <div className="w-32 h-32 relative">
                                    <div className="absolute inset-0 border-[6px] border-[#3667AA]/5 rounded-full"></div>
                                    <motion.div
                                        className="absolute inset-0 border-[6px] border-t-[#3667AA] rounded-full shadow-[0_0_20px_rgba(54,103,170,0.3)]"
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    ></motion.div>
                                </div>
                                <div className="text-center space-y-4">
                                    <h3 className="text-2xl font-display font-bold text-[#181824] uppercase tracking-widest">Processando</h3>
                                    <p className="text-[10px] text-gray-400 uppercase tracking-[0.4em] font-black animate-pulse">Criptografando Transação...</p>
                                </div>
                            </div>
                        )}

                        {currentStep === 'success' && (
                            <div className="flex flex-col items-center space-y-12 text-center">
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-32 h-32 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-2xl relative"
                                >
                                    <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-20"></div>
                                    <i className="fas fa-check text-5xl"></i>
                                </motion.div>
                                <div className="space-y-4">
                                    <h3 className="text-4xl font-display font-bold text-[#181824]">Tudo certo!</h3>
                                    <p className="text-gray-500 max-w-[320px] mx-auto leading-relaxed font-medium">
                                        Sua jornada financeira continua. O valor estará disponível em sua conta em instantes.
                                    </p>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={onCancelWithdraw}
                                    className="bg-white border border-gray-100 text-[#181824] font-black px-16 py-6 rounded-2xl hover:shadow-2xl transition-all text-[11px] uppercase tracking-[0.3em]"
                                >
                                    Concluir
                                </motion.button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default WalletSummary;
