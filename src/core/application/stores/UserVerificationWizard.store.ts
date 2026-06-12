import { useAuthStore } from '@/core/auth/auth.store'; // Static import

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { UserVerification } from '@/core/domain/verification/verification.types';
import { getPendingDocuments } from '@/core/domain/verification/verification.logic';



export type UserVerificationStep = 'cnh' | 'facial' | 'success';

// Default full flow
const ALL_STEPS: UserVerificationStep[] = ['cnh', 'facial', 'success'];

interface VerificationData {
    cnhImage?: string;
    cnhFileType?: string;
    cnhFile?: File;
    selfieImage?: string;
    selfieFile?: File; // For backend upload
}

export type VerificationContext = 'onboarding' | 'booking' | 'profile';

interface UserVerificationWizardState {
    isOpen: boolean;
    currentStep: UserVerificationStep;
    steps: UserVerificationStep[]; // Dynamic steps based on current status
    data: VerificationData;
    context: VerificationContext;
    isUploading: boolean;

    // Step validation state
    stepValidity: boolean;
    setStepValidity: (isValid: boolean) => void;

    // Submission State
    hasSubmitted: boolean;
    setHasSubmitted: (hasSubmitted: boolean) => void;

    // Actions
    openWizard: (context?: VerificationContext, userVerification?: UserVerification) => void;
    closeWizard: () => void;
    setStep: (step: UserVerificationStep) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateData: (data: Partial<VerificationData>) => void;
    reset: () => void;

    // Computed
    getProgress: () => number;
}

const INITIAL_DATA: VerificationData = {};

export const useUserVerificationWizardStore = create<UserVerificationWizardState>()(
    devtools(
        (set, get) => ({
            isOpen: false,
            currentStep: 'cnh',
            steps: ALL_STEPS, // Start with default
            data: INITIAL_DATA,
            isUploading: false,
            stepValidity: false,

            setStepValidity: (isValid) => set({ stepValidity: isValid }),

            setHasSubmitted: (hasSubmitted) => set({ hasSubmitted }),

            openWizard: (context = 'onboarding', userVerification) => {
                let dynamicSteps = [...ALL_STEPS];

                if (userVerification) {
                    // Domain Logic: Filter which docs are needed
                    const pendingDocs = getPendingDocuments(userVerification.documents);

                    // Map DocumentType to WizardStep
                    const requiredSteps: UserVerificationStep[] = [];
                    if (pendingDocs.includes('CNH')) requiredSteps.push('cnh');
                    if (pendingDocs.includes('SELFIE')) requiredSteps.push('facial');
                    requiredSteps.push('success'); // Always end with success/submit

                    dynamicSteps = requiredSteps;
                }

                // If nothing to do (e.g. all approved but wizard forced open), default or handle edge case
                if (dynamicSteps.length === 1 && dynamicSteps[0] === 'success') {
                    // Edge case: User is fully verified but opened wizard. Maybe show success immediately?
                }

                set({
                    isOpen: true,
                    steps: dynamicSteps,
                    currentStep: dynamicSteps[0],
                    stepValidity: false,
                    context,
                    hasSubmitted: false // Reset on open
                });
            },

            closeWizard: () => set({ isOpen: false }),

            setStep: (step) => set({ currentStep: step, stepValidity: false }),

            nextStep: () => {
                const { currentStep, steps } = get();
                const currentIndex = steps.indexOf(currentStep);

                if (currentIndex < steps.length - 1) {
                    const nextStep = steps[currentIndex + 1];

                    // Logic: If completing facial step (or explicitly moving to success)
                    if (currentStep === 'facial' && nextStep === 'success') {
                        set({ hasSubmitted: true });

                        // Trigger submission logic in Auth Store
                        import('@/core/auth/auth.store').then(({ useAuthStore }) => {
                            useAuthStore.getState().submitVerificationDocuments();
                        });
                    } else if (nextStep === 'success') {
                        // Fallback: If skipping straight to success (shouldn't happen often, but safe)
                        set({ hasSubmitted: true });
                        import('@/core/auth/auth.store').then(({ useAuthStore }) => {
                            useAuthStore.getState().submitVerificationDocuments();
                        });
                    }

                    set({ currentStep: nextStep, stepValidity: false });
                } else {
                    // Finished
                }
            },

            prevStep: () => {
                const { currentStep, steps } = get();
                const currentIndex = steps.indexOf(currentStep);
                if (currentIndex > 0) {
                    set({ currentStep: steps[currentIndex - 1], stepValidity: true });
                }
            },

            updateData: (updates) => set((state) => ({
                data: { ...state.data, ...updates }
            })),

            reset: () => set({
                currentStep: 'cnh',
                steps: ALL_STEPS,
                data: INITIAL_DATA,
                isUploading: false,
                stepValidity: false,
                context: 'onboarding',
                hasSubmitted: false
            }),

            getProgress: () => {
                const { currentStep, steps } = get();
                const currentIndex = steps.indexOf(currentStep);
                return Math.round(((currentIndex + 1) / steps.length) * 100);
            }
        }),
        { name: 'UserVerificationWizardStore' }
    )
);
