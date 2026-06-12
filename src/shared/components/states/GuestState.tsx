import React from 'react';
import { LucideIcon } from 'lucide-react';

interface GuestStateProps {
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: LucideIcon;
    className?: string;
}

/**
 * GuestState Component - "Air Mode"
 * Maximum lightness: No icon container, pure floating elements, organic shapes.
 */
export const GuestState: React.FC<GuestStateProps> = ({
    title,
    description,
    actionLabel = 'Entrar',
    onAction,
    icon: Icon,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center p-6 w-full max-w-sm mx-auto relative z-10 animate-in fade-in zoom-in-95 duration-500 ${className}`}>

            {/* Immersive Background Glow - Even softer */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none -z-10"></div>

            {/* IDENTITY SECTION - Freestanding Icon */}
            {Icon && (
                <div className="mb-6 relative">
                    <div className="absolute inset-0 bg-blue-400/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Icon strokeWidth={1.2} className="w-12 h-12 text-[#3667AA] drop-shadow-sm relative z-10" />
                </div>
            )}

            {/* Kicker Label */}
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#3667AA] mb-5 block opacity-80">
                {title}
            </span>

            {/* MAIN COPY */}
            <h3 className="text-xl font-display font-light text-slate-600 leading-relaxed text-center mb-12 max-w-[260px]">
                {description}
            </h3>

            {/* ACTION BUTTON - Organic Pill Shape */}
            {onAction && (
                <button
                    onClick={onAction}
                    className="w-full py-4 bg-gradient-to-tr from-[#3667AA] to-blue-500 hover:brightness-110 text-white text-sm font-medium tracking-wide rounded-full transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 group"
                >
                    <span>{actionLabel}</span>
                    <i className="fas fa-arrow-right text-[10px] opacity-70 group-hover:translate-x-1 transition-transform"></i>
                </button>
            )}
        </div>
    );
};
