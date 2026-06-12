import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatHeaderProps } from '../types';
import { BackButton } from '@/core/components/buttons/BackButton';

export const ChatHeader: React.FC<ChatHeaderProps> = ({
    conversation,
    isChatSearchActive,
    chatSearchTerm,
    onChatSearchTermChange,
    matches,
    currentMatchIndex,
    onNavigateSearch,
    onCloseChatSearch,
    onBack,
    isOptionsOpen,
    onToggleOptions,
    onActivateChatSearch,
    onTogglePin,
    isPinned,
    onDeleteConversation,
    optionsMenuRef,
    chatSearchInputRef,
    currentUser,
    onViewCarDetails
}) => {
    return (
        <div className="bg-white/80 backdrop-blur-md px-4 sm:px-6 py-4 flex items-center justify-between shadow-sm border-b border-white/50 shrink-0 z-20 min-h-[76px] transition-all sticky top-0">

            {isChatSearchActive ? (
                // --- SEARCH MODE HEADER ---
                <div className="flex items-center gap-3 w-full animate-fade-in">
                    <div className="flex-1 relative group">
                        <div className="absolute inset-0 bg-slate-100/50 rounded-full scale-[0.98] group-hover:scale-100 transition-transform duration-300 -z-10"></div>
                        <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"></i>
                        <input
                            ref={chatSearchInputRef}
                            type="text"
                            value={chatSearchTerm}
                            onChange={(e) => onChatSearchTermChange(e.target.value)}
                            placeholder="Buscar na conversa..."
                            className="w-full bg-white border border-slate-100 rounded-full py-2.5 pl-11 pr-4 text-sm outline-none focus:border-primary/30 focus:ring-4 focus:ring-primary/5 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] placeholder-slate-400 text-slate-800"
                        />
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 text-sm font-medium whitespace-nowrap">
                        {matches.length > 0 ? (
                            <>
                                <span>{currentMatchIndex + 1} de {matches.length}</span>
                                <button onClick={() => onNavigateSearch('prev')} className="p-2 hover:bg-slate-100 rounded-full" title="Mais antigas"><i className="fas fa-chevron-up"></i></button>
                                <button onClick={() => onNavigateSearch('next')} className="p-2 hover:bg-slate-100 rounded-full" title="Mais recentes"><i className="fas fa-chevron-down"></i></button>
                            </>
                        ) : (
                            <span className="text-xs text-slate-400 px-2">Sem resultados</span>
                        )}
                    </div>
                    <button onClick={onCloseChatSearch} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 ml-2">
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            ) : (
                // --- STANDARD HEADER ---
                <>
                    <div className="flex items-center gap-3">
                        <div className="md:hidden -ml-2">
                            <BackButton onClick={onBack} />
                        </div>
                        <div className="relative">
                            <img src={conversation.otherUser?.avatar} alt={conversation.otherUser?.name} className="w-10 h-10 rounded-full object-cover" />
                            {conversation.otherUser?.isOnline && (
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-sm">{conversation.otherUser?.name}</h3>
                            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                {conversation.otherUser?.isOnline ? (
                                    <>
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span> Online
                                    </>
                                ) : conversation.otherUser?.lastSeen}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-4 relative" ref={optionsMenuRef}>
                        {/* Car Context Widget (Desktop) - REMOVED per user request */}

                        {/* Options Menu Button - Darker Icon */}
                        <button
                            onClick={onToggleOptions}
                            className={`p-2 rounded-full transition-colors ${isOptionsOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-800 hover:text-slate-900 hover:bg-slate-50'}`}
                        >
                            <i className="fas fa-ellipsis-v w-4 text-center"></i>
                        </button>

                        {/* Dropdown Menu - Improved Design */}
                        <AnimatePresence>
                            {isOptionsOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15, ease: "easeOut" }}
                                    className="absolute top-full right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden z-50 origin-top-right ring-1 ring-black/5"
                                >
                                    <div className="py-1">
                                        <button
                                            onClick={onActivateChatSearch}
                                            className="w-full text-left px-5 py-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-3 transition-colors"
                                        >
                                            <div className="w-5 flex justify-center text-slate-400">
                                                <i className="fas fa-search"></i>
                                            </div>
                                            Buscar mensagens
                                        </button>

                                        <button
                                            onClick={onTogglePin}
                                            className="w-full text-left px-5 py-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-3 transition-colors border-t border-slate-50"
                                        >
                                            <div className="w-5 flex justify-center text-slate-400">
                                                <i className={`fas fa-thumbtack ${isPinned ? 'text-primary rotate-45' : ''}`}></i>
                                            </div>
                                            {isPinned ? 'Desafixar conversa' : 'Fixar conversa'}
                                        </button>

                                        <button
                                            onClick={onDeleteConversation}
                                            className="w-full text-left px-5 py-3.5 text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors border-t border-slate-50"
                                        >
                                            <div className="w-5 flex justify-center">
                                                <i className="far fa-trash-alt"></i>
                                            </div>
                                            Excluir conversa
                                        </button>

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </>
            )}
        </div>
    );
};
