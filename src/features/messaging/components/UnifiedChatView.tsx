import React from 'react';
import { ChatMessageList } from './ChatMessageList';
import { ChatInput } from './ChatInput';
import { ChatCarWidget } from './ChatCarWidget';
import { useMobileViewportFix } from '../hooks/useMobileViewportFix';
import { AnimatePresence, motion } from 'framer-motion';

// --- Shared Types would normally be in Types file, but defining specific props here for clarity ---
interface UnifiedChatViewProps {
    mode: 'full' | 'compact';
    messages: any[]; // Replacing with your specific Message type
    currentUserId: string;

    // Input Props
    inputText: string;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSendMessage: (e: React.FormEvent) => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    onInputFocus?: () => void;

    // Search Props
    isChatSearchActive?: boolean;
    chatSearchTerm?: string;
    matches?: string[];
    currentMatchIndex?: number;

    // Refs
    textareaRef: React.RefObject<HTMLTextAreaElement>;
    messagesContainerRef?: React.RefObject<HTMLDivElement>;
    messageRefs?: any; // MutableRefObject
    touchStartRef?: any;

    // Car Widget Props
    carRelated?: any; // The car object attached to conversation
    isHost?: boolean;
    onCarWidgetClick?: () => void;
    onViewCarDetails?: (carId: string) => void;

    // Compact Mode Specifics (QuickChat)
    onClose?: () => void;
    headerContent?: React.ReactNode;
    emptyState?: React.ReactNode;

    // Render Helper
    renderMessageStatus: (status?: string, isRead?: boolean) => React.ReactNode;
}

export const UnifiedChatView: React.FC<UnifiedChatViewProps> = (props) => {

    const { viewportHeight } = useMobileViewportFix(true);

    const MainContent = (
        <div
            className="flex flex-col w-full bg-[#F8F9FB] relative"
            style={{ height: props.mode === 'full' ? '100%' : '100%' }} // Flex basis usually handles this
        >
            {/* COMPACT HEADER (Only rendered if mode is compact) */}
            {props.mode === 'compact' && props.headerContent && (
                <div className="shrink-0 z-20">
                    {props.headerContent}
                </div>
            )}

            {/* MESSAGES AREA */}
            <ChatMessageList
                messages={props.messages}
                currentUserId={props.currentUserId}
                isChatSearchActive={props.isChatSearchActive || false}
                chatSearchTerm={props.chatSearchTerm || ''}
                matches={props.matches || []}
                currentMatchIndex={props.currentMatchIndex || 0}
                messagesContainerRef={props.messagesContainerRef}
                messageRefs={props.messageRefs || { current: {} }}
                textareaRef={props.textareaRef}
                touchStartRef={props.touchStartRef || { current: 0 }}
                renderMessageStatus={props.renderMessageStatus}
                emptyState={props.emptyState}
            />

            {/* INPUT AREA */}
            <div className={`shrink-0 relative z-20 ${props.isChatSearchActive ? 'opacity-50 pointer-events-none grayscale' : ''}`}>

                {/* Car Widget - Only in Full Mode (Navbar) */}
                {props.mode === 'full' && props.carRelated && (
                    <ChatCarWidget
                        carRelated={props.carRelated}
                        onClick={props.onCarWidgetClick || (() => { })}
                        isHost={props.isHost || false}
                    />
                )}

                {/* Unified Deep Input */}
                <ChatInput
                    inputText={props.inputText}
                    onInputChange={props.onInputChange}
                    onSendMessage={props.onSendMessage}
                    onKeyDown={props.onKeyDown || (() => { })}
                    onInputFocus={props.onInputFocus}
                    textareaRef={props.textareaRef}
                    isChatSearchActive={props.isChatSearchActive || false}
                />
            </div>
        </div>
    );

    // If FULL mode, just render content directly
    if (props.mode === 'full') {
        return (
            <div className="flex-1 flex flex-col h-full bg-[#F8F9FB] relative overflow-hidden">
                {/* Mobile Decoration for Full View */}
                <div className="absolute inset-0 z-0 md:hidden pointer-events-none bg-[#F8F9FB]">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#3667AA]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                </div>

                {/* Content Layer */}
                <div className="relative z-10 flex flex-col h-full">
                    {MainContent}
                </div>
            </div>
        );
    }

    // If COMPACT mode (Sheet Style)
    return (
        <>
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                onClick={props.onClose}
            />

            {/* Sheet Container */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 md:left-auto md:right-8 xl:right-[calc(50vw-40rem+2rem)] md:bottom-0 z-50 flex flex-col bg-white shadow-2xl rounded-t-[2rem] md:rounded-t-2xl md:w-[450px] overflow-hidden h-[95dvh] md:h-[540px] md:max-h-[85vh]"
            >
                {MainContent}
            </motion.div>
        </>
    );
};
