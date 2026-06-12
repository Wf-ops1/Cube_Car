import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { User } from '@/shared/types';
import { useNotificationStore } from '@/features/notifications/stores/notification.store';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    // Actions
    setAuth: (user: User | null) => void;
    logout: () => void;
    setLoading: (isLoading: boolean) => void;
    submitVerificationDocuments: () => Promise<boolean>;
    approveVerification: () => void;
    rejectVerification: (reason: string) => void;
}

/**
 * Global Authentication Store
 * Manages user session state using Zustand with persistence and devtools.
 */
export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set, get) => ({
                user: null,
                isAuthenticated: false,
                isLoading: true, // Começa em loading para aguardar o rehydrate

                setAuth: (user) =>
                    set({
                        user,
                        isAuthenticated: !!user,
                        isLoading: false
                    }, false, 'auth/setAuth'),

                logout: () =>
                    set({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false
                    }, false, 'auth/logout'),

                setLoading: (isLoading) => set({ isLoading }, false, 'auth/setLoading'),

                submitVerificationDocuments: async () => {
                    set({ isLoading: true }, false, 'auth/submitStart');
                    // Simulate API delay
                    await new Promise(r => setTimeout(r, 1500));

                    const currentUser = get().user;

                    if (currentUser) {
                        // Self-healing: Ensure verification object exists
                        const verification = currentUser.verification || {
                            id: crypto.randomUUID(),
                            userId: currentUser.id,
                            status: 'NOT_STARTED',
                            documents: []
                        };

                        let docs = verification.documents || [];

                        // Safeguard: if documents array is empty, create them
                        if (docs.length === 0) {
                            docs = [
                                { type: 'CNH', status: 'MISSING' },
                                { type: 'SELFIE', status: 'MISSING' }
                            ] as any;
                        }

                        const updatedDocuments = docs.map(doc => {
                            if (doc.type === 'CNH' || doc.type === 'SELFIE') {
                                return { ...doc, status: 'PENDING_REVIEW' as const, submittedAt: new Date() };
                            }
                            return doc;
                        });

                        const updatedUser = {
                            ...currentUser,
                            verification: {
                                ...verification,
                                status: 'IN_REVIEW' as const,
                                documents: updatedDocuments
                            }
                        };

                        console.log('[AuthStore] Verification Submitted:', updatedUser.verification);

                        set({
                            user: updatedUser as any,
                            isAuthenticated: true, // Ensure auth consistency
                            isLoading: false
                        }, false, 'auth/submitSuccess');

                        // [NOTIFICATION] Documentos Recebidos
                        useNotificationStore.getState().addNotification({
                            id: crypto.randomUUID(),
                            userId: currentUser.id,
                            type: 'verification_submitted',
                            title: '📄 Documentos recebidos',
                            message: 'Seus documentos já estão com a gente! Avisaremos assim que a análise for concluída.',
                            read: false,
                            createdAt: new Date().toISOString()
                        });

                        // 🕵️ DEV SIMULATION: Auto-approve after 2 minutes
                        // Fires for ALL users in dev mode (no backend exists yet)
                        console.log('[AuthStore] 🔍 User ID:', currentUser.id, '| Email:', currentUser.email);
                        console.log('[AuthStore] ⏳ Scheduling auto-approval in 2 minutes...');

                        setTimeout(() => {
                            const userAtExecution = get().user;
                            console.log('[AuthStore] ⚡ Timer fired! Current user:', userAtExecution?.id, '| Status:', userAtExecution?.verification?.status);

                            if (userAtExecution && userAtExecution.verification?.status === 'IN_REVIEW') {
                                console.log('[AuthStore] ✅ Executing Auto-Approval NOW');
                                get().approveVerification();
                            } else {
                                console.log('[AuthStore] ⚠️ Skipped: user gone or status changed');
                            }
                        }, 120000); // 2 minutes

                        return true;
                    }

                    set({ isLoading: false }, false, 'auth/submitNoUser');
                    return false;
                },

                approveVerification: () => {
                    const currentUser = get().user;
                    if (!currentUser) return;

                    // Update User State
                    const updatedUser = {
                        ...currentUser,
                        isVerified: true, // Legacy support
                        verification: {
                            ...currentUser.verification,
                            status: 'APPROVED' as const,
                            reviewedAt: new Date()
                        }
                    };

                    set({ user: updatedUser as any }, false, 'auth/approveVerification');

                    // [NOTIFICATION] Aprovado
                    useNotificationStore.getState().addNotification({
                        id: crypto.randomUUID(),
                        userId: currentUser.id,
                        type: 'verification_approved',
                        title: '✅ Conta verificada!',
                        message: 'Tudo certo! Sua conta foi validada e você já pode alugar na Cube.',
                        read: false,
                        createdAt: new Date().toISOString()
                    });
                },

                rejectVerification: (reason: string) => {
                    const currentUser = get().user;
                    if (!currentUser) return;

                    // Update User State
                    const updatedUser = {
                        ...currentUser,
                        isVerified: false,
                        verification: {
                            ...currentUser.verification,
                            status: 'REJECTED' as const,
                            reviewedAt: new Date(),
                            rejectionReason: reason
                        }
                    };

                    set({ user: updatedUser as any }, false, 'auth/rejectVerification');

                },
            }),
            {
                name: 'cube-car-auth-storage', // Nome da chave no LocalStorage
                onRehydrateStorage: () => (state) => {
                    // Finaliza o loading assim que o rehydrate termina
                    if (state) {
                        state.setLoading(false);
                        
                        // Resiliência de DEV: Garante que a aprovação fictícia aconteça
                        // mesmo que o usuário recarregue a página (F5) enquanto está "Em Análise"
                        if (state.user?.verification?.status === 'IN_REVIEW') {
                            const docs = state.user.verification.documents || [];
                            const submittedDoc = docs.find(d => d.submittedAt);
                            
                            if (submittedDoc?.submittedAt) {
                                const diff = new Date().getTime() - new Date(submittedDoc.submittedAt).getTime();
                                const timeRemaining = 120000 - diff; // 2 minutos
                                
                                if (timeRemaining <= 0) {
                                    console.log('[AuthStore] Auto-approving immediately after reload (time already passed)');
                                    setTimeout(() => state.approveVerification(), 500); // 500ms delay para dar tempo do UI montar
                                } else {
                                    console.log(`[AuthStore] Resuming auto-approval timer after reload: ${timeRemaining}ms remaining`);
                                    setTimeout(() => {
                                        if (useAuthStore.getState().user?.verification?.status === 'IN_REVIEW') {
                                            useAuthStore.getState().approveVerification();
                                        }
                                    }, timeRemaining);
                                }
                            } else {
                                // Fallback caso não ache data de submissão
                                setTimeout(() => state.approveVerification(), 120000);
                            }
                        }
                    }
                },
            }
        ),
        { name: 'AuthStore' }
    )
);

// Selectors for performance optimization
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthActions = () => {
    const setAuth = useAuthStore((state) => state.setAuth);
    const logout = useAuthStore((state) => state.logout);
    const setLoading = useAuthStore((state) => state.setLoading);

    return { setAuth, logout, setLoading };
};
