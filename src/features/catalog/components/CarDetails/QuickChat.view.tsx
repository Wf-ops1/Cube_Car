import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { Car } from '@/core/data/car/car.types';
import { Conversation } from '@/core/data/messaging/messaging.types';
import { UnifiedChatView } from '@/features/messaging/components/UnifiedChatView';

interface QuickChatProps {
    isOpen: boolean;
    onClose: () => void;
    owner: { name: string; avatar: string };
    car: Car;
    conversation?: Conversation;
    currentUserId: string;
    chatInput: string;
    setChatInput: (val: string) => void;
    handleSubmit: (e?: React.FormEvent) => void;
    chatScrollRef: React.RefObject<HTMLDivElement>;
    renderMessageStatus: (status?: string, isRead?: boolean) => React.ReactNode;
    onProfileClick: () => void;
}

const QuickChat: React.FC<QuickChatProps> = ({
    isOpen, onClose, owner, car, conversation, currentUserId, chatInput, setChatInput, handleSubmit, chatScrollRef, renderMessageStatus, onProfileClick
}) => {

    const inputRef = React.useRef<HTMLTextAreaElement>(null);

    const handleSendSafe = (e: React.FormEvent) => {
        e.preventDefault();
        handleSubmit(e);
    };

    const header = (
        <div className="px-6 py-5 border-b border-white/50 flex items-center justify-between shrink-0 backdrop-blur-md bg-white/80 z-20 relative">
            <button onClick={onProfileClick} className="flex items-center gap-3 text-left group">
                <div className="relative">
                    <img src={owner.avatar} className="w-11 h-11 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex flex-col">
                    <h3 className="font-display font-bold text-slate-800 text-[15px] group-hover:text-blue-600 transition-colors">{owner.name}</h3>
                </div>
            </button>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all">
                <i className="fas fa-times text-sm"></i>
            </button>
        </div>
    );

    const iceBreakers = (
        <div className="flex flex-col items-center justify-center text-center mt-0 space-y-6 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-50 to-white rounded-full flex items-center justify-center shadow-sm">
                <i className="fas fa-comment-dots text-3xl text-blue-200"></i>
            </div>
            <div>
                <h4 className="font-bold text-slate-800 mb-1">Quebre o gelo</h4>
                <p className="text-xs text-slate-400 max-w-[200px] mx-auto">Comece a conversa com uma dessas perguntas rápidas:</p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-[280px]">
                {[
                    "Olá! O carro está disponível?",
                    "Tem cadeirinha de bebê?",
                    "Qual a autonomia na estrada?",
                    "Aceita entrega no aeroporto?"
                ].map((text, i) => (
                    <button
                        key={i}
                        onClick={() => setChatInput(text)}
                        className="bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-600 hover:text-blue-600 text-xs font-medium px-4 py-2 rounded-full transition-all active:scale-95 shadow-sm"
                    >
                        {text}
                    </button>
                ))}
            </div>
        </div>
    );

    const messages = conversation?.messages || [];

    return (
        <AnimatePresence>
            {isOpen && (
                <UnifiedChatView
                    mode="compact"
                    messages={messages}
                    currentUserId={currentUserId}
                    inputText={chatInput}
                    onInputChange={(e) => setChatInput(e.target.value)}
                    onSendMessage={handleSendSafe}
                    textareaRef={inputRef}
                    messagesContainerRef={chatScrollRef}
                    carRelated={car}
                    headerContent={header}
                    emptyState={iceBreakers}
                    renderMessageStatus={renderMessageStatus}
                    onClose={onClose}
                />
            )}
        </AnimatePresence>
    );

};

export default QuickChat;
