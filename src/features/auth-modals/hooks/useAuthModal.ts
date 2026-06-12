import { useState } from 'react';
import { AuthMode, AuthMethod, AuthModalConfig } from '../types';
import { useEmailAuth } from './strategies/useEmailAuth';
import { useGoogleAuth } from './strategies/useGoogleAuth';

export const useAuthModal = (config: AuthModalConfig = {}) => {
    const [mode, setMode] = useState<AuthMode>(config.defaultMode || 'login');
    const [activeMethod, setActiveMethod] = useState<AuthMethod>('email');

    // Strategies
    const emailAuth = useEmailAuth({ mode });
    const googleAuth = useGoogleAuth();

    const switchMode = (newMode: AuthMode) => {
        setMode(newMode);
        emailAuth.resetForm();
    };

    const isLoading = emailAuth.loading || googleAuth.loading;

    return {
        mode,
        setMode: switchMode,
        activeMethod,
        setActiveMethod,
        emailAuth,
        googleAuth,
        isLoading
    };
};
