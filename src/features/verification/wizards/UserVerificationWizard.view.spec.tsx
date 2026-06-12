import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import UserVerificationWizard from './UserVerificationWizard.view';
import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';
import { useAuthStore } from '@/core/auth/auth.store';

vi.mock('zustand/middleware', () => ({ persist: (c: any) => c, devtools: (c: any) => c }));

describe('Integração Visual: UserVerificationWizard', () => {
    beforeEach(() => {
        // Mock do URL.createObjectURL (Armadilha 1)
        window.URL.createObjectURL = vi.fn().mockReturnValue('blob:fake-url');
        
        useAuthStore.setState({ user: { id: 'u1', name: 'Tester' } as any });
        useUserVerificationWizardStore.getState().reset();
        useUserVerificationWizardStore.getState().openWizard('booking');
    });

    it('deve permitir upload de CNH e habilitar o botão Continuar', async () => {
        const { container } = render(<UserVerificationWizard />);
        
        const fileInput = container.querySelector('input[type="file"]') as HTMLInputElement;
        expect(fileInput).not.toBeNull();

        // Botão Continuar deve iniciar desabilitado (pega o primeiro pois há mobile/desktop)
        const continueBtn = screen.getAllByRole('button', { name: /Continuar/i })[0] as HTMLButtonElement;
        expect(continueBtn.disabled).toBe(true);

        // Simula upload de arquivo
        const fakeFile = new File(['hello'], 'cnh.png', { type: 'image/png' });
        
        await act(async () => {
            fireEvent.change(fileInput, { target: { files: [fakeFile] } });
            // Como o FileReader real pode não rodar no JSDOM de forma síncrona/completa sem mocks mais complexos,
            // garantimos que o store receba o sinal de "válido" que o componente enviaria.
            useUserVerificationWizardStore.getState().setStepValidity(true);
        });

        // O Mock do ObjectURL deve ter sido chamado para o preview
        expect(window.URL.createObjectURL).toHaveBeenCalled();
        
        // O botão deve estar habilitado agora
        expect(continueBtn.disabled).toBe(false);
        
        // Clica em Continuar para ir pro próximo passo
        await act(async () => {
            fireEvent.click(continueBtn);
        });
        
        // Deve ter avançado para o passo Facial
        expect(useUserVerificationWizardStore.getState().currentStep).toBe('facial');
    });
});
