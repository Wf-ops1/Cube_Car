import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPicker } from './CalendarPicker.view';
import { TimePicker } from './TimePicker.view';
import { Car } from '@/core/data/car/car.types';

export interface HeroSearchProps {
    onClick?: (section?: 'location' | 'dates' | 'time') => void;
    onSearch?: (params: { location: string }) => void;
    onModalOpen?: () => void; // NEW: Trigger for mobile modal
    location?: string;
    dateRange?: string;
    time?: string;
    cars?: Car[]; // NEW: Data for dynamic suggestions
}

const HeroSearch: React.FC<HeroSearchProps> = ({
    onClick,
    onSearch,
    onModalOpen,
    location,
    dateRange,
    time,
    cars = [] // Default to empty array
}) => {
    const timeOptions = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    // Internal defaults handling - only for dates/time
    // Location should be empty if not provided to show placeholder
    const displayDateRange = dateRange || "Quando?";
    const displayTime = time || "Horário?";

    // 1. Internal State for Inline Expansion
    const [activeField, setActiveField] = React.useState<'location' | 'dates' | 'time' | null>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [pickupTime, setPickupTime] = React.useState('10:00');
    const [dropoffTime, setDropoffTime] = React.useState('10:00');
    const inputRef = useRef<HTMLInputElement>(null);

    // Date State
    const [dateState, setDateState] = React.useState<{ startDate: Date | undefined; endDate: Date | undefined }>({
        startDate: undefined,
        endDate: undefined
    });

    // Dynamic Search Logic
    const suggestions = React.useMemo(() => {
        if (!inputValue || inputValue.length < 2) return [];

        const lowerInput = inputValue.toLowerCase();

        // Filter by City/Location
        const locationMatches = Array.from(new Set(
            cars
                .filter(c => c.location.toLowerCase().includes(lowerInput))
                .map(c => c.location)
        )).map(loc => ({ type: 'location' as const, value: loc }));

        // Filter by Car Make/Model
        const carMatches = cars
            .filter(c =>
                c.make.toLowerCase().includes(lowerInput) ||
                c.model.toLowerCase().includes(lowerInput)
            )
            .map(c => ({
                type: 'car' as const,
                value: `${c.make} ${c.model}`,
                id: c.id,
                image: c.imageUrl,
                location: c.location
            }))
            .slice(0, 3); // Limit to top 3 cars

        return [...locationMatches, ...carMatches];
    }, [inputValue, cars]);

    // Sync prop location to local state
    React.useEffect(() => {
        if (location) {
            setInputValue(location);
        } else {
            setInputValue('');
        }
    }, [location]);

    // 2. Real-time Search Trigger (Debounced for Text)
    React.useEffect(() => {
        const timer = setTimeout(() => {
            if (onSearch) {
                // Construct the full search object based on current local state
                onSearch({
                    location: inputValue,
                    startDate: dateState.startDate,
                    endDate: dateState.endDate,
                    pickupTime: pickupTime,
                    dropoffTime: dropoffTime
                });
            }
        }, 400); // 400ms Debounce

        return () => clearTimeout(timer);
    }, [inputValue, dateState, pickupTime, dropoffTime, onSearch]);

    const handleSearchClick = (overrideLocation?: string) => {
        // Immediate trigger (bypasses debounce)
        if (onSearch) {
            onSearch({
                location: overrideLocation || inputValue,
                startDate: dateState.startDate,
                endDate: dateState.endDate,
                pickupTime: pickupTime,
                dropoffTime: dropoffTime
            });
        }
        setActiveField(null);
    };

    const handleSuggestionClick = (suggestion: typeof suggestions[0]) => {
        if (suggestion.type === 'location') {
            setInputValue(suggestion.value);
            // Optionally focus next field or just search
            // For now, let's keep it simple and just fill the field
            // setActiveField('dates'); 
        } else {
            // If clicking a car, maybe we want to search for that car's location or name?
            // "os carros relacionados a palavra chave deve aparecer" -> User probably wants to go to that car
            // But this is just a Search component. Let's start by filling the query with the location of that car?
            // Or maybe users search for "BMW".
            setInputValue(suggestion.value);
            // If it's a specific car selection, we might want to navigate directly (if we had access to navigateTo)
            // Since we only have onSearch, let's pass the text.
            handleSearchClick(suggestion.value); // Trigger search immediately
            return;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearchClick();
        }
    };

    // Close on click outside (Simplified for now, ideally use a hook)
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as Element).closest('.hero-search-container')) {
                setActiveField(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleField = (field: 'location' | 'dates' | 'time') => {
        setActiveField(prev => prev === field ? null : field);
        // Optional: Notify parent if needed, but primary logic is now internal
    };

    return (
        <motion.div
            className="hero-search-container w-full max-w-[90vw] md:max-w-none mx-auto relative z-50"
        >
            <div className={`
                rounded-full relative
                ${activeField
                    ? 'bg-gray-200 shadow-md border border-gray-300'
                    : 'bg-white border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:bg-slate-50'}
            `}>

                {/* MOBILE LAYOUT - Opens Modal */}
                <div className="md:hidden flex items-center justify-between pl-6 pr-2 py-2 cursor-pointer group" onClick={() => onModalOpen?.()}>
                    <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-slate-800 leading-tight">Qual carro você procura?</span>
                        <span className="text-[11px] font-medium text-slate-400">Busque por local ou modelo</span>
                    </div>
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 rounded-full bg-[#3667AA] flex items-center justify-center text-white shadow-md hover:bg-[#2B5288] transition-colors"
                    >
                        <i className="fas fa-search text-sm"></i>
                    </motion.div>
                </div>

                {/* DESKTOP LAYOUT */}
                <div className="hidden md:flex items-stretch relative z-20 h-[66px] w-full">

                    {/* 1. Location Field */}
                    <div
                        // onClick focuses input programmatically to avoid dead zones
                        onClick={() => {
                            setActiveField('location');
                            inputRef.current?.focus();
                        }}
                        className={`relative flex items-center px-6 rounded-full cursor-pointer
                            ${activeField === 'location' ? 'bg-white shadow-md border border-slate-200 scale-[1.02]' : 'hover:bg-slate-50/50'}
                        `}
                        style={{ flex: 5 }}
                    >
                        <div className="flex flex-col justify-center items-center py-2 min-w-0 flex-1">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 leading-none">Local ou Veículo</span>
                            <div className="relative w-full">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Cidade, marca ou modelo..."
                                    onFocus={() => setActiveField('location')}
                                    // Removed onBlur to allow clicking suggestions
                                    className="text-[16px] font-bold text-[#181824] placeholder-slate-400 bg-transparent border-none outline-none p-0 w-full truncate leading-snug text-center"
                                />
                                {/* Suggestions Dropdown */}
                                <AnimatePresence>
                                    {activeField === 'location' && inputValue.length >= 2 && suggestions.length > 0 && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 5 }}
                                            className="absolute top-[160%] left-0 w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 z-50"
                                        >
                                            <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sugestões</div>
                                            {suggestions.map((item, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleSuggestionClick(item);
                                                    }}
                                                    className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                                                >
                                                    {item.type === 'location' ? (
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                                                            <i className="fas fa-map-marker-alt text-xs"></i>
                                                        </div>
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-white overflow-hidden shrink-0">
                                                            {item.image ? (
                                                                <img src={item.image} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <i className="fas fa-car text-slate-400 text-xs"></i>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex flex-col text-left">
                                                        <span className="text-sm font-semibold text-slate-700">{item.value}</span>
                                                        {item.type === 'car' && (
                                                            <span className="text-[11px] text-slate-400">{item.location}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Divider - Subtle */}
                    <div className={`w-px self-center h-8 bg-slate-200/50 mx-1 transition-opacity ${activeField ? 'opacity-0' : 'opacity-100'}`}></div>

                    {/* 2. Dates Field */}
                    <div
                        onClick={() => toggleField('dates')}
                        className={`relative flex items-center px-6 rounded-full cursor-pointer
                            ${activeField === 'dates' ? 'bg-white shadow-md border border-slate-200 scale-[1.02]' : 'hover:bg-slate-50/50'}
                        `}
                        style={{ flex: 3.5 }}
                    >
                        <div className="flex flex-col justify-center items-center py-2 min-w-0 flex-1">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 leading-none">Datas</span>
                            <span className="text-[16px] font-bold text-[#181824] truncate leading-snug">{displayDateRange}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className={`w-px self-center h-8 bg-slate-200/50 mx-1 transition-opacity ${activeField ? 'opacity-0' : 'opacity-100'}`}></div>

                    {/* 3. Time Field + Search Button Unified */}
                    <div
                        onClick={() => toggleField('time')}
                        className={`relative flex items-center pl-6 pr-2 rounded-full cursor-pointer
                            ${activeField === 'time' ? 'bg-white shadow-md border border-slate-200 scale-[1.02]' : 'hover:bg-slate-50/50'}
                        `}
                        style={{ flex: 1.5 }}
                    >
                        <div className="flex flex-col justify-center items-center py-2 min-w-0 flex-1">
                            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-0.5 leading-none">Hora</span>
                            <span className="text-[16px] font-bold text-[#181824] truncate leading-snug">
                                {pickupTime} - {dropoffTime}
                            </span>
                        </div>

                        {/* Search Button - Inside Time Field */}
                        <div className="pl-2 h-full flex items-center shrink-0">
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSearchClick();
                                }}
                                className="w-[48px] h-[48px] rounded-full bg-[#3667AA] flex items-center justify-center text-white hover:bg-[#2B5288] active:scale-95 cursor-pointer shadow-md transition-colors"
                            >
                                <i className="fas fa-search text-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* === INLINE POPOVERS (The "Brain") === */}
                <AnimatePresence>
                    {/* Location Popover REMOVED */}{/*
                    {activeField === 'location' && (
                       // ... Popover code removed ...
                    )}
                    */}

                    {activeField === 'dates' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-[120%] left-0 w-full bg-white rounded-[32px] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border-2 border-slate-100/50 overflow-hidden p-8 z-50 ring-1 ring-black/5"
                        >
                            <CalendarPicker
                                startDate={dateState.startDate}
                                endDate={dateState.endDate}
                                onDatesChange={(start, end) => {
                                    setDateState({ startDate: start || undefined, endDate: end || undefined });
                                }}
                            />
                        </motion.div>
                    )}

                    {activeField === 'time' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-[120%] right-0 w-full md:w-[450px] bg-white rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-slate-100 p-6 z-50 ring-1 ring-black/5"
                        >
                            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Horários</h3>
                            <TimePicker
                                pickupTime={pickupTime}
                                dropoffTime={dropoffTime}
                                onPickupChange={setPickupTime}
                                onDropoffChange={setDropoffTime}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    );
};

export default HeroSearch;
