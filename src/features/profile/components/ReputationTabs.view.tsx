import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

export type ReputationTabType = 'host' | 'guest';

interface ReputationTabsProps {
    activeTab: ReputationTabType;
    onTabChange: (tab: ReputationTabType) => void;
    hostRating?: number;
    guestRating?: number;
    hostReviewCount?: number;
    guestReviewCount?: number;
    className?: string;
}

const ReputationTabs: React.FC<ReputationTabsProps> = ({
    activeTab,
    onTabChange,
    hostRating = 0,
    guestRating = 0,
    hostReviewCount = 0,
    guestReviewCount = 0,
    className = ''
}) => {

    const tabs = [
        { id: 'host', label: 'Como Host', rating: hostRating, count: hostReviewCount },
        { id: 'guest', label: 'Como Motorista', rating: guestRating, count: guestReviewCount },
    ];

    return (
        <div className={`flex p-1 bg-slate-100/80 rounded-2xl relative z-0 ${className}`}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id as ReputationTabType)}
                        className={`flex-1 relative flex flex-col items-center justify-center py-2.5 px-2 min-h-[68px] transition-colors z-10 ${isActive ? 'text-[#3667AA]' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="reputation-tab-highlighter"
                                className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/60"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}

                        <span className="relative z-20 font-bold text-[12px] sm:text-[13px] mb-1 whitespace-nowrap truncate w-full px-1">{tab.label}</span>

                        <div className="relative z-20 flex items-center justify-center gap-1.5 opacity-90">
                            <div className="flex items-center gap-0.5">
                                <Star size={12} fill="currentColor" strokeWidth={0} />
                                <span className="text-[12px] font-bold">{tab.rating.toFixed(2)}</span>
                            </div>
                            <span className="text-[11px] opacity-60 font-medium">({tab.count})</span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default ReputationTabs;
