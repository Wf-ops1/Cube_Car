import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    Search,
    ChevronDown,
} from 'lucide-react';
import { CalendarPicker } from './CalendarPicker.view';
import { TimePicker } from './TimePicker.view';

// Add correct import for User type
import { User } from '@/shared/types';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialLocation?: string;
    initialSection?: 'location' | 'dates' | 'time'; // New prop
    initialStartDate?: Date | null; // New prop
    initialEndDate?: Date | null; // New prop
    initialPickupTime?: string | null; // New prop
    initialDropoffTime?: string | null; // New prop
    onSearch: (criteria: any) => void;
    user: User | null;
}

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

const SearchModal: React.FC<SearchModalProps> = ({
    isOpen,
    onClose,
    initialLocation = '',
    initialSection = 'location', // Default to location
    initialStartDate = null,
    initialEndDate = null,
    initialPickupTime = null,
    initialDropoffTime = null,
    onSearch,
    user
}) => {
    // State
    const [activeSection, setActiveSection] = useState<'location' | 'dates' | 'time' | null>(initialSection);
    const [location, setLocation] = useState(initialLocation);

    // Separate state for Start/End dates to control the picker
    const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
    const [endDate, setEndDate] = useState<Date | null>(initialEndDate);

    // Times can be null to show "--:--" initially
    const [pickupTime, setPickupTime] = useState<string | null>(initialPickupTime);
    const [dropoffTime, setDropoffTime] = useState<string | null>(initialDropoffTime);

    // Reset state when modal opens with new initials
    useEffect(() => {
        if (isOpen) {
            setActiveSection(initialSection);
            setLocation(initialLocation);
            setStartDate(initialStartDate);
            setEndDate(initialEndDate);
            setPickupTime(initialPickupTime);
            setDropoffTime(initialDropoffTime);
        }
    }, [isOpen, initialSection, initialLocation, initialStartDate, initialEndDate, initialPickupTime, initialDropoffTime]);

    const handleSearch = () => {
        // Prevent advance if location is empty in location step
        if (activeSection === 'location' && !location.trim()) {
            return;
        }

        // UX Decision: "Next" only on Dates. Location and Time trigger Search immediately.
        if (activeSection === 'dates') {
            setActiveSection('time');
        } else {
            onSearch({ location, startDate, endDate, pickupTime, dropoffTime });
            onClose();
        }
    };

    const handleClearSection = (section: 'location' | 'dates' | 'time') => {
        if (section === 'location') setLocation('');
        if (section === 'dates') { setStartDate(null); setEndDate(null); }
        if (section === 'time') { setPickupTime(null); setDropoffTime(null); }
    };

    const formatDateFooter = (date: Date | null) => {
        if (!date) return '-';
        // Formats to "09 de jan"
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
    };

    const formatDateShort = (date: Date | null) => {
        if (!date) return '';
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');
    };

    // Body Scroll Lock to prevent background scrolling on mobile
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Position fixed is crucial for iOS to prevent rubber-banding of the background
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        // Cleanup function
        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    // Animation variants
    const modalVariants = {
        hidden: { opacity: 0, y: '100%' },
        visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
        exit: { opacity: 0, y: '100%' }
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    // Helper for Location Button State
    const isLocationEmpty = !location.trim();

    // Shared style for the "Limpar" button - Darker text and underline
    const clearButtonStyle = "text-[10px] font-bold uppercase tracking-wider text-slate-800 hover:text-black   transition-colors underline decoration-slate-400/60 underline-offset-2";

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[100]"
                        onClick={onClose}
                    />

                    {/* Modal Container */}
                    <motion.div
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="fixed inset-0 h-[100dvh] z-[101] flex flex-col bg-white  overflow-hidden font-sans"
                    >
                        {/* Floating Close Button - Minimalist */}
                        <div className="absolute top-6 right-6 z-20">
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.15)] text-slate-800 hover:scale-110 transition-all active:scale-95 active:shadow-sm"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Header Title - Aligned with ProfileHub */}
                        <div className="px-6 pt-12 pb-2 relative z-10 flex justify-between items-end">
                            <div>
                                <h1 className="text-[28px] font-bold font-display leading-tight" style={{ color: '#1C2230' }}>Sua busca</h1>
                                <p className="text-[12px] text-slate-500  font-medium">Planeje sua próxima viagem</p>
                            </div>
                        </div>

                        {/* Main Content Area */}

                        <main className="flex-1 overflow-hidden flex flex-col px-4 pb-2 gap-3 relative z-10 pt-2">

                            {/* ================= LOCATION SECTION ================= */}
                            {activeSection === 'location' ? (
                                <div className="bg-white  rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5  flex flex-col overflow-hidden relative transition-all duration-500">
                                    <div className="p-5 pb-2 flex-none bg-transparent z-10 relative">
                                        <div className="flex justify-between items-center mb-3">
                                            <h1 className="text-2xl font-display font-bold" style={{ color: '#1C2230' }}>Qual carro?</h1>
                                            {location && (
                                                <button
                                                    onClick={() => handleClearSection('location')}
                                                    className={clearButtonStyle}
                                                >
                                                    Limpar
                                                </button>
                                            )}
                                        </div>
                                        {/* Standard Input Replacement */}
                                        <div className="relative group w-full">
                                            <div className="flex bg-white  rounded-2xl overflow-hidden p-2 items-center border border-gray-200  shadow-sm">
                                                <div className="pl-3 text-gray-400">
                                                    <Search size={20} />
                                                </div>
                                                <input
                                                    type="text"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            setActiveSection('dates');
                                                        }
                                                    }}
                                                    placeholder="Cidade, marca ou modelo..."
                                                    className="flex-grow px-3 py-3 bg-transparent text-gray-800  font-medium focus:outline-none placeholder-gray-400 text-base"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pb-12"></div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setActiveSection('location')}
                                    className={`bg-transparent border-b border-slate-200/85  px-8 flex justify-between items-center cursor-pointer hover:bg-slate-50/30  transition-all flex-none duration-500 ${activeSection === 'time' ? 'py-3' : 'py-4'}`}
                                >
                                    <span className={`font-bold font-display text-slate-400/85  transition-all duration-300 ${activeSection === 'time' ? 'text-sm' : 'text-base'}`}>Qual carro?</span>
                                    <span className={`font-semibold transition-all duration-300 ${activeSection === 'time' ? 'text-xs' : 'text-sm'} !text-[#1C2230]`}>{location || 'Local ou Modelo'}</span>
                                </div>
                            )}

                            {/* ================= DATES SECTION ================= */}
                            {activeSection === 'dates' ? (
                                <div className="bg-white  rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5  flex flex-col flex-1 overflow-hidden relative transition-all duration-500">
                                    <div className="px-5 pt-5 pb-0 flex-none bg-transparent z-10 relative">
                                        <div className="flex justify-between items-center mb-3">
                                            <h1 className="text-2xl font-display font-bold" style={{ color: '#1C2230' }}>Quando?</h1>
                                            {(startDate || endDate) && (
                                                <button
                                                    onClick={() => handleClearSection('dates')}
                                                    className={clearButtonStyle}
                                                >
                                                    Limpar
                                                </button>
                                            )}
                                        </div>
                                        {/* Global Weekdays Header - Fixed Position inside the container */}
                                        <div className="grid grid-cols-7 text-center px-2 mb-2">
                                            {WEEKDAYS.map((d, idx) => (
                                                <span key={idx} className="text-[10px] font-bold text-slate-400  uppercase tracking-wider">{d}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto no-scrollbar overscroll-contain px-5 pb-0 h-full">
                                        <CalendarPicker
                                            startDate={startDate}
                                            endDate={endDate}
                                            onDatesChange={(start, end) => {
                                                setStartDate(start);
                                                setEndDate(end);
                                            }}
                                        />
                                    </div>
                                    {/* Scroll Indicator - High Contrast */}
                                    <div className="absolute bottom-1 left-0 right-0 pointer-events-none flex justify-center z-10">
                                        <div className="bg-slate-900/10  backdrop-blur-sm text-slate-600  rounded-full p-1 animate-bounce">
                                            <ChevronDown size={14} />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setActiveSection('dates')}
                                    className={`bg-transparent border-b border-slate-200/85  px-8 flex justify-between items-center cursor-pointer hover:bg-slate-50/30  transition-all flex-none duration-500 ${activeSection === 'time' ? 'py-3' : 'py-4'}`}
                                >
                                    <span className={`font-bold font-display text-slate-400/85  transition-all duration-300 ${activeSection === 'time' ? 'text-sm' : 'text-base'}`}>Quando?</span>
                                    <span
                                        className={`font-semibold transition-all duration-300 ${activeSection === 'time' ? 'text-xs' : 'text-sm'} !text-[#1C2230]`}
                                    >
                                        {startDate ? `${formatDateShort(startDate)}${endDate ? ` - ${formatDateShort(endDate)}` : ''}` : 'Adicionar datas'}
                                    </span>
                                </div>
                            )}


                            {/* ================= TIME SECTION ================= */}
                            {/* Hidden completely when dates active, pushed down otherwise */}
                            {activeSection === 'time' ? (
                                <div className="bg-white  rounded-[32px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] ring-1 ring-black/5  flex flex-col flex-1 overflow-hidden relative transition-all duration-500">
                                    <div className="px-5 pt-5 pb-0 flex-none bg-transparent z-10 relative">
                                        <div className="flex justify-between items-center mb-3">
                                            <h1 className="text-2xl font-display font-bold" style={{ color: '#1C2230' }}>Que horas?</h1>
                                            {(pickupTime || dropoffTime) && (
                                                <button
                                                    onClick={() => handleClearSection('time')}
                                                    className={clearButtonStyle}
                                                >
                                                    Limpar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-hidden px-0 pb-0 h-full flex flex-col">
                                        <TimePicker
                                            pickupTime={pickupTime || '10:00'}
                                            dropoffTime={dropoffTime || '10:00'}
                                            onPickupChange={setPickupTime}
                                            onDropoffChange={setDropoffTime}
                                        />
                                    </div>
                                </div>
                            ) : (
                                activeSection !== 'dates' && (
                                    <div
                                        onClick={() => setActiveSection('time')}
                                        className="bg-transparent border-b border-slate-200/85  px-8 flex justify-between items-center cursor-pointer hover:bg-slate-50/30  transition-all flex-none duration-500 py-4"
                                    >
                                        <span className="font-bold font-display text-slate-400/85  text-base transition-all duration-300">Que Horas?</span>
                                        <span className="font-semibold text-sm transition-all duration-300" style={{ color: '#1C2230' }}>{(pickupTime || dropoffTime) ? `${pickupTime || '--:--'} - ${dropoffTime || '--:--'}` : 'Adicionar horários'}</span>
                                    </div>
                                )
                            )}
                        </main>

                        {/* Contextual Sticky Footer */}
                        {/* Footer - Fixed Action Bar */}
                        <footer className="flex-none bg-white  px-6 py-2 flex justify-between items-center z-20 border-t border-slate-100 ">

                            {/* Smart Context Summary Group (Left Side) */}
                            <div className="flex-1 pr-4">
                                {activeSection === 'dates' ? (
                                    /* SPECIFIC DATES SUMMARY LAYOUT */
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400  uppercase tracking-wider mb-0.5">DATAS SELECIONADAS</span>
                                        {!startDate ? (
                                            <span className="text-base font-bold text-gray-400 ">Selecione o período</span>
                                        ) : (
                                            <div className="flex items-center gap-2 text-base font-bold !text-[#1C2230] ">
                                                <span>{startDate ? formatDateFooter(startDate) : '---'}</span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 "></span>
                                                <span>{endDate ? formatDateFooter(endDate) : '---'}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : activeSection === 'time' ? (
                                    /* TIME SUMMARY */
                                    /* TIME SUMMARY */
                                    <div className="flex items-center gap-2">
                                        <div className="flex flex-col data-forced-black">
                                            <span className="text-[10px] font-bold text-slate-400  uppercase tracking-wider mb-0.5">RETIRADA</span>
                                            <span className="text-base font-bold !text-[#1C2230] ">{pickupTime || '--:--'}</span>
                                        </div>
                                        <span className="text-gray-300  mx-2 pt-4">→</span>
                                        <div className="flex flex-col data-forced-black">
                                            <span className="text-[10px] font-bold text-slate-400  uppercase tracking-wider mb-0.5">DEVOLUÇÃO</span>
                                            <span className="text-base font-bold !text-[#1C2230] ">{dropoffTime || '--:--'}</span>
                                        </div>
                                    </div>
                                ) : (
                                    /* LOCATION SUMMARY / PLACEHOLDER */
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-slate-400  uppercase tracking-wider mb-0.5">VEÍCULO OU LOCAL</span>
                                        <span className="text-sm font-bold !text-[#1C2230]  truncate">
                                            {location || '---'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Action Button (Right Side) */}
                            <button
                                onClick={handleSearch}
                                disabled={activeSection === 'location' && isLocationEmpty}
                                className={`
                                    pl-5 pr-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg
                                    ${activeSection === 'location' && isLocationEmpty
                                        ? 'bg-gray-200 text-gray-400   cursor-not-allowed shadow-none'
                                        : 'bg-gradient-to-tr from-[#3667AA] to-blue-500 hover:bg-[#254575] text-white active:scale-95 shadow-md hover:shadow-lg'
                                    }
                                `}
                            >
                                {activeSection === 'location' && isLocationEmpty ? (
                                    <span>Digite local ou modelo</span>
                                ) : activeSection === 'dates' ? (
                                    <>
                                        <span>Avançar</span>
                                        <ChevronDown size={16} className="-rotate-90" />
                                    </>
                                ) : (
                                    <>
                                        <Search size={16} />
                                        <span>Buscar</span>
                                    </>
                                )}
                            </button>
                        </footer>
                    </motion.div>
                </>
            )}
        </AnimatePresence >
    );
};

export default SearchModal;
