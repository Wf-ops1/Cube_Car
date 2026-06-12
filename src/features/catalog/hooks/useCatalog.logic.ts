import { useState, useEffect, useCallback } from 'react';
import { Car } from '@/core/data/car/car.types';
import { searchCarsUseCase, SearchParams } from '@/core/application/use-cases/searchCars.usecase';

export type CarCategory = 'Todos' | 'Hatch' | 'Sedan';

/**
 * useCatalog Logic Hook
 * Orchestrates the Catalog UI state and triggers business use cases.
 */
export const useCatalog = () => {
    const [cars, setCars] = useState<Car[]>([]);
    const [totalCars, setTotalCars] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Context-dependent states (Filters)
    const [searchQuery, setSearchQuery] = useState('');
    const [searchStartDate, setSearchStartDate] = useState<Date | undefined>(undefined);
    const [searchEndDate, setSearchEndDate] = useState<Date | undefined>(undefined);
    const [searchPickupTime, setSearchPickupTime] = useState<string | undefined>(undefined);
    const [searchDropoffTime, setSearchDropoffTime] = useState<string | undefined>(undefined);
    const [selectedCategory, setSelectedCategory] = useState<CarCategory>('Todos');

    const loadFilteredCars = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const results = await searchCarsUseCase({
                query: searchQuery,
                category: selectedCategory,
                startDate: searchStartDate,
                endDate: searchEndDate,
                pickupTime: searchPickupTime,
                dropoffTime: searchDropoffTime
            });

            setCars(results);
            setTotalCars(results.length);
        } catch (err) {
            console.error('Catalog search failed:', err);
            setError('Não foi possível carregar os veículos correspondentes.');
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery, selectedCategory, searchStartDate, searchEndDate, searchPickupTime, searchDropoffTime]);

    useEffect(() => {
        loadFilteredCars();
    }, [loadFilteredCars]);

    const handleSearch = (params: any) => {
        if (params.location !== undefined) {
            setSearchQuery(params.location);
        }
        if (params.startDate) setSearchStartDate(params.startDate);
        if (params.endDate) setSearchEndDate(params.endDate);
        if (params.pickupTime) setSearchPickupTime(params.pickupTime);
        if (params.dropoffTime) setSearchDropoffTime(params.dropoffTime);
    };

    return {
        cars,
        totalCars,
        isLoading,
        error,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        handleSearch,
        refreshCatalog: loadFilteredCars
    };
};
