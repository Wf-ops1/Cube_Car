import { z } from 'zod';

// ==========================================
// Value Objects
// ==========================================

export const RatingScoreSchema = z
    .number()
    .min(1.0, "A nota mínima é 1.0")
    .max(5.0, "A nota máxima é 5.0");

export const ReviewStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);

export const ReviewCriterionEnum = z.enum([
    "limpeza",
    "manutencao",
    "comunicacao",
    "precisao"
]);

export type ReviewCriterion = z.infer<typeof ReviewCriterionEnum>;
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

// ==========================================
// Entities
// ==========================================

export const SubCriterionScoreSchema = z.object({
    criterion: ReviewCriterionEnum,
    score: RatingScoreSchema,
});

export type SubCriterionScore = z.infer<typeof SubCriterionScoreSchema>;

/**
 * Single Source of Truth for a Review.
 * Uses an Anti-Corruption Layer approach by holding `carReferenceId`
 * instead of a rigid coupling to the Car object itself.
 */
export const ReviewSchema = z.object({
    id: z.string().uuid("ID inválido"),
    carReferenceId: z.string().min(1, "ID do carro de referência é obrigatório"),
    authorId: z.string().min(1, "ID do autor é obrigatório"),

    // UI Metadata (Denormalized minimum data for safe rendering)
    authorName: z.string().optional(),
    authorAvatar: z.string().optional(),

    body: z.string().min(10, "A avaliação deve ter pelo menos 10 caracteres").optional(),

    overallRating: RatingScoreSchema,
    subCriteria: z.array(SubCriterionScoreSchema).optional(),

    status: ReviewStatusSchema.default("APPROVED"),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime().optional()
});

export type Review = z.infer<typeof ReviewSchema>;

export const ReviewSubmissionPayloadSchema = z.object({
    idempotencyKey: z.string().uuid("Idempotency-Key inválida"),
    carReferenceId: z.string(),
    authorId: z.string(),
    overallRating: RatingScoreSchema,
    body: z.string().optional(),
    subCriteria: z.array(SubCriterionScoreSchema).optional()
});

export type ReviewSubmissionPayload = z.infer<typeof ReviewSubmissionPayloadSchema>;
