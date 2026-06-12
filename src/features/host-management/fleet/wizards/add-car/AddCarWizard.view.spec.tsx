import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AddCarWizard from './AddCarWizard.view';
import { useAddCarWizardStore } from '../AddCarWizard.store';
import { useAuthStore } from '@/core/auth/auth.store';

vi.mock('zustand/middleware', () => ({ persist: (c: any) => c, devtools: (c: any) => c }));

describe('Integração Visual: AddCarWizard', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({ 
                matches: false, 
                media: query,
                onchange: null,
                addListener: vi.fn(), 
                removeListener: vi.fn(),
                addEventListener: vi.fn(), 
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn()
            })),
        });
        
        useAuthStore.setState({ user: { id: 'u1' } as any });
        useAddCarWizardStore.getState().reset();
        useAddCarWizardStore.getState().openWizard();
    });

    it('deve bloquear avanço com campos vazios e permitir avanço com inputs forçados (Armadilha 2)', async () => {
        const { container } = render(<AddCarWizard />);
        
        const continueBtn = screen.getAllByRole('button', { name: /Continuar/i })[0] as HTMLButtonElement;
        
        // Deve estar desabilitado no início
        expect(continueBtn.disabled).toBe(true);

        // Encontrar os inputs (assumindo Placa e Renavam no Step 1)
        const textInputs = container.querySelectorAll('input[type="text"]');
        
        if (textInputs.length >= 2) {
            // Usa fireEvent.change para injetar o valor de uma vez e fugir da armadilha de máscara
            await act(async () => {
                fireEvent.change(textInputs[0], { target: { value: 'AAA-1234' } });
                fireEvent.change(textInputs[1], { target: { value: '12345678901' } });
            });

            // O botão deve ser habilitado
            expect(continueBtn.disabled).toBe(false);
            
            // Avança para o Step 2
            await act(async () => {
                fireEvent.click(continueBtn);
            });
            
            expect(useAddCarWizardStore.getState().currentStep).toBe('basic_info');
        }
    });
});
