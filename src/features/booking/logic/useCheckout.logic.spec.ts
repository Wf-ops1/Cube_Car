import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
vi.mock('zustand/middleware', () => ({ persist: (c: any) => c, devtools: (c: any) => c }));

import { useCheckoutLogic } from './useCheckout.logic'; 
import { useAuthStore } from '@/core/auth/auth.store';
import { User } from '@/shared/types';
import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';

const mockCar = { id: 'c1', ownerId: 'h1', pricePerDay: 100 } as any;
const mockPropsBase = {
    car: mockCar,
    initialStartDate: '2024-10-10',
    initialEndDate: '2024-10-12',
    initialStartTime: '10:00',
    initialEndTime: '10:00',
    onSuccess: vi.fn()
};

describe('Integração: Funil de Conversão Seguro (Checkout)', () => {

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(), // deprecated
            removeListener: vi.fn(), // deprecated
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })),
    });

    useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
    useUserVerificationWizardStore.getState().reset();
  });

  it('Trava 1: Deve iniciar no Step 0 (Login) se o usuário for anônimo', () => {
    const { result } = renderHook(() => useCheckoutLogic({ ...mockPropsBase, user: null }));

    expect(result.current.currentStep).toBe(0);
    // Para anônimo, a propriedade evalua como null ou false (user && user.verification)
    expect(result.current.needsVerification).toBeFalsy(); 
  });

  it('Trava 2: Deve interceptar usuários não verificados (needsVerification ativada)', () => {
    const mockUser: User = { 
        id: 'user-123', 
        name: 'Hóspede', 
        email: 'test@test.com',
        verification: { status: 'IN_REVIEW', documents: [] } as any 
    } as User;

    const { result } = renderHook(
        () => useCheckoutLogic({ ...mockPropsBase, user: mockUser })
    );

    // O Checkout deve iniciar no Step 1 porque há um usuário autenticado
    expect(result.current.currentStep).toBe(1);

    // No entanto, a flag de verificação obrigatória DEVE estar ativa, pois status !== 'APPROVED'
    expect(result.current.needsVerification).toBe(true);
  });

  it('Fluxo Feliz: Deve liberar a flag needsVerification para um usuário aprovado', () => {
    const mockUser: User = { 
        id: 'user-456', 
        name: 'Hóspede Premium', 
        email: 'test@test.com',
        isVerified: true,
        verification: { status: 'APPROVED', documents: [] } as any 
    } as User;

    const { result } = renderHook(() => useCheckoutLogic({ ...mockPropsBase, user: mockUser }));

    expect(result.current.currentStep).toBe(1);
    
    // O caminho do dinheiro está livre, a verificação não é mais necessária
    expect(result.current.needsVerification).toBe(false);
  });

});
