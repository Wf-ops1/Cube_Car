import { useState, useEffect } from 'react';
import { User } from '@/core/data/auth/auth.types';
import { useHostStore } from '@/features/host-management/stores/host.store';

import { Car } from '@/shared/types';

// Enriched types for the Owner Context
export interface EnrichedCar extends Car {
    contextStatus: 'RENTED' | 'AVAILABLE' | 'BLOCKED' | 'PENDING_APPROVAL';
    nextTrip?: string;
    earnings?: string;
    returnTime?: string;
    fuelLevel?: number;
    batteryLevel?: number;
    plate?: string;
}

export interface RentalRequest {
    id: string;
    carId: string; // Used to link globally to bookings across the Chat module
    userName: string;
    userAvatar: string;
    carModel: string;
    period: string;
    totalValue: string;
    rating: number;
    tripCount: number;
    timeAgo?: string;
    // New Raw Fields for Smart UI
    createdAt: string;
    startDate: string;
    endDate: string;
    priceValue: number;
}

export interface DashboardMetrics {
    netEarnings: number;
    occupancyRate: number;
    totalTrips: number;
    averageRating: number;
    projectedEarnings: number;
}

export const useOwnerCenter = (user: User) => {
    // Connect to centralized store for fleet
    const {
        fleet: storeFleet,
        requests: storeRequests,
        stats: storeStats,
        fetchDashboardData,
        toggleAd,
        updatePrice,
        isLoadingFleet
    } = useHostStore();

    const fleet: EnrichedCar[] = storeFleet.map(c => {
        let contextStatus: EnrichedCar['contextStatus'] = 'AVAILABLE';
        if (c.status === 'pending') contextStatus = 'PENDING_APPROVAL';
        else if (c.status === 'approved' && c.isActiveAd === false) contextStatus = 'BLOCKED';

        return {
            ...c,
            contextStatus,
            rating: c.rating ?? 5.0,
        } as EnrichedCar;
    });

    const pendingRequests: RentalRequest[] = storeRequests.map(r => {
        // Simple formatter for period
        const sDate = new Date(r.startDate);
        const eDate = new Date(r.endDate);
        const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const periodStr = `${sDate.getDate()} - ${eDate.getDate()} ${months[sDate.getMonth()]}`;

        return {
            id: r.id,
            carId: r.carId,
            userName: r.renter?.name || 'Localizador',
            userAvatar: (r.renter as any)?.avatar || (r.renter as any)?.photoUrl || '',
            carModel: r.car?.model || 'Veículo',
            period: periodStr,
            totalValue: `R$ ${r.totalPrice.toFixed(2).replace('.', ',')}`,
            rating: (r.renter as any)?.rating || 5.0,
            tripCount: (r.renter as any)?.trips || 0,
            timeAgo: 'Agora',
            createdAt: r.createdAt,
            startDate: r.startDate,
            endDate: r.endDate,
            priceValue: r.totalPrice
        };
    });

    // Derive metrics directly from true state (Calculated State)
    const metrics: DashboardMetrics = {
        netEarnings: storeStats.totalEarnings,
        occupancyRate: fleet.length > 0 ? Math.round((fleet.filter(c => c.contextStatus === 'RENTED').length / fleet.length) * 100) : 0,
        totalTrips: storeStats.totalTrips,
        averageRating: storeStats.rating,
        projectedEarnings: storeStats.totalEarnings * 1.5 // Mock for projection
    };

    const [loading, setLoading] = useState(true);

    // View States
    const [activeTab, setActiveTab] = useState<'painel' | 'frota' | 'pedidos'>('painel');
    const [calendarModalState, setCalendarModalState] = useState<{ isOpen: boolean; carId: string; carModel: string } | null>(null);
    const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);

    const activeCar = fleet.find(c => c.contextStatus === 'RENTED');

    useEffect(() => {
        const loadData = async () => {
            // Load store data ensuring we query for the current owner
            await fetchDashboardData(user?.id || 'user-1');
            setLoading(false);
        };
        loadData();
    }, [fetchDashboardData, user?.id]);

    const handleUpdatePrice = (carId: string, delta: number) => {
        updatePrice(carId, delta);
    };

    const handleToggleStatus = (carId: string) => {
        toggleAd(carId);
    };

    const handlePublishDraft = (carId: string) => {
        if (!user.isVerified) {
            window.dispatchEvent(new CustomEvent('open-verification-modal'));
        } else {
            useHostStore.getState().updateCar(carId, { status: 'approved', isActiveAd: true });
        }
    };

    return {
        fleet,
        pendingRequests,
        metrics,
        loading,
        activeTab,
        setActiveTab,
        calendarModalState,
        setCalendarModalState,
        isHeaderCollapsed,
        setIsHeaderCollapsed,
        activeCar,
        handleUpdatePrice,
        handleToggleStatus,
        handlePublishDraft
    };
};
