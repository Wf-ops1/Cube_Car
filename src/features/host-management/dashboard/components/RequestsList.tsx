import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RentalRequest } from '@/features/host-management/application/useOwnerCenter.logic';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useBookingStore } from '@/features/booking/stores/booking.store';

interface RequestsListProps {
    requests: RentalRequest[];
    loading: boolean;
    onApprove: (id: string) => void;
    onReject: (id: string) => void;
    onChatClick?: (id: string) => void;
}

export const RequestsList: React.FC<RequestsListProps> = ({ requests, loading, onApprove, onReject, onChatClick }) => {

    const { uiStatuses: statuses, setBookingUIStatus: setBookingStatus } = useBookingStore();

    const handleApprove = (id: string, carId: string) => {
        setBookingStatus(carId, 'accepting');
        setTimeout(() => {
            setBookingStatus(carId, 'confirmed');
            setTimeout(() => {
                onApprove(id);
            }, 1200); // 1.2s delay to read the success badge
        }, 800); // 800ms to show the spinner
    };

    const handleReject = (id: string, carId: string) => {
        setBookingStatus(carId, 'rejecting');
        setTimeout(() => {
            setBookingStatus(carId, 'cancelled');
            setTimeout(() => {
                onReject(id);
            }, 1200);
        }, 800);
    };

    // Helper to format currency
    // Helper to format currency
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    // Helper for Urgency Signal
    const getTimeLabel = (dateRaw: string) => {
        if (!dateRaw) return 'Recente';
        const diff = Date.now() - new Date(dateRaw).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `Há ${Math.max(0, mins)} min`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `Há ${hours}h`;
        return 'Há dias';
    };

    // Helper for Duration
    const getDuration = (start: string, end: string) => {
        if (!start || !end) return 1;
        const s = new Date(start).getTime();
        const e = new Date(end).getTime();
        const days = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
        return Math.max(1, days);
    }

    const renderRequestCard = (req: RentalRequest) => {
        const days = getDuration(req.startDate, req.endDate);
        const urgencyText = getTimeLabel(req.createdAt);
        const dailyRate = req.priceValue ? req.priceValue / Math.max(days, 1) : 0;

        return (
            <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden group mb-5 ${(statuses[req.carId || req.id] === 'rejecting' || statuses[req.carId || req.id] === 'rejected' || statuses[req.carId || req.id] === 'cancelled')
                    ? 'opacity-30 grayscale pointer-events-none scale-[0.98]'
                    : 'opacity-100 scale-100'
                    }`}
            >
                {/* Header Section: Avatar + Identity + Urgency */}
                <div className="p-6 pb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-full overflow-hidden border border-slate-100 shadow-sm ring-4 ring-slate-50 relative z-10">
                                <img
                                    src={req.userAvatar || 'https://i.pravatar.cc/150'}
                                    alt={req.userName || 'Motorista'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>

                        <div className="min-w-0 flex-1 pt-0.5">
                            <h4 className="font-display font-bold text-slate-800 text-lg tracking-tight leading-blue-normal truncate pr-2">{req.userName || 'Usuário Cube'}</h4>

                            {/* Standardized Rating (FleetList Style) */}
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mt-1">
                                <i className="fas fa-star text-slate-400 text-xs"></i>
                                <span className="font-bold text-slate-800">{req.rating}</span>
                                <span className="text-slate-400 font-bold text-[10px]">· {req.tripCount} viagens</span>
                            </div>
                        </div>
                    </div>

                    {/* Chat Button (Responsive: Icon on Mobile, Full on Desktop) */}
                    <div className="shrink-0 pt-0.5">
                        <button
                            onClick={(e) => { e.stopPropagation(); onChatClick?.(req.id); }}
                            className="flex items-center justify-center md:gap-2 w-12 h-12 md:w-auto md:h-auto md:px-6 md:py-2.5 rounded-full bg-slate-100 border border-slate-200 shadow-sm text-slate-800 font-bold hover:bg-slate-200 hover:border-slate-300 hover:shadow-md active:scale-95 transition-all group/chat"
                        >
                            <i className="fas fa-comment-dots text-base text-slate-400 group-hover/chat:text-[#3667AA] transition-colors"></i>
                            <span className="text-xs tracking-wide hidden md:block">Conversar</span>
                        </button>
                    </div>
                </div>

                {/* Body Section: Context & Financials */}
                {/* Body Section: Context & Financials */}
                <div className="px-6 py-2">
                    <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">

                        {/* Row 1: Vehicle Identity */}
                        <div className="mb-5">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Veículo</span>
                            <p className="text-lg font-display font-bold text-slate-900 tracking-tight leading-none mb-5">{req.carModel || 'Carro'}</p>
                            <div className="h-px bg-slate-200/80 w-full"></div>
                        </div>

                        {/* Row 2: Date (Scanner Friendly: Label + Badge) */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Período</span>
                                <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wide">{days} dias</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium pl-0.5">
                                <span className='capitalize'>{new Date(req.startDate).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '')}</span>
                                <i className="fas fa-arrow-right text-[10px] text-slate-300"></i>
                                <span className='capitalize'>{new Date(req.endDate).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace('.', '')}</span>
                            </div>
                        </div>

                        {/* Row 3: Financials */}
                        <div className="flex justify-between border-t border-slate-200/60 pt-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Diária</span>
                                <span className="text-slate-600 font-bold text-sm inline-block -mt-1">
                                    {formatCurrency(dailyRate)}
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 block">Total</span>
                                <span className="text-lg font-extrabold text-emerald-600 tracking-tight leading-none">
                                    {formatCurrency(req.priceValue)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Section: Actions */}
                <div className="px-6 pb-6 pt-1 flex flex-col gap-3 relative">
                    <AnimatePresence mode="popLayout">
                        {(statuses[req.carId || req.id] || 'pending') === 'pending' && (
                            <motion.div
                                key="pending-actions"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="w-full flex gap-2"
                            >
                                {/* Cancel Button (Refined: "Recusar" + Minimal Style) */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleReject(req.id, req.carId || req.id); }}
                                    className="flex-1 border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-[11px] uppercase font-bold tracking-wide py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    Recusar
                                </button>

                                {/* Approve Button (Simplified) */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleApprove(req.id, req.carId || req.id); }}
                                    className="flex-1 border border-[#3667AA] bg-[#3667AA] text-white hover:bg-[#2c5691] text-[11px] uppercase font-bold tracking-wide py-2.5 rounded-xl transition-colors shadow-sm active:scale-[0.98] flex items-center justify-center gap-2"
                                >
                                    Aprovar
                                </button>
                            </motion.div>
                        )}

                        {(statuses[req.carId || req.id] === 'accepting' || statuses[req.carId || req.id] === 'rejecting') && (
                            <motion.div
                                key="loading-actions"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="w-full flex justify-center py-2.5"
                            >
                                <Spinner size="sm" color={statuses[req.carId || req.id] === 'accepting' ? 'blue' : 'rose'} />
                            </motion.div>
                        )}

                        {statuses[req.carId || req.id] === 'confirmed' && (
                            <motion.div
                                key="confirmed-status"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                                className="w-full text-center text-emerald-600 text-[11px] uppercase font-bold py-2.5 bg-emerald-50 rounded-xl tracking-wide flex justify-center items-center shadow-inner"
                            >
                                <i className="fas fa-check-circle mr-1.5 opacity-80 animate-pulse text-emerald-500 scale-110"></i>
                                Reserva Aprovada
                            </motion.div>
                        )}

                        {statuses[req.carId || req.id] === 'cancelled' && (
                            <motion.div
                                key="rejected-status"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                                className="w-full text-center text-slate-500 text-[11px] uppercase font-bold py-2.5 bg-slate-50 rounded-xl tracking-wide border border-slate-100 flex justify-center items-center"
                            >
                                <i className="fas fa-times-circle mr-1.5 opacity-70"></i>
                                Reserva Recusada
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Microcopy Reassurance - Improved Readability */}
                    <div className="flex items-center justify-center gap-2 text-slate-500 text-xs font-medium tracking-wide mt-2">
                        <i className="fas fa-shield-alt text-slate-400"></i>
                        <span>Cancelamento grátis</span>
                    </div>
                </div>

            </motion.div>
        );
    };

    if (loading) {
        return (
            <div className="col-span-2 text-center py-12">
                <Spinner size="lg" color="slate" />
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-4">Carregando Pedidos...</p>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="col-span-2 text-center py-16 px-6 bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200">
                <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <i className="far fa-bell-slash text-xl"></i>
                </div>
                <p className="text-slate-500 text-sm font-bold">Nenhuma solicitação pendente.</p>
                <p className="text-slate-400 text-xs mt-1">Quando alguém solicitar um carro, aparecerá aqui.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
            {requests.map(req => renderRequestCard(req))}
        </div>
    );
};
