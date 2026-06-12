import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { WEEKDAYS, ALL_TIME_SLOTS } from '@/features/catalog/hooks/useBookingLogic';
// Need to ensure this path is correct or update it
import { BookingCalendar } from '@/features/catalog/components/CarDetails/Booking/Shared/BookingCalendar';

interface DateSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    startTime: string;
    setStartTime: (time: string) => void;
    endTime: string;
    setEndTime: (time: string) => void;
    isDateDisabled?: (date: string) => boolean;
    isTimeDisabled?: (time: string, date: string) => boolean;
    totalPrice?: number;
    totalDays?: number;
    onConfirm?: () => void;
    confirmLabel?: string;
    priceLabel?: string;
}

export const DateSelectionModal: React.FC<DateSelectionModalProps> = ({
    isOpen, onClose,
    startDate, setStartDate,
    endDate, setEndDate,
    startTime, setStartTime,
    endTime, setEndTime,
    isDateDisabled = () => false,
    isTimeDisabled = () => false,
    totalPrice = 0,
    totalDays = 0,
    onConfirm,
    confirmLabel = 'Confirmar Seleção',
    priceLabel = 'Total Estimado'
}) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [tab, setTab] = useState<'dates' | 'times'>('dates');

    // Default implementations if not provided
    const safeIsDateDisabled = isDateDisabled || ((_date: string) => false);
    const safeIsTimeDisabled = isTimeDisabled || ((_time: string, _date: string) => false);

    const handleDateClick = (dateStr: string) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(dateStr);
            setEndDate('');
        } else if (startDate && !endDate) {
            if (dateStr < startDate) {
                setStartDate(dateStr);
            } else {
                setEndDate(dateStr);
            }
        }
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        onClose();
    };

    const renderCalendar = () => {
        return (
            <div className="flex-1 flex flex-col min-h-0">
                {/* Scrollable Content with Sticky Header inside for Alignment */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-7 mb-4 px-6 pt-4 sticky top-0 bg-white z-20 pb-2 border-b border-gray-100">
                        {WEEKDAYS.map(day => (<div key={day} className="text-center text-xs font-bold text-gray-400 uppercase">{day}</div>))}
                    </div>
                    <div className="px-6 pb-20">
                        <BookingCalendar
                            viewDate={viewDate}
                            startDate={startDate}
                            endDate={endDate}
                            onDateClick={handleDateClick}
                            isDateDisabled={safeIsDateDisabled}
                            monthsToShow={12}
                            layout="list"
                        />
                    </div>
                </div>
            </div>
        );
    };

    const renderFooter = () => {
        const isSelectionComplete = startDate && endDate && startTime && endTime;

        return (
            <div className="px-6 py-4 md:pb-10 border-t border-gray-100 bg-gray-50/50 safe-area-bottom shrink-0 mt-auto">
                <div className="flex justify-between items-end mb-4 md:mb-3 px-1">
                    <div className="text-sm text-gray-500 flex flex-col gap-1 md:mb-1">
                        <p className="flex items-center gap-1">
                            Retirada: <strong className="text-[#1C2230]">{startDate ? startDate.split('-').reverse().join('/') : '--'}</strong> <span className="text-xs text-gray-400 font-medium">às</span> <strong className="text-[#1C2230]">{startTime}</strong>
                        </p>
                        <p className="flex items-center gap-1">
                            Devolução: <strong className="text-[#1C2230]">{endDate ? endDate.split('-').reverse().join('/') : '--'}</strong> <span className="text-xs text-gray-400 font-medium">às</span> <strong className="text-[#1C2230]">{endTime}</strong>
                        </p>
                        <p className="hidden md:block mt-1 text-2xl font-bold text-[#1C2230]">
                            Total: <span className="text-[#3667AA]">{totalPrice > 0 ? `R$ ${totalPrice.toFixed(0)}` : 'R$ --'}</span>
                        </p>
                    </div>
                    <div className="text-right flex flex-col items-end justify-end h-full md:hidden">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold mb-0.5">
                            <span>Total</span>
                        </p>
                        <p className="text-xl font-display font-bold text-[#3667AA] leading-none">
                            {totalPrice > 0 ? `R$ ${totalPrice.toFixed(0)}` : 'R$ --'}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        if (isSelectionComplete) {
                            handleConfirm();
                        } else if (startDate && endDate && (!startTime || !endTime)) {
                            setTab('times');
                        }
                    }}
                    disabled={!isSelectionComplete && (!startDate || !endDate)}
                    className={`w-full font-bold py-4 rounded-2xl text-base transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2
                        ${(isSelectionComplete || (startDate && endDate))
                            ? 'bg-gradient-to-tr from-[#3667AA] to-blue-500 text-white hover:brightness-110 shadow-blue-900/20'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        }
                    `}
                >
                    <span>{isSelectionComplete ? 'Reservar' : 'Próximo'}</span>
                </button>
            </div>
        );
    };

    const renderTimePicker = () => {
        // Use normalized slots for consistency
        const times = ALL_TIME_SLOTS;

        return (
            <div className="p-6 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Horário de Retirada</label>
                    <div className="grid grid-cols-4 gap-2">
                        {times.filter((_, i) => i % 4 === 0).map(time => {
                            const isAvailable = !safeIsTimeDisabled(time, startDate);
                            return (
                                <button key={`start-${time}`}
                                    disabled={!isAvailable}
                                    onClick={() => isAvailable && setStartTime(time)}
                                    className={`py-2 rounded-lg text-sm border transition-colors
                                        ${!isAvailable ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
                                        ${isAvailable && startTime === time ? 'border-[#3667AA] bg-[#3667AA]/10 text-[#3667AA] font-bold' : ''}
                                        ${isAvailable && startTime !== time ? 'border-gray-200 text-gray-600 active:scale-95' : ''}
                                    `}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3">Horário de Devolução</label>
                    <div className="grid grid-cols-4 gap-2">
                        {times.filter((_, i) => i % 4 === 0).map(time => {
                            const isAvailable = !safeIsTimeDisabled(time, endDate);
                            return (
                                <button key={`end-${time}`}
                                    disabled={!isAvailable}
                                    onClick={() => isAvailable && setEndTime(time)}
                                    className={`py-2 rounded-lg text-sm border transition-colors
                                        ${!isAvailable ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed' : ''}
                                        ${isAvailable && endTime === time ? 'border-[#3667AA] bg-[#3667AA]/10 text-[#3667AA] font-bold' : ''}
                                        ${isAvailable && endTime !== time ? 'border-gray-200 text-gray-600 active:scale-95' : ''}
                                    `}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        )
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    {/* Modal Wrapper for Centering */}
                    <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="pointer-events-auto w-full h-[90vh] bg-white rounded-t-[2rem] overflow-hidden flex flex-col shadow-2xl date-picker-container md:w-[850px] md:h-[700px] md:max-h-[85vh] md:rounded-[2rem]"
                        >
                            {/* Close Button Header */}
                            <div className="relative w-full h-8 flex items-center justify-center shrink-0 mt-4 md:mt-4">
                                <button
                                    onClick={onClose}
                                    className="absolute right-6 top-0 p-2 text-gray-400 hover:text-gray-600 active:scale-95 transition-transform z-10"
                                >
                                    <i className="fas fa-times text-lg"></i>
                                </button>
                            </div>

                            {/* DESKTOP LAYOUT WRAPPER: Flex Row on Desktop, Col on Mobile */}
                            <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

                                {/* LEFT COLUMN: Calendar (Full on Desktop, Tabbed on Mobile) */}
                                <div className={`flex flex-col h-full md:w-[60%] md:border-r md:border-gray-100 ${tab === 'dates' ? 'block' : 'hidden md:block'}`}>

                                    {/* Header Tabs (Mobile Only) */}
                                    <div className="flex border-b border-gray-100 px-6 shrink-0 md:hidden">
                                        <button
                                            onClick={() => setTab('dates')}
                                            className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-colors ${tab === 'dates' ? 'border-[#3667AA] text-[#3667AA]' : 'border-transparent text-gray-400'}`}
                                        >
                                            Datas
                                        </button>
                                        <button
                                            onClick={() => setTab('times')}
                                            className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-colors ${tab === 'times' ? 'border-[#3667AA] text-[#3667AA]' : 'border-transparent text-gray-400'}`}
                                        >
                                            Horários
                                        </button>
                                    </div>

                                    {/* Desktop Title for Calendar */}
                                    <div className="hidden md:block px-8 pb-4 border-b border-gray-100">
                                        <h3 className="text-xl font-display font-bold text-[#1C2230]">Selecione as datas</h3>
                                    </div>

                                    {renderCalendar()}

                                    {/* Mobile Footer - Dates Tab Only */}
                                    <div className="md:hidden mt-auto">
                                        {renderFooter()}
                                    </div>
                                </div>

                                {/* RIGHT COLUMN: Times & Actions (Full on Desktop, Tabbed on Mobile) */}
                                <div className={`flex flex-col h-full md:w-[40%] bg-white ${tab === 'times' ? 'block' : 'hidden md:flex'}`}>

                                    {/* Header Tabs (Mobile Only - Duplicate for structure, but usually only one rendered) */}
                                    <div className="flex border-b border-gray-100 px-6 shrink-0 md:hidden">
                                        <button
                                            onClick={() => setTab('dates')}
                                            className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-colors ${tab === 'dates' ? 'border-[#3667AA] text-[#3667AA]' : 'border-transparent text-gray-400'}`}
                                        >
                                            Datas
                                        </button>
                                        <button
                                            onClick={() => setTab('times')}
                                            className={`flex-1 pb-4 text-sm font-bold border-b-2 transition-colors ${tab === 'times' ? 'border-[#3667AA] text-[#3667AA]' : 'border-transparent text-gray-400'}`}
                                        >
                                            Horários
                                        </button>
                                    </div>

                                    {/* Desktop Title for Times */}
                                    <div className="hidden md:block px-6 pb-4 border-b border-gray-100">
                                        <h3 className="text-xl font-display font-bold text-[#1C2230]">Horários & Resumo</h3>
                                    </div>

                                    {/* Content: Time Picker */}
                                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                                        {renderTimePicker()}
                                    </div>

                                    {/* User Action Area (Fixed Bottom) */}
                                    {renderFooter()}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};
