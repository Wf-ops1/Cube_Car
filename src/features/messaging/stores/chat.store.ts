import { create } from 'zustand';
import { Conversation } from '../types';

interface ChatStore {
    conversations: Conversation[];
    totalUnreadCount: number;
    setConversations: (conversations: Conversation[]) => void;
    markAsRead: (chatId: string) => void;
    setTotalUnreadCount: (count: number) => void;
    addConversation: (conversation: Conversation) => void;
    updateConversation: (id: string, updates: Partial<Conversation>) => void;
    findConversation: (carId: string, ownerId: string) => Conversation | undefined;
}

export const useChatStore = create<ChatStore>((set, get) => ({
    conversations: [],
    totalUnreadCount: 3,

    setConversations: (conversations) => {
        const total = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        set({ conversations, totalUnreadCount: total });
    },

    markAsRead: (chatId) => {
        const { conversations } = get();
        const newConversations = conversations.map(c =>
            c.id === chatId ? { ...c, unreadCount: 0 } : c
        );
        const total = newConversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
        set({ conversations: newConversations, totalUnreadCount: total });
    },

    setTotalUnreadCount: (count) => set({ totalUnreadCount: count }),

    addConversation: (conversation) => {
        set((state) => ({
            conversations: [conversation, ...state.conversations],
            totalUnreadCount: state.totalUnreadCount + (conversation.unreadCount || 0)
        }));
    },

    updateConversation: (id: string, updates: Partial<Conversation>) => {
        set((state) => ({
            conversations: state.conversations.map(c =>
                c.id === id ? { ...c, ...updates } : c
            )
        }));
    },

    findConversation: (carId: string, ownerId: string) => {
        const { conversations } = get();
        return conversations.find(c =>
            c.carRelated?.id === carId &&
            (c.participantId === ownerId || c.otherUser.id === ownerId)
        );
    }
}));
