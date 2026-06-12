import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
vi.mock('zustand/middleware', () => ({ persist: (c: any) => c, devtools: (c: any) => c }));

import { useAuthStore } from './auth.store';
import { User } from '@/shared/types';
import { useNotificationStore } from '@/features/notifications/stores/notification.store';

vi.mock('@/features/notifications/stores/notification.store', () => ({
    useNotificationStore: {
        getState: vi.fn().mockReturnValue({
            addNotification: vi.fn()
        })
    }
}));

describe('Auth Store', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('should set auth state to authenticated when user is provided', () => {
        const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' } as User;
        
        useAuthStore.getState().setAuth(mockUser);
        
        const state = useAuthStore.getState();
        expect(state.user).toEqual(mockUser);
        expect(state.isAuthenticated).toBe(true);
        expect(state.isLoading).toBe(false);
    });

    it('should reset auth state on logout', () => {
        const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' } as User;
        useAuthStore.getState().setAuth(mockUser);
        
        useAuthStore.getState().logout();
        
        const state = useAuthStore.getState();
        expect(state.user).toBeNull();
        expect(state.isAuthenticated).toBe(false);
        expect(state.isLoading).toBe(false);
    });

    describe('Verification Flow', () => {
        it('should submit verification documents and start auto-approve timer', async () => {
            const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' } as User;
            useAuthStore.getState().setAuth(mockUser);

            const submitPromise = useAuthStore.getState().submitVerificationDocuments();
            
            // Fast forward API delay
            vi.advanceTimersByTime(1500);
            await submitPromise;

            const state = useAuthStore.getState();
            expect(state.user?.verification?.status).toBe('IN_REVIEW');
            expect(state.user?.verification?.documents).toHaveLength(2);
            expect(state.user?.verification?.documents?.[0].status).toBe('PENDING_REVIEW');
            
            expect(useNotificationStore.getState().addNotification).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'verification_submitted' })
            );

            // Fast forward auto-approve timer (2 minutes)
            vi.advanceTimersByTime(120000);
            
            const finalState = useAuthStore.getState();
            expect(finalState.user?.verification?.status).toBe('APPROVED');
            expect(finalState.user?.isVerified).toBe(true);
        });

        it('should fail submission if no user is authenticated', async () => {
            const resultPromise = useAuthStore.getState().submitVerificationDocuments();
            vi.advanceTimersByTime(1500);
            const result = await resultPromise;
            
            expect(result).toBe(false);
            expect(useAuthStore.getState().user).toBeNull();
        });

        it('should manually approve verification', () => {
            const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com', verification: { status: 'IN_REVIEW' } } as any;
            useAuthStore.getState().setAuth(mockUser);

            useAuthStore.getState().approveVerification();

            const state = useAuthStore.getState();
            expect(state.user?.verification?.status).toBe('APPROVED');
            expect(state.user?.isVerified).toBe(true);
            expect(state.user?.verification?.reviewedAt).toBeDefined();

            expect(useNotificationStore.getState().addNotification).toHaveBeenCalledWith(
                expect.objectContaining({ type: 'verification_approved' })
            );
        });

        it('should reject verification and record reason', () => {
            const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com', verification: { status: 'IN_REVIEW' } } as any;
            useAuthStore.getState().setAuth(mockUser);

            useAuthStore.getState().rejectVerification('Documento ilegível');

            const state = useAuthStore.getState();
            expect(state.user?.verification?.status).toBe('REJECTED');
            expect(state.user?.isVerified).toBe(false);
            expect(state.user?.verification?.rejectionReason).toBe('Documento ilegível');
            expect(state.user?.verification?.reviewedAt).toBeDefined();
        });
    });
});
