import { User } from '@/core/data/auth/auth.types';
import { useAuthModal } from '../hooks/useAuthModal';

interface UseSignupModalProps {
    onClose: () => void;
    onSignup?: (user: User) => void;
}

export const useSignupModal = ({ onClose, onSignup }: UseSignupModalProps) => {
    // Force signup mode
    const auth = useAuthModal({ defaultMode: 'signup' });

    const handleSuccess = (user: User) => {
        if (onSignup) {
            onSignup(user);
        }
        onClose();
    };

    return {
        // We only expose what's needed for signup
        emailAuth: auth.emailAuth,
        googleAuth: auth.googleAuth,
        isLoading: auth.isLoading,
        handleSuccess
    };
};
