import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
vi.mock('zustand/middleware', () => ({ persist: (c: any) => c, devtools: (c: any) => c }));

import { useDraftBookingStore } from './draftBooking.store';

describe('DraftBooking Store', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        useDraftBookingStore.setState({ draft: null });
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should create a draft booking with default TTL and notify config', () => {
        vi.setSystemTime(new Date('2024-01-01T10:00:00Z').getTime());
        
        const mockDraftData = {
            carId: 'c1',
            carSnapshot: { make: 'Toyota', model: 'Corolla', imageUrl: 'img.jpg', pricePerDay: 100 },
            dates: { startDate: '2024-01-10', endDate: '2024-01-12', startTime: '10:00', endTime: '10:00' },
            priceSnapshot: { rentalCost: 200, serviceFee: 20, total: 220, days: 2 },
            userId: 'u1'
        };

        useDraftBookingStore.getState().createDraft(mockDraftData);
        
        const draft = useDraftBookingStore.getState().draft;
        expect(draft).not.toBeNull();
        expect(draft?.carId).toBe('c1');
        expect(draft?.createdAt).toBe(new Date('2024-01-01T10:00:00Z').getTime());
        expect(draft?.ttl).toBe(24 * 60 * 60 * 1000); // 24 hours
        expect(draft?.notifyWhenApproved).toBe(true);
    });

    it('should update partial fields of an existing draft', () => {
        const mockDraftData = {
            carId: 'c1',
            carSnapshot: { make: 'Toyota', model: 'Corolla', imageUrl: 'img.jpg', pricePerDay: 100 },
            dates: { startDate: '2024-01-10', endDate: '2024-01-12', startTime: '10:00', endTime: '10:00' },
            priceSnapshot: { rentalCost: 200, serviceFee: 20, total: 220, days: 2 },
            userId: 'u1'
        };

        useDraftBookingStore.getState().createDraft(mockDraftData);
        
        // Update price
        useDraftBookingStore.getState().updateDraft({
            priceSnapshot: { rentalCost: 300, serviceFee: 30, total: 330, days: 3 }
        });

        const draft = useDraftBookingStore.getState().draft;
        expect(draft?.priceSnapshot.total).toBe(330);
        expect(draft?.carId).toBe('c1'); // other fields remain untouched
    });

    it('should not throw on update if draft is null', () => {
        expect(() => useDraftBookingStore.getState().updateDraft({ userId: 'u2' })).not.toThrow();
        expect(useDraftBookingStore.getState().draft).toBeNull();
    });

    it('should clear the draft', () => {
        useDraftBookingStore.setState({ draft: { carId: 'c1' } as any });
        useDraftBookingStore.getState().clearDraft();
        expect(useDraftBookingStore.getState().draft).toBeNull();
    });

    it('should correctly evaluate draft expiration based on TTL', () => {
        const baseTime = new Date('2024-01-01T10:00:00Z').getTime();
        vi.setSystemTime(baseTime);

        useDraftBookingStore.getState().createDraft({
            carId: 'c1',
            carSnapshot: { make: 'Toyota', model: 'Corolla', imageUrl: 'img.jpg', pricePerDay: 100 },
            dates: { startDate: '2024-01-10', endDate: '2024-01-12', startTime: '10:00', endTime: '10:00' },
            priceSnapshot: { rentalCost: 200, serviceFee: 20, total: 220, days: 2 },
            userId: 'u1'
        });

        // Initially not expired
        expect(useDraftBookingStore.getState().isDraftExpired()).toBe(false);

        // Fast forward 23 hours
        vi.setSystemTime(baseTime + (23 * 60 * 60 * 1000));
        expect(useDraftBookingStore.getState().isDraftExpired()).toBe(false);

        // Fast forward 25 hours
        vi.setSystemTime(baseTime + (25 * 60 * 60 * 1000));
        expect(useDraftBookingStore.getState().isDraftExpired()).toBe(true);
    });

    it('should return true for isDraftExpired if draft is null', () => {
        useDraftBookingStore.setState({ draft: null });
        expect(useDraftBookingStore.getState().isDraftExpired()).toBe(true);
    });

    it('should get draft using getDraft', () => {
        const mockDraftData = {
            carId: 'c1',
            carSnapshot: { make: 'Toyota', model: 'Corolla', imageUrl: 'img.jpg', pricePerDay: 100 },
            dates: { startDate: '2024-01-10', endDate: '2024-01-12', startTime: '10:00', endTime: '10:00' },
            priceSnapshot: { rentalCost: 200, serviceFee: 20, total: 220, days: 2 },
            userId: 'u1'
        };
        useDraftBookingStore.getState().createDraft(mockDraftData);
        const draft = useDraftBookingStore.getState().getDraft();
        expect(draft?.carId).toBe('c1');
    });
});
