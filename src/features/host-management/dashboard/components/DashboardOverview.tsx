import React, { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { DashboardMetrics, EnrichedCar } from '../../application/useOwnerCenter.logic';

interface DashboardOverviewProps {
    activeCar?: EnrichedCar;
    metrics: DashboardMetrics;
    onNavigate?: (path: string) => void;
    onAddCarClick?: () => void;
}

import { CountUp } from '@/shared/components/ui/CountUp';

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ activeCar, metrics, onNavigate, onAddCarClick }) => {
    return (
        <div className="space-y-10 md:space-y-6">

            {/* Top Row: Financials (2/3) + Quick Actions (1/3) */}
            {/* Top Row: Quick Actions (Top Mobile) + Financials (Bottom Mobile) */}
            <div className="flex flex-col lg:grid lg:grid-cols-3 gap-8 lg:gap-6">

                {/* 1. Quick Actions: Order-1 on Mobile (Top), Order-2 on Desktop (Right Side) */}
                <div className="order-1 lg:order-2 lg:col-span-1 flex flex-col">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3 px-1 font-display">Ações Rápidas</h3>
                    {/* Mobile View: Chips */}
                    <div className="md:hidden grid grid-cols-3 gap-2">
                        {[
                            { icon: 'fa-plus', label: <>Adicionar<br />Carro</>, color: 'text-[#3667AA]', onClick: onAddCarClick },
                            { icon: 'fa-wallet', label: 'Sacar', color: 'text-emerald-600', onClick: () => onNavigate?.('financial') },
                            { icon: 'fa-book-reader', label: 'Guia Host', color: 'text-amber-400', onClick: () => onNavigate?.('help') }
                        ].map((item, idx) => (
                            <button key={idx} onClick={item.onClick} className="bg-white border border-slate-200 rounded-full py-1.5 px-2 flex items-center justify-center gap-2 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 hover:shadow-md active:scale-[0.98] h-full min-h-[50px]">
                                <i className={`fas ${item.icon} ${item.color} text-xs shrink-0`}></i>
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide leading-none text-center flex flex-col justify-center">
                                    {item.label}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* Desktop View: Large Cards (Grid 1-2 / 3, Fill Height) */}
                    <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-4 flex-1">
                        {/* 1. Adicionar Carro */}
                        <button onClick={onAddCarClick} className="bg-white border border-slate-200 rounded-[2rem] h-full flex flex-col items-center justify-center gap-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.02] hover:border-blue-200 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-1 group-hover:bg-blue-100 transition-colors duration-300">
                                <i className="fas fa-plus text-[#3667AA] text-lg group-hover:scale-110 transition-transform duration-300"></i>
                            </div>
                            <span className="text-xs font-bold text-slate-600 group-hover:text-[#3667AA] uppercase tracking-wider text-center px-4 leading-[1.1] transition-colors duration-300">
                                Adicionar<br />Carro
                            </span>
                        </button>

                        {/* 2. Sacar */}
                        <button onClick={() => onNavigate?.('financial')} className="bg-white border border-slate-200 rounded-[2rem] h-full flex flex-col items-center justify-center gap-2 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.02] hover:border-emerald-200 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-1 group-hover:bg-emerald-100 transition-colors duration-300">
                                <i className="fas fa-wallet text-emerald-600 text-lg group-hover:scale-110 transition-transform duration-300"></i>
                            </div>
                            <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-600 uppercase tracking-wider text-center transition-colors duration-300">
                                Sacar
                            </span>
                        </button>

                        {/* 3. Guia Host (Full Width) */}
                        <button onClick={() => onNavigate?.('help')} className="col-span-2 bg-white border border-slate-200 rounded-[2rem] h-full flex flex-row items-center justify-between px-8 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:scale-[1.02] hover:border-amber-200 transition-all duration-300 group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors duration-300">
                                    <i className="fas fa-book-reader text-amber-500 text-lg group-hover:scale-110 transition-transform duration-300"></i>
                                </div>
                                <span className="text-xs font-bold text-slate-600 group-hover:text-amber-600 uppercase tracking-wider transition-colors duration-300">
                                    Guia do Anfitrião
                                </span>
                            </div>
                            <i className="fas fa-chevron-right text-slate-300 group-hover:text-amber-500 transition-colors duration-300 text-sm"></i>
                        </button>
                    </div>
                </div>

                {/* 2. Financials: Order-2 on Mobile (Bottom), Order-1 on Desktop (Main Left) */}
                <div className="order-2 lg:order-1 lg:col-span-2">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3 px-1 font-display">Seus Rendimentos</h3>
                    {/* Financial Card: Flat Panel, No Shadow */}
                    <div className="bg-slate-50/50 text-slate-800 rounded-[2rem] p-7 relative overflow-hidden shadow-none border border-slate-200">
                        <div className="relative z-10">
                            <div className="flex justify-between items-start">
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Resultado Líquido</p>
                                <div className="w-8 h-8 rounded-full bg-slate-100/50 flex items-center justify-center border border-slate-200/50">
                                    <i className="fas fa-wallet text-xs text-slate-400"></i>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-lg text-slate-500 font-medium">R$</span>
                                <h3 className="text-4xl font-display font-medium tracking-tight text-slate-800">
                                    {metrics.netEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </h3>
                            </div>
                            <div className="mt-6 flex items-center gap-6 pt-4 border-t border-slate-200">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold tracking-wider mb-1 text-slate-500">Disponível</span>
                                    <span className="text-emerald-600 font-bold text-lg">R$ {(metrics.netEarnings * 0.4).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                                <div className="h-8 w-[1px] bg-slate-200"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold tracking-wider mb-1 text-slate-600">A Liberar</span>
                                    <span className="text-slate-500 font-bold text-lg">R$ {(metrics.netEarnings * 0.6).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* Hero Car: The "Active" Focus (MAGAZINE STYLE) */}
            {activeCar && (
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-3 px-1 font-display">Em Atividade Agora</h3>
                    <div className="relative w-full aspect-[4/5] md:aspect-[3/1] rounded-[2rem] overflow-hidden group shadow-lg shadow-slate-200/50 border border-white">
                        <div className="absolute top-6 right-6 z-20 bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                            Em Viagem
                        </div>

                        <img
                            src={activeCar.imageUrl}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                            alt={activeCar.model}
                            style={{ objectPosition: 'center 40%' }}
                        />

                        {/* Gradient overlay: Vertical on Mobile, Horizontal on Desktop */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent md:bg-gradient-to-r md:from-slate-900/95 md:via-slate-900/60 md:to-transparent"></div>

                        {/* Content: Bottom aligned on Mobile, Centered Left on Desktop */}
                        <div className="absolute inset-x-0 bottom-0 top-auto p-6 z-20 flex flex-col justify-end md:inset-y-0 md:left-0 md:right-auto md:p-8 md:justify-center md:max-w-lg">
                            <div className="flex flex-col gap-2 mb-6">
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight leading-none">{activeCar.model}</h2>
                                <p className="text-base text-slate-300 flex items-center gap-2 font-medium whitespace-nowrap">
                                    <Clock className="w-4 h-4 text-emerald-400" />
                                    <span className="text-white">{activeCar.nextTrip}</span>
                                </p>
                            </div>

                            {/* Integrated Progress - No Widget Box */}
                            <div className="space-y-2 max-w-xs">
                                <div className="flex justify-between items-end px-1">
                                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Status da Viagem</span>
                                    <span className="text-xs font-bold text-emerald-400 font-mono">65%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden backdrop-blur-sm">
                                    <div className="h-full bg-emerald-500 w-[65%] shadow-[0_0_10px_rgba(16,185,129,0.5)] rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
