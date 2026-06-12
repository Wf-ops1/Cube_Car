export type DocumentType =
    | 'CNH'
    | 'SELFIE';

export type DocumentStatus =
    | 'MISSING'
    | 'PENDING_REVIEW'
    | 'APPROVED'
    | 'REJECTED';

export interface VerificationDocument {
    type: DocumentType;
    status: DocumentStatus;
    url?: string;
    rejectionReason?: string;
    submittedAt?: Date;
    reviewedAt?: Date;
    reviewedBy?: string;
}

export type VerificationStatus =
    | 'NOT_STARTED'
    | 'IN_REVIEW'
    | 'APPROVED'
    | 'REJECTED';

export interface UserVerification {
    /**
     * Unique identifier for the verification process/aggregate
     */
    id: string;

    /**
     * Reference to the user this verification belongs to
     */
    userId: string;

    /**
     * Overall status derived from documents.
     * @deprecated Should be derived using logic functions, but kept for cache/API simplicity if needed.
     * Ideally, rely on `getOverallStatus(documents)` from logic.ts.
     */
    status: VerificationStatus;

    /**
     * List of documents associated with this verification process
     */
    documents: VerificationDocument[];
}
