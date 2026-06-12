import { useState, useMemo } from 'react';
import { User } from '@/core/data/auth/auth.types';
import { mockTripsData } from './dashboard.mock';
import { useBookingStore } from '@/features/booking/stores/booking.store';
import { getDerivedBookingStatus, DerivedBookingStatus } from '@/features/booking/logic/booking.logic';
import { bookingGateway } from '@/core/data/gateways/booking.gateway';
// Import removed: core store is merged into booking.store

export const useDashboard = (user: User) => {
    const [selectedTripDetail, setSelectedTripDetail] = useState<any | null>(null);
    const [completingTripId, setCompletingTripId] = useState<string | null>(null);
    const [reviewModalData, setReviewModalData] = useState<{ isOpen: boolean, trip: any | null }>({ isOpen: false, trip: null });
    const [reviewedTripIds, setReviewedTripIds] = useState<Set<string>>(new Set());

    // Unification: Read Bookings from Store (DISABLED: User requested pure mock)
    const bookingsFromStore = useBookingStore((state) => state.bookings);
    // Unification: Read Bookings from Store
    const bookings = bookingsFromStore;

    // Handle date offsets for robust mocking
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(15, 0, 0, 0); // 15:00 Dropoff

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    yesterday.setHours(11, 0, 0, 0);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(today.getDate() - 2);
    twoDaysAgo.setHours(10, 0, 0, 0); // 10:00 Pickup

    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7);
    nextWeekStart.setHours(9, 30, 0, 0);

    const nextWeekEnd = new Date(today);
    nextWeekEnd.setDate(today.getDate() + 10);
    nextWeekEnd.setHours(18, 0, 0, 0);

    // Hardcoded Mock Data with REAL Domain States (Made reactive)
    const [mockTrips, setMockTrips] = useState(() => mockTripsData(twoDaysAgo, yesterday, tomorrow, nextWeekStart, nextWeekEnd));

    // Merge store bookings with mocks so the page is never empty
    const myTrips = [...bookings.map(b => {
        const derivedStatus = getDerivedBookingStatus(b.status, b.startDate, b.endDate);
        const start = new Date(b.startDate);
        const end = new Date(b.endDate);

        return {
            id: b.id,
            carId: b.carId, // Added field
            carName: b.car.make,
            model: b.car.model,
            year: b.car.year.toString(),
            imageUrl: b.car.imageUrl,

            // Rich Data formatting
            period: `${start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')} — ${end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}`,
            pickupTime: start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            dropoffTime: end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),

            // Legacy/Fallback (keep for list view compatibility)
            dates: `${start.getDate()} ${start.toLocaleString('pt-BR', { month: 'short' })}`,
            startDate: start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            endDate: end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            days: 3,
            location: b.car.location || "Local não definido",
            status: derivedStatus,
            owner: (b.car as any).ownerName || "Anfitrião Parceiro",
            ownerId: (b.car as any).ownerId || "host-1", // Added field
            avatarUrl: 'https://i.pravatar.cc/150?u=host',
            price: b.totalPrice,
            code: `RES-${b.id.substr(0, 4).toUpperCase()}`,
            bookingCode: b.id,
            instructions: 'Aguardando confirmação do anfitrião.',
            paymentMethod: 'Cartão Confirmado'
        };
    }), ...mockTrips.map((m: any) => {
        const derivedStatus = getDerivedBookingStatus(m.dbStatus, m.startDate, m.endDate);
        const start = new Date(m.startDate);
        const end = new Date(m.endDate);

        return {
            ...m,
            // Rich Data formatting
            period: `${start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')} — ${end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}`,
            pickupTime: start.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            dropoffTime: end.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),

            carId: `car-${m.id}`, // Mock Car ID
            ownerId: `host-${m.owner.split(' ')[0].toLowerCase()}`, // Mock Host ID

            status: derivedStatus,
            dates: `${start.getDate()} ${start.toLocaleString('pt-BR', { month: 'short' })}`,
            startDate: start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            endDate: end.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
            bookingCode: m.id,
            instructions: m.instructions || 'Detalhes da reserva mockup'
        };
    })];

    // Find the most relevant reservation to show in Big Card
    // Priority: ACTIVE > CONFIRMED > PENDING
    const activeReservation = useMemo(() => {
        return myTrips.find(t => t.status === 'active') ||
            myTrips.find(t => t.status === 'confirmed') ||
            myTrips.find(t => t.status === 'pending') ||
            myTrips.find(t => t.status === 'rejected') ||
            myTrips.find(t => t.status === 'completed') ||
            myTrips.find(t => t.status === 'cancelled') ||
            myTrips.find(t => t.status === 'expired');
    }, [myTrips]);

    // Trips that are completed but not yet reviewed
    const pendingReviewTrips = useMemo(() => {
        return myTrips.filter(t => t.status === 'completed' && !reviewedTripIds.has(t.id));
    }, [myTrips, reviewedTripIds]);

    const markTripReviewed = (tripId: string) => {
        setReviewedTripIds(prev => new Set(prev).add(tripId));
    };

    const handleReviewTrip = (trip: any) => {
        setReviewModalData({ isOpen: true, trip });
    };

    const handleReviewClose = () => {
        setReviewModalData({ isOpen: false, trip: null });
        setSelectedTripDetail(null);
    };

    const handleReviewSubmitted = (tripId: string) => {
        markTripReviewed(tripId);
        setReviewModalData({ isOpen: false, trip: null });
        setSelectedTripDetail(null);
    };

    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    const handleCompleteTrip = async (trip: any) => {
        setCompletingTripId(trip.id);
        try {
            if (trip.id.startsWith('mock-')) {
                // Update local mock state directly for immediate UI feedback
                setMockTrips(prev => prev.map(m =>
                    m.id === trip.id ? { ...m, dbStatus: 'COMPLETED', endDate: yesterday.toISOString() } : m
                ));
            } else {
                await bookingGateway.updateStatus(trip.id, 'COMPLETED');
                useBookingStore.getState().setBookingUIStatus(trip.id, 'completed');
            }

            // Immediately update the currently viewing trip so the UI (like the action button) reacts!
            setSelectedTripDetail((prev: any) => prev ? { ...prev, status: 'completed' } : null);

            // Show rewarding success overlay instead of jumping straight to review
            setShowSuccessOverlay(true);
            await new Promise(resolve => setTimeout(resolve, 2500));
            setShowSuccessOverlay(false);

            // Allow the exit animation of the overlay to finish smoothly
            await new Promise(resolve => setTimeout(resolve, 400));

            setReviewModalData({ isOpen: true, trip });
        } catch (error) {
            console.error("Failed to complete trip", error);
        } finally {
            setCompletingTripId(null);
        }
    };

    return {
        myTrips,
        activeReservation,
        selectedTripDetail,
        setSelectedTripDetail,
        handleCompleteTrip,
        completingTripId,
        reviewModalData,
        setReviewModalData,
        showSuccessOverlay,
        setShowSuccessOverlay,
        pendingReviewTrips,
        reviewedTripIds,
        handleReviewTrip,
        handleReviewClose,
        handleReviewSubmitted
    };
};
