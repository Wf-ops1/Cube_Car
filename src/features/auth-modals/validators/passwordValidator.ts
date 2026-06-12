import { AUTH_CONFIG } from '../constants/authConfig';
import { AUTH_MESSAGES } from '../constants/authMessages';
import { AuthMode } from '../types';

export const passwordValidator = (password: string, mode: AuthMode): string | null => {
    if (!password) return AUTH_MESSAGES.ERROR.PASSWORD_REQUIRED;

    // Login: minimal validation
    if (mode === 'login') {
        return password.length >= AUTH_CONFIG.PASSWORD.MIN_LENGTH_LOGIN
            ? null
            : AUTH_MESSAGES.ERROR.PASSWORD_TOO_SHORT;
    }

    // Signup: strong validation
    if (password.length < AUTH_CONFIG.PASSWORD.MIN_LENGTH_SIGNUP) return AUTH_MESSAGES.ERROR.PASSWORD_WEAK;
    if (AUTH_CONFIG.PASSWORD.REQUIRE_LETTER && !/[a-zA-Z]/.test(password)) return AUTH_MESSAGES.ERROR.PASSWORD_WEAK;
    if (AUTH_CONFIG.PASSWORD.REQUIRE_NUMBER && !/[0-9]/.test(password)) return AUTH_MESSAGES.ERROR.PASSWORD_WEAK;
    if (AUTH_CONFIG.PASSWORD.REQUIRE_SPECIAL && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) return AUTH_MESSAGES.ERROR.PASSWORD_WEAK;

    return null;
};
