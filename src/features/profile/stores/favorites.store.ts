import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
    favoriteIds: string[];
    toggleFavorite: (carId: string) => void;
    isFavorite: (carId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favoriteIds: [],
            toggleFavorite: (carId) => set((state) => {
                const isFav = state.favoriteIds.includes(carId);
                return {
                    favoriteIds: isFav
                        ? state.favoriteIds.filter(id => id !== carId)
                        : [...state.favoriteIds, carId]
                };
            }),
            isFavorite: (carId) => get().favoriteIds.includes(carId),
        }),
        {
            name: 'cube-car-favorites', // unique name
        }
    )
);
