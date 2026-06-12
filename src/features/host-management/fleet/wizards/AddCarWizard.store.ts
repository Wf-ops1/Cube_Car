import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type WizardStep = 'document' | 'basic_info' | 'details' | 'photos' | 'location' | 'pricing' | 'review';

export const STEPS: WizardStep[] = ['document', 'basic_info', 'details', 'photos', 'location', 'pricing', 'review'];

interface WizardData {
    // Step 1 & 2: Basic Info
    licensePlate?: string;
    renavam?: string;
    make?: string;
    model?: string;
    year?: number;
    color?: string;

    // Step 3: Details
    transmission?: string;
    fuel?: string;
    hasInsurance?: boolean;
    seats?: number;
    doors?: number;
    description?: string;
    features?: string[]; // stored as flat array, UI groups them
    type?: string; // SUV, Sedan etc

    // Step 4: Photos
    photos?: string[];

    // Step 5: Location
    location?: string; // City/State
    address?: string; // Private exact address
    neighborhood?: string; // Neighborhood
    number?: string; // House/Building number
    zipCode?: string;

    // Step 6: Pricing & Rules
    pricePerDay?: number;
    minTripDuration?: number; // days
    cancellationPolicy?: string;

    // Metadata
    ownerId?: string;
}

interface AddCarWizardState {
    isOpen: boolean;
    currentStep: WizardStep;
    data: WizardData;
    isScanning: boolean;
    ocrScanStatus: 'idle' | 'scanning' | 'success' | 'partial_success' | 'failed';
    extractedData: Partial<WizardData>;

    // State for Floating Navbar validation
    stepValidity: boolean;
    setStepValidity: (isValid: boolean) => void;

    // Actions
    openWizard: () => void;
    closeWizard: () => void;
    setStep: (step: WizardStep) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateData: (data: Partial<WizardData>) => void;
    setOcrScanStatus: (status: 'idle' | 'scanning' | 'success' | 'partial_success' | 'failed') => void;
    setExtractedData: (data: Partial<WizardData>) => void;
    startScanning: () => void;
    completeScanning: (mockData: Partial<WizardData>) => void;
    reset: () => void;

    // Computed
    getProgress: () => number;
}

const INITIAL_DATA: WizardData = {
    photos: [],
    pricePerDay: 150,
    features: [],
    seats: 5,
    doors: 4,
    transmission: 'Automático',
    fuel: 'Flex'
};

export const useAddCarWizardStore = create<AddCarWizardState>()(
    devtools(
        persist(
            (set, get) => ({
                isOpen: false,
            currentStep: 'document',
            data: INITIAL_DATA,
            isScanning: false,
            ocrScanStatus: 'idle',
            extractedData: {},
            stepValidity: false, // Default to false until step confirms valid

            setStepValidity: (isValid) => set({ stepValidity: isValid }),

            setOcrScanStatus: (status) => set({ ocrScanStatus: status }),
            setExtractedData: (extractedData) => set((state) => ({
                extractedData,
                data: { ...state.data, ...extractedData }
            })),

            openWizard: () => set({ isOpen: true, currentStep: 'document', stepValidity: false }),
            closeWizard: () => set({ isOpen: false }),
            setStep: (step) => set({ currentStep: step, stepValidity: false }), // Reset validity on step change

            nextStep: () => {
                const currentIndex = STEPS.indexOf(get().currentStep);
                if (currentIndex < STEPS.length - 1) {
                    set({ currentStep: STEPS[currentIndex + 1], stepValidity: false });
                }
            },

            prevStep: () => {
                const currentIndex = STEPS.indexOf(get().currentStep);
                if (currentIndex > 0) {
                    set({ currentStep: STEPS[currentIndex - 1], stepValidity: true }); // Going back usually means valid previous state, but components will re-validate
                }
            },

            updateData: (updates) => set((state) => ({
                data: { ...state.data, ...updates }
            })),

            startScanning: () => set({ isScanning: true }),

            completeScanning: (mockData) => set((state) => ({
                isScanning: false,
                data: { ...state.data, ...mockData },
                currentStep: 'basic_info'
            })),

            reset: () => set({
                currentStep: 'document',
                data: INITIAL_DATA,
                isScanning: false,
                ocrScanStatus: 'idle',
                extractedData: {},
                stepValidity: false
            }),

            getProgress: () => {
                const currentIndex = STEPS.indexOf(get().currentStep);
                return Math.round(((currentIndex + 1) / STEPS.length) * 100);
            }
        }),
        { name: 'cube-car-wizard-draft' }
        ),
        { name: 'AddCarWizardStore' }
    )
);
