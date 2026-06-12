import React from 'react';
import { motion } from 'framer-motion';
import { ChatMessageListProps } from '../types';
import { HighlightText } from '../utils/chat.utils';
import { SafeEnvironmentNotice } from './SafeEnvironmentNotice';

export const ChatMessageList: React.FC<ChatMessageListProps> = ({
    messages,
    currentUserId,
    isChatSearchActive,
    chatSearchTerm,
    matches,
    currentMatchIndex,
    messagesContainerRef,
    messageRefs,
    textareaRef,
    touchStartRef,
    renderMessageStatus,
    emptyState // New Prop
}) => {
    return (
        <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto scrollbar-custom px-6 pt-6 pb-4 space-y-3 relative min-h-0 overscroll-y-contain"
            onTouchStart={(e) => {
                touchStartRef.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
                const currentY = e.touches[0].clientY;
                const diff = Math.abs(currentY - touchStartRef.current);

                // Threshold: 2px (ultra-sensitive) to dismiss keyboard immediately on any scroll intent
                if (diff > 2 && document.activeElement === textareaRef.current) {
                    textareaRef.current?.blur();
                }
            }}
        >

            {/* Safety Notice Check - Always visible at top of conversation */}
            <div className="flex justify-center w-full">
                <SafeEnvironmentNotice />
            </div>

            {messages.length === 0 && emptyState ? (
                <div className="mt-8 transition-opacity duration-500 ease-in-out">
                    {emptyState}
                </div>
            ) : (
                <>
                    {/* Date Separator Example */}
                    <div className="flex justify-center mb-4">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide bg-slate-200/50 px-3 py-1 rounded-full">Hoje</span>
                    </div>

                    {messages.map((msg, idx) => {
                        const isMe = msg.senderId === currentUserId;

                        // System Message Handler (UX Fix)
                        if (msg.senderId === 'system') {
                            return (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex justify-center my-4"
                                >
                                    <div className="flex flex-col items-center gap-1 my-6">
                                        <div className="flex items-center gap-2 bg-gray-100/80 px-4 py-1.5 rounded-full text-[11px] text-gray-500 font-medium tracking-wide">
                                            <i className="fas fa-magic text-blue-400/80 text-[10px]"></i>
                                            {msg.text}
                                        </div>
                                        <span className="text-[9px] text-gray-300 font-medium">{msg.timestamp}</span>
                                    </div>
                                </motion.div>
                            );
                        }


                        // Check if this message is a search match
                        const isMatch = matches.includes(msg.id);
                        const isActiveMatch = matches[currentMatchIndex] === msg.id;

                        return (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={msg.id}
                                id={`msg-${msg.id}`}
                                /* FIX: Ensure callback ref returns void to avoid TS error */
                                ref={(el) => { messageRefs.current[msg.id] = el; }}
                                className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`flex flex-col gap-1 max-w-[85%] sm:max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>

                                    {msg.type === 'image' ? (
                                        <div className="mb-1 overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                                            <img src={msg.metadata?.src} alt="Attachment" className="w-64 h-auto object-cover" />
                                        </div>
                                    ) : (
                                        <div
                                            className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm relative group transition-colors duration-300 break-words whitespace-pre-wrap min-w-0
                                    ${isMe
                                                    ? 'bg-gradient-to-br from-[#3667AA] to-[#254B85] text-white shadow-lg shadow-blue-900/10 rounded-tr-sm border-none'
                                                    : 'bg-white border border-slate-100 text-slate-800 shadow-sm rounded-tl-sm'
                                                }
                                  ${isActiveMatch ? 'ring-4 ring-yellow-400/50 shadow-lg' : ''}
                                `}
                                        >
                                            {isChatSearchActive && isMatch ? (
                                                <HighlightText text={msg.text} highlight={chatSearchTerm} isActiveMatch={isActiveMatch} />
                                            ) : (
                                                msg.text
                                            )}
                                        </div>
                                    )}

                                    <div className="flex items-center gap-1 opacity-60 px-1">
                                        <span className="text-[10px] font-medium">{msg.timestamp}</span>
                                        {isMe && renderMessageStatus(msg.status, msg.isRead)}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </>
            )}
        </div>
    );
};
