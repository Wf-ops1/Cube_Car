import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('zustand/middleware', () => ({ persist: (c: any) => c, devtools: (c: any) => c }));

import { useAppLogic } from './App.logic';
import { useAuthStore } from '@/core/auth/auth.store';
import { useChatStore } from '@/features/messaging/stores/chat.store';

describe('Integração: useAppLogic (Roteamento)', () => {

  beforeEach(() => {
      // Clear global stores to prevent state bleed
      useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false });
      useChatStore.setState({ conversations: [] });
  });

  it('deve inicializar o app na tela home e com modais fechados', () => {
    // Cria o ambiente invisível para o hook rodar
    const { result } = renderHook(() => useAppLogic());

    // Verifica o estado inicial
    expect(result.current.currentPage).toBe('home');
    expect(result.current.isSearchModalOpen).toBe(false);
  });

  it('deve navegar para a tela de detalhes e conseguir voltar para a home', () => {
    const { result } = renderHook(() => useAppLogic());

    // O 'act' é obrigatório sempre que formos disparar uma função que muda o state do React
    act(() => {
      result.current.navigateTo('details'); 
    });

    // Valida se a página mudou para os detalhes do carro
    expect(result.current.currentPage).toBe('details');

    // Valida se a home ficou salva no histórico chamando goBack()
    act(() => {
      result.current.goBack();
    });

    expect(result.current.currentPage).toBe('home');
  });

  it('deve abrir o modal de pesquisa corretamente', () => {
    const { result } = renderHook(() => useAppLogic());

    act(() => {
      result.current.setIsSearchModalOpen(true);
    });

    expect(result.current.isSearchModalOpen).toBe(true);
  });

});
