import { Review, ReviewCriterion } from './reputation.types';

/**
 * Domain Service for Reputation.
 * Pure functions free of Side-Effects to calculate scores deterministically.
 */
export const ReputationService = {
    /**
     * Calculates the overall average rating from a list of reviews.
     * Only considers APPROVED reviews.
     * 
     * @param reviews Array of reviews for a car
     * @returns Average rating (Float up to 1 decimal place) or 0 if no valid reviews.
     */
    calculateOverallRating(reviews: Review[]): number {
        const approvedReviews = reviews.filter(r => r.status === 'APPROVED');
        if (approvedReviews.length === 0) return 0;

        const total = approvedReviews.reduce((sum, review) => sum + review.overallRating, 0);
        const average = total / approvedReviews.length;

        // Round to 1 decimal place safely
        return Math.round(average * 10) / 10;
    },

    /**
     * Calculates the average score for a specific sub-criterion.
     * Only considers APPROVED reviews that contain the specified criterion.
     * 
     * @param reviews Array of reviews for a car
     * @param criterion The specific criterion to calculate (e.g. 'limpeza')
     * @returns Average score (Float up to 1 decimal place) or 0 if no valid criteria found.
     */
    calculateCriteriaScore(reviews: Review[], criterion: ReviewCriterion): number {
        const approvedReviews = reviews.filter(r => r.status === 'APPROVED');
        if (approvedReviews.length === 0) return 0;

        let total = 0;
        let count = 0;

        approvedReviews.forEach(review => {
            if (review.subCriteria) {
                const sub = review.subCriteria.find(c => c.criterion === criterion);
                if (sub) {
                    total += sub.score;
                    count++;
                }
            }
        });

        if (count === 0) return 0;

        const average = total / count;
        return Math.round(average * 10) / 10;
    }
};
