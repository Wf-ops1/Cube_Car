import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User } from '@/core/data/auth/auth.types';

interface OwnerHeaderProps {
    user: User;
    onNavigate: (path: string) => void;
    title?: React.ReactNode;
    subtitle?: string;
}

export const OwnerHeader: React.FC<OwnerHeaderProps> = ({ user, onNavigate, title, subtitle }) => {
    // Dynamic Greeting (Default fallback)
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

    return (
        <header className="relative w-full z-50 pt-0 pointer-events-none">
            {/* Gradient Scrim removed to avoid overlap with OwnerCenter background */}
            {/* Header Content - Light Theme Polish */}
            {/* Header Content - Light Theme Polish */}
            <div className="max-w-7xl mx-auto w-full pointer-events-auto">
                <div className="flex justify-between items-start mb-1">
                    <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col gap-1"
                    >
                        {/* Title & Subtitle */}
                        <div>
                            <h1 className="text-2xl md:text-4xl font-display font-bold text-slate-800 tracking-tight leading-tight min-h-[2rem] flex items-center">
                                {title ? title : (
                                    <>
                                        {greeting}, <span className="text-slate-500 ml-1">{user.name.split(' ')[0]}</span>
                                    </>
                                )}
                            </h1>
                            <p className="text-xs md:text-sm text-slate-400 font-medium tracking-wide mt-1">
                                {subtitle || "Gerencie seus carros"}
                            </p>
                        </div>
                    </motion.div>
                    <button
                        onClick={() => onNavigate('home')}
                        className="
                            flex items-center justify-center gap-2
                            bg-white border border-slate-200/60 shadow-sm
                            hover:shadow-md active:scale-95 
                            text-slate-800 hover:text-slate-900 
                            transition-all duration-200 ease-out font-bold group 
                            rounded-full 
                            px-5 py-2.5
                            -mt-4
                        "
                    >
                        <i className="fas fa-sign-out-alt text-sm group-hover:-translate-x-0.5 transition-transform duration-200"></i>
                        <span className="text-xs uppercase tracking-widest leading-none">Sair</span>
                    </button>
                </div>
            </div>
        </header>
    );
};
