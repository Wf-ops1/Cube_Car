import { describe, it, expect } from 'vitest';
import { getOverallStatus, getPendingDocuments, approveDocument, rejectDocument, submitDocument } from './verification.logic';
import { VerificationDocument } from './verification.types';

describe('Verification Domain Logic', () => {

    describe('getOverallStatus', () => {
        it('should return NOT_STARTED when no documents exist', () => {
            expect(getOverallStatus([])).toBe('NOT_STARTED');
        });

        it('should return REJECTED if any document is rejected', () => {
            const docs: VerificationDocument[] = [
                { type: 'CNH', status: 'APPROVED' },
                { type: 'SELFIE', status: 'REJECTED' }
            ];
            expect(getOverallStatus(docs)).toBe('REJECTED');
        });

        it('should return IN_REVIEW if any document is pending review', () => {
            const docs: VerificationDocument[] = [
                { type: 'CNH', status: 'APPROVED' },
                { type: 'SELFIE', status: 'PENDING_REVIEW' }
            ];
            expect(getOverallStatus(docs)).toBe('IN_REVIEW');
        });

        it('should return APPROVED only if BOTH required docs are approved', () => {
            const docs: VerificationDocument[] = [
                { type: 'CNH', status: 'APPROVED' },
                { type: 'SELFIE', status: 'APPROVED' }
            ];
            expect(getOverallStatus(docs)).toBe('APPROVED');
        });

        it('should return NOT_STARTED (or partial) if one is approved but other is missing', () => {
            const docs: VerificationDocument[] = [
                { type: 'CNH', status: 'APPROVED' }
            ];
            expect(getOverallStatus(docs)).toBe('NOT_STARTED');
        });
    });

    describe('getPendingDocuments', () => {
        it('should return all required types if documents list is empty', () => {
            expect(getPendingDocuments([])).toEqual(['CNH', 'SELFIE']);
        });

        it('should return only missing documents', () => {
            const docs: VerificationDocument[] = [
                { type: 'CNH', status: 'APPROVED' }
            ];
            expect(getPendingDocuments(docs)).toEqual(['SELFIE']);
        });

        it('should return REJECTED documents as pending action', () => {
            const docs: VerificationDocument[] = [
                { type: 'CNH', status: 'APPROVED' },
                { type: 'SELFIE', status: 'REJECTED' }
            ];
            expect(getPendingDocuments(docs)).toEqual(['SELFIE']);
        });

        it('should NOT return documents that are PENDING_REVIEW', () => {
            const docs: VerificationDocument[] = [
                { type: 'CNH', status: 'APPROVED' },
                { type: 'SELFIE', status: 'PENDING_REVIEW' }
            ];
            expect(getPendingDocuments(docs)).toEqual([]);
        });
    });

    describe('Transitions', () => {
        it('approveDocument should update status and timestamps', () => {
            const docs: VerificationDocument[] = [
                { type: 'CNH', status: 'PENDING_REVIEW' }
            ];
            const updated = approveDocument(docs, 'CNH', 'admin-1');
            expect(updated[0].status).toBe('APPROVED');
            expect(updated[0].reviewedBy).toBe('admin-1');
            expect(updated[0].reviewedAt).toBeDefined();
        });

        it('rejectDocument should logic reason', () => {
            const docs: VerificationDocument[] = [
                { type: 'CNH', status: 'PENDING_REVIEW' }
            ];
            const updated = rejectDocument(docs, 'CNH', 'Blurry image', 'admin-1');
            expect(updated[0].status).toBe('REJECTED');
            expect(updated[0].rejectionReason).toBe('Blurry image');
        });
    });
});
