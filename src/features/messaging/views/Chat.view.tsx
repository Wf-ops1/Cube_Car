import React from 'react';
import { ChatInterfaceProps } from '../types';
import { useChat } from '../hooks/useChat';
import { useChatSearch } from '../hooks/useChatSearch';
import { ChatSidebar } from '../components/ChatSidebar';
import { ChatHeader } from '../components/ChatHeader';
import { UnifiedChatView } from '../components/UnifiedChatView';
import { ChatBookingModal } from '../components/ChatBookingModal';
import { useMobileViewportFix } from '../hooks/useMobileViewportFix';

const Chat: React.FC<ChatInterfaceProps> = (props) => {

    // 1. Initialize logic hooks
    const chat = useChat(props);
    const search = useChatSearch(
        props.conversations,
        chat.activeConversation,
        chat.pinnedIds
    );

    // 2. Defensive Viewport Management (Mobile)
    const { viewportHeight } = useMobileViewportFix(!!chat.activeConversation);

    // 2. Helper for message status (passed to list)
    const renderMessageStatus = (status?: string, isRead?: boolean) => {
        const effectiveStatus = status || (isRead ? 'read' : 'delivered');
        if (effectiveStatus === 'read') return <i className="fas fa-check-double text-green-500 text-[10px] ml-1"></i>;
        if (effectiveStatus === 'delivered') return <i className="fas fa-check-double text-gray-400 text-[10px] ml-1"></i>;
        return <i className="fas fa-check text-gray-400 text-[10px] ml-1"></i>;
    };

    // Safe handler to prevent reloads/crashes
    const handleSendSafe = (e: React.FormEvent) => {
        e.preventDefault();
        chat.handleSendMessage(e);
    };

    return (
        // Root container
        <div className="flex h-full w-full relative overflow-hidden">

            {/* APP CONTAINER - IMBUIED/EMBEDDED ON DESKTOP */}
            <div className="relative z-10 w-full h-full md:max-w-7xl md:mx-auto md:bg-white md:my-6 md:h-[calc(100vh-8rem)] md:rounded-[2.5rem] md:border md:border-slate-200 md:shadow-2xl flex overflow-hidden lg:gap-px">

                {/* SIDEBAR */}
                <ChatSidebar
                    conversations={search.filteredConversations}
                    activeChatId={props.activeChatId}
                    pinnedIds={chat.pinnedIds}
                    searchQuery={search.sidebarSearchQuery}
                    onSearchChange={search.setSidebarSearchQuery}
                    onSelectChat={(id) => {
                        props.onSelectChat(id);
                        search.closeChatSearch();
                    }}
                    onBack={props.onBack}
                    currentUserId={props.currentUser.id}
                    onSearchFocus={props.onSearchFocus}
                />

                {/* MAIN CHAT AREA */}
                <div
                    className={`${!props.activeChatId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white relative w-full z-10 md:h-full`}
                    style={{ height: viewportHeight }} // DYNAMIC HEIGHT FIX FOR MOBILE KEYBOARD
                >

                    {chat.activeConversation ? (
                        <div className="flex-1 flex flex-col h-full">

                            {/* HEADER */}
                            <ChatHeader
                                conversation={chat.activeConversation}
                                // Search Props
                                isChatSearchActive={search.isChatSearchActive}
                                chatSearchTerm={search.chatSearchTerm}
                                onChatSearchTermChange={search.setChatSearchTerm}
                                matches={search.matches}
                                currentMatchIndex={search.currentMatchIndex}
                                onNavigateSearch={search.handleNavigateSearch}
                                onCloseChatSearch={search.closeChatSearch}
                                onActivateChatSearch={() => search.activateChatSearch(chat.setIsOptionsOpen)}
                                chatSearchInputRef={search.chatSearchInputRef}
                                // Options Props
                                isOptionsOpen={chat.isOptionsOpen}
                                onToggleOptions={() => chat.setIsOptionsOpen(!chat.isOptionsOpen)}
                                optionsMenuRef={chat.optionsMenuRef}
                                // Actions
                                onBack={() => props.onSelectChat(null)}
                                onTogglePin={() => chat.togglePin(chat.activeConversation!.id)}
                                isPinned={chat.pinnedIds.includes(chat.activeConversation.id)}
                                onDeleteConversation={chat.handleDeleteConversation}
                                currentUser={props.currentUser}
                                onViewCarDetails={props.onViewCarDetails}
                            />

                            {/* UNIFIED CHAT VIEW (Messages + Input) */}
                            <div className="flex-1 min-h-0">
                                <UnifiedChatView
                                    mode="full"
                                    messages={chat.activeConversation.messages}
                                    currentUserId={props.currentUser.id}
                                    // Input
                                    inputText={chat.inputText}
                                    onInputChange={chat.handleInputResize}
                                    onSendMessage={handleSendSafe}
                                    onKeyDown={chat.handleKeyDown}
                                    onInputFocus={chat.handleInputFocus}
                                    textareaRef={chat.textareaRef}
                                    // Search
                                    isChatSearchActive={search.isChatSearchActive}
                                    chatSearchTerm={search.chatSearchTerm}
                                    matches={search.matches}
                                    currentMatchIndex={search.currentMatchIndex}
                                    // Refs
                                    messagesContainerRef={chat.messagesContainerRef}
                                    messageRefs={search.messageRefs}
                                    touchStartRef={chat.touchStartRef}
                                    // Widget
                                    carRelated={chat.activeConversation.carRelated}
                                    isHost={chat.activeConversation.carRelated?.hostId
                                        ? chat.activeConversation.carRelated.hostId === props.currentUser.id
                                        : (props.currentUser.role === 'host' || !!(props.currentUser as any).isHost)}
                                    onCarWidgetClick={chat.handleCarWidgetClick}
                                    onViewCarDetails={props.onViewCarDetails}
                                    // Utils
                                    renderMessageStatus={renderMessageStatus}
                                />
                            </div>

                        </div>
                    ) : (
                        // EMPTY STATE (No chat selected)
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white h-full">
                            <div className="w-24 h-24 bg-mercury-50 rounded-full flex items-center justify-center text-primary mb-6 shadow-sm animate-bounce-slow">
                                <i className="fas fa-comments text-4xl"></i>
                            </div>
                            {props.conversations.length > 0 ? (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Nenhuma conversa selecionada</h2>
                                    <p className="text-slate-500 max-w-sm">Envie mensagens e tire dúvidas antes de compartilhar um carro.</p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Ainda não há conversas aqui.</h2>
                                    <p className="text-slate-500 max-w-sm">Comece uma reserva para conversar com o proprietário ou motorista.</p>
                                </>
                            )}
                        </div>
                    )}

                    {/* Native Booking Details Sidebar / Modal */}
                    {chat.activeConversation?.carRelated && (
                        <ChatBookingModal
                            isOpen={chat.isDetailsModalOpen}
                            onClose={() => chat.setIsDetailsModalOpen(false)}
                            carRelated={chat.activeConversation.carRelated}
                            isHost={chat.activeConversation.carRelated?.hostId
                                ? chat.activeConversation.carRelated.hostId === props.currentUser.id
                                : (props.currentUser.role === 'host' || !!(props.currentUser as any).isHost)}
                            onViewCarDetails={props.onViewCarDetails}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
