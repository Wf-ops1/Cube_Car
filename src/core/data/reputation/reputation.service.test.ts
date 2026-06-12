import { describe, it, expect } from 'vitest';
import { ReputationService } from './reputation.service';
import { Review } from './reputation.types';

describe('ReputationService', () => {

    const mockReviews: Review[] = [
        {
            id: '1',
            carReferenceId: 'c1',
            authorId: 'u1',
            overallRating: 5,
            status: 'APPROVED',
            createdAt: new Date().toISOString(),
            subCriteria: [
                { criterion: 'limpeza', score: 5 },
                { criterion: 'manutencao', score: 4 }
            ]
        },
        {
            id: '2',
            carReferenceId: 'c1',
            authorId: 'u2',
            overallRating: 3,
            status: 'APPROVED',
            createdAt: new Date().toISOString(),
            subCriteria: [
                { criterion: 'limpeza', score: 3 },
                { criterion: 'comunicacao', score: 4 } // missing manutencao
            ]
        },
        {
            id: '3',
            carReferenceId: 'c1',
            authorId: 'u3',
            overallRating: 1,
            status: 'REJECTED', // SHOULD BE IGNORED
            createdAt: new Date().toISOString(),
            subCriteria: [
                { criterion: 'limpeza', score: 1 }
            ]
        }
    ];

    describe('calculateOverallRating', () => {
        it('should correctly calculate the average of approved reviews', () => {
            const result = ReputationService.calculateOverallRating(mockReviews);
            // Approved overall ratings: 5 and 3. Average = 4.0.
            expect(result).toBe(4.0);
        });

        it('should return 0 when there are no reviews', () => {
            expect(ReputationService.calculateOverallRating([])).toBe(0);
        });

        it('should return 0 when there are only rejected reviews', () => {
            const rejectedOnly = [mockReviews[2]];
            expect(ReputationService.calculateOverallRating(rejectedOnly)).toBe(0);
        });
    });

    describe('calculateCriteriaScore', () => {
        it('should calculate the average score for a specific sub-criterion', () => {
            // For 'limpeza': 5 and 3 = 4.0
            expect(ReputationService.calculateCriteriaScore(mockReviews, 'limpeza')).toBe(4.0);
        });

        it('should ignore approved reviews that omit a specific sub-criterion', () => {
            // For 'manutencao': only review 1 has it (score 4)
            expect(ReputationService.calculateCriteriaScore(mockReviews, 'manutencao')).toBe(4.0);
        });

        it('should return 0 when no approved reviews contain the criterion', () => {
            // No review has 'precisao'
            expect(ReputationService.calculateCriteriaScore(mockReviews, 'precisao')).toBe(0);
        });

        it('should not consider rejected reviews', () => {
            const rejectedCriteriaScore = mockReviews[2].subCriteria![0].score; // 1
            const result = ReputationService.calculateCriteriaScore(mockReviews, 'limpeza');
            // Check that average of 'limpeza' is 4.0 (5+3/2), not including the 1 from REJECTED
            expect(result).toBe(4.0);
        });
    });
});
