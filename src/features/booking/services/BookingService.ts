import { Car, User, Booking } from '@/shared/types';
import { bookingGateway } from '@/core/data/gateways/booking.gateway';
import { carsGateway } from '@/core/data/gateways/cars.gateway';
import { walletGateway } from '@/core/data/gateways/wallet.gateway';
import { useNotificationStore } from '@/features/notifications/stores/notification.store';
import { paymentGateway } from '@/core/data/gateways/payment.gateway';
import { useBookingStore } from '@/features/booking/stores/booking.store';
import { useChatStore } from '@/features/messaging/stores/chat.store';
import { messagingFacade } from '@/features/messaging/services/MessagingFacade';
import { Conversation } from '@/core/data/messaging/messaging.types';

interface CreateBookingParams {
    car: Car;
    renter: User;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
}

class BookingService {

    /**
     * Creates a new booking intent.
     * Orchestrates validation, persistence, and owner notification.
     */
    async createBooking(params: CreateBookingParams): Promise<Booking> {
        const { car, renter, startDate, endDate, startTime, endTime, totalPrice } = params;

        // 1. Business Validation
        if (!car.id) throw new Error('Carro inválido');
        if (!renter.id) throw new Error('Motorista não identificado');

        // 2. Process Payment
        const paymentResult = await paymentGateway.processPayment(totalPrice, 'CREDIT_CARD');
        if (!paymentResult) throw new Error('Falha no pagamento');

        // 3. Persist
        const booking = await bookingGateway.create({
            carId: car.id,
            car,
            renterId: renter.id,
            renter,
            startDate,
            endDate,
            totalPrice,
            status: 'PENDING'
        });

        // 4. Notify Owner
        // (Removed notification as requested)

        // 5. Update Stores (Client Side State)
        useBookingStore.getState().createBooking(booking as any);

        // 6. Create Chat Conversation (Handled by Facade)
        // 6. Send Notification Message via Facade
        // Delegating all chat logic to the Messaging Domain Facade
        await messagingFacade.notifyBookingEvent({
            carId: car.id,
            hostId: car.ownerId || 'host-1',
            renterId: renter.id,
            bookingId: booking.id,
            message: `Solicitação de reserva enviada para ${params.startDate} a ${params.endDate}. Aguarde a confirmação do anfitrião.`,
            bookingDetails: {
                startDate: params.startDate,
                endDate: params.endDate,
                startTime: params.startTime,
                endTime: params.endTime,
                price: params.totalPrice
            }
        });

        console.log('[BookingService] Booking Created, Store Updated (Trips & Chat):', booking.id);
        return booking;
    }

    /**
     * Approves a booking.
     * Orchestrates status update, inventory blocking, wallet processing, and driver notification.
     */
    async approveBooking(bookingId: string): Promise<Booking> {
        // 1. Fetch current state
        const booking = await bookingGateway.getById(bookingId);
        if (!booking) throw new Error('Booking not found');

        // 2. Validate Transition
        if (booking.status !== 'PENDING') {
            throw new Error(`Invalid state transition: Cannot approve booking in ${booking.status} state.`);
        }

        try {
            // 3. Update Status
            const updatedBooking = await bookingGateway.updateStatus(bookingId, 'APPROVED');

            // 4. Side Effects
            // a. Credit Wallet (Host)
            await walletGateway.addFunds(booking.car.ownerId, booking.totalPrice, `Reserva #${booking.id}`);

            // b. Notify Renter
            // (Removed notification as requested)

            return updatedBooking;

        } catch (error) {
            console.error('[BookingService] Approval failed', error);
            throw error;
        }
    }

    async rejectBooking(bookingId: string): Promise<Booking> {
        const booking = await bookingGateway.getById(bookingId);
        if (!booking) throw new Error('Booking not found');

        const updatedBooking = await bookingGateway.updateStatus(bookingId, 'REJECTED');

        // Refund Payment
        await paymentGateway.refund(booking.id); // Using booking ID as transaction ref for mock

        return updatedBooking;
    }

    async completeBooking(bookingId: string): Promise<Booking> {
        const booking = await bookingGateway.getById(bookingId);
        if (!booking) throw new Error('Booking not found');

        const updatedBooking = await bookingGateway.updateStatus(bookingId, 'COMPLETED');
        useBookingStore.getState().updateBookingStatus(bookingId, 'COMPLETED');

        // Request Rating
        // (Removed notification as requested)

        return updatedBooking;
    }
}

export const bookingService = new BookingService();
