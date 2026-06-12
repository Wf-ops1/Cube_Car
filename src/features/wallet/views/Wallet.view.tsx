import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WalletSummary from '../components/WalletSummary';
import TransactionTimeline from '../components/TransactionTimeline';
import WalletMethods from '../components/WalletMethods';
import { WalletData, Transaction, PayoutMethod, WithdrawalStep } from '../types';
import { EmptyState } from '@/shared/components/states/EmptyState';
import { BackButton } from '@/core/components/buttons/BackButton';
import { useWalletLogic } from '../hooks/useWallet.logic';

const MOCK_DATA: WalletData = {
    available: 1250.00,
    pending: 340.50,
    currency: 'R$',
    payoutMethod: {
        type: 'pix',
        details: { keyType: 'email', key: 'rewards@cubecar.com' }
    },
    transactions: [
        { id: '1', amount: 229.50, description: 'Tesla Model 3', type: 'earning', status: 'completed', date: '18 OUT • 14:30', subtitle: 'Viagem Concluída' },
        { id: '2', amount: 297.00, description: 'Jeep Wrangler', type: 'earning', status: 'completed', date: '05 SET • 09:15', subtitle: 'Viagem Concluída' },
        { id: '3', amount: -500.00, description: 'Saque PIX', type: 'withdrawal', status: 'completed', date: '01 SET', subtitle: 'Nubank' },
        { id: '4', amount: 890.00, description: 'Porsche Taycan', type: 'earning', status: 'processing', date: 'HOJE • 10:00', subtitle: 'Aguardando Liberação' },
    ]
};

const WalletView: React.FC = () => {
    const {
        hasActivated,
        data,
        isLoading,
        withdrawalStep, setWithdrawalStep,
        withdrawalError, setWithdrawalError,
        activeTab, setActiveTab,
        handleActivate,
        handleSaveMethod,
        handleDeleteMethod,
        handleConfirmWithdraw
    } = useWalletLogic();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#FDFDFD] text-typography-primary selection:bg-typography-primary/10 overflow-x-hidden noise-bg"
        >
            {/* AMBIENT BACKGROUND (Optimized) */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-50">
                <div
                    className="absolute top-0 right-0 w-[600px] h-[600px] opacity-[0.05]"
                    style={{ background: 'radial-gradient(circle, #3667AA 0%, transparent 70%)' }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-[0.03]"
                    style={{ background: 'radial-gradient(circle, #3667AA 0%, transparent 70%)' }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8 lg:py-16">

                {/* TOP NAVIGATION */}
                <div className="flex items-center justify-between mb-8 lg:mb-12">
                    <BackButton onClick={() => window.history.back()} />

                    {/* Only show status if wallet is active */}
                    {hasActivated && (
                        <div className="flex flex-col items-end gap-1.5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-sm">
                                <span className="w-1.5 h-1.5 bg-[#3667AA] rounded-full animate-pulse"></span>
                                <span className="text-[9px] font-bold uppercase tracking-wider text-[#1C2230]">Central de Recebimento</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* UX MATURITY SWITCH: Never Used vs Active */}
                {!hasActivated ? (
                    <EmptyState
                        title="Sua Carteira Digital"
                        description="Receba seus ganhos com segurança, gerencie saques via Pix e acompanhe cada centavo da sua jornada no Cube Car."
                        icon="fa-wallet"
                        actionLabel="Ativar Carteira Grátis"
                        onAction={handleActivate}
                        isActionLoading={isLoading}
                        className="py-20 border-none"
                    />
                ) : (
                    <main className="space-y-10 md:space-y-16">
                        {/* EDITORIAL HEADER */}
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-[#3667AA]/5 rounded-md">
                                <p className="text-[#3667AA] font-bold uppercase tracking-[0.3em] text-[10px]">Financeiro</p>
                            </div>
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold leading-[1.1] tracking-tight text-[#1C2230]">
                                Ganhos &<br />Movimentações
                            </h1>
                        </div>

                        {/* TABS (Dashboard Style) */}
                        <div className="bg-gray-100/80 p-1.5 rounded-2xl flex items-center relative gap-1 border border-gray-200/50 w-full md:max-w-[400px]">
                            <button
                                onClick={() => setActiveTab('earnings')}
                                className={`relative z-10 flex-1 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'earnings' ? 'text-[#1C2230]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                Meus Ganhos
                            </button>
                            <button
                                onClick={() => setActiveTab('methods')}
                                className={`relative z-10 flex-1 py-2.5 text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'methods' ? 'text-[#1C2230]' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                Como Receber
                            </button>

                            <motion.div
                                className="absolute bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-xl h-[calc(100%-12px)] top-1.5"
                                initial={false}
                                animate={{
                                    left: activeTab === 'earnings' ? '6px' : 'calc(50% + 2px)',
                                    width: 'calc(50% - 8px)'
                                }}
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            />
                        </div>

                        <AnimatePresence mode="wait">
                            {activeTab === 'earnings' ? (
                                <motion.div
                                    key="tab-earnings"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="space-y-12 lg:space-y-20"
                                >
                                    <WalletSummary
                                        available={data.available}
                                        pending={data.pending}
                                        currency={data.currency}
                                        payoutMethod={data.payoutMethod}
                                        currentStep={withdrawalStep}
                                        onStartWithdraw={() => setWithdrawalStep('amount')}
                                        onCancelWithdraw={() => setWithdrawalStep('idle')}
                                        onConfirmWithdraw={handleConfirmWithdraw}
                                    />

                                    <TransactionTimeline transactions={data.transactions} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="tab-methods"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.4 }}
                                    className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden p-8 md:p-12"
                                >
                                    <WalletMethods
                                        currentMethod={data.payoutMethod}
                                        onSave={handleSaveMethod}
                                        onDelete={handleDeleteMethod}
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                )}
            </div>

            {/* Ambient Footer */}
            <footer className="py-20 text-center opacity-30 mt-auto">
                <p className="text-[10px] uppercase tracking-[0.5em] font-bold text-[#1C2230]">Cube Car Financial &middot; 2025</p>
            </footer>
        </motion.div>
    );
};

export default WalletView;
