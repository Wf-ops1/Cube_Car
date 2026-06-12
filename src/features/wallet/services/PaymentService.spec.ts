import { describe, it, expect } from 'vitest';
import { PaymentService } from './PaymentService';

describe('PaymentService', () => {
    it('should process payment and return strict schema', async () => {
        const response = await PaymentService.process(440, 'CREDIT_CARD');
        
        expect(response.status).toBe('SUCCESS');
        expect(response.amount).toBe(440);
        expect(response.transactionId).toBeDefined();
    });
});
