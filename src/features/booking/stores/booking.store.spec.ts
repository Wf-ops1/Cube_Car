import { describe, it, expect, beforeEach, vi } from 'vitest';
vi.mock('zustand/middleware', () => ({ persist: (c: any) => c, devtools: (c: any) => c }));
import { useBookingStore } from './booking.store';
import { Booking } from './booking.store';

describe('Booking Store', () => {
    beforeEach(() => {
        useBookingStore.setState({ bookings: [], uiStatuses: {} });
    });

    it('should create a booking', () => {
        const mockBooking = { id: '1', status: 'PENDING', renterId: 'r1', car: { ownerId: 'h1' } } as any;
        
        useBookingStore.getState().createBooking(mockBooking);
        
        const state = useBookingStore.getState();
        expect(state.bookings).toHaveLength(1);
        expect(state.bookings[0].id).toBe('1');
    });

    it('should update booking status', () => {
        const mockBooking = { id: '1', status: 'PENDING', renterId: 'r1', car: { ownerId: 'h1' } } as any;
        useBookingStore.getState().createBooking(mockBooking);
        
        useBookingStore.getState().updateBookingStatus('1', 'APPROVED');
        
        const state = useBookingStore.getState();
        expect(state.bookings[0].status).toBe('APPROVED');
    });

    it('should get bookings by renter', () => {
        const mockBooking1 = { id: '1', status: 'PENDING', renterId: 'r1', car: { ownerId: 'h1' } } as any;
        const mockBooking2 = { id: '2', status: 'PENDING', renterId: 'r2', car: { ownerId: 'h1' } } as any;
        useBookingStore.getState().createBooking(mockBooking1);
        useBookingStore.getState().createBooking(mockBooking2);

        const renter1Bookings = useBookingStore.getState().getBookingsByRenter('r1');
        expect(renter1Bookings).toHaveLength(1);
        expect(renter1Bookings[0].id).toBe('1');
    });

    it('should get bookings by host', () => {
        const mockBooking1 = { id: '1', status: 'PENDING', renterId: 'r1', car: { ownerId: 'h1' } } as any;
        const mockBooking2 = { id: '2', status: 'PENDING', renterId: 'r2', car: { ownerId: 'h2' } } as any;
        useBookingStore.getState().createBooking(mockBooking1);
        useBookingStore.getState().createBooking(mockBooking2);

        const host1Bookings = useBookingStore.getState().getBookingsByHost('h1');
        expect(host1Bookings).toHaveLength(1);
        expect(host1Bookings[0].id).toBe('1');
    });

    describe('UI Statuses', () => {
        it('should correctly set and get booking UI status without affecting core bookings', () => {
            const mockBooking = { id: '1', status: 'PENDING', renterId: 'r1', car: { ownerId: 'h1' } } as any;
            useBookingStore.getState().createBooking(mockBooking);

            // initially should default to 'pending'
            expect(useBookingStore.getState().getBookingUIStatus('1')).toBe('pending');

            // Set UI status to 'accepting'
            useBookingStore.getState().setBookingUIStatus('1', 'accepting');

            expect(useBookingStore.getState().getBookingUIStatus('1')).toBe('accepting');
            expect(useBookingStore.getState().uiStatuses['1']).toBe('accepting');
            
            // Should not alter core booking status
            expect(useBookingStore.getState().bookings[0].status).toBe('PENDING');
        });
    });
});
