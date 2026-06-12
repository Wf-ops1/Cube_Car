import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Car } from '@/core/data/car/car.types';
import Alert from '@/shared/components/ui/Alert';

interface BookingCardProps {
    car: Car;
    isGuest?: boolean;
    onLoginReq?: () => void;
    onContinue: (data: any) => void;
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    startTime: string;
    setStartTime: (time: string) => void;
    endTime: string;
    setEndTime: (time: string) => void;
    activeDropdown: string | null;
    setActiveDropdown: (key: string | null) => void;
    isBooking: boolean;
    bookError: string | null;
    setBookError: (error: string | null) => void;
    isDateDisabled: (date: string) => boolean;
    isTimeDisabled: (time: string, date: string) => boolean;
    totalDays: number;
    isVerificationPending?: boolean;
    onCheckVerificationStatus?: () => void;
}

import { WEEKDAYS, MONTHS, ALL_TIME_SLOTS, getDaysInMonth, getFirstDayOfMonth } from '@/features/catalog/hooks/useBookingLogic';
import { BookingCalendar } from './Shared/BookingCalendar';
import { useReputationStore } from '@/features/reputation/stores/reputation.store';

const TimeDropdown = ({
    availability,
    date,
    selectedTime,
    onSelect,
    isTimeDisabled,
    onClose
}: {
    availability: { start: string; end: string };
    date: string;
    selectedTime: string;
    onSelect: (time: string) => void;
    isTimeDisabled: (time: string, date: string) => boolean;
    onClose: () => void;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            const firstAvailable = containerRef.current.querySelector('[data-available="true"]') as HTMLElement;
            if (firstAvailable) {
                // Use scrollTop instead of scrollIntoView to prevent page jumping
                containerRef.current.scrollTop = firstAvailable.offsetTop;
            }
        }
    }, []);

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-xl z-[110] max-h-56 overflow-y-auto custom-scrollbar p-1 animate-fade-in-up"
            ref={containerRef}
        >
            {ALL_TIME_SLOTS.filter(t => t >= availability.start && t <= availability.end).map(time => {
                const isAvailable = !isTimeDisabled(time, date);
                return (
                    <button key={time}
                        disabled={!isAvailable}
                        data-available={isAvailable}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isAvailable) {
                                onSelect(time);
                                onClose();
                            }
                        }}
                        className={`w-full text-left px-4 py-3 text-sm rounded-lg border-b border-gray-50 last:border-0 transition-colors
                            ${!isAvailable ? 'text-gray-300 cursor-not-allowed bg-gray-50' : 'text-slate-600 hover:bg-slate-50'}
                            ${isAvailable && selectedTime === time ? 'bg-[#3667AA]/10 text-[#3667AA] font-bold' : ''}
                        `}
                    >
                        {time}
                    </button>
                );
            })}
        </div>
    );
};

