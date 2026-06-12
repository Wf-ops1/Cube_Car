import { useState, useEffect, useCallback } from 'react';
import { Car } from '@/core/data/car/car.types';
import { carsGateway } from '@/core/data/gateways/cars.gateway';

export const useApprovalListLogic = (onUpdate: () => void) => {
    const [pendingCars, setPendingCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actioningId, setActioningId] = useState<string | null>(null);

    const loadPending = useCallback(async () => {
        setIsLoading(true);
        const all = await carsGateway.getAll();
        setPendingCars(all.filter(c => c.status === 'pending'));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        loadPending();
    }, [loadPending]);

    const handleAction = async (id: string, action: 'approved' | 'rejected') => {
        setActioningId(id);
        const reason = action === 'rejected' ? 'Seu veículo não atende aos requisitos mínimos de qualidade da plataforma.' : undefined;
        await carsGateway.updateStatus(id, action, reason);
        await loadPending();
        onUpdate();
        setActioningId(null);
    };

    return {
        pendingCars,
        isLoading,
        actioningId,
        handleAction
    };
};
