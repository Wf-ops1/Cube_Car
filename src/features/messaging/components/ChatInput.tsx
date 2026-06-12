import React from 'react';
import { ChatInputProps } from '../types';

export const ChatInput: React.FC<ChatInputProps> = ({
    inputText,
    onInputChange,
    onSendMessage,
    onKeyDown,
    onInputFocus,
    textareaRef,
    isChatSearchActive
}) => {
    // Auto-resize logic (Maestria: Crescimento orgânico)
    React.useLayoutEffect(() => {
        if (textareaRef.current) {
            // Reset height to allow shrinking
            textareaRef.current.style.height = 'auto';
            // Set new height based on scrollHeight, capped at max-h-32 (128px)
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 128)}px`;
        }
    }, [inputText, textareaRef]);

    return (
        <div className={`shrink-0 z-30 pointer-events-none pb-4 pt-2 -mt-4 bg-gradient-to-t from-white via-white/80 to-transparent ${isChatSearchActive ? 'opacity-50 grayscale' : ''}`}>
            <div className="px-4 pointer-events-auto">
                <form onSubmit={onSendMessage} className="relative flex items-end gap-2 max-w-4xl mx-auto w-full bg-white p-1.5 rounded-[1.8rem] shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-slate-100 ring-4 ring-slate-50/50 transition-all duration-200">

                    <div className="flex-1 flex items-center pl-4 py-0.5">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={inputText}
                            onChange={onInputChange}
                            onKeyDown={onKeyDown}
                            onFocus={onInputFocus}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 bg-transparent border-none py-1 text-[13.5px] focus:ring-0 placeholder:text-slate-400 font-medium text-slate-800 outline-none resize-none overflow-hidden max-h-32 leading-snug"
                            style={{ minHeight: '20px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!inputText.trim()}
                        className="w-10 h-10 bg-gradient-to-br from-[#3667AA] to-blue-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:shadow-none transition-all shrink-0 mr-0.5"
                    >
                        <i className="fas fa-paper-plane text-[13px] ml-0.5"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};
