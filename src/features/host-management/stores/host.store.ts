import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { Car, Booking } from '@/shared/types';
import { carsGateway } from '@/core/data/gateways/cars.gateway';
import { bookingGateway } from '@/core/data/gateways/booking.gateway';
import { walletGateway } from '@/core/data/gateways/wallet.gateway';

interface HostStats {
    totalEarnings: number;
    pendingEarnings: number;
    totalTrips: number;
    rating: number;
}

interface HostState {
    // Data
    fleet: Car[];
    requests: Booking[];
    stats: HostStats;

    // Loading States
    isLoadingFleet: boolean;
    isLoadingRequests: boolean;
    isLoadingStats: boolean;
    error: string | null;

    // Actions
    fetchDashboardData: (userId: string) => Promise<void>;

    addCar: (car: Car) => Promise<void>;
    updateCar: (id: string, updates: Partial<Car>) => Promise<void>;
    deleteCar: (id: string) => Promise<void>;
    toggleAd: (carId: string) => void;
    updatePrice: (carId: string, delta: number) => void;

    // Request Actions
    approveRequest: (bookingId: string) => Promise<void>;
    rejectRequest: (bookingId: string) => Promise<void>;
}

export const useHostStore = create<HostState>()(
    devtools(
        persist(
            (set, get) => ({
                fleet: [],
                requests: [],
                stats: {
                    totalEarnings: 0,
                    pendingEarnings: 0,
                    totalTrips: 0,
                    rating: 5.0
                },
                isLoadingFleet: false,
                isLoadingRequests: false,
                isLoadingStats: false,
                error: null,

                fetchDashboardData: async (userId: string) => {
                    set({ isLoadingFleet: true, isLoadingRequests: true, isLoadingStats: true, error: null });
                    try {
                        // 1. Fetch Fleet
                        const fleet = await carsGateway.getOwnerFleet(userId);

                        // 2. Fetch Requests (Bookings)
                        const allBookings = await bookingGateway.getByOwner(userId);
                        const pendingRequests = allBookings.filter(b => b.status === 'PENDING');

                        // 3. Fetch Wallet/Stats
                        // Simulating stats aggregation from wallet/bookings
                        const balance = await walletGateway.getBalance(userId);
                        const completedBookings = allBookings.filter(b => b.status === 'COMPLETED');

                        // Merge Guard: Preserve local optimistic cars while updating with server data
                        const optimisticCars = get().fleet.filter(c => c.isOptimistic);
                        const serverCarIds = new Set(fleet.map(c => c.id));

                        // Keep optimistic cars that haven't been confirmed by the server yet
                        // (If the server returns them, they lose the optimistic flag naturally)
                        const remainingOptimisticCars = optimisticCars.filter(c => !serverCarIds.has(c.id));

                        const mergedFleet = [...remainingOptimisticCars, ...fleet];

                        set({
                            fleet: mergedFleet,
                            requests: pendingRequests,
                            stats: {
                                totalEarnings: balance,
                                pendingEarnings: 0, // Mock for now
                                totalTrips: completedBookings.length,
                                rating: 4.9 // Mock
                            },
                            isLoadingFleet: false,
                            isLoadingRequests: false,
                            isLoadingStats: false
                        });
                    } catch (error: any) {
                        console.error('Failed to fetch host dashboard data', error);
                        set({ error: error.message, isLoadingFleet: false, isLoadingRequests: false, isLoadingStats: false });
                    }
                },

                addCar: async (car: Car) => {
                    // Optimistic update with flag
                    const optimisticCar = { ...car, isOptimistic: true };
                    set(state => ({ fleet: [optimisticCar, ...state.fleet] }));
                    try {
                        const createdCar = await carsGateway.create(car);
                        // Replace the optimistic ID with the real ID from the backend and remove the flag
                        set(state => ({
                            fleet: state.fleet.map(c => c.id === car.id ? { ...c, id: createdCar.id, isOptimistic: undefined } : c)
                        }));
                    } catch (error: any) {
                        set(state => ({ fleet: state.fleet.filter(c => c.id !== car.id), error: error.message }));
                    }
                },

                updateCar: async (id, updates) => {
                    set(state => ({
                        fleet: state.fleet.map(c => c.id === id ? { ...c, ...updates } : c)
                    }));
                    try {
                        // Assuming gateway has update
                        // await carsGateway.update(id, updates); 
                    } catch (error: any) {
                        // Rollback logic would require keeping previous state
                        set({ error: error.message });
                    }
                },

                deleteCar: async (id) => {
                    set(state => ({
                        fleet: state.fleet.filter(c => c.id !== id)
                    }));
                },

                toggleAd: async (carId: string) => {
                    let nextStatus = false;
                    set(state => ({
                        fleet: state.fleet.map(c => {
                            if (c.id === carId) {
                                const currentStatus = c.isActiveAd !== false;
                                nextStatus = !currentStatus;
                                return { ...c, isActiveAd: nextStatus };
                            }
                            return c;
                        })
                    }));
                    try {
                        await carsGateway.updateCar(carId, { isActiveAd: nextStatus });
                    } catch (e) {
                        console.error("Failed to sync ad status", e);
                    }
                },

                updatePrice: async (carId: string, delta: number) => {
                    let newPrice = 0;
                    set(state => ({
                        fleet: state.fleet.map(c => {
                            if (c.id === carId) {
                                newPrice = Math.max(0, (c.pricePerDay || 0) + delta);
                                return { ...c, pricePerDay: newPrice };
                            }
                            return c;
                        })
                    }));
                    try {
                        if (newPrice > 0) {
                            await carsGateway.updateCar(carId, { pricePerDay: newPrice });
                        }
                    } catch (e) {
                        console.error("Failed to sync price", e);
                    }
                },

                approveRequest: async (bookingId) => {
                    try {
                        await bookingGateway.updateStatus(bookingId, 'APPROVED');
                        set(state => ({
                            requests: state.requests.filter(r => r.id !== bookingId)
                        }));
                    } catch (error: any) {
                        set({ error: error.message });
                    }
                },

                rejectRequest: async (bookingId) => {
                    try {
                        await bookingGateway.updateStatus(bookingId, 'REJECTED');
                        set(state => ({
                            requests: state.requests.filter(r => r.id !== bookingId)
                        }));
                    } catch (error: any) {
                        set({ error: error.message });
                    }
                }
            }),
            {
                name: 'cube-car-host-storage',
                partialize: (state) => ({ fleet: state.fleet }), // Persist only fleet for offline view
            }
        ),
        { name: 'HostStore' }
    )
);
