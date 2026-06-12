import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Review, ReviewSubmissionPayload } from '@/core/data/reputation/reputation.types';
import { reputationGateway } from '@/core/data/gateways/reputation.gateway';

interface ReputationState {
    // State
    reviewsByCar: Record<string, Review[]>;
    featuredReviews: Review[];

    // Loading States
    isLoadingCarReviews: Record<string, boolean>;
    isSubmitting: boolean;
    error: string | null;

    // Actions
    fetchReviewsByCarId: (carId: string) => Promise<void>;
    fetchFeaturedReviews: () => Promise<void>;
    submitReview: (payload: ReviewSubmissionPayload) => Promise<void>;
}

export const useReputationStore = create<ReputationState>()(
    devtools(
        (set, get) => ({
            reviewsByCar: {},
            featuredReviews: [],

            isLoadingCarReviews: {},
            isSubmitting: false,
            error: null,

            fetchReviewsByCarId: async (carId) => {
                // Prevent duplicate fetches if already fetching
                if (get().isLoadingCarReviews[carId]) return;

                set(state => ({
                    isLoadingCarReviews: { ...state.isLoadingCarReviews, [carId]: true },
                    error: null
                }));

                try {
                    const reviews = await reputationGateway.getByCarId(carId);

                    set(state => ({
                        reviewsByCar: { ...state.reviewsByCar, [carId]: reviews },
                        isLoadingCarReviews: { ...state.isLoadingCarReviews, [carId]: false }
                    }));
                } catch (error: any) {
                    set(state => ({
                        error: error.message,
                        isLoadingCarReviews: { ...state.isLoadingCarReviews, [carId]: false }
                    }));
                }
            },

            fetchFeaturedReviews: async () => {
                try {
                    const featured = await reputationGateway.getFeaturedReviews(3);
                    set({ featuredReviews: featured });
                } catch (error: any) {
                    console.error("Failed to fetch featured reviews", error);
                }
            },

            submitReview: async (payload) => {
                set({ isSubmitting: true, error: null });
                try {
                    const newReview = await reputationGateway.submitReview(payload);

                    // Update state optimistically for the specific car
                    const carId = payload.carReferenceId;
                    set(state => {
                        const existingReviews = state.reviewsByCar[carId] || [];
                        // Check if it's already there (idempotency safety at UI level)
                        if (existingReviews.some(r => r.id === newReview.id)) {
                            return { isSubmitting: false };
                        }

                        const updatedList = [newReview, ...existingReviews];

                        return {
                            reviewsByCar: {
                                ...state.reviewsByCar,
                                [carId]: updatedList
                            },
                            isSubmitting: false
                        };
                    });
                } catch (error: any) {
                    set({ error: error.message, isSubmitting: false });
                    throw error; // Re-throw so the UI can catch it if needed
                }
            },
        }),
        { name: 'ReputationStore' }
    )
);
