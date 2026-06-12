import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getStatusConfig } from '@/features/booking/logic/booking.logic';
import { DashboardHeroCard } from './DashboardHeroCard';

interface TravelerDashboardProps {
    myTrips: any[];
    activeReservation: any;
    onNavigateHome: () => void;
    setSelectedTripDetail: (trip: any) => void;
    onCompleteTrip?: (trip: any) => void;
    completingTripId?: string | null;
    pendingReviewTrips?: any[];
    reviewedTripIds?: Set<string>;
    onReviewTrip?: (trip: any) => void;
}

export const TravelerDashboard: React.FC<TravelerDashboardProps> = ({ myTrips, activeReservation, onNavigateHome, setSelectedTripDetail, onCompleteTrip, completingTripId, pendingReviewTrips = [], reviewedTripIds = new Set(), onReviewTrip }) => {
    return (
        <motion.div
            key="traveler"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="flex flex-col"
        >
            {myTrips.length > 0 ? (
                <>
                    {/* PENDING REVIEW BANNER */}
                    <AnimatePresence>
                        {pendingReviewTrips.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-8 bg-white border border-slate-200 rounded-[1.5rem] p-5 md:p-6 flex items-center gap-5 cursor-pointer shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 group relative overflow-hidden"
                                onClick={() => onReviewTrip?.(pendingReviewTrips[0])}
                            >
                                <div className="absolute inset-0 pointer-events-none"></div>
                                <div className="w-12 h-12 bg-amber-50 border border-amber-100 shadow-sm rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 relative z-10">
                                    <i className="fas fa-star text-amber-400 text-xl"></i>
                                </div>
                                <div className="flex-1 min-w-0 relative z-10">
                                    <p className="text-[13px] font-semibold text-[#1C2230] leading-tight">
                                        {pendingReviewTrips.length === 1
                                            ? `Como foi a sua experiência com o ${pendingReviewTrips[0].carName}?`
                                            : `Você tem ${pendingReviewTrips.length} viagens esperando sua avaliação`
                                        }
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-0.5">Sua opinião ajuda a comunidade Cube.</p>
                                </div>
                                <div className="shrink-0 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all">
                                    <i className="fas fa-chevron-right text-sm"></i>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <section className="relative group/summary mb-10 md:mb-16">
                        {myTrips.filter(t => ['active', 'confirmed', 'pending', 'rejected', 'expired', 'completed', 'cancelled'].includes(t.status)).length > 0 ? (
                            <div className="space-y-8">
                                {myTrips.filter(t => ['active', 'confirmed', 'pending', 'rejected', 'expired', 'completed', 'cancelled'].includes(t.status)).map(trip => (
                                    <DashboardHeroCard
                                        key={trip.id}
                                        reservation={trip}
                                        onClick={setSelectedTripDetail}
                                        onComplete={onCompleteTrip}
                                        isCompleting={completingTripId === trip.id}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="relative overflow-hidden bg-white border border-slate-200 shadow-sm rounded-[3rem] md:rounded-[4rem] p-16 md:p-32 text-center group cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-700" onClick={onNavigateHome}>
                                {/* Empty State Hero for when there are trips but no UPCOMING active ones */}
                                <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
                                </div>
                                <div className="relative z-10 max-w-md mx-auto space-y-8">
                                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-200 group-hover:scale-110 transition-transform duration-700 group-hover:bg-[#3667AA]/5 group-hover:shadow-xl">
                                        <i className="fas fa-compass text-slate-300 group-hover:text-[#3667AA] transition-colors text-3xl"></i>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-3xl md:text-5xl font-display font-medium text-[#1C2230] tracking-tight leading-[1.1]">Qual será sua<br /><span className="text-[#3667AA]">próxima história?</span></h3>
                                        <p className="text-slate-500 font-light text-lg">Seu próximo veículo premium está a poucos cliques de distância.</p>
                                    </div>
                                    <div className="pt-4">
                                        <span className="inline-flex items-center gap-3 text-[#3667AA] font-bold uppercase tracking-[0.2em] text-xs group-hover:text-[#2c5691] transition-colors">
                                            Explorar catálogo
                                            <i className="fas fa-arrow-right text-[10px] group-hover:translate-x-2 transition-transform"></i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* Trip History Only */}
                    <section>
                        <div className="flex items-center justify-between px-2 mb-6 md:mb-8">
                            <h2 className="text-2xl md:text-4xl font-display font-bold text-[#181824] tracking-tight flex items-center gap-3 md:gap-4">
                                <span className="w-1.5 h-8 md:h-10 bg-gray-200 rounded-full"></span>
                                Histórico
                            </h2>
                            <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">{myTrips.filter(t => ['completed', 'cancelled'].includes(t.status)).length} Concluídas</span>
                        </div>

                        <div className="relative space-y-6">
                            <div className="absolute left-[31px] md:left-[39px] top-6 bottom-6 w-[2px] bg-gray-100 z-0"></div>

                            {myTrips.filter(t => ['completed', 'cancelled'].includes(t.status)).map((trip, idx) => (
                                <motion.div
                                    key={trip.id}
                                    initial={{ x: -20, opacity: 0 }}
                                    whileInView={{ x: 0, opacity: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group relative flex items-center gap-5 md:gap-8 p-5 md:p-6 pr-10 bg-transparent hover:bg-white rounded-3xl md:rounded-[2rem] border border-transparent hover:border-slate-200 hover:shadow-[0_8px_30px_rgba(100,100,111,0.08)] transition-all duration-300 cursor-pointer overflow-hidden"
                                    onClick={() => setSelectedTripDetail(trip)}
                                >
                                    <div className="absolute inset-0 pointer-events-none"></div>
                                    <div className="z-10 shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-[1.25rem] overflow-hidden shadow-sm border border-slate-200 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:shadow-md transition-all duration-300">
                                        <img src={trip.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                                    </div>

                                    <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 items-center relative z-10">
                                        <div className="col-span-1">
                                            <p className="text-[8px] md:text-xs font-black text-slate-600 uppercase tracking-widest leading-none mb-1 group-hover:text-slate-700">{trip.dates?.split('-')[0] || trip.dates || ''}</p>
                                            <h3 className="font-bold text-slate-700 group-hover:text-[#1C2230] transition-colors text-sm md:text-lg leading-tight truncate">{trip.carName}</h3>
                                        </div>
                                        <div className="hidden md:block">
                                            <p className="text-[10px] md:text-xs font-bold text-slate-600 group-hover:text-slate-700 uppercase tracking-wider mb-1">Código</p>
                                            <p className="text-[10px] md:text-sm font-mono font-medium text-slate-600 group-hover:text-[#1C2230] tracking-wider">#{trip.bookingCode || trip.code}</p>
                                        </div>
                                        <div className="hidden md:block">
                                            <p className="text-[10px] md:text-xs font-bold text-slate-600 group-hover:text-slate-700 uppercase tracking-wider mb-1">Anfitrião</p>
                                            <p className="text-sm md:text-base text-slate-700 group-hover:text-[#1C2230]">{trip.owner}</p>
                                        </div>
                                        <div className="text-right flex flex-col items-end gap-1">
                                            {trip.status === 'completed' && !reviewedTripIds.has(trip.id) ? (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onReviewTrip?.(trip);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#3667AA] text-white text-[10px] font-bold uppercase tracking-wider rounded-lg hover:bg-[#2c5691] active:scale-95 transition-all shadow-sm"
                                                >
                                                    <i className="fas fa-star text-[9px] group-hover:text-amber-400"></i>
                                                    Avaliar
                                                </button>
                                            ) : (
                                                <>
                                                    <p className="text-[8px] md:text-xs font-black text-slate-600 uppercase tracking-widest mb-0.5 md:mb-1 group-hover:text-slate-700">Total</p>
                                                    <p className="font-bold text-slate-700 text-sm md:text-lg group-hover:text-[#1C2230]">R$ {trip.price}</p>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="absolute right-4 md:right-6 opacity-100 group-hover:translate-x-1 transition-all text-slate-400 group-hover:text-[#3667AA]">
                                        <i className="fas fa-chevron-right text-sm md:text-base"></i>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </section>
                </>
            ) : (
                /* --- DASHBOARD ZERO STATE (ONBOARDING HERO) --- */
                <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative mb-12"
                    >
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full"></div>
                        <img
                            src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=300&q=80"
                            alt="Welcome"
                            className="relative w-40 h-40 md:w-56 md:h-56 rounded-full object-cover border-8 border-white shadow-2xl skew-y-2 hover:skew-y-0 transition-transform duration-700"
                        />
                        <div className="absolute -bottom-6 -right-4 bg-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 skew-y-2 hover:skew-y-0 transition-transform duration-700 delay-100">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <div>
                                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest leading-none mb-1">Status</p>
                                <p className="text-sm font-bold text-gray-900 leading-none">Pronto para Voar</p>
                            </div>
                        </div>
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-display font-bold text-[#181824] mb-6 max-w-2xl leading-tight">
                        Bem-vindo ao Cube Car,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-[#3667AA]">sua garagem infinita.</span>
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl font-light max-w-lg mx-auto mb-10 leading-relaxed">
                        Você está a um passo de dirigir os carros mais exclusivos do mundo. Sem burocracia, apenas prazer.
                    </p>

                    <button
                        onClick={onNavigateHome}
                        className="group relative px-10 py-5 bg-[#181824] text-white rounded-full font-bold uppercase tracking-widest shadow-2xl hover:scale-105 hover:shadow-blue-900/20 transition-all duration-300"
                    >
                        <span className="relative z-10 flex items-center gap-3">
                            Explorar Frota <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                        </span>
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                </div>
            )}
        </motion.div>
    );
};
