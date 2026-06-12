import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatCarWidgetProps } from '../types';
import { Spinner } from '../../../shared/components/ui/Spinner';
import { useChatBookingLogic, formatChatDate } from '../hooks/useChatBookingLogic';

export const ChatCarWidget: React.FC<ChatCarWidgetProps> = ({
    carRelated,
    onClick,
    isHost,
    className
}) => {
    const {
        localStatus,
        isAccepting,
        isRejecting,
        isCanceling,
        getStatusText,
        getStatusColorClass,
        actions
    } = useChatBookingLogic({ carRelated, isHost });

    const handleActionClick = (e: React.MouseEvent, action: () => void) => {
        e.stopPropagation();
        action();
    };

    return (
        <div className={`mx-4 mt-3 mb-6 flex flex-col bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] max-w-5xl md:mx-auto md:w-[480px] md:mt-3 md:mb-6 overflow-hidden transition-all duration-300 font-sans relative ${className || ''} ${(localStatus === 'rejecting' || localStatus === 'rejected' || localStatus === 'cancelled') ? 'opacity-30 grayscale pointer-events-none scale-[0.98]' : ''}`}>

            {/* Ambient Background Hint */}
            <div className="absolute top-0 right-0 w-[200px] h-[100px] bg-[#3667AA]/5 rounded-full blur-[40px] pointer-events-none"></div>

            {/* Main Car Info & Status - Compact View */}
            <div
                className="p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors active:scale-[0.99] relative z-20 w-full"
                onClick={onClick}
            >
                <img src={carRelated.imageUrl} className="w-14 h-10 rounded-xl object-cover shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] ring-1 ring-black/5" alt="Car" />
                <div className="flex flex-col justify-center flex-1 min-w-0">
                    <p className="text-[12px] font-display font-medium text-[#1C2230] leading-tight mb-0.5 truncate">
                        {carRelated.make} {carRelated.model}
                    </p>

                    {localStatus && (
                        <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${localStatus === 'pending' ? 'animate-pulse' : ''} ${getStatusColorClass().split(' ')[1]}`}></div>
                            <span className={`text-[9px] font-bold uppercase tracking-[0.1em] truncate ${getStatusColorClass().split(' ')[0]}`}>
                                {getStatusText()}
                            </span>
                        </div>
                    )}
                </div>
                <button
                    className="text-slate-500 hover:text-[#3667AA] transition-colors flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-slate-100 uppercase tracking-widest font-bold text-[10px] z-30 shrink-0"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        onClick();
                    }}
                    aria-label="Ver Detalhes"
                >
                    <span>Detalhes</span>
                    <i className="fas fa-chevron-right text-[10px]"></i>
                </button>
            </div>

            {/* Booking Action Area - Ultra Compact Row */}
            {localStatus && carRelated.bookingDetails && (
                <div className="px-3 pb-3 pt-1 border-t border-dashed border-gray-100 relative z-10 bg-gradient-to-b from-transparent to-slate-50/50">

                    {/* Booking Details Inline */}
                    <div className="flex flex-col gap-1.5 mb-3 px-1 pt-1 opacity-90">
                        <div className="flex items-center gap-2 text-[10.5px] text-[#1C2230] font-medium leading-tight flex-wrap">
                            <i className="fas fa-calendar-alt text-[#3667AA]/70 text-[10px]"></i>
                            <span>
                                {formatChatDate(carRelated.bookingDetails.startDate)} {carRelated.bookingDetails.startTime && <span className="text-gray-500 font-normal">({carRelated.bookingDetails.startTime})</span>}
                                <span className="text-gray-400 mx-1.5">-</span>
                                {formatChatDate(carRelated.bookingDetails.endDate)} {carRelated.bookingDetails.endTime && <span className="text-gray-500 font-normal">({carRelated.bookingDetails.endTime})</span>}
                            </span>
                        </div>
                        <span className="text-sm font-bold text-[#1C2230] mt-1">R$ {carRelated.bookingDetails.price}</span>
                    </div>

                    {/* Actions with Animate Presence for Smooth Transitions */}
                    <div className="flex flex-col gap-3 pt-2 relative">
                        <AnimatePresence mode="popLayout">
                            {(localStatus === 'pending' || localStatus === 'accepting' || localStatus === 'rejecting') && (
                                <motion.div
                                    key="pending-actions"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full flex gap-2"
                                >
                                    {isHost ? (
                                        <>
                                            <button
                                                onClick={(e) => handleActionClick(e, actions.handleReject)}
                                                disabled={isRejecting || isAccepting}
                                                className="flex-1 border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-[11px] uppercase font-bold tracking-wide py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                            >
                                                {isRejecting ? <Spinner size="sm" color="rose" /> : 'Recusar'}
                                            </button>
                                            <button
                                                onClick={(e) => handleActionClick(e, actions.handleAccept)}
                                                disabled={isAccepting || isRejecting}
                                                className="flex-1 border border-[#3667AA] bg-[#3667AA] text-white hover:bg-[#2c5691] text-[11px] uppercase font-bold tracking-wide py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-75 disabled:scale-100 flex items-center justify-center gap-2"
                                            >
                                                {isAccepting ? <Spinner size="sm" color="white" /> : 'Aceitar'}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={(e) => handleActionClick(e, actions.handleCancel)}
                                            disabled={isCanceling}
                                            className="w-full border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-[11px] uppercase font-bold tracking-wide py-2.5 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isCanceling ? <Spinner size="sm" color="rose" /> : 'Cancelar Reserva'}
                                        </button>
                                    )}
                                </motion.div>
                            )}

                            {localStatus === 'confirmed' && (
                                <motion.div
                                    key="confirmed-status"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                                    className="w-full text-center text-emerald-600 text-[11px] uppercase font-bold py-2.5 bg-emerald-50 rounded-xl tracking-wide flex justify-center items-center shadow-inner"
                                >
                                    <i className="fas fa-check-circle mr-1.5 opacity-80 animate-pulse text-emerald-500 scale-110"></i>
                                    {getStatusText()}
                                </motion.div>
                            )}

                            {localStatus === 'rejected' && (
                                <motion.div
                                    key="rejected-status"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                                    className="w-full text-center text-slate-500 text-[11px] uppercase font-bold py-2.5 bg-slate-50 rounded-xl tracking-wide border border-slate-100 flex justify-center items-center"
                                >
                                    <i className="fas fa-times-circle mr-1.5 opacity-70"></i>
                                    {getStatusText()}
                                </motion.div>
                            )}

                            {localStatus === 'cancelled' && (
                                <motion.div
                                    key="cancelled-status"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                                    className="w-full text-center text-rose-500 text-[11px] uppercase font-bold py-2.5 bg-rose-50 rounded-xl tracking-wide border border-rose-100 flex justify-center items-center"
                                >
                                    <i className="fas fa-ban mr-1.5 opacity-70 text-rose-400 scale-110"></i>
                                    {getStatusText()}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            )}

        </div>
    );
};
