import React from 'react';
import { User } from '@/core/data/auth/auth.types';
import { Conversation, Message } from '@/core/data/messaging/messaging.types';

export type { Conversation, Message };

export interface ChatInterfaceProps {
    currentUser: User;
    onBack: () => void;
    conversations: Conversation[];
    activeChatId: string | null;
    onSelectChat: (chatId: string | null) => void;
    onSendMessage: (chatId: string, text: string) => void;
    onDeleteChat?: (chatId: string) => void;
    onViewCarDetails?: (carId: string) => void;
    onSearchFocus?: (isFocused: boolean) => void;
}

export interface ChatSidebarProps {
    conversations: Conversation[];
    activeChatId: string | null;
    pinnedIds: string[];
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onSelectChat: (id: string | null) => void;
    onBack: () => void;
    currentUserId: string;
    onSearchFocus?: (isFocused: boolean) => void;
}

export interface ChatHeaderProps {
    conversation: Conversation;
    isChatSearchActive: boolean;
    chatSearchTerm: string;
    onChatSearchTermChange: (term: string) => void;
    matches: string[];
    currentMatchIndex: number;
    onNavigateSearch: (direction: 'next' | 'prev') => void;
    onCloseChatSearch: () => void;
    onBack: () => void;
    isOptionsOpen: boolean;
    onToggleOptions: () => void;
    onActivateChatSearch: () => void;
    onTogglePin: () => void;
    isPinned: boolean;
    onDeleteConversation: () => void;
    optionsMenuRef: React.RefObject<HTMLDivElement>;
    chatSearchInputRef: React.RefObject<HTMLInputElement>;
    currentUser: User; // Making sure currentUser is available if needed for logic inside header
    onViewCarDetails?: (carId: string) => void; // For car widget in header if we move it there
}

export interface ChatMessageListProps {
    messages: Message[];
    currentUserId: string;
    isChatSearchActive: boolean;
    chatSearchTerm: string;
    matches: string[];
    currentMatchIndex: number;
    messagesContainerRef: React.RefObject<HTMLDivElement>;
    messageRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    touchStartRef: React.MutableRefObject<number>;
    renderMessageStatus: (status?: string, isRead?: boolean) => React.ReactNode;
    emptyState?: React.ReactNode;
}

export interface ChatInputProps {
    inputText: string;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSendMessage: (e?: React.FormEvent) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onInputFocus: () => void;
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    isChatSearchActive: boolean;
}

export interface ChatCarWidgetProps {
    carRelated: NonNullable<Conversation['carRelated']>;
    onClick: () => void;
    isHost: boolean;
    className?: string;
}
