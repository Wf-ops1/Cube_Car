export const useOnboardingModal = (onClose: () => void) => {
    const handleContinue = () => {
        onClose();
    };

    return {
        handleContinue
    };
};
