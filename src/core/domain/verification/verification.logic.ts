import { DocumentStatus, DocumentType, UserVerification, VerificationDocument, VerificationStatus } from './verification.types';

/**
 * Derives the overall verification status based on the status of individual documents.
 * Rules:
 * - If any document is REJECTED -> REJECTED
 * - If any document is PENDING_REVIEW -> IN_REVIEW
 * - If ALL required documents (CNH + SELFIE) are APPROVED -> APPROVED
 * - Otherwise -> NOT_STARTED (or partial)
 */
export function getOverallStatus(documents: VerificationDocument[]): VerificationStatus {
    if (documents.some(doc => doc.status === 'REJECTED')) {
        return 'REJECTED';
    }

    if (documents.some(doc => doc.status === 'PENDING_REVIEW')) {
        return 'IN_REVIEW';
    }

    const hasCNH = documents.some(doc => doc.type === 'CNH' && doc.status === 'APPROVED');
    const hasSelfie = documents.some(doc => doc.type === 'SELFIE' && doc.status === 'APPROVED');

    if (hasCNH && hasSelfie) {
        return 'APPROVED';
    }

    return 'NOT_STARTED';
}

/**
 * Returns a list of documents that need user action (MISSING or REJECTED).
 * Documents in PENDING_REVIEW or APPROVED are considered "done" for the user.
 */
export function getPendingDocuments(
    documents: VerificationDocument[],
    requiredTypes: DocumentType[] = ['CNH', 'SELFIE']
): DocumentType[] {
    return requiredTypes.filter(type => {
        const doc = documents.find(d => d.type === type);
        // If doc is missing -> Pending
        if (!doc) return true;
        // If doc is Missing or Rejected -> Pending
        if (doc.status === 'MISSING' || doc.status === 'REJECTED') return true;

        // If Approved or Pending Review -> NOT Pending (User waits)
        return false;
    });
}

/**
 * Creates or updates a document with 'PENDING_REVIEW' status.
 */
export function submitDocument(
    currentDocuments: VerificationDocument[],
    type: DocumentType,
    url: string
): VerificationDocument[] {
    const newDoc: VerificationDocument = {
        type,
        status: 'PENDING_REVIEW',
        url,
        submittedAt: new Date(),
        rejectionReason: undefined
    };

    // Replace existing or add new
    const others = currentDocuments.filter(d => d.type !== type);
    return [...others, newDoc];
}


/**
 * Transitions a specific document to APPROVED.
 */
export function approveDocument(
    currentDocuments: VerificationDocument[],
    type: DocumentType,
    reviewerId: string
): VerificationDocument[] {
    const docIndex = currentDocuments.findIndex(d => d.type === type);
    if (docIndex === -1) return currentDocuments; // Or throw

    const updatedDoc: VerificationDocument = {
        ...currentDocuments[docIndex],
        status: 'APPROVED',
        reviewedAt: new Date(),
        reviewedBy: reviewerId,
        rejectionReason: undefined
    };

    const newDocs = [...currentDocuments];
    newDocs[docIndex] = updatedDoc;
    return newDocs;
}

/**
 * Transitions a specific document to REJECTED.
 */
export function rejectDocument(
    currentDocuments: VerificationDocument[],
    type: DocumentType,
    reason: string,
    reviewerId: string
): VerificationDocument[] {
    const docIndex = currentDocuments.findIndex(d => d.type === type);
    if (docIndex === -1) return currentDocuments;

    const updatedDoc: VerificationDocument = {
        ...currentDocuments[docIndex],
        status: 'REJECTED',
        reviewedAt: new Date(),
        reviewedBy: reviewerId,
        rejectionReason: reason
    };

    const newDocs = [...currentDocuments];
    newDocs[docIndex] = updatedDoc;
    return newDocs;
}
