import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
    q: string;
    a: string;
}

interface FaqAccordionProps {
    faqs: FAQItem[];
    openIndex: number | null;
    onToggle: (index: number) => void;
    searchQuery?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ faqs, openIndex, onToggle, searchQuery }) => {

    const renderFormattedAnswer = (text: string) => {
        return text.split('\n').map((line, i) => {
            if (!line.trim()) return <br key={i} className="block content-[''] h-3" />;
            const colonIndex = line.indexOf(':');
            if (colonIndex > -1 && colonIndex < 50) {
                const title = line.substring(0, colonIndex + 1);
                const content = line.substring(colonIndex + 1);
                return (
                    <p key={i} className="mb-1 text-[#3A4150]" style={{ color: '#374151', lineHeight: '1.6' }}>
                        <span className="font-bold text-[#1C2230]" style={{ color: '#1C2230' }}>{title}</span>
                        {content}
                    </p>
                );
            }
            return <p key={i} className="mb-1 text-[#3A4150]" style={{ color: '#374151', lineHeight: '1.6' }}>{line}</p>;
        });
    };

    if (faqs.length === 0) {
        return (
            <div className="text-center py-12 text-slate-400">
                <i className="fas fa-ghost text-4xl mb-4 opacity-30"></i>
                <p>Nenhum resultado encontrado para "{searchQuery}"</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {faqs.map((faq, idx) => (
                <motion.div
                    key={idx}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-[1.5rem] border overflow-hidden transition-all duration-300 ${openIndex === idx
                        ? 'bg-white border-blue-100 shadow-lg shadow-blue-900/5'
                        : 'bg-white/40 border-white/60 hover:bg-white/60 hover:border-white shadow-sm'
                        }`}
                >
                    <button
                        onClick={() => onToggle(idx)}
                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                        <span
                            className={`font-bold text-base transition-colors ${openIndex === idx ? 'text-[#3667AA]' : 'text-slate-700'}`}
                            style={{ color: openIndex === idx ? '#3667AA' : '#1C2230' }}
                        >
                            {faq.q}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${openIndex === idx ? 'bg-blue-50 text-[#3667AA] rotate-180' : 'bg-transparent text-slate-400'}`}>
                            <i className="fas fa-chevron-down text-sm"></i>
                        </div>
                    </button>
                    <AnimatePresence>
                        {openIndex === idx && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="px-6 pb-6 pt-0 text-sm leading-relaxed text-slate-600 border-t border-slate-100/50 mt-2 pt-4">
                                    {renderFormattedAnswer(faq.a)}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
    );
};
