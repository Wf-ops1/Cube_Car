import { useState } from 'react';
import { User } from '@/core/data/auth/auth.types';
import { authGateway } from '@/core/data/gateways/auth.gateway';
import { AUTH_MESSAGES } from '../../constants/authMessages';

export const useGoogleAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGoogleLogin = async (): Promise<User | null> => {
        setLoading(true);
        setError(null);

        try {
            // In a real app, this would trigger the Google OAuth Popup/Redirect
            const user = await authGateway.googleLogin();
            return user;
        } catch (err: any) {
            console.error('Google Auth Error:', err);
            setError(AUTH_MESSAGES.ERROR.NETWORK_ERROR);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        handleGoogleLogin
    };
};
