import { z } from 'zod';

export const paymentResponseSchema = z.object({
  transactionId: z.string(),
  status: z.enum(['SUCCESS', 'FAILED']),
  amount: z.number()
});

export class PaymentService {
  static async process(amount: number, method: string) {
    // Simulando delay da rede
    await new Promise((r) => setTimeout(r, 500));
    
    // Mock blindado por tipagem: sem vazamento de dados de cartão
    return paymentResponseSchema.parse({
      transactionId: 'txn_' + Date.now(),
      status: 'SUCCESS',
      amount
    });
  }
}
