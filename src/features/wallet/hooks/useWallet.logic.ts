import { useState } from 'react';
import { walletGateway } from '@/core/data/gateways/wallet.gateway';
import { useUser } from '@/core/auth/auth.store';
import { WalletData, Transaction, PayoutMethod, WithdrawalStep } from '../types';

export const useWalletLogic = () => {
    const user = useUser();
    const [hasActivated, setHasActivated] = useState(false);
    const [data, setData] = useState<WalletData>({
        available: 0,
        pending: 0,
        currency: 'R$',
        payoutMethod: null,
        transactions: []
    });

    const [isLoading, setIsLoading] = useState(false);
    const [withdrawalStep, setWithdrawalStep] = useState<WithdrawalStep>('idle');
    const [withdrawalError, setWithdrawalError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'earnings' | 'methods'>('earnings');

    // MAPPERS
    const mapGatewayDataToViewData = (gatewayData: any): WalletData => {
        return {
            available: gatewayData.available,
            pending: gatewayData.pending,
            currency: 'R$', // Default for now as gateway doesn't provide it
            payoutMethod: gatewayData.payoutMethod || null,
            transactions: (gatewayData.history || []).map((tx: any) => ({
                id: tx.id,
                amount: tx.amount,
                description: tx.description.split(' - ')[0] || tx.description,
                type: tx.type === 'receipt' ? 'earning' : 'withdrawal',
                status: tx.status, // Now includes 'processing'
                date: new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase(),
                subtitle: tx.description.split(' - ')[1] || (tx.type === 'receipt' ? 'Viagem' : 'Transferência'),
                icon: tx.type === 'receipt' ? 'fa-car' : 'fa-university'
            }))
        };
    };

    // Simulate "Activation"
    const handleActivate = async () => {
        setIsLoading(true);
        try {
            // Fetch initial data from gateway
            const result = await walletGateway.getBalance(user?.id || 'user-1');

            const viewData = mapGatewayDataToViewData(result);
            setData(viewData);
            setHasActivated(true);
        } catch (e) {
            console.error("Failed to activate wallet", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveMethod = (method: PayoutMethod) => {
        setData(prev => ({ ...prev, payoutMethod: method }));
    };

    const handleDeleteMethod = () => {
        if (confirm("Deseja remover este método? Isso impedirá saques imediatos.")) {
            setData(prev => ({ ...prev, payoutMethod: null }));
        }
    };

    const handleConfirmWithdraw = async (amount: number) => {
        setWithdrawalStep('processing');
        setWithdrawalError(null);

        try {
            if (!data.payoutMethod) throw new Error("Método de pagamento não definido");

            const result = await walletGateway.requestPayout(user?.id || 'user-1', amount, data.payoutMethod);

            // Success Logic
            const newTx: Transaction = {
                id: result.transactionId,
                amount: -amount,
                description: 'Saque solicitado',
                type: 'withdrawal',
                status: 'processing',
                date: 'AGORA',
                subtitle: data.payoutMethod.type === 'pix' ? 'Via Pix' : 'Via TED'
            };

            setData(prev => ({
                ...prev,
                available: prev.available - amount,
                transactions: [newTx, ...prev.transactions]
            }));
            setWithdrawalStep('success');

        } catch (e: any) {
            // [UX Hardening] Limit Feedback
            if (e.message === 'LIMIT_EXCEEDED') {
                setWithdrawalError("O valor excede seu limite diário de R$ 5.000,00.");
                setWithdrawalStep('amount'); // Returning to input
            } else if (e.message === 'INSUFFICIENT_FUNDS') {
                setWithdrawalError("Saldo insuficiente para esta transação.");
                setWithdrawalStep('amount');
            } else {
                setWithdrawalError("Erro ao processar saque. Tente novamente.");
                setWithdrawalStep('amount');
            }
        }
    };

    return {
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
    };
};
