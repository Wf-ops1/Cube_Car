import React, { useState } from 'react';

interface CalendarPickerProps {
    startDate?: Date | null;
    endDate?: Date | null;
    onDatesChange?: (start: Date | null, end: Date | null) => void;
}

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

export const CalendarPicker: React.FC<CalendarPickerProps> = ({ startDate, endDate, onDatesChange }) => {
    // Internal state only for hover visual feedback
    const [hoverDate, setHoverDate] = useState<Date | null>(null);

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const isDateSelected = (date: Date) => {
        if (startDate && date.getTime() === startDate.getTime()) return true;
        if (endDate && date.getTime() === endDate.getTime()) return true;
        return false;
    };

    const isInRange = (date: Date) => {
        if (startDate && endDate) {
            return date > startDate && date < endDate;
        }
        if (startDate && hoverDate) {
            return (date > startDate && date < hoverDate) || (date < startDate && date > hoverDate);
        }
        return false;
    };

    const handleDateClick = (date: Date) => {
        if (date < new Date(new Date().setHours(0, 0, 0, 0))) return;

        if (!startDate || (startDate && endDate)) {
            // Start new range
            onDatesChange?.(date, null);
        } else {
            // Complete range
            if (date < startDate) {
                onDatesChange?.(date, startDate);
            } else {
                onDatesChange?.(startDate, date);
            }
        }
    };

    // State for Desktop Navigation
    const [desktopOffset, setDesktopOffset] = useState(0);

    const handlePrevMonth = () => {
        if (desktopOffset > 0) setDesktopOffset(prev => prev - 1);
    };

    const handleNextMonth = () => {
        // Limit to 10 so we don't show empty months at the end (12 months total)
        if (desktopOffset < 11) setDesktopOffset(prev => prev + 1);
    };

    // Helper to render a specific range of months
    const renderMonthRange = (startOffset: number, count: number) => {
        const today = new Date();
        const months = [];

        for (let i = 0; i < count; i++) {
            const offset = startOffset + i;
            // Prevent rendering beyond 12 months
            if (offset >= 12) break;

            const monthDate = new Date(today.getFullYear(), today.getMonth() + offset, 1);
            const year = monthDate.getFullYear();
            const month = monthDate.getMonth();
            const daysInMonth = getDaysInMonth(year, month);
            const firstDay = getFirstDayOfMonth(year, month);
            const days = [];

            // Empty slots for previous month
            for (let j = 0; j < firstDay; j++) {
                days.push(<div key={`empty-${year}-${month}-${j}`} className="w-full h-10" />);
            }

            // Days
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month, day);
                const isSelected = isDateSelected(date);
                const inRange = isInRange(date);
                const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                days.push(
                    <div className="relative w-full aspect-square flex items-center justify-center py-1" key={`${year}-${month}-${day}`}>
                        {/* Range Background Visuals */}
                        {inRange && !isSelected && (
                            <div className={`absolute inset-y-1 inset-x-0 bg-[#3667AA]/10  ${startDate && date.getTime() === startDate.getTime() ? 'rounded-l-full' : ''} ${endDate && date.getTime() === endDate.getTime() ? 'rounded-r-full' : ''}`} />
                        )}
                        {isSelected && startDate && endDate && date.getTime() === startDate.getTime() && (
                            <div className="absolute top-1 bottom-1 right-0 w-1/2 bg-[#3667AA]/10 " />
                        )}
                        {isSelected && endDate && startDate && date.getTime() === endDate.getTime() && (
                            <div className="absolute top-1 bottom-1 left-0 w-1/2 bg-[#3667AA]/10 " />
                        )}

                        <button
                            onMouseEnter={() => setHoverDate(date)}
                            onClick={() => handleDateClick(date)}
                            disabled={isPast}
                            className={`
                                relative z-10 w-10 h-10 flex items-center justify-center text-sm font-medium rounded-full transition-all duration-100
                                ${isPast
                                    ? 'text-mercury-300  cursor-not-allowed decoration-mercury-300 line-through decoration-1'
                                    : 'cursor-pointer active:scale-90'
                                }
                                ${!isPast && !isSelected && !inRange ? 'text-mercury-700  hover:bg-mercury-100 ' : ''}
                                ${inRange && !isSelected ? 'text-[#3667AA]  font-semibold' : ''}
                                ${isSelected ? 'bg-[#3667AA] text-white shadow-md shadow-blue-900/20 scale-100 font-bold' : ''}
                            `}
                        >
                            {day}
                        </button>
                    </div>
                );
            }

            // FORCE 6 ROWS (42 slots) to prevent height jumping
            const totalSlots = 42;
            const currentSlots = days.length;
            for (let k = currentSlots; k < totalSlots; k++) {
                days.push(<div key={`empty-end-${year}-${month}-${k}`} className="w-full h-10" />);
            }

            const monthName = MONTHS[month];
            const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

            months.push(
                <div key={`${year}-${month}`} className="flex flex-col relative">
                    {/* Month Header */}
                    <div className="pt-6 pb-4 px-2">
                        <div className="flex items-baseline justify-between md:justify-center md:-translate-y-4">
                            <span className="text-lg font-display font-bold text-mercury-900  capitalize">
                                {capitalizedMonth} <span className="text-mercury-400  font-medium text-sm ml-1">{year}</span>
                            </span>
                        </div>
                    </div>

                    {/* Weekdays Header */}
                    <div className="grid grid-cols-7 mb-2 px-2">
                        {WEEKDAYS.map((day, idx) => (
                            <span key={idx} className="text-[11px] font-bold text-mercury-400  uppercase text-center block">
                                {day}
                            </span>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-y-1 px-2 pb-4">
                        {days}
                    </div>

                    {/* Visual Divider - Mobile Only */}
                    <div className="mx-6 h-px bg-gradient-to-r from-transparent via-mercury-200  to-transparent md:hidden"></div>
                </div>
            );
        }
        return months;
    };

    return (
        <div className="w-full bg-transparent pb-10 relative">

            {/* MOBILE VIEW: Vertical Scroll (All 12 months) */}
            <div className="flex flex-col md:hidden">
                {renderMonthRange(0, 12)}
            </div>

            {/* DESKTOP VIEW: Side-by-Side with Arrows (2 months) */}
            <div className="hidden md:block relative">
                {/* Navigation Arrows */}
                <button
                    onClick={handlePrevMonth}
                    disabled={desktopOffset === 0}
                    className={`absolute top-6 left-0 z-20 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors ${desktopOffset === 0 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <i className="fas fa-chevron-left text-slate-600"></i>
                </button>

                <button
                    onClick={handleNextMonth}
                    disabled={desktopOffset >= 10} // Can't go past the last pair
                    className={`absolute top-6 right-0 z-20 w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors ${desktopOffset >= 10 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    <i className="fas fa-chevron-right text-slate-600"></i>
                </button>

                {/* Grid Container */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-0">
                    {renderMonthRange(desktopOffset, 2)}
                </div>
            </div>
        </div>
    );
};
