import { useState, useEffect } from 'react';
import { User } from '@/core/data/auth/auth.types';
import { Car } from '@/core/data/car/car.types';
import { carsGateway } from '@/core/data/gateways/cars.gateway';

export const useHostFleetLogic = (user: User) => {
    const [myFleet, setMyFleet] = useState<Car[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Mock Business Metrics (In real app, fetch from gateway)
    const metrics = {
        monthlyEarnings: 3240.00,
        projectedEarnings: 4500.00,
        occupancyRate: 85,
        rating: 4.9,
        activeRentals: 1,
        tier: 'Gold Partner'
    };

    useEffect(() => {
        const fetchFleet = async () => {
            try {
                setError(null);
                const cars = await carsGateway.getOwnerFleet(user.id);
                setMyFleet(cars);
            } catch (error) {
                console.error("Failed to load fleet", error);
                setError("Não foi possível carregar sua frota. Verifique sua conexão.");
            } finally {
                setLoading(false);
            }
        };
        fetchFleet();
    }, [user.id]);

    return {
        myFleet,
        loading,
        error,
        metrics
    };
};
