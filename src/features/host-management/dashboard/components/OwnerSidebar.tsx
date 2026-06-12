import React from 'react';
import { motion } from 'framer-motion';

interface OwnerSidebarProps {
    onNavigate: (path: string) => void;
    activeTab: 'painel' | 'frota' | 'pedidos';
    setActiveTab: (tab: 'painel' | 'frota' | 'pedidos') => void;
    pendingRequestsCount: number;
}

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({ onNavigate, activeTab, setActiveTab, pendingRequestsCount }) => {
    return (
        <aside className="hidden lg:flex flex-col w-[280px] fixed left-0 top-0 bottom-0 bg-[#0F172A] border-r border-white/5 z-50">
            {/* Branding */}
            <div className="p-8">
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2.5 rounded-full border border-white/5 w-fit">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)] animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-200">Prosperity Club</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {[
                    { id: 'painel', label: 'Visão Geral', icon: 'fa-chart-pie' },
                    { id: 'frota', label: 'Portfólio', icon: 'fa-shield-alt' },
                    { id: 'pedidos', label: 'Oportunidades', icon: 'fa-gem', badge: pendingRequestsCount }
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all relative group ${activeTab === item.id
                            ? 'text-white bg-white/10 shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        {activeTab === item.id && (
                            <motion.div
                                layoutId="sidebar-active"
                                className="absolute left-0 w-1 h-8 bg-[#3667AA] rounded-r-full"
                            />
                        )}
                        <i className={`fas ${item.icon} text-lg w-6 text-center ${activeTab === item.id ? 'text-[#3667AA]' : 'text-slate-500 group-hover:text-slate-300'}`}></i>
                        <span className="font-medium text-sm tracking-wide">{item.label}</span>

                        {!!item.badge && item.badge > 0 && (
                            <span className="ml-auto bg-[#3667AA] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-blue-900/50">
                                {item.badge}
                            </span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer / Profile */}
            <div className="p-6 border-t border-white/5">
                <div className="mb-6">
                    <p className="text-[10px] uppercase font-bold text-blue-200/40 tracking-wider mb-1 px-2">Patrimônio Gerido</p>
                    <h3 className="text-2xl text-white font-display px-2">
                        <span className="text-sm opacity-50 mr-1">R$</span>428.500
                    </h3>
                </div>
                <button
                    onClick={() => onNavigate('home')}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-white/5"
                >
                    <i className="fas fa-home text-sm"></i>
                    <span className="text-sm font-medium">Voltar para Home</span>
                </button>
            </div>
        </aside>
    );
};
