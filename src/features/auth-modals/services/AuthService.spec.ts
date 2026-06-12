import { describe, it, expect } from 'vitest';
import { AuthService } from './AuthService';

describe('AuthService', () => {
    it('should validate and return login payload correctly', async () => {
        const response = await AuthService.login('test@example.com', 'password123');
        expect(response).toHaveProperty('token');
        expect(response.email).toBe('test@example.com');
        expect(response.name).toBe('Mock User');
    });

    it('should adhere to the exact payload structure via Zod schema', async () => {
        const response = await AuthService.login('test2@example.com', 'password123');
        expect(typeof response.id).toBe('string');
        expect(typeof response.token).toBe('string');
    });
});
