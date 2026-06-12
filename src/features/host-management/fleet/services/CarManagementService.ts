import { z } from 'zod';

export const carRegistrationSchema = z.object({
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.number().min(1950).max(new Date().getFullYear() + 1),
    pricePerDay: z.number().positive(),
    location: z.string().min(1),
    ownerId: z.string().min(1)
});

export type CarRegistrationPayload = z.infer<typeof carRegistrationSchema>;

export class CarManagementService {
    static async registerCar(payload: CarRegistrationPayload) {
        // Validate payload to ensure zero technical debt
        const validated = carRegistrationSchema.parse(payload);
        
        // Mock network delay
        await new Promise(r => setTimeout(r, 500));

        // Returns simulated created car
        return {
            id: 'car_' + Date.now(),
            ...validated,
            status: 'PENDING_APPROVAL'
        };
    }
}
