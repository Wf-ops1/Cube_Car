import { Car } from '@/shared/types';
import { carsGateway } from '@/core/data/gateways/cars.gateway';

export interface SearchParams {
    query?: string;
    category?: string;
    startDate?: Date;
    endDate?: Date;
    pickupTime?: string;
    dropoffTime?: string;
}

/**
 * Helper to compare times "HH:mm"
 * Returns true if target is within [start, end] inclusive
 */
const isTimeWithinRange = (target: string, start: string, end: string): boolean => {
    const [tH, tM] = target.split(':').map(Number);
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);

    const targetMinutes = tH * 60 + tM;
    const startMinutes = sH * 60 + sM;
    const endMinutes = eH * 60 + eM;

    return targetMinutes >= startMinutes && targetMinutes <= endMinutes;
};

/**
 * SearchCars Use Case
 * Orchestrates the business logic for filtering the car catalog.
 * Atende às Regras de Refino 2.1
 */
export const searchCarsUseCase = async (params: SearchParams): Promise<Car[]> => {
    const allCars = await carsGateway.getAll();

    return allCars.filter(car => {
        // Filter out paused or non-approved ads
        const isAdActive = car.isActiveAd !== false && car.status === 'approved';
        if (!isAdActive) return false;

        // Suporta tanto car.type quanto car.category pela migração
        const carType = car.type || (car as any).category;
        const matchesCategory = !params.category || params.category === 'Todos' || carType === params.category;

        const searchLower = params.query?.toLowerCase() || '';
        const matchesSearch = !searchLower ||
            car.make.toLowerCase().includes(searchLower) ||
            car.model.toLowerCase().includes(searchLower) ||
            car.location.toLowerCase().includes(searchLower) ||
            carType.toLowerCase().includes(searchLower);

        // Filter by Time Availability
        // If car has availabilityHours defined, strict check against params
        // If params are missing, ignore time check
        let matchesTime = true;
        if (car.availabilityHours && params.pickupTime && params.dropoffTime) {
            const isPickupOk = isTimeWithinRange(params.pickupTime, car.availabilityHours.start, car.availabilityHours.end);
            const isDropoffOk = isTimeWithinRange(params.dropoffTime, car.availabilityHours.start, car.availabilityHours.end);
            matchesTime = isPickupOk && isDropoffOk;
        }

        return matchesCategory && matchesSearch && matchesTime;
    });
};
