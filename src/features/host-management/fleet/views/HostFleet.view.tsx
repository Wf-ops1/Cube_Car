import React from 'react';
import { User } from '@/core/data/auth/auth.types';
import { motion } from 'framer-motion';
import { ErrorState } from '@/shared/components/states/ErrorState';
import { useHostFleetLogic } from '../hooks/useHostFleet.logic';

interface HostFleetProps {
    user: User;
    onNavigateHome: () => void;
    onAddCarClick: () => void;
}

const HostFleet: React.FC<HostFleetProps> = ({ user, onNavigateHome, onAddCarClick }) => {
    const { myFleet, loading, error, metrics } = useHostFleetLogic(user);

    const FleetSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100/50 animate-pulse">
                    <div className="aspect-[4/3] bg-slate-200 rounded-[1.5rem] mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-6 bg-slate-200 rounded w-1/2"></div>
                        <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                        <div className="flex justify-between pt-4 border-t border-slate-50">
                            <div className="h-6 bg-slate-200 rounded w-20"></div>
                            <div className="h-6 bg-slate-100 rounded w-12"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-32">

            {/* --- TOP BAR (DARK MODE - BUSINESS CLASS FEEL) --- */}
            <div className="bg-[#1C2230] text-white pt-6 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3667AA]/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex justify-between items-start md:items-center mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-[#FFD700]/20 text-[#FFD700] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-[#FFD700]/30 shadow-[0_0_15px_rgba(255,215,0,0.2)] flex items-center gap-1">
                                    <i className="fas fa-crown text-[10px]"></i> {metrics.tier}
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-display font-medium text-white">Central do Parceiro</h1>
                            <p className="text-slate-400 text-sm">Bem-vindo ao seu escritório, {user.name?.split(' ')[0]}.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg border border-white/10">
                                <i className="fas fa-headset"></i> Suporte Prioritário
                            </button>
                            <button onClick={onNavigateHome} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    {/* METRICS DASHBOARD */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="col-span-2 md:col-span-1 bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors group">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1 group-hover:text-slate-200">Saldo Atual</p>
                            <h3 className="text-3xl font-display font-medium text-white tracking-tight">R$ {metrics.monthlyEarnings.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                            <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
                                <i className="fas fa-arrow-up"></i> +12% esse mês
                            </p>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ocupação</p>
                                <i className="fas fa-chart-pie text-slate-500"></i>
                            </div>
                            <p className="text-2xl font-bold text-white">{metrics.occupancyRate}%</p>
                            <div className="w-full bg-white/10 h-1 rounded-full mt-3 overflow-hidden">
                                <div className="bg-[#3667AA] h-full" style={{ width: `${metrics.occupancyRate}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:bg-white/10 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Qualidade</p>
                                <i className="fas fa-star text-[#FFD700]"></i>
                            </div>
                            <p className="text-2xl font-bold text-white">{metrics.rating}</p>
                            <p className="text-[10px] text-slate-400 mt-1">Superhost status</p>
                        </div>

                        <div
                            onClick={onAddCarClick}
                            className="bg-gradient-to-br from-[#3667AA] to-blue-600 rounded-2xl p-5 shadow-lg shadow-blue-500/20 relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform"
                        >
                            <div className="absolute top-0 right-0 p-16 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                            <div className="relative z-10">
                                <p className="text-xs text-blue-100 font-bold uppercase tracking-wider mb-2">Novo Anúncio</p>
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white mb-2 group-hover:rotate-90 transition-transform">
                                    <i className="fas fa-plus"></i>
                                </div>
                                <p className="text-[10px] text-white/80">Adicionar veículo</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- MAIN CONTENT CENTER --- */}
            <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-20 space-y-8">

                {/* Fleet Section */}
                <div>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h2 className="text-lg font-bold text-slate-800">
                            Frota Ativa <span className="text-slate-400 text-sm font-normal ml-2">({myFleet.length} veículos)</span>
                        </h2>
                        <button className="text-xs font-bold text-[#3667AA] hover:text-blue-800 uppercase tracking-wider">
                            Ver Relatórios <i className="fas fa-chevron-right ml-1"></i>
                        </button>
                    </div>

                    {loading ? (
                        <FleetSkeleton />
                    ) : error ? (
                        <ErrorState
                            message={error}
                            retryAction={() => window.location.reload()}
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myFleet.length > 0 ? myFleet.map((car, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    key={car.id}
                                    className="group bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 hover:shadow-xl hover:border-blue-100/50 transition-all duration-300"
                                >
                                    {/* Card Header Status */}
                                    <div className="flex justify-between items-center mb-4 px-1">
                                        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${car.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                            {car.status === 'approved' ? 'Ativo' : 'Pendente'}
                                        </div>
                                        <button className="w-8 h-8 rounded-full hover:bg-slate-50 flex items-center justify-center text-slate-400 transition-colors">
                                            <i className="fas fa-ellipsis-h"></i>
                                        </button>
                                    </div>

                                    <div className="relative aspect-[16/10] rounded-[1.5rem] overflow-hidden mb-5">
                                        <img src={car.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={car.model} />

                                        {/* Dynamic Status Overlay */}
                                        {car.contextStatus === 'RENTED' && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                                                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                                    <span className="text-xs font-bold text-[#3667AA] uppercase tracking-wide">Em Viagem</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-1">
                                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#3667AA] transition-colors">{car.model}</h3>
                                        <p className="text-xs text-slate-500 mb-4">{car.make} • {car.year} • {car.licensePlate || 'ABC-1234'}</p>

                                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Diária</p>
                                                <p className="text-sm font-bold text-slate-900">R$ {car.pricePerDay}</p>
                                            </div>

                                            <div className="text-right">
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Próx. Reserva</p>
                                                <p className="text-sm font-bold text-emerald-600">Hoje, 14:00</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Actions (Hover Reveal) */}
                                    {/* <div className="mt-4 pt-0 h-0 group-hover:h-auto group-hover:mt-4 group-hover:pt-4 overflow-hidden transition-all border-t border-transparent group-hover:border-slate-50">
                                        <button className="w-full py-2 bg-slate-50 hover:bg-[#3667AA] hover:text-white rounded-xl text-xs font-bold text-slate-600 transition-colors">
                                            Gerenciar Calendário
                                        </button>
                                    </div> */}
                                </motion.div>
                            )) : (
                                <div className="col-span-full py-12 text-center bg-white rounded-[2rem] border border-slate-100 border-dashed">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <i className="fas fa-car text-slate-300 text-2xl"></i>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Comece seu negócio</h3>
                                    <p className="text-sm text-slate-500 max-w-xs mx-auto mb-6">Cadastre seu primeiro veículo para desbloquear o painel de métricas.</p>
                                    <button
                                        onClick={onAddCarClick}
                                        className="bg-[#1C2230] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all"
                                    >
                                        Cadastrar Veículo
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Insight / Up-sell Block */}
                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 mb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
                        <i className="fas fa-chart-line text-[200px] text-emerald-900 -translate-y-1/2 translate-x-1/4"></i>
                    </div>

                    <div className="relative z-10 max-w-xl">
                        <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4">
                            Dica de Performance
                        </span>
                        <h3 className="text-2xl font-bold text-emerald-950 mb-2">Alta demanda esperada para o Feriado</h3>
                        <p className="text-emerald-800/80 leading-relaxed">
                            Ajuste seus preços ou disponibilidade para o próximo feriado. Motoristas estão buscando SUVs e carros premium.
                        </p>
                    </div>
                    <button className="relative z-10 px-6 py-3 bg-white text-emerald-900 font-bold rounded-xl shadow-sm hover:shadow-md transition-all whitespace-nowrap">
                        Ajustar Calendário
                    </button>
                </div>

            </main>
        </div>
    );
};

export default HostFleet;
