import { Booking } from '../stores/booking.store';

export type DerivedBookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'rejected' | 'cancelled' | 'expired';

/**
 * Pure Domain Function: Calculates the real-time status of a booking
 * based on its persistent status and the current time.
 * 
 * Logic:
 * - REJECTED -> 'rejected' (Red)
 * - CANCELLED -> 'cancelled' (Red/Gray)
 * - COMPLETED -> 'completed' (Gray)
 * - PENDING + Future Date -> 'pending' (Yellow)
 * - PENDING + Past Start Date -> 'expired' (Gray/Disabled)
 * - APPROVED + Future Date -> 'confirmed' (Green)
 * - APPROVED + Current Date inside Range -> 'active' (Blue)
 * - APPROVED + Past Date -> 'completed' (Gray)
 */
export const getDerivedBookingStatus = (
    status: Booking['status'] | string,
    startDateStr: string,
    endDateStr: string,
    now: Date = new Date()
): DerivedBookingStatus => {
    // If it is already a derived status string from the UI or mocks, return it directly
    if (['pending', 'confirmed', 'active', 'completed', 'rejected', 'cancelled', 'expired'].includes(status as string)) {
        return status as DerivedBookingStatus;
    }

    // 1. Handle immutable terminal states first
    if (status === 'REJECTED') return 'rejected';
    if (status === 'CANCELLED') return 'cancelled';
    if (status === 'COMPLETED') return 'completed';

    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    // 2. Handle PENDING state
    if (status === 'PENDING') {
        if (now > start) {
            return 'expired'; // Request expired
        }
        return 'pending';
    }

    // 3. Handle 'APPROVED' (Confirmed) state, which depends on Time
    if (status === 'APPROVED') {
        if (now > end) {
            return 'completed'; // Trip finished
        }

        if (now >= start && now <= end) {
            return 'active'; // Currently on trip
        }

        if (now < start) {
            return 'confirmed'; // Trip in future
        }
    }

    return 'pending'; // Fallback
};

export const getStatusConfig = (status: DerivedBookingStatus) => {
    switch (status) {
        case 'pending':
            return {
                label: 'Aguardando aprovação',
                color: 'bg-yellow-500',
                textColor: 'text-yellow-500',
                dotColor: 'bg-yellow-500',
                icon: 'fa-clock'
            };
        case 'active':
            return {
                label: 'Viagem em andamento',
                color: 'bg-blue-500',
                textColor: 'text-blue-500',
                dotColor: 'bg-blue-500',
                icon: 'fa-car-side'
            };
        case 'confirmed':
            return {
                label: 'Viagem confirmada',
                color: 'bg-blue-500',
                textColor: 'text-blue-500',
                dotColor: 'bg-blue-500',
                icon: 'fa-check-circle'
            };
        case 'rejected':
            return {
                label: 'Solicitação recusada',
                color: 'bg-red-500',
                textColor: 'text-red-500',
                dotColor: 'bg-red-500',
                icon: 'fa-times-circle'
            };
        case 'cancelled':
            return {
                label: 'Cancelada',
                color: 'bg-red-500',
                textColor: 'text-red-500',
                dotColor: 'bg-red-500',
                icon: 'fa-ban'
            };
        case 'expired':
            return {
                label: 'Solicitação expirada',
                color: 'bg-gray-400',
                textColor: 'text-gray-400',
                dotColor: 'bg-gray-400',
                icon: 'fa-hourglass-end'
            };
        case 'completed':
            return {
                label: 'Viagem finalizada',
                color: 'bg-green-500',
                textColor: 'text-green-500',
                dotColor: 'bg-green-500',
                icon: 'fa-flag-checkered'
            };
        default:
            return {
                label: 'Desconhecido',
                color: 'bg-gray-300',
                textColor: 'text-gray-300',
                dotColor: 'bg-gray-300',
                icon: 'fa-question'
            };
    }
};
