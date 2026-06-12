import { User } from '@/shared/types';

export type { User };

export interface AuthSession {
    user: User | null;
    token: string | null;
}

export interface AuthSession {
    user: User | null;
    token: string | null;
}
