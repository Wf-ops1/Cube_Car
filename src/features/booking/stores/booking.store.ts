import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { Car } from '@/core/data/car/car.types';
import { User } from '@/core/data/auth/auth.types';

export interface Booking {
    id: string;
    carId: string;
    car: Car; // Embedding full car for simplicity in MVP
    renterId: string;
    renter: User; // Embedding full user for simplicity
    startDate: string;
    endDate: string;
    status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
    totalPrice: number;
    createdAt: string;
}

export type BookingStatus = 'pending' | 'accepting' | 'rejecting' | 'confirmed' | 'rejected' | 'cancelled' | 'completing' | 'completed';

interface BookingState {
    bookings: Booking[];
    createBooking: (booking: Booking) => void;
    updateBookingStatus: (id: string, status: Booking['status']) => void;
    getBookingsByRenter: (renterId: string) => Booking[];
    getBookingsByHost: (hostId: string) => Booking[];

    // UI Status Tracking functionality merged from core/stores/booking.store.ts
    uiStatuses: Record<string, BookingStatus>;
    setBookingUIStatus: (id: string, status: BookingStatus) => void;
    getBookingUIStatus: (id: string) => BookingStatus;
}

export const useBookingStore = create<BookingState>()(
    devtools(
        persist(
            (set, get) => ({
                bookings: [],
                uiStatuses: {},

                createBooking: (booking) => set((state) => ({
                    bookings: [booking, ...state.bookings]
                }), false, 'booking/create'),

                updateBookingStatus: (id, status) => set((state) => ({
                    bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
                }), false, 'booking/updateStatus'),

                getBookingsByRenter: (renterId) => {
                    return get().bookings.filter(b => b.renterId === renterId);
                },

                getBookingsByHost: (hostId) => {
                    // In a real app we'd check car ownership, but here we check car.ownerId if we had it, 
                    // or for MVP we might need to trust the filter. 
                    // Let's assume the embedded car object has ownerId.
                    return get().bookings.filter(b => (b.car as any).ownerId === hostId);
                },

                setBookingUIStatus: (id, status) => {
                    set((state) => ({
                        uiStatuses: {
                            ...state.uiStatuses,
                            [id]: status
                        }
                    }), false, 'booking/setUIStatus');
                },

                getBookingUIStatus: (id) => {
                    return get().uiStatuses[id] || 'pending';
                }
            }),
            {
                name: 'cube-car-booking-storage',
            }
        ),
        { name: 'BookingStore' }
    )
);
