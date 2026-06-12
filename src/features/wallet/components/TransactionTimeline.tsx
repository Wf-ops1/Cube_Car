import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Transaction } from '../types';

interface TransactionTimelineProps {
    transactions: Transaction[];
}

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'completed': return 'Recebido';
        case 'pending': return 'Pendente';
        case 'processing': return 'Em Trânsito';
        default: return status;
    }
};

const TransactionTimeline: React.FC<TransactionTimelineProps> = ({ transactions }) => {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    if (transactions.length === 0) {
        return (
            <div className="py-20 text-center">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-typography-tertiary opacity-60">
                    Sua jornada financeira começa aqui.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-2xl font-display font-semibold text-[#181824] flex items-center gap-4">
                    <span className="w-1 h-8 bg-[#181824] rounded-full"></span>
                    Extrato de Movimentações
                </h2>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">{transactions.length} Atividades</span>
            </div>

            <div className="relative">
                {/* Vertical Line (Journey Style) */}
                <div className="absolute left-[39px] md:left-[49px] top-6 bottom-6 w-[1px] bg-gray-100 z-0 opacity-50"></div>

                <div className="space-y-4">
                    {transactions.map((transaction, idx) => (
                        <div key={transaction.id} className="relative">
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                onClick={() => setExpandedId(expandedId === transaction.id ? null : transaction.id)}
                                className={`group relative z-10 flex items-center gap-4 md:gap-6 p-4 md:p-5 bg-white rounded-[2rem] border transition-all duration-300 cursor-pointer shadow-sm ${expandedId === transaction.id
                                    ? 'border-[#3667AA]/30 shadow-xl ring-4 ring-[#3667AA]/5'
                                    : 'border-gray-50 hover:border-gray-200 hover:shadow-md'
                                    }`}
                            >
                                {/* Icon Wrapper */}
                                <div className={`shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-base shadow-sm border-2 border-white transition-all duration-500 ${transaction.type === 'earning'
                                    ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white'
                                    : 'bg-[#181824] text-white group-hover:bg-[#3667AA]'
                                    }`}>
                                    <i className={`fas ${transaction.type === 'earning' ? 'fa-arrow-down' : 'fa-arrow-up'} text-lg`}></i>
                                </div>

                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                                    <div className="col-span-1">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">{transaction.date}</p>
                                        <h3 className="font-bold text-[#181824] text-xs md:text-sm leading-tight truncate">{transaction.description}</h3>
                                    </div>

                                    <div className="hidden md:block">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Cód. Referência</p>
                                        <p className="text-[10px] text-gray-500 font-medium truncate tracking-tight">{transaction.subtitle}</p>
                                    </div>

                                    <div className="hidden lg:block">
                                        <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.2em] mb-1">Status</p>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1 h-1 rounded-full ${transaction.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-400'}`}></div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-[#181824]">{getStatusLabel(transaction.status)}</p>
                                        </div>
                                    </div>

                                    <div className="text-right pr-2">
                                        <p className="text-[8px] font-black text-[#3667AA] uppercase tracking-[0.2em] mb-1">Montante</p>
                                        <p className={`font-display font-bold text-base md:text-xl ${transaction.type === 'earning' ? 'text-emerald-600' : 'text-[#181824]'}`}>
                                            {transaction.type === 'earning' ? '+' : '-'} R$ {transaction.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>

                                <div className={`ml-2 transition-all duration-300 ${expandedId === transaction.id ? 'rotate-180 text-[#3667AA]' : 'text-gray-200 group-hover:text-gray-400'}`}>
                                    <i className="fas fa-chevron-down text-[10px]"></i>
                                </div>
                            </motion.div>

                            <AnimatePresence>
                                {expandedId === transaction.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0, y: -20 }}
                                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                                        exit={{ opacity: 0, height: 0, y: -20 }}
                                        className="relative z-0 mx-6 bg-slate-50 border-x border-b border-gray-100 rounded-b-[2rem] overflow-hidden"
                                    >
                                        <div className="p-6 md:p-8 pt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <h4 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Detalhamento Técnico</h4>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-500 font-medium">Valor Base</span>
                                                        <span className="text-[#181824] font-bold">R$ {(transaction.amount * 1.25).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-500 font-medium">Seguros & Proteção</span>
                                                        <span className="text-gray-400">- R$ {(transaction.amount * 0.05).toFixed(2)}</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-blue-500 font-bold">Comissão Cube Car (20%)</span>
                                                        <span className="text-blue-600 font-bold">- R$ {(transaction.amount * 0.2).toFixed(2)}</span>
                                                    </div>
                                                    <div className="h-px bg-gray-200/50 my-2"></div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-[#181824] font-black uppercase tracking-tighter">Crédito Líquido</span>
                                                        <span className="text-emerald-600 font-black">R$ {transaction.amount.toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-white/50 rounded-2xl p-6 border border-white flex flex-col justify-center items-center text-center space-y-3">
                                                <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                                                    <i className="fas fa-file-invoice-dollar"></i>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-[#181824] uppercase tracking-widest leading-tight">Nota Fiscal Emitida</p>
                                                    <p className="text-[9px] text-gray-400 font-medium mt-1 uppercase">Disponível para download</p>
                                                </div>
                                                <button className="text-[9px] font-black text-[#3667AA] uppercase tracking-[0.2em] hover:underline transition-all">Baixar PDF</button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TransactionTimeline;
