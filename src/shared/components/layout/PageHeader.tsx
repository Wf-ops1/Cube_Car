import React from 'react';
import { BackButton } from '@/core/components/buttons/BackButton';

interface PageHeaderProps {
    title: string;
    badgeText?: string;
    badgeIcon?: string;
    onBack: () => void;
    className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    badgeText,
    badgeIcon,
    onBack,
    className = ''
}) => {
    return (
        <div className={`relative z-20 px-4 md:px-8 py-8 lg:py-16 max-w-7xl mx-auto w-full mb-8 ${className}`}>
            <div className="flex items-center justify-between">
                <BackButton onClick={onBack} className="relative z-50" />

                {(badgeText || badgeIcon) && (
                    <div className="flex flex-col items-end gap-1.5">
                        <div className="inline-flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-[#1C2230] transition-all duration-300">
                            {badgeIcon && <i className={`fas ${badgeIcon} text-[#3667AA] text-xs`} style={{ color: '#3667AA' }}></i>}
                            {badgeText && <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1C2230]" style={{ color: '#1C2230' }}>{badgeText}</span>}
                        </div>
                        {/* Optional Title can be added here if needed for mobile, or kept in the main body */}
                    </div>
                )}
            </div>
        </div>
    );
};
