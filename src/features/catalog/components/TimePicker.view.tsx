import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface TimePickerProps {
    pickupTime?: string;
    dropoffTime?: string;
    onPickupChange?: (time: string) => void;
    onDropoffChange?: (time: string) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({
    pickupTime = '10:00',
    dropoffTime = '10:00',
    onPickupChange,
    onDropoffChange
}) => {
    const [activeTab, setActiveTab] = useState<'pickup' | 'dropoff'>('pickup');

    // Simple grid of hours from 00:00 to 23:00
    const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

    // Helper to check if a specific time is selected in the active context
    const isSelected = (time: string) => {
        return activeTab === 'pickup' ? pickupTime === time : dropoffTime === time;
    };

    const handleTimeClick = (time: string) => {
        if (activeTab === 'pickup') {
            onPickupChange?.(time);
        } else {
            onDropoffChange?.(time);
        }
    };

    return (
        <div className="flex flex-col h-full w-full relative">
            {/* Toggle Switch (Tabs) - Wallet Style */}
            <div className="mx-5 mt-5 mb-4 bg-slate-100  p-1.5 rounded-2xl flex items-center relative gap-1 border border-slate-200/50  shadow-inner shadow-black/5">
                <button
                    onClick={() => setActiveTab('pickup')}
                    className={`relative z-10 flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'pickup'
                        ? 'text-[#1C2230] '
                        : 'text-slate-400 hover:text-slate-600  '
                        }`}
                >
                    Retirada
                </button>
                <button
                    onClick={() => setActiveTab('dropoff')}
                    className={`relative z-10 flex-1 py-2.5 text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === 'dropoff'
                        ? 'text-[#1C2230] '
                        : 'text-slate-400 hover:text-slate-600  '
                        }`}
                >
                    Devolução
                </button>

                <motion.div
                    className="absolute bg-white  shadow-[0_4px_12px_rgba(0,0,0,0.08)] rounded-xl h-[calc(100%-12px)] top-1.5"
                    initial={false}
                    animate={{
                        left: activeTab === 'pickup' ? '6px' : '50%',
                        width: 'calc(50% - 6px)' // Adjust width to account for gap/padding
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
            </div>

            {/* Time Grid Container */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: activeTab === 'pickup' ? -20 : 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: activeTab === 'pickup' ? 20 : -20 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-4 gap-3"
                    >
                        {hours.map((time) => {
                            const selected = isSelected(time);
                            return (
                                <button
                                    key={time}
                                    onClick={() => handleTimeClick(time)}
                                    className={`
                                        py-3 rounded-xl text-sm font-medium transition-all shadow-sm border
                                        ${selected
                                            ? 'bg-[#3667AA]/10 text-[#3667AA] border-[#3667AA] shadow-sm font-bold active:scale-95'
                                            : 'bg-white  text-slate-600  border-slate-200  hover:border-[#3667AA] hover:text-[#3667AA]  hover:shadow-md'
                                        }
                                    `}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Scroll Indicator - High Contrast */}
            <div className="absolute bottom-1 left-0 right-0 pointer-events-none flex justify-center z-10 md:hidden">
                <div className="bg-slate-900/10  backdrop-blur-sm text-slate-600  rounded-full p-1 animate-bounce">
                    <ChevronDown size={14} />
                </div>
            </div>
        </div>
    );
};
