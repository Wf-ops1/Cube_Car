export interface PaymentGatewayContract {
    processPayment(amount: number, method: string): Promise<{ success: boolean; error?: string }>;
    refund(transactionId: string): Promise<boolean>;
    getStatus(transactionId: string): Promise<'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'>;
    processCreditCard(cardData: any): Promise<{ success: boolean; error?: string }>;
}

class MockPaymentGateway implements PaymentGatewayContract {
    async processPayment(amount: number, method: string): Promise<{ success: boolean; error?: string }> {
        console.log(`Processing ${amount} via ${method}`);
        return { success: true };
    }

    async processCreditCard(cardData: any): Promise<{ success: boolean; error?: string }> {
        console.log('Processing credit card', cardData);
        return { success: true };
    }

    async refund(transactionId: string): Promise<boolean> {
        console.log(`Refunding transaction ${transactionId}`);
        return true;
    }

    async getStatus(transactionId: string): Promise<'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'> {
        console.log(`Checking status for ${transactionId}`);
        return 'COMPLETED';
    }
}

export const paymentGateway = new MockPaymentGateway();
