import { Review, ReviewSubmissionPayload } from '../reputation/reputation.types';
import { mockReviews } from '../reputation/reputation.mock';
import { carsGateway } from './cars.gateway';
import { ReputationService } from '../reputation/reputation.service';

export interface ReputationGatewayContract {
    submitReview(payload: ReviewSubmissionPayload): Promise<Review>;
    getByCarId(carId: string): Promise<Review[]>;
    getFeaturedReviews(limit?: number): Promise<Review[]>;
    getByAuthorId(authorId: string): Promise<Review[]>;
}

class MockReputationGateway implements ReputationGatewayContract {
    private reviews: Review[] = [...mockReviews];

    async submitReview(payload: ReviewSubmissionPayload): Promise<Review> {
        // Enforcing idempotency in our mock
        // In a real system, the backend would reject or return idempotently
        // if this ID already exists in Redis/Database.
        // Doing a simple delay to simulate network.
        await new Promise(resolve => setTimeout(resolve, 800));

        const existingReview = this.reviews.find(r => r.id === payload.idempotencyKey);
        if (existingReview) {
            return existingReview; // Return existing (Idempotent response)
        }

        // Backend business rule: user cannot review the exact same car twice (unless they rented it twice, but for the MVP, this validates intent and prevents duplicate clicks by author/car tuple limits).
        const hasReviewedBefore = this.reviews.find(
            r => r.authorId === payload.authorId && r.carReferenceId === payload.carReferenceId
        );
        if (hasReviewedBefore) {
            // Depending on the business rule, throw error or softly reject. For MVP we can just reject conceptually or update.
            throw new Error("Usuário já avaliou este veículo anteriormente.");
        }

        const newReview: Review = {
            id: payload.idempotencyKey,
            carReferenceId: payload.carReferenceId,
            authorId: payload.authorId,
            overallRating: payload.overallRating,
            body: payload.body,
            subCriteria: payload.subCriteria,
            // Mocking name and avatar just for UI prototyping purposes.
            // Normally the API would inject this based on the authenticated user.
            authorName: "Você",
            authorAvatar: "https://i.pravatar.cc/150",
            status: "APPROVED", // Auto-approving for MVP
            createdAt: new Date().toISOString(),
        };

        this.reviews.unshift(newReview);

        // 🔄 BACKEND SYNCHRONIZATION (SIMULATING A SINGLE TRANSACTION / IN-MEMORY EVENT BUS)
        try {
            // Recalculate snapshot based on the current context of reviews for this car
            const carReviews = await this.getByCarId(payload.carReferenceId);
            const snapshotRating = ReputationService.calculateOverallRating(carReviews);

            // "Sync" the view in the cars table (Mock Backend)
            await carsGateway.updateCar(payload.carReferenceId, { rating: snapshotRating });
        } catch (e) {
            console.error("Critical Backend Error: Failed to generate Car Snapshot:", e);
        }

        return newReview;
    }

    async getByCarId(carId: string): Promise<Review[]> {
        // Simulate network
        await new Promise(resolve => setTimeout(resolve, 400));
        return this.reviews.filter(r => r.carReferenceId === carId && r.status === 'APPROVED');
    }

    async getFeaturedReviews(limit: number = 5): Promise<Review[]> {
        // Sort by length of review or overall rating for a pseudo 'featured' logic
        return [...this.reviews]
            .filter(r => r.status === 'APPROVED')
            .sort((a, b) => b.overallRating - a.overallRating)
            .slice(0, limit);
    }

    async getByAuthorId(authorId: string): Promise<Review[]> {
        return this.reviews.filter(r => r.authorId === authorId);
    }
}

export const reputationGateway = new MockReputationGateway();
