import { User } from '@/core/data/auth/auth.types';
import { useAuthModal } from '../hooks/useAuthModal';

export type AuthView = 'login' | 'signup-email' | 'forgot-password';

interface UseLoginModalProps {
    onClose: () => void;
    initialView?: 'login' | 'signup';
    onLogin?: (user: User, isSignup?: boolean) => void;
}

export const useLoginModal = ({ onClose, onLogin }: UseLoginModalProps) => {
    // Force login mode
    const auth = useAuthModal({ defaultMode: 'login' });

    const handleSuccess = (user: User) => {
        if (onLogin) {
            onLogin(user);
        }
        onClose();
    };

    return {
        mode: auth.mode,
        setMode: auth.setMode,
        emailAuth: auth.emailAuth,
        googleAuth: auth.googleAuth,
        isLoading: auth.isLoading,
        handleSuccess
    };
};
