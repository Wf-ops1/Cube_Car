import { useState } from 'react';
import { User } from '@/core/data/auth/auth.types';
import { authGateway } from '@/core/data/gateways/auth.gateway';
import { AUTH_MESSAGES } from '../../constants/authMessages';
import { AuthMode, AuthFormData } from '../../types';
import { emailValidator } from '../../validators/emailValidator';
import { passwordValidator } from '../../validators/passwordValidator';

interface UseEmailAuthProps {
    mode: AuthMode;
}

export const useEmailAuth = ({ mode }: UseEmailAuthProps) => {
    const [form, setForm] = useState<AuthFormData>({ email: '', password: '', name: '' });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const validate = (): boolean => {
        const errors: Record<string, string> = {};

        const emailErr = emailValidator(form.email);
        if (emailErr) errors.email = emailErr;

        const passErr = passwordValidator(form.password, mode);
        if (passErr) errors.password = passErr;

        if (mode === 'signup' && !form.name.trim()) {
            errors.name = AUTH_MESSAGES.ERROR.NAME_REQUIRED;
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const submit = async (): Promise<User | null> => {
        setError(null);

        if (!validate()) {
            return null;
        }

        setLoading(true);

        try {
            let user: User;

            if (mode === 'login') {
                user = await authGateway.login({ email: form.email, password: form.password });
            } else {
                // For signup, we structure the user object as expected by the gateway
                // Note: In a real app, password should be sent separately or handled by the gateway securely
                user = await authGateway.signup({
                    email: form.email,
                    name: form.name,
                    // Pass mock data or let gateway handle it
                    avatar: `https://i.pravatar.cc/150?u=${form.email}`,
                    isHost: false
                });
            }

            return user;
        } catch (err: any) {
            // Map known errors
            if (err.message === 'RATE_LIMIT_EXCEEDED') {
                setError(AUTH_MESSAGES.ERROR.RATE_LIMIT);
            } else if (err.message === 'INVALID_CREDENTIALS') {
                setError(AUTH_MESSAGES.ERROR.INVALID_CREDENTIALS);
            } else {
                setError(err.message || AUTH_MESSAGES.ERROR.NETWORK_ERROR);
            }
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: keyof AuthFormData, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return {
        form,
        updateField,
        error,
        fieldErrors,
        loading,
        submit,
        resetForm: () => setForm({ email: '', password: '', name: '' })
    };
};
