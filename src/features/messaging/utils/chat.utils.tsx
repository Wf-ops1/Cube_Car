import React from 'react';
import { Conversation, Message } from '@/core/data/messaging/messaging.types';

/**
 * Filter conversations based on a search term.
 * Checks against:
 * - Other user's name
 * - Car make/model (if applicable)
 * - Message content
 * 
 * Sorts by PINNED status first, then original order.
 */
export const filterConversations = (
    conversations: Conversation[],
    searchTerm: string,
    pinnedIds: string[]
): Conversation[] => {
    const term = searchTerm.toLowerCase().trim();

    // 1. Filter
    const filtered = conversations.filter(c => {
        if (!term) return true;

        // Safety checks for undefined checks
        const nameMatch = c.otherUser?.name.toLowerCase().includes(term);
        const carMatch = c.carRelated && (
            c.carRelated.make.toLowerCase().includes(term) ||
            c.carRelated.model.toLowerCase().includes(term)
        );

        // Search in all messages content (user or other)
        const messagesMatch = c.messages.some(msg =>
            msg.text.toLowerCase().includes(term)
        );

        return nameMatch || carMatch || messagesMatch;
    });

    // 2. Sort: Pinned first, then original order (assuming original is chronological)
    return filtered.sort((a, b) => {
        const aPinned = pinnedIds.includes(a.id);
        const bPinned = pinnedIds.includes(b.id);
        if (aPinned && !bPinned) return -1;
        if (!bPinned && aPinned) return 1;
        return 0;
    });
};

/**
 * Finds all message IDs that contain the search term (case insensitive).
 */
export const findMatchingMessages = (messages: Message[], searchTerm: string): string[] => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.toLowerCase();
    const foundIds: string[] = [];

    // Search chronologically (oldest to newest)
    messages.forEach(msg => {
        if (msg.text.toLowerCase().includes(term)) {
            foundIds.push(msg.id);
        }
    });

    return foundIds;
};

/**
 * Robust Scroll to Bottom Logic
 * Direct DOM manipulation is often more reliable on mobile than scrollIntoView
 */
export const scrollToBottom = (containerRef: React.RefObject<HTMLDivElement>) => {
    if (containerRef.current) {
        const container = containerRef.current;
        container.scrollTop = container.scrollHeight;
    }
};

/**
 * Helper to determine which message text to show in the sidebar preview.
 * If searching, find the message that matched. If not, show last message.
 */
export const getPreviewMessage = (conversation: Conversation, searchTerm: string) => {
    let displayText = conversation.lastMessage;
    let displaySenderId = conversation.messages[conversation.messages.length - 1]?.senderId;
    let displayTime = conversation.lastMessageTime;

    if (searchTerm.trim()) {
        // Find the LAST message (most recent) that contains the term
        // Copy array to reverse safely
        const matchingMsg = [...conversation.messages].reverse().find(m =>
            m.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (matchingMsg) {
            displayText = matchingMsg.text;
            displaySenderId = matchingMsg.senderId;
        }
    }

    return { displayText, displaySenderId, displayTime };
};

/**
 * Highlight Text Component (Pure Functional Component)
 */
export const HighlightText = ({ text, highlight, isActiveMatch }: { text: string, highlight: string, isActiveMatch: boolean }) => {
    if (!highlight || !highlight.trim()) return <>{text} </>;

    // Escape regex special characters to prevent errors
    const escapedHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedHighlight})`, 'gi'));

    return (
        <span>
            {
                parts.map((part, i) =>
                    part.toLowerCase() === highlight.toLowerCase() ? (
                        <span key={i} className={`${isActiveMatch ? 'bg-orange-300' : 'bg-yellow-200'} text-gray-900 font-semibold rounded px-0.5`} > {part} </span>
                    ) : part
                )}
        </span>
    );
};
