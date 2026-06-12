import { AUTH_CONFIG } from '../constants/authConfig';
import { AUTH_MESSAGES } from '../constants/authMessages';

export const emailValidator = (email: string): string | null => {
    if (!email) return AUTH_MESSAGES.ERROR.EMAIL_REQUIRED;
    if (!email.includes('@')) return AUTH_MESSAGES.ERROR.EMAIL_INVALID;
    if (email.length < AUTH_CONFIG.EMAIL.MIN_LENGTH) return AUTH_MESSAGES.ERROR.EMAIL_INVALID;
    return null;
};
