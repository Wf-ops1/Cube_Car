import React, { useState, useRef, useEffect } from 'react';
import { ChatInterfaceProps } from '../types';
import { scrollToBottom } from '../utils/chat.utils';

export const useChat = (props: ChatInterfaceProps) => {
    const {
        onSendMessage,
        activeChatId,
        onDeleteChat,
        conversations,
        onViewCarDetails,
        currentUser
    } = props;

    const [inputText, setInputText] = useState('');
    const [pinnedIds, setPinnedIds] = useState<string[]>([]);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);
    const touchStartRef = useRef<number>(0);
    const optionsMenuRef = useRef<HTMLDivElement>(null);

    const activeConversation = conversations.find(c => c.id === activeChatId);

    // Close options menu on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target as Node)) {
                setIsOptionsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOptionsOpen]);


    const handleInputResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(e.target.value);
        // Reset height to auto to shrink if text is deleted
        e.target.style.height = 'auto';
        // Set height to scrollHeight to expand
        e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    };

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || !activeChatId) return;

        onSendMessage(activeChatId, inputText);
        setInputText('');

        // Reset textarea height softly
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'; // Shrink back to base

            // Only re-focus if we lost it (avoids keyboard flickering)
            if (document.activeElement !== textareaRef.current) {
                textareaRef.current.focus();
            }
        }

        // Use rAF for smoother visual update without 'flash'
        requestAnimationFrame(() => {
            scrollToBottom(messagesContainerRef);
            // Double check next frame for layout settle
            requestAnimationFrame(() => scrollToBottom(messagesContainerRef));
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Scroll to bottom when input is focused (to handle mobile keyboard opening)
    const handleInputFocus = () => {
        setTimeout(() => scrollToBottom(messagesContainerRef), 300); // Delay to wait for keyboard animation
    };

    const togglePin = (chatId: string) => {
        setPinnedIds(prev =>
            prev.includes(chatId) ? prev.filter(id => id !== chatId) : [...prev, chatId]
        );
        setIsOptionsOpen(false);
    };

    const handleDeleteConversation = () => {
        if (activeConversation && onDeleteChat) {
            if (window.confirm("Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.")) {
                onDeleteChat(activeConversation.id);
                setIsOptionsOpen(false);
            }
        }
    };

    const handleCarWidgetClick = () => {
        if (!activeConversation?.carRelated?.id) return;
        setIsDetailsModalOpen(true);
    };

    // Helper exposed to ensure scroll happens when messages change
    useEffect(() => {
        if (activeConversation) {
            requestAnimationFrame(() => {
                scrollToBottom(messagesContainerRef);
                requestAnimationFrame(() => scrollToBottom(messagesContainerRef));
            });
        }
    }, [activeConversation?.messages]);

    return {
        inputText,
        setInputText,
        pinnedIds,
        isOptionsOpen,
        setIsOptionsOpen,
        isDetailsModalOpen,
        setIsDetailsModalOpen,
        textareaRef,
        messagesContainerRef,
        touchStartRef,
        optionsMenuRef,
        handleInputResize,
        handleSendMessage,
        handleKeyDown,
        handleInputFocus,
        togglePin,
        handleDeleteConversation,
        handleCarWidgetClick,
        activeConversation
    };
};
