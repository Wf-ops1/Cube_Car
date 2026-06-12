import { useState } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { useAddCarWizardStore, STEPS } from '../../AddCarWizard.store';
import { useHostStore } from '../../../../stores/host.store';
import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';
// carsGateway no longer used locally

export const useAddCarWizardLogic = (onComplete?: () => void, onAuthModal?: (type: 'login' | 'signup') => void) => {
    const { isOpen, currentStep, closeWizard, getProgress, stepValidity, nextStep, prevStep, reset, data } = useAddCarWizardStore();
    const { addCar } = useHostStore();
    const progress = getProgress();
    const { user } = useAuthStore();
    const [isPublishing, setIsPublishing] = useState(false);
    const [showVerificationPrompt, setShowVerificationPrompt] = useState(false);

    // Layout Logic configurations (preventing hardcodes in the view)
    const isTopAlignedStep = currentStep === 'details';

    // Helper for saving the car data
    const performSaveCar = async (isVerified: boolean) => {
        setIsPublishing(true);
        // Simulate Network Delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        const carType = data.type || 'Sedan';
        const newCar = {
            id: Math.random().toString(36).substr(2, 9),
            ownerId: user?.id || 'user-1',
            make: data.make || 'Marca',
            model: data.model || 'Modelo',
            year: data.year || 2024,
            pricePerDay: data.pricePerDay || 150,
            imageUrl: data.photos?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&q=80&w=800',
            category: carType,
            type: carType,
            rating: 5.0,
            trips: 0,
            location: data.location || 'São Paulo, SP',
            neighborhood: data.neighborhood,
            coordinates: { lat: -23.5505, lng: -46.6333 },
            status: isVerified ? ('approved' as const) : ('pending' as const),
            isActiveAd: isVerified,
            description: data.description,
            features: data.features,
            images: data.photos
        };

        await addCar(newCar as any);
        setIsPublishing(false);
    };

    const handleNext = async () => {
        if (currentStep === 'review') {
            if (!user) {
                if (onAuthModal) {
                    onAuthModal('signup');
                }
                return;
            }

            const isVerified = user?.isVerified || false;
            
            if (!isVerified) {
                setShowVerificationPrompt(true);
                return;
            }

            await performSaveCar(isVerified);

            closeWizard();
            reset();

            // Trigger refresh externally if provided
            if (onComplete) {
                onComplete();
            }
        } else {
            nextStep();
        }
    };

    const handleSaveDraftAndExit = async () => {
        await performSaveCar(false);
        setShowVerificationPrompt(false);
        closeWizard();
        reset();
        if (onComplete) onComplete();
    };

    const handleStartVerification = async () => {
        await performSaveCar(false);
        setShowVerificationPrompt(false);
        closeWizard();
        reset();
        if (onComplete) onComplete();
        // Open the verification wizard directly
        setTimeout(() => {
            useUserVerificationWizardStore.getState().openWizard();
        }, 100);
    };

    return {
        isOpen,
        currentStep,
        closeWizard,
        progress,
        stepValidity,
        nextStep,
        prevStep,
        user,
        isPublishing,
        handleNext,
        STEPS,
        isTopAlignedStep,
        showVerificationPrompt,
        setShowVerificationPrompt,
        handleSaveDraftAndExit,
        handleStartVerification
    };
};
