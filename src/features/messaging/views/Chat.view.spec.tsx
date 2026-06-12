import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatView from './Chat.view';
import React from 'react';

// Mock dependencies
const mockUseChat = vi.fn();
vi.mock('../hooks/useChat', () => ({
    useChat: () => mockUseChat()
}));

const mockUseChatSearch = vi.fn();
vi.mock('../hooks/useChatSearch', () => ({
    useChatSearch: () => mockUseChatSearch()
}));

const mockUseMobileViewportFix = vi.fn();
vi.mock('../hooks/useMobileViewportFix', () => ({
    useMobileViewportFix: () => mockUseMobileViewportFix()
}));

vi.mock('@/core/components/Header', () => ({ default: () => <div data-testid="header-mock" /> }));
vi.mock('@/shared/components/ui/Spinner', () => ({ Spinner: () => <div data-testid="spinner-mock" /> }));

describe('ChatView RTL', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render empty state when no conversation is selected', () => {
        mockUseChat.mockReturnValue({
            activeConversation: null,
            pinnedIds: [],
        });
        mockUseChatSearch.mockReturnValue({
            filteredConversations: [],
            sidebarSearchQuery: '',
            setSidebarSearchQuery: vi.fn(),
            closeChatSearch: vi.fn(),
        });
        mockUseMobileViewportFix.mockReturnValue({ viewportHeight: '100vh' });

        render(<ChatView 
            conversations={[{ id: 'dummy' } as any]} 
            currentUser={{ id: 'u1' } as any} 
            activeChatId={null} 
            onSelectChat={vi.fn()} 
            onBack={vi.fn()} 
        />);
        
        expect(screen.getByText('Nenhuma conversa selecionada')).toBeDefined();
    });

    it('should render chat messages', () => {
        const mockSendMessage = vi.fn();
        
        mockUseChat.mockReturnValue({
            activeConversation: {
                id: 'c1',
                messages: [{ id: 'm1', text: 'HelloFromMock', senderId: 'u2', timestamp: '10:00', status: 'sent' }],
                participants: [{ id: 'u1' }, { id: 'u2', name: 'John Doe' }]
            },
            pinnedIds: [],
            inputText: 'Test',
            handleInputResize: vi.fn(),
            handleSendMessage: mockSendMessage,
            handleKeyDown: vi.fn(),
            handleInputFocus: vi.fn(),
            textareaRef: { current: document.createElement('textarea') },
            messagesContainerRef: { current: null },
            touchStartRef: { current: 0 },
            optionsMenuRef: { current: null },
            isOptionsOpen: false,
            setIsOptionsOpen: vi.fn(),
            isDetailsModalOpen: false,
            setIsDetailsModalOpen: vi.fn(),
        });

        mockUseChatSearch.mockReturnValue({
            filteredConversations: [],
            sidebarSearchQuery: '',
            setSidebarSearchQuery: vi.fn(),
            closeChatSearch: vi.fn(),
            isChatSearchActive: false,
            matches: [],
            currentMatchIndex: 0,
            messageRefs: { current: {} }
        });

        mockUseMobileViewportFix.mockReturnValue({ viewportHeight: '100vh' });

        render(<ChatView 
            conversations={[{ id: 'c1', messages: [] } as any]} 
            currentUser={{ id: 'u1' } as any} 
            activeChatId={'c1'} 
            onSelectChat={vi.fn()} 
            onBack={vi.fn()} 
        />);

        expect(screen.getByText('HelloFromMock')).toBeDefined();
    });
});
