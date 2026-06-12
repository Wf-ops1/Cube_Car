import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SupportSearchHeroProps {
    userAvatar: string;
    onSearch: (query: string) => void;
}

export const SupportSearchHero: React.FC<SupportSearchHeroProps> = ({ userAvatar, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        onSearch(searchQuery);
    }, [searchQuery, onSearch]);

    return (
        <div className="relative z-10 pt-8 pb-12 md:pt-0 md:pb-32">
            <div className="max-w-4xl mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block"
                >
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] md:text-xs md:tracking-[0.3em] text-[#3667AA] mb-4 md:mb-6 block">Suporte 24h</span>
                    <h1 className="text-3xl md:text-6xl font-display font-medium text-slate-900 leading-tight mb-8 md:mb-12">
                        Como podemos <br /><span className="text-slate-400">te ajudar hoje?</span>
                    </h1>

                    {/* Search Bar - Glassmorphism Enhanced & Intuitive */}
                    <div className="relative max-w-2xl md:max-w-3xl mx-auto group">
                        <div className="absolute inset-0 bg-blue-500/5 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Digite sua dúvida..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] py-6 md:py-8 pl-8 md:pl-10 pr-20 md:pr-24 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-[#3667AA]/10 focus:bg-white transition-all shadow-xl shadow-slate-200/40 text-lg md:text-xl font-medium"
                            />
                            {/* Internal Action Button - Glued Loupe */}
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#3667AA] text-white w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/20 hover:scale-105 active:scale-95 transition-all">
                                <i className="fas fa-search text-xl md:text-2xl"></i>
                            </button>
                        </div>

                        {/* Quick Suggestions Tags */}
                        <div className="mt-4 md:mt-8 flex flex-wrap justify-center gap-2 md:gap-4">
                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-400 py-1.5 md:py-3">Sugestões:</span>
                            {['Cancelamento', 'Seguro', 'Pagamento', 'Multas'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => setSearchQuery(tag)}
                                    className="px-3 py-1 md:px-6 md:py-2.5 bg-white/50 border border-white/50 rounded-full text-xs md:text-sm font-medium text-slate-600 hover:bg-white hover:text-[#3667AA] hover:border-blue-200 transition-colors shadow-sm"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
