import React, { useState, useEffect } from 'react';
import { ChatSidebarProps } from '../types';
import { HighlightText, getPreviewMessage } from '../utils/chat.utils';

import { useChatStore } from '@/features/messaging/stores/chat.store';

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
    conversations,
    activeChatId,
    pinnedIds,
    onSelectChat,
    onBack,
    currentUser,
    onDeleteChat,
    onSearchFocus // Keep onSearchFocus as it's used in the input
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const { totalUnreadCount, markAsRead, setConversations, conversations: storeConversations, setTotalUnreadCount } = useChatStore();

    // Sync global unread count & Mark as Read
    useEffect(() => {
        if (activeChatId && storeConversations.length > 0) {
            markAsRead(activeChatId);
        }
    }, [activeChatId, markAsRead, storeConversations.length]);

    const currentUserId = currentUser?.id; // Derive currentUserId from currentUser

    return (
        <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} w-full md:w-[380px] lg:w-[420px] flex-col bg-transparent md:bg-white border-r border-slate-100 overflow-hidden z-10`}>

            {/* Sidebar Header */}
            <div className="px-6 pt-6 pb-2">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-[26px] md:text-[32px] font-display font-bold text-[#1C2230] tracking-tight">Mensagens</h1>
                </div>

                {/* Sidebar Search (Filters List Only) */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-slate-100/50 rounded-full scale-[0.98] group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                    <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 group-focus-within:text-primary transition-colors"></i>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => onSearchFocus?.(true)} // [UX] Hide Navbar
                        onBlur={() => onSearchFocus?.(false)} // [UX] Show Navbar
                        placeholder="Buscar conversas..."
                        className="w-full bg-white border border-slate-100 text-sm py-3 pl-11 pr-10 rounded-full outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all text-slate-800 placeholder-slate-400 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center bg-slate-100 rounded-full text-slate-400 hover:text-white hover:bg-slate-400 transition-all text-xs"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-4 space-y-1">

                {conversations.length === 0 ? (
                    // EMPTY STATE
                    <div className="flex flex-col items-center justify-center pt-12 text-center px-6">
                        {/* Mobile: Blue Chat Bubbles (Matches Desktop Right Pane Empty State) */}
                        <div className="md:hidden w-24 h-24 bg-white rounded-full flex items-center justify-center text-primary mb-6 shadow-sm animate-bounce-slow">
                            <i className="fas fa-comments text-4xl"></i>
                        </div>

                        {/* Desktop: Search Icon (Original Sidebar State) */}
                        <div className="hidden md:flex w-16 h-16 bg-mercury-100 rounded-full items-center justify-center text-slate-400 mb-4">
                            <i className="fas fa-search text-2xl"></i>
                        </div>

                        <p className="text-sm font-medium text-slate-900">Nenhuma conversa encontrada</p>
                        <p className="text-xs text-slate-500 mt-1">
                            {searchQuery ? `Sem resultados para "${searchQuery}"` : 'Suas conversas aparecerão aqui.'}
                        </p>
                    </div>
                ) : (
                    conversations.map(conv => {
                        const { displayText, displayTime, displaySenderId } = getPreviewMessage(conv, searchQuery);

                        const isMyMessage = displaySenderId === currentUserId;
                        const isPinned = pinnedIds.includes(conv.id);

                        // Use store state for unread count to allow immediate updates
                        const storeConv = storeConversations.find(c => c.id === conv.id);
                        const effectiveUnreadCount = storeConv ? storeConv.unreadCount : conv.unreadCount;

                        return (
                            <div
                                key={conv.id}
                                onClick={() => onSelectChat(conv.id)}
                                className={`p-3 rounded-2xl flex gap-3 cursor-pointer transition-all relative group ${activeChatId === conv.id ? 'bg-primary/5 border border-primary/10' : 'hover:bg-slate-50 border border-transparent'
                                    } ${isPinned ? 'bg-slate-50/80' : ''} `}
                            >
                                <div className="relative shrink-0">
                                    <img src={conv.otherUser?.avatar} alt={conv.otherUser?.name} className="w-12 h-12 rounded-full object-cover" />
                                    {conv.otherUser?.isOnline && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-50 border-2 border-white rounded-full"></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className={`font-bold text-sm truncate ${activeChatId === conv.id ? 'text-primary' : 'text-slate-800'} `}>
                                            <HighlightText text={conv.otherUser?.name || 'Usuário'} highlight={searchQuery} isActiveMatch={false} />
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            {isPinned && <i className="fas fa-thumbtack text-[10px] text-slate-400 rotate-45"></i>}
                                            <span className="text-[10px] text-slate-500 shrink-0">{displayTime}</span>
                                        </div>
                                    </div>
                                    <p className={`text-xs truncate ${effectiveUnreadCount && effectiveUnreadCount > 0 ? 'font-bold text-slate-800' : 'text-slate-600'} `}>
                                        {conv.carRelated && activeChatId !== conv.id && !searchQuery && (
                                            <span className="inline-block px-1.5 py-0.5 bg-slate-200 rounded text-[10px] mr-1 text-slate-800 font-bold">
                                                <HighlightText text={`${conv.carRelated.make} ${conv.carRelated.model} `} highlight={searchQuery} isActiveMatch={false} />
                                            </span>
                                        )}
                                        {isMyMessage && <span className="font-normal mr-1">Você:</span>}
                                        <HighlightText text={displayText || ''} highlight={searchQuery} isActiveMatch={false} />
                                    </p>
                                </div>
                                {(effectiveUnreadCount || 0) > 0 && activeChatId !== conv.id && (
                                    <div className="shrink-0 flex flex-col items-end justify-center">
                                        <div className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-glow">
                                            {effectiveUnreadCount}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};
