import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Conversation } from '../types';
import { useChatBookingLogic, formatChatDate } from '../hooks/useChatBookingLogic';

interface ChatBookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    carRelated: NonNullable<Conversation['carRelated']>;
    isHost: boolean;
    onViewCarDetails?: (carId: string) => void;
}

export const ChatBookingModal: React.FC<ChatBookingModalProps> = ({
    isOpen,
    onClose,
    carRelated,
    isHost,
    onViewCarDetails
}) => {
    const { bookingDetails } = carRelated;
    const [pendingNavigation, setPendingNavigation] = useState(false);

    const { localStatus, getStatusText, actions } = useChatBookingLogic({ carRelated, isHost });

    return (
        <AnimatePresence onExitComplete={() => {
            if (pendingNavigation && onViewCarDetails) {
                onViewCarDetails(carRelated.id);
                setPendingNavigation(false);
            }
        }}>
            {isOpen && (
                <>
                    {/* Backdrop - Visible on mobile, or across the whole chat area on desktop but transparent/blur only on the right panel ideally. For now, let's keep it but make it absolute on desktop so it only covers the chat area, not the whole screen. */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-[100] bg-[#1C2230]/40 backdrop-blur-sm md:absolute md:inset-0 md:rounded-[2.5rem]"
                    />

                    {/* Modal Content - Bottom Sheet on Mobile, Right Drawer on Desktop */}
                    <motion.div
                        initial={{ opacity: 0, y: window.innerWidth < 768 ? '100%' : 0, x: window.innerWidth >= 768 ? '100%' : 0 }}
                        animate={{ opacity: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, y: window.innerWidth < 768 ? '100%' : 0, x: window.innerWidth >= 768 ? '100%' : 0 }}
                        transition={{ type: 'spring', damping: 24, stiffness: 220 }}
                        className={`fixed inset-x-0 bottom-0 z-[101] bg-[#F8F9FB] rounded-t-[2rem] md:absolute md:inset-y-0 md:inset-x-auto md:right-0 md:bottom-0 md:h-full md:w-full md:max-w-md md:rounded-l-[2rem] md:rounded-r-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] md:max-h-full font-sans transition-opacity transition-[filter] duration-300 ${(localStatus === 'rejecting' || localStatus === 'rejected' || localStatus === 'cancelled') ? 'opacity-30 grayscale pointer-events-none' : ''}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Ambient Background layer */}
                        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3667AA]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3667AA]/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3"></div>
                        </div>

                        {/* Mobile Pull Indicator */}
                        <div className="w-full flex justify-center pt-3 pb-2 md:hidden relative z-20">
                            <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
                        </div>

                        {/* Interactive Image Header with Elegant Gradient */}
                        <div className="relative h-48 sm:h-56 w-full shrink-0 z-10 group bg-black">
                            <img src={carRelated.imageUrl} alt={carRelated.model} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1C2230] via-[#1C2230]/40 to-transparent pointer-events-none"></div>

                            {/* Close Button must stop propagation to not trigger the routing */}
                            <button
                                onClick={(e) => { e.stopPropagation(); onClose(); }}
                                className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center bg-white shadow-md hover:bg-slate-50 hover:shadow-lg rounded-full text-slate-800 transition-all z-20 hover:-translate-y-0.5"
                            >
                                <i className="fas fa-times"></i>
                            </button>

                            <div className="absolute bottom-5 left-6 right-6 flex justify-between items-end">
                                <div>
                                    <p className="text-white/80 text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{carRelated.make}</p>
                                    <h3 className="text-2xl font-display font-medium text-white leading-tight flex items-center gap-2">
                                        {carRelated.model}
                                    </h3>
                                </div>

                                {/* Call to action button */}
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setPendingNavigation(true);
                                        onClose();
                                    }}
                                    className="flex items-center gap-2 text-white bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest border border-white/30 hover:bg-white/30 active:scale-95 transition-all shadow-lg cursor-pointer z-[100] relative"
                                >
                                    Ver Anúncio
                                    <i className="fas fa-chevron-right text-[10px]"></i>
                                </button>
                            </div>
                        </div>

                        {/* Details Content */}
                        <div className="p-6 overflow-y-auto w-full relative z-20">

                            {/* Status Section Highlight */}
                            {localStatus && (
                                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-200/60">
                                    <div>
                                        <span className="text-[9px] font-bold text-[#3667AA] uppercase tracking-[0.2em] mb-1 block">Status da Reserva</span>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${localStatus === 'pending' ? 'bg-amber-500 animate-pulse' : localStatus === 'confirmed' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                            <span className="text-sm font-bold text-[#1C2230]">
                                                {getStatusText()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 text-[#3667AA]">
                                        {localStatus === 'pending' ? <i className={`fas ${isHost ? 'fa-bell' : 'fa-clock'} text-xl`}></i> : localStatus === 'completed' ? <i className="fas fa-flag-checkered text-xl text-blue-600"></i> : <i className="fas fa-check-circle text-xl text-emerald-600"></i>}
                                    </div>
                                </div>
                            )}

                            {/* Booking Info Premium Ticket */}
                            {bookingDetails && (
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.05)] overflow-hidden mb-6">
                                    <div className="p-5 flex items-center justify-between relative">
                                        {/* Ticket perforations */}
                                        <div className="absolute inset-x-0 bottom-0 border-b-2 border-dashed border-gray-100 z-10"></div>
                                        <div className="absolute -left-2 bottom-0 w-4 h-4 rounded-full bg-[#F8F9FB] shadow-inner translate-y-1/2 z-20 border-r border-[#F8F9FB]"></div>
                                        <div className="absolute -right-2 bottom-0 w-4 h-4 rounded-full bg-[#F8F9FB] shadow-inner translate-y-1/2 z-20 border-l border-[#F8F9FB]"></div>

                                        {/* Pickup */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 text-[#3667AA] mb-2">
                                                <i className="fas fa-calendar-alt text-xs"></i>
                                                <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Retirada</p>
                                            </div>
                                            <p className="text-sm font-bold text-[#1C2230] leading-none mb-1">{formatChatDate(bookingDetails.startDate)}</p>
                                            {bookingDetails.startTime && <p className="text-[11px] text-gray-400 font-medium">{bookingDetails.startTime}</p>}
                                        </div>

                                        {/* Arrow */}
                                        <div className="px-4 text-gray-200">
                                            <i className="fas fa-long-arrow-alt-right text-lg"></i>
                                        </div>

                                        {/* Return */}
                                        <div className="flex-1 text-right">
                                            <div className="flex items-center justify-end gap-2 text-[#3667AA] mb-2">
                                                <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Devolução</p>
                                                <i className="fas fa-calendar-check text-xs"></i>
                                            </div>
                                            <p className="text-sm font-bold text-[#1C2230] leading-none mb-1">{formatChatDate(bookingDetails.endDate)}</p>
                                            {bookingDetails.endTime && <p className="text-[11px] text-gray-400 font-medium">{bookingDetails.endTime}</p>}
                                        </div>
                                    </div>

                                    {/* Price Reveal inside ticket */}
                                    <div className="bg-gradient-to-br from-slate-50 to-white px-5 py-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50/80 rounded-full flex items-center justify-center text-[#3667AA]">
                                                    <i className="fas fa-receipt text-[10px] md:text-sm"></i>
                                                </div>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] leading-none mt-0.5">Valor Total</p>
                                            </div>
                                            <span className="text-xl md:text-2xl font-display font-medium text-[#1C2230]">R$ {bookingDetails.price}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>


                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
