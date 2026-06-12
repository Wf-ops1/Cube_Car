import { User } from '@/shared/types';
import { mockUser, mockHost } from '@/core/data/auth/user.mock.ts';

export interface AuthGatewayContract {
    login(credentials: any): Promise<any>;
    logout(): Promise<void>;
    signup(data: any): Promise<any>;
    googleLogin(): Promise<any>;
}

// Mock implementation (using centralized mocks)
const mockUsers: User[] = [mockUser, mockHost];

class MockAuthGateway implements AuthGatewayContract {
    async login(credentials: any): Promise<any> {
        // Original mock logic for email/password login
        const user = mockUsers.find(u => u.email === credentials.email);
        if (!user) {
            // Fallback for dev: if email is 'admin', return mockUser with moderator role
            if (credentials.email === 'admin@cube.com') {
                return { user: { ...mockUser, role: 'moderator', name: 'Admin User' }, token: 'mock-admin-token' };
            }
            throw new Error('Invalid credentials');
        }
        return { user, token: 'mock-token' };
    }

    async signup(data: any): Promise<any> {
        const newUser: User = {
            id: Date.now().toString(),
            email: data.email,
            name: data.name,
            role: 'traveler',
            isVerified: false,
            verification: {
                id: crypto.randomUUID(),
                userId: 'new-user',
                status: 'NOT_STARTED',
                documents: []
            }
        };
        mockUsers.push(newUser);
        return newUser;
    }

    async logout(): Promise<void> {
        return Promise.resolve();
    }

    async googleLogin(): Promise<any> {
        // Return centralized mockUser for consistency
        return { user: mockUser, token: 'mock-token' };
    }
}

// Real implementation (preparada para futuro)
class RealAuthGateway implements AuthGatewayContract {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async login(credentials: any): Promise<any> {
        // TODO: Implementar chamada real à API
        return mockAuthGateway.login(credentials);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async signup(data: any): Promise<any> {
        // TODO: Implementar chamada real à API
        return mockAuthGateway.signup(data);
    }

    async googleLogin(): Promise<any> {
        return mockAuthGateway.googleLogin();
    }

    async logout(): Promise<void> {
        // TODO: Implementar chamada real à API
        return mockAuthGateway.logout();
    }
}

// Export instances
const mockAuthGateway = new MockAuthGateway();
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const realAuthGateway = new RealAuthGateway();

// Use mock for now
export const authGateway = mockAuthGateway;
