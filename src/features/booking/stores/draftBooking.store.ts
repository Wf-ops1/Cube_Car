import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { Car } from '@/core/data/car/car.types';

export interface DraftBooking {
    carId: string;
    carSnapshot: {
        make: string;
        model: string;
        imageUrl: string;
        pricePerDay: number;
    };
    dates: {
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
    };
    priceSnapshot: {
        rentalCost: number;
        serviceFee: number;
        total: number;
        days: number;
    };
    userId: string;
    createdAt: number; // timestamp
    ttl: number; // time to live in ms (e.g. 24h)
    notifyWhenApproved: boolean;
}

interface DraftBookingState {
    draft: DraftBooking | null;
    createDraft: (draft: Omit<DraftBooking, 'createdAt' | 'ttl' | 'notifyWhenApproved'>) => void;
    updateDraft: (updates: Partial<DraftBooking>) => void;
    clearDraft: () => void;
    isDraftExpired: () => boolean;
    getDraft: () => DraftBooking | null;
}

// Default TTL: 24 hours
const DEFAULT_TTL = 24 * 60 * 60 * 1000;

export const useDraftBookingStore = create<DraftBookingState>()(
    devtools(
        persist(
            (set, get) => ({
                draft: null,

                createDraft: (draftData) => set({
                    draft: {
                        ...draftData,
                        createdAt: Date.now(),
                        ttl: DEFAULT_TTL,
                        notifyWhenApproved: true // Default to true as per UX
                    }
                }, false, 'draft/create'),

                updateDraft: (updates) => set((state) => ({
                    draft: state.draft ? { ...state.draft, ...updates } : null
                }), false, 'draft/update'),

                clearDraft: () => set({ draft: null }, false, 'draft/clear'),

                isDraftExpired: () => {
                    const { draft } = get();
                    if (!draft) return true;
                    return Date.now() > (draft.createdAt + draft.ttl);
                },

                getDraft: () => get().draft
            }),
            {
                name: 'cube-car-draft-booking',
            }
        ),
        { name: 'DraftBookingStore' }
    )
);
