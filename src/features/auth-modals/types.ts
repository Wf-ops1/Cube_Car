import { User } from '@/core/data/auth/auth.types';

export type AuthMode = 'login' | 'signup';
export type AuthMethod = 'email' | 'google';

export interface AuthFormData {
    email: string;
    password: string;
    name: string;
}

export interface AuthModalProps {
    onClose: () => void;
    initialView?: AuthMode;
    onLogin?: (user: User, isSignup?: boolean) => void;
}

export interface AuthModalConfig {
    methods?: AuthMethod[];
    defaultMode?: AuthMode;
}

export type FieldErrors = Partial<Record<keyof AuthFormData, string>>;
