import React from 'react';

interface EmptyStateProps {
    title: string;
    description: string;
    icon?: string;
    actionLabel?: string;
    onAction?: () => void;
    showArrow?: boolean;
    className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    description,
    icon = 'fa-box-open',
    actionLabel,
    onAction,
    showArrow = true,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-6 text-center border-2 border-dashed border-slate-100 rounded-3xl ${className}`}>
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <i className={`fas ${icon} text-3xl`}></i>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
                {description}
            </p>

            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-full transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center gap-2"
                >
                    {actionLabel}
                    {showArrow && <i className="fas fa-arrow-right"></i>}
                </button>
            )}
        </div>
    );
};
