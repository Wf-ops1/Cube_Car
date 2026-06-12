export type TransactionType = 'credit' | 'debit' | 'release' | 'earning' | 'withdrawal';
export type TransactionStatus = 'completed' | 'pending' | 'processing';

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    type: TransactionType;
    status: TransactionStatus;
    date: string;
    icon?: string;
    subtitle?: string; // For richer details like "Nubank" or "Tesla Model 3"
}

export type PayoutMethodType = 'pix' | 'bank';

export interface PixDetails {
    keyType: string;
    key: string;
}

export interface BankDetails {
    bankCode: string;
    agency: string;
    account: string;
    digit: string;
    accountType: 'corrente' | 'poupanca';
}

export interface PayoutMethod {
    type: PayoutMethodType;
    details: PixDetails | BankDetails;
}

export type WithdrawalStep = 'idle' | 'amount' | 'confirm' | 'processing' | 'success';
export type ConfigStep = 'method-select' | 'form-pix' | 'form-bank' | 'saving' | 'success' | 'error';

export interface WalletData {
    available: number;
    pending: number;
    currency: string;
    transactions: Transaction[];
    payoutMethod: PayoutMethod | null;
}
