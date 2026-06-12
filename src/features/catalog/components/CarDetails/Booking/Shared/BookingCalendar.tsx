import React, { useState } from 'react';
import { MONTHS, WEEKDAYS, getDaysInMonth, getFirstDayOfMonth } from '@/features/catalog/hooks/useBookingLogic';

interface BookingCalendarProps {
    viewDate?: Date;
    onViewDateChange?: (date: Date) => void;
    startDate: string;
    endDate: string;
    onDateClick: (dateStr: string) => void;
    hoverDate?: string | null;
    setHoverDate?: (date: string | null) => void;
    isDateDisabled: (date: string) => boolean;
    monthsToShow?: number; // 1 for desktop, 12 for mobile list
    layout?: 'grid' | 'list'; // grid for desktop, list for mobile
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
    viewDate = new Date(),
    onViewDateChange,
    startDate,
    endDate,
    onDateClick,
    hoverDate,
    setHoverDate,
    isDateDisabled,
    monthsToShow = 1,
    layout = 'grid'
}) => {

    const renderMonth = (monthOffset: number, index: number) => {
        const targetDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + monthOffset, 1);
        const daysInMonth = getDaysInMonth(targetDate);
        const firstDay = getFirstDayOfMonth(targetDate);
        const days = [];

        // Empty slots for start of month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${monthOffset}-${i}`} className="h-10 w-full"></div>);
        }

        // Days
        for (let d = 1; d <= daysInMonth; d++) {
            const currentDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), d);
            const currentStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

            const isStartDate = startDate === currentStr;
            const isEndDate = endDate === currentStr;
            const isInRange = startDate && endDate && currentStr > startDate && currentStr < endDate;
            const isHoverRange = startDate && !endDate && hoverDate && currentStr > startDate && currentStr <= hoverDate;

            const showRangeBg = isInRange || isHoverRange || (isStartDate && (endDate || hoverDate)) || (isEndDate && startDate);
            const isToday = new Date().toDateString() === currentDate.toDateString();
            const isPast = isDateDisabled(currentStr);

            days.push(
                <div key={`${targetDate.getMonth()}-${d}`} className={`relative w-full h-10 flex items-center justify-center 
                    ${showRangeBg && !isStartDate && !isEndDate ? 'bg-[#3667AA]/10' : ''} 
                    ${showRangeBg && isStartDate ? 'bg-gradient-to-r from-transparent to-[#3667AA]/10' : ''} 
                    ${showRangeBg && isEndDate ? 'bg-gradient-to-l from-transparent to-[#3667AA]/10' : ''} 
                    ${(isStartDate && (endDate || hoverDate)) || (isStartDate && layout === 'list' && endDate) ? 'rounded-l-full' : ''} 
                    ${(isEndDate || (hoverDate === currentStr && !endDate)) && startDate ? 'rounded-r-full' : ''}`}>
                    <button
                        disabled={isPast}
                        onClick={(e) => { e.stopPropagation(); if (!isPast) onDateClick(currentStr); }}
                        onMouseEnter={() => !isPast && setHoverDate && setHoverDate(currentStr)}
                        className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all
                        ${isPast ? 'text-gray-300 cursor-not-allowed decoration-slate-300' : ''}
                        ${(isStartDate || isEndDate) ? 'bg-[#3667AA] text-white shadow-md transform scale-105' : (!isPast ? 'text-[#484848] hover:bg-gray-100 hover:scale-105' : '')}
                        ${isToday && !isStartDate && !isEndDate ? 'border border-[#3667AA] text-[#3667AA]' : ''}
                    `}>
                        {d}
                    </button>
                </div>
            );
        }

        return (
            <div key={`${targetDate.getFullYear()}-${targetDate.getMonth()}`} className={layout === 'list' ? "mb-8" : "px-2"}>
                <div className={`font-bold text-slate-800 capitalize ${layout === 'list' ? 'text-lg mb-4 pl-2 text-left' : 'text-center mb-6'}`}>
                    {MONTHS[targetDate.getMonth()]} {targetDate.getFullYear()}
                </div>
                {layout === 'list' ? (
                    // Mobile List Calendar - No headers here, they are sticky outside
                    <div className="grid grid-cols-7 gap-y-2">{days}</div>
                ) : (
                    // Desktop Grid Calendar - Headers included
                    <>
                        <div className="grid grid-cols-7 mb-2">
                            {WEEKDAYS.map(day => (<div key={day} className="text-center text-[10px] uppercase font-bold text-gray-400 tracking-wide">{day}</div>))}
                        </div>
                        <div className="grid grid-cols-7 gap-y-1">{days}</div>
                    </>
                )}
            </div>
        );
    };

    if (layout === 'list') {
        // Render simple list of months (for mobile)
        return (
            <>
                {Array.from({ length: monthsToShow }).map((_, i) => renderMonth(i, i))}
            </>
        );
    }

    // Default Grid Layout (Desktop)
    return (
        <div className="flex-1">
            {renderMonth(0, 0)}
        </div>
    );
};