export const DesktopBookingWidget: React.FC<BookingCardProps> = ({
    car,
    isGuest,
    onLoginReq,
    onContinue,
    startDate, setStartDate,
    endDate, setEndDate,
    startTime, setStartTime,
    endTime, setEndTime,
    activeDropdown, setActiveDropdown,
    isBooking,
    bookError, setBookError,
    isDateDisabled,
    isTimeDisabled,
    totalPrice,
    totalDays,
    isVerificationPending = false,
    onCheckVerificationStatus
}) => {
    const [viewDate, setViewDate] = useState(new Date());
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoverDate, setHoverDate] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const availability = car.availabilityHours || { start: "08:00", end: "18:00" };

    const { reviewsByCar } = useReputationStore();
    const reviewCount = reviewsByCar[car.id]?.length || 0;

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsExpanded(false);
            }
        }
        if (isExpanded) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isExpanded]);



    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(newDate);
    };

    const formatDateDisplay = (dateStr: string) => {
        if (!dateStr) return 'Data';
        const [y, m, d] = dateStr.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    };



    const handleDateClick = (dateStr: string) => {
        if (activeDropdown === 'start-time' || activeDropdown === 'end-time') {
            setActiveDropdown(null); // Close time dropdown if open
        }

        if (!startDate || (startDate && endDate)) {
            setStartDate(dateStr);
            setEndDate('');
        } else if (startDate && !endDate) {
            if (dateStr < startDate) {
                setStartDate(dateStr);
            } else {
                setEndDate(dateStr);
                // Keep expanded to show the result
            }
        }
    };

    const renderMonth = (monthOffset: number) => {
        return (
            <BookingCalendar
                viewDate={new Date(viewDate.getFullYear(), viewDate.getMonth() + monthOffset, 1)}
                startDate={startDate}
                endDate={endDate}
                onDateClick={handleDateClick}
                hoverDate={hoverDate}
                setHoverDate={setHoverDate}
                isDateDisabled={isDateDisabled}
                layout="grid"
            />
        );
    };





    const onContinueClick = () => {
        onContinue({
            car, startDate, endDate, startTime, endTime
        });
    };

    return (
        <div className="sticky top-24 bg-white rounded-[32px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.18)] transition-all duration-300 border border-gray-100 p-8 z-30 date-picker-container relative" ref={containerRef}>

            {/* Standard View Header */}
            <div className="flex justify-between items-baseline mb-6">
                <div><span className="text-2xl font-bold text-slate-900">R$ {car.pricePerDay}</span><span className="text-slate-500 text-sm"> / dia</span></div>
                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                    {reviewCount > 0 ? (
                        <>
                            <i className="fas fa-star text-[#3667AA]"></i> {car.rating || 5.0} · <span className="text-slate-500 underline font-medium">{reviewCount} avaliações</span>
                        </>
                    ) : (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3667AA]/10 text-[#3667AA] text-[10px] font-bold uppercase tracking-wider border border-[#3667AA]/20">
                            <i className="fas fa-sparkles text-[10px]"></i> Novo
                        </span>
                    )}
                </div>
            </div>

            {/* Smart Pill Trigger (Closed State) */}
            <div
                className={`border mb-6 relative z-30 bg-white cursor-pointer transition-all duration-300 group
                ${isExpanded ? 'opacity-0 pointer-events-none absolute' : 'border-gray-200 rounded-2xl hover:shadow-lg'}`}
                onClick={() => setIsExpanded(true)}
            >
                <div className="flex border-b border-gray-200">
                    <div className="flex-1 p-4 border-r border-gray-200 relative rounded-tl-2xl transition-colors group-hover:bg-gray-50/80">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">Retirada</p>
                        <p className="text-sm text-slate-600 font-medium truncate">{startDate ? formatDateDisplay(startDate) : 'Adicionar data'}</p>
                    </div>
                    <div className="flex-1 p-4 relative rounded-tr-2xl transition-colors group-hover:bg-gray-50/80">
                        <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider mb-1">Devolução</p>
                        <p className="text-sm text-slate-600 font-medium truncate">{endDate ? formatDateDisplay(endDate) : 'Adicionar data'}</p>
                    </div>
                </div>
                <div className="flex bg-gray-50/30 rounded-b-2xl">
                    <div className="flex-1 p-4 border-r border-gray-200 relative rounded-bl-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Horário</p>
                        <p className="text-xs text-slate-500">{startTime}</p>
                    </div>
                    <div className="flex-1 p-4 relative rounded-br-2xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Horário</p>
                        <p className="text-xs text-slate-500">{endTime}</p>
                    </div>
                </div>
            </div>


            {/* EXPANDED POPOVER - Breaking Container Constraints */}
            <AnimatePresence>
                {isExpanded && (<motion.div
                    onClick={() => setActiveDropdown(null)} // UX: Click anywhere in container closes time dropdown
                    initial={{ opacity: 0, scale: 0.98, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -10 }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute top-[-20px] right-[-20px] w-[750px] bg-white/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/50 z-[100] p-8"
                    style={{ maxWidth: 'none', transformOrigin: 'top right' }}
                >
                    {/* Header: 4 Inputs Grid (Bento Style) */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                        {/* Check-in Group */}
                        <div className="bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm grid grid-cols-[1.5fr_1fr] relative hover:shadow-md transition-shadow">
                            <div className="p-3 border-r border-gray-100 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Data Retirada</p>
                                <p className="text-base font-bold text-slate-900 truncate">{startDate ? formatDateDisplay(startDate) : 'Selecionar'}</p>
                            </div>
                            <div className="p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer relative" onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'start-time' ? null : 'start-time'); }}>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Hora</p>
                                <p className="text-base font-bold text-slate-900">{startTime}</p>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs"><i className="fas fa-chevron-down"></i></div>
                                {activeDropdown === 'start-time' && (
                                    <TimeDropdown
                                        availability={availability}
                                        date={startDate}
                                        selectedTime={startTime}
                                        onSelect={setStartTime}
                                        isTimeDisabled={isTimeDisabled}
                                        onClose={() => setActiveDropdown(null)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Checkout Group */}
                        <div className="bg-white rounded-2xl p-1.5 border border-gray-200 shadow-sm grid grid-cols-[1.5fr_1fr] relative hover:shadow-md transition-shadow">
                            <div className="p-3 border-r border-gray-100 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Data Devolução</p>
                                <p className="text-base font-bold text-slate-900 truncate">{endDate ? formatDateDisplay(endDate) : 'Selecionar'}</p>
                            </div>
                            <div className="p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer relative" onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === 'end-time' ? null : 'end-time'); }}>
                                <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Hora</p>
                                <p className="text-base font-bold text-slate-900">{endTime}</p>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs"><i className="fas fa-chevron-down"></i></div>
                                {activeDropdown === 'end-time' && (
                                    <TimeDropdown
                                        availability={availability}
                                        date={startDate}
                                        selectedTime={endTime}
                                        onSelect={setEndTime}
                                        isTimeDisabled={isTimeDisabled}
                                        onClose={() => setActiveDropdown(null)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Double Calendar */}
                    <div className="flex gap-8 px-2 mb-8 relative">
                        <button onClick={() => changeMonth(-1)} className="absolute left-0 top-0 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-600 hover:scale-110 hover:shadow-md transition-all z-10"><i className="fas fa-chevron-left"></i></button>
                        {renderMonth(0)}
                        <div className="w-[1px] bg-gray-100 my-4"></div>
                        {renderMonth(1)}
                        <button onClick={() => changeMonth(1)} className="absolute right-0 top-0 w-10 h-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-gray-600 hover:scale-110 hover:shadow-md transition-all z-10"><i className="fas fa-chevron-right"></i></button>
                    </div>

                    {/* Price Breakdown (Visible in Expanded) */}
                    <div className="flex justify-start items-center gap-4 py-4 border-t border-gray-100">
                        {startDate && endDate ? (
                            <div className="flex-1 flex items-center gap-4 text-sm text-slate-600">
                                <div className="bg-gray-50 px-3 py-1 rounded-lg">
                                    <span className="font-bold text-slate-900">Total: R$ {(totalPrice * 1.1).toFixed(0)}</span>
                                    <span className="text-xs ml-1">({totalDays} noites)</span>
                                </div>
                                <span className="text-xs text-slate-400">Taxas incluídas</span>
                            </div>
                        ) : (
                            <div className="flex-1 text-sm text-slate-400 font-medium">Selecione as datas para ver o total</div>
                        )}

                        <div className="flex gap-3">
                            <button onClick={() => { setStartDate(''); setEndDate(''); }} className="px-4 py-2 text-sm font-bold underline text-slate-600 hover:text-slate-900 transition-colors">Limpar</button>
                            <button onClick={() => setIsExpanded(false)} className="px-8 py-3 rounded-full font-bold text-sm bg-gradient-to-r from-[#3667AA] to-[#4A7AC2] text-white hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#3667AA]/20">Concluir</button>
                        </div>
                    </div>
                </motion.div>
                )}
            </AnimatePresence>

            {/* ERROR ALERT */}
            <AnimatePresence>
                {bookError && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-4 overflow-hidden relative z-20">
                        <Alert type="error" title="Atenção" onClose={() => setBookError(null)}>{bookError}</Alert>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MAIN ACTION BUTTON */}
            <button
                onClick={() => {
                    if (isVerificationPending && onCheckVerificationStatus) {
                        onCheckVerificationStatus();
                        return;
                    }
                    onContinueClick();
                }}
                disabled={(!startDate || !endDate || isBooking) && !isVerificationPending}
                className={`w-full py-4 rounded-2xl text-lg font-bold shadow-xl transition-all active:scale-[0.98] flex justify-center items-center gap-2 relative z-20
                ${isVerificationPending ? 'bg-amber-100 text-amber-700 hover:brightness-95 cursor-pointer' : 'bg-gradient-to-r from-[#3667AA] to-[#4A7AC2] text-white hover:brightness-110 shadow-xl shadow-[#3667AA]/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed'} `}
            >
                {isBooking ? 'Processando...' : isVerificationPending ? (
                    <>
                        Aguardando Aprovação <i className="fas fa-clock text-sm"></i>
                    </>
                ) : 'Reservar'}
            </button>

            {!startDate && <p className="text-center text-xs text-slate-400 mt-4 relative z-20">Você não será cobrado ainda.</p>}

            {/* Price Feedback Zone (Visible when NOT expanded or simply below) */}
            {
                startDate && endDate && !isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in space-y-2 relative z-20">
                        <div className="flex justify-between text-slate-600">
                            <span className="underline">R$ {car.pricePerDay} x {totalDays} noites</span>
                            <span>R$ {totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-slate-600">
                            <span className="underline">Taxa de serviço (10%)</span>
                            <span>R$ {(totalPrice * 0.1).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-slate-900 font-bold text-lg pt-2 border-t border-gray-100 mt-2">
                            <span>Total</span>
                            <span>R$ {(totalPrice * 1.1).toFixed(0)}</span>
                        </div>
                    </div>
                )
            }
        </div >
    );
};
