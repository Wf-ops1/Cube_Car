export interface WalletGatewayContract {
    getBalance(userId: string): Promise<number>;
    getTransactions(userId: string): Promise<any[]>;
    requestPayout(userId: string, amount: number, method: string): Promise<{ success: boolean; date: string; transactionId: string }>;
    addFunds(userId: string, amount: number, description: string): Promise<void>;
}

class MockWalletGateway implements WalletGatewayContract {
    async getBalance(userId: string): Promise<number> {
        // Mock balance
        return 4500.00;
    }

    async getTransactions(userId: string): Promise<any[]> {
        return [];
    }

    async requestPayout(userId: string, amount: number, method: string): Promise<{ success: boolean; date: string; transactionId: string }> {
        return { success: true, date: new Date().toISOString(), transactionId: `TX-${Date.now()}` };
    }

    async addFunds(userId: string, amount: number, description: string): Promise<void> {
        // Mock implementation
    }
}

export const walletGateway = new MockWalletGateway();
