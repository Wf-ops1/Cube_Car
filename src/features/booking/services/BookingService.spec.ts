import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('zustand/middleware', () => ({ persist: (c: any) => c, devtools: (c: any) => c }));
import { bookingService } from './BookingService';
import { paymentGateway } from '@/core/data/gateways/payment.gateway';
import { bookingGateway } from '@/core/data/gateways/booking.gateway';
import { walletGateway } from '@/core/data/gateways/wallet.gateway';
import { messagingFacade } from '@/features/messaging/services/MessagingFacade';
import { useBookingStore } from '@/features/booking/stores/booking.store';

vi.mock('@/core/data/gateways/payment.gateway', () => ({
    paymentGateway: { processPayment: vi.fn(), refund: vi.fn() }
}));
vi.mock('@/core/data/gateways/booking.gateway', () => ({
    bookingGateway: { create: vi.fn(), getById: vi.fn(), updateStatus: vi.fn() }
}));
vi.mock('@/core/data/gateways/wallet.gateway', () => ({
    walletGateway: { addFunds: vi.fn() }
}));
vi.mock('@/features/messaging/services/MessagingFacade', () => ({
    messagingFacade: { notifyBookingEvent: vi.fn() }
}));

describe('BookingService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useBookingStore.setState({ bookings: [] });
    });

    it('should create a booking successfully', async () => {
        (paymentGateway.processPayment as any).mockResolvedValue(true);
        (bookingGateway.create as any).mockResolvedValue({ id: 'b1', status: 'PENDING' });
        (messagingFacade.notifyBookingEvent as any).mockResolvedValue(true);

        const params = {
            car: { id: 'c1', ownerId: 'h1' },
            renter: { id: 'r1' },
            startDate: '2023-10-01',
            endDate: '2023-10-05',
            startTime: '10:00',
            endTime: '10:00',
            totalPrice: 500
        } as any;

        const booking = await bookingService.createBooking(params);

        expect(booking.id).toBe('b1');
        expect(paymentGateway.processPayment).toHaveBeenCalledWith(500, 'CREDIT_CARD');
        expect(bookingGateway.create).toHaveBeenCalled();
        expect(messagingFacade.notifyBookingEvent).toHaveBeenCalled();
        expect(useBookingStore.getState().bookings).toHaveLength(1);
    });

    it('should throw an error if payment fails', async () => {
        (paymentGateway.processPayment as any).mockResolvedValue(false);

        const params = {
            car: { id: 'c1', ownerId: 'h1' },
            renter: { id: 'r1' },
            startDate: '2023-10-01',
            endDate: '2023-10-05',
            startTime: '10:00',
            endTime: '10:00',
            totalPrice: 500
        } as any;

        await expect(bookingService.createBooking(params)).rejects.toThrow('Falha no pagamento');
        expect(bookingGateway.create).not.toHaveBeenCalled();
    });

    it('should approve a booking and credit the wallet', async () => {
        const mockBooking = { id: 'b1', status: 'PENDING', totalPrice: 500, car: { ownerId: 'h1' } };
        (bookingGateway.getById as any).mockResolvedValue(mockBooking);
        (bookingGateway.updateStatus as any).mockResolvedValue({ ...mockBooking, status: 'APPROVED' });

        const result = await bookingService.approveBooking('b1');

        expect(result.status).toBe('APPROVED');
        expect(walletGateway.addFunds).toHaveBeenCalledWith('h1', 500, 'Reserva #b1');
    });

    it('should reject a booking and refund payment', async () => {
        const mockBooking = { id: 'b1', status: 'PENDING', totalPrice: 500, car: { ownerId: 'h1' } };
        (bookingGateway.getById as any).mockResolvedValue(mockBooking);
        (bookingGateway.updateStatus as any).mockResolvedValue({ ...mockBooking, status: 'REJECTED' });

        const result = await bookingService.rejectBooking('b1');

        expect(result.status).toBe('REJECTED');
        expect(paymentGateway.refund).toHaveBeenCalledWith('b1');
    });
});
