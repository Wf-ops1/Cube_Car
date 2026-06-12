import { z } from 'zod';

export const loginResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  token: z.string(),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

export class AuthService {
  static async login(email: string, password: string): Promise<LoginResponse> {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 500));
    
    // Simulate a successful response
    const fakeData = {
      id: 'mocked-id',
      email: email,
      name: 'Mock User',
      token: 'fake-jwt-token-123'
    };
    
    // Zod parsing ensures the contract is strictly followed
    return loginResponseSchema.parse(fakeData);
  }
}
