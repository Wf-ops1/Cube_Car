export interface PaymentData {
    cardNumber: string;
    cardName: string;
    expiry: string;
    cvc: string;
    amount: number;
}

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
}

export type PayoutMethod = 'PIX' | 'BANK_ACCOUNT';
export type PixKeyType = 'CPF' | 'EMAIL' | 'PHONE' | 'RANDOM';

export interface PayoutData {
    id?: string;
    method: PayoutMethod;
    pixKeyType?: PixKeyType;
    pixKey?: string;
    bankDetails?: {
        bankName: string;
        agency: string;
        account: string;
    };
    isDefault?: boolean;
}

export interface EarningsData {
    available: number;
    pending: number;
    currency?: string;
    payoutMethod?: PayoutData;
    history: {
        id: string;
        date: string;
        description: string;
        amount: number;
        status: 'completed' | 'pending' | 'cancelled' | 'processing';
        type: 'receipt' | 'withdrawal';
    }[];
}
