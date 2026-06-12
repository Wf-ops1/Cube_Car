import { describe, it, expect, beforeEach, vi } from 'vitest';
vi.mock('zustand/middleware', () => ({ persist: (c: any) => c, devtools: (c: any) => c }));
import { useAddCarWizardStore } from './AddCarWizard.store';

describe('AddCarWizard Store', () => {
    beforeEach(() => {
        useAddCarWizardStore.getState().reset();
    });

    it('should navigate steps correctly', () => {
        const store = useAddCarWizardStore.getState();
        expect(store.currentStep).toBe('document');
        
        store.nextStep();
        expect(useAddCarWizardStore.getState().currentStep).toBe('basic_info');
        
        useAddCarWizardStore.getState().prevStep();
        expect(useAddCarWizardStore.getState().currentStep).toBe('document');
    });

    it('should update data correctly', () => {
        useAddCarWizardStore.getState().updateData({ make: 'Tesla', model: 'Model 3' });
        const store = useAddCarWizardStore.getState();
        expect(store.data.make).toBe('Tesla');
        expect(store.data.model).toBe('Model 3');
    });

    it('should calculate progress', () => {
        const store = useAddCarWizardStore.getState();
        // first step is document (1/7) -> ~14%
        expect(store.getProgress()).toBeGreaterThan(10);
    });

    it('should reset properly', () => {
        useAddCarWizardStore.getState().updateData({ make: 'Tesla' });
        useAddCarWizardStore.getState().nextStep();
        
        useAddCarWizardStore.getState().reset();
        const store = useAddCarWizardStore.getState();
        expect(store.currentStep).toBe('document');
        expect(store.data.make).toBeUndefined();
    });
});
