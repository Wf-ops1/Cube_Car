import { useState, useRef, useMemo, useEffect } from 'react';
import { Conversation } from '@/core/data/messaging/messaging.types';
import { filterConversations, findMatchingMessages, scrollToBottom } from '../utils/chat.utils';

export const useChatSearch = (
    conversations: Conversation[],
    activeConversation: Conversation | undefined,
    pinnedIds: string[]
) => {
    // Sidebar Search State
    const [sidebarSearchQuery, setSidebarSearchQuery] = useState('');

    // In-Chat Search State
    const [isChatSearchActive, setIsChatSearchActive] = useState(false);
    const [chatSearchTerm, setChatSearchTerm] = useState('');
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [matches, setMatches] = useState<string[]>([]);

    const chatSearchInputRef = useRef<HTMLInputElement>(null);
    const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // --- 1. SIDEBAR FILTER LOGIC ---
    const filteredConversations = useMemo(() => {
        return filterConversations(conversations, sidebarSearchQuery, pinnedIds);
    }, [conversations, sidebarSearchQuery, pinnedIds]);


    // --- 2. IN-CHAT SEARCH LOGIC ---
    useEffect(() => {
        if (!isChatSearchActive || !chatSearchTerm.trim() || !activeConversation) {
            setMatches([]);
            setCurrentMatchIndex(0);
            return;
        }

        const foundIds = findMatchingMessages(activeConversation.messages, chatSearchTerm);
        setMatches(foundIds);

        if (foundIds.length > 0) {
            setCurrentMatchIndex(foundIds.length - 1);
        } else {
            setCurrentMatchIndex(0);
        }
    }, [chatSearchTerm, activeConversation, isChatSearchActive]);

    // Scroll to match when index changes
    useEffect(() => {
        if (matches.length > 0 && isChatSearchActive) {
            const msgId = matches[currentMatchIndex];
            const el = messageRefs.current[msgId];
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [currentMatchIndex, matches, isChatSearchActive]);

    const handleNavigateSearch = (direction: 'next' | 'prev') => {
        if (matches.length === 0) return;
        if (direction === 'next') { // Newer messages (down in array)
            setCurrentMatchIndex(prev => (prev + 1) % matches.length);
        } else { // Older messages (up in array)
            setCurrentMatchIndex(prev => (prev - 1 + matches.length) % matches.length);
        }
    };

    const activateChatSearch = (setIsOptionsOpen: (isOpen: boolean) => void) => {
        setIsChatSearchActive(true);
        setIsOptionsOpen(false);
        setTimeout(() => chatSearchInputRef.current?.focus(), 100);
    };

    const closeChatSearch = () => {
        setIsChatSearchActive(false);
        setChatSearchTerm('');
        setMatches([]);
    };

    return {
        sidebarSearchQuery,
        setSidebarSearchQuery,
        filteredConversations,
        isChatSearchActive,
        chatSearchTerm,
        setChatSearchTerm,
        matches,
        currentMatchIndex,
        handleNavigateSearch,
        activateChatSearch,
        closeChatSearch,
        chatSearchInputRef,
        messageRefs
    };
};
