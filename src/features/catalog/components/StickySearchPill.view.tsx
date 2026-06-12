import React from 'react';
import { motion } from 'framer-motion';

interface StickySearchPillProps {
    dateRange?: string; // e.g., "12 - 15 Dez"
    location?: string; // e.g., "Miami, FL"
    onClick: () => void;
    className?: string;
    isVisible: boolean;
}

const StickySearchPill: React.FC<StickySearchPillProps> = ({
    dateRange = "Qualquer data",
    location,
    onClick,
    className = "",
    isVisible
}) => {
    const displayLocation = location || "Qualquer lugar";

    return (
        <motion.div
            layoutId="search-bar"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={onClick}
            className={`fixed top-[1.125rem] left-0 right-0 z-[80] flex justify-center pointer-events-none ${className}`}
        >
            <div className="pointer-events-auto bg-white/80 backdrop-blur-md border border-white/60 shadow-glass-sm rounded-full px-3 py-1.5 md:px-4 md:py-2 flex items-center gap-2 md:gap-4 cursor-pointer hover:bg-white transition-all group w-auto max-w-[95%] md:max-w-md mx-auto">

                {/* Search Icon Circle (Smaller on Mobile) */}
                <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-[#3667AA] to-blue-500 flex items-center justify-center text-white shadow-glow-sm group-hover:scale-105 transition-transform shrink-0">
                    <i className="fas fa-location-arrow text-[10px] md:text-xs"></i>
                </div>

                {/* Content Divider */}
                <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                    <div className="flex flex-col min-w-0">
                        <span className="block text-[10px] font-bold text-[#6F7684] uppercase leading-none mb-0.5">Localização</span>
                        <span className="text-xs md:text-sm font-semibold text-[#1C2230] truncate text-left">{displayLocation}</span>
                    </div>

                    <div className="block w-px h-6 bg-gray-200"></div>

                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-[#6F7684] uppercase leading-none mb-0.5">Datas</span>
                        <span className="text-xs font-semibold text-[#1C2230] whitespace-nowrap">{dateRange}</span>
                    </div>
                </div>

                {/* Filter Icon */}
                <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-[#6F7684] group-hover:text-[#3667AA] transition-colors ml-2">
                    <i className="fas fa-sliders-h text-xs"></i>
                </div>
            </div>
        </motion.div>
    );
};

export default StickySearchPill;
