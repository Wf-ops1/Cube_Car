import { describe, it, expect } from 'vitest';
import { CarManagementService } from './CarManagementService';

describe('CarManagementService', () => {
    it('should reject invalid car data via Zod schema', async () => {
        await expect(CarManagementService.registerCar({
            make: '', // invalid
            model: 'Model 3',
            year: 2022,
            pricePerDay: 150,
            location: 'SP',
            ownerId: 'u1'
        })).rejects.toThrow();
    });

    it('should register car successfully with valid data', async () => {
        const car = await CarManagementService.registerCar({
            make: 'Tesla',
            model: 'Model 3',
            year: 2022,
            pricePerDay: 150,
            location: 'São Paulo',
            ownerId: 'u1'
        });

        expect(car.id).toBeDefined();
        expect(car.status).toBe('PENDING_APPROVAL');
        expect(car.make).toBe('Tesla');
    });
});
