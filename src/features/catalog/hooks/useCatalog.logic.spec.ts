import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCatalog } from './useCatalog.logic';
import { searchCarsUseCase } from '@/core/application/use-cases/searchCars.usecase';

vi.mock('@/core/application/use-cases/searchCars.usecase', () => ({
    searchCarsUseCase: vi.fn()
}));

describe('useCatalog logic hook', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with loading state and fetch cars', async () => {
        const mockCars = [{ id: '1', make: 'Fiat', model: 'Mobi' }];
        (searchCarsUseCase as any).mockResolvedValue(mockCars);

        const { result } = renderHook(() => useCatalog());

        expect(result.current.isLoading).toBe(true);
        expect(result.current.cars).toEqual([]);

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.cars).toEqual(mockCars);
        expect(result.current.totalCars).toBe(1);
    });

    it('should update search query correctly', async () => {
        (searchCarsUseCase as any).mockResolvedValue([]);
        const { result } = renderHook(() => useCatalog());

        act(() => {
            result.current.handleSearch({ location: 'São Paulo' });
        });

        expect(result.current.searchQuery).toBe('São Paulo');
    });

    it('should handle errors during fetch gracefully', async () => {
        (searchCarsUseCase as any).mockRejectedValue(new Error('Network Error'));
        const { result } = renderHook(() => useCatalog());

        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });

        expect(result.current.error).toBe('Não foi possível carregar os veículos correspondentes.');
        expect(result.current.cars).toEqual([]);
    });
});
