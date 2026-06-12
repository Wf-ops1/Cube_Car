import React from 'react';

interface BackButtonProps {
    /** Optional custom click handler. If not provided, uses window.history.back(). */
    onClick?: () => void;
    /** Additional classes for positioning (e.g. 'absolute top-4 left-4') */
    className?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick, className = '' }) => {

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        if (onClick) {
            onClick();
        } else {
            // Fallback for when no onClick is provided
            if (window.history.length > 1) {
                window.history.back();
            } else {
                console.warn("BackButton: No onClick provided and no history to go back to.");
            }
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
                flex items-center justify-center 
                bg-white/90 backdrop-blur-md border border-slate-200/60 shadow-sm
                hover:shadow-md active:scale-95 
                text-slate-800 hover:text-slate-900 
                transition-all duration-200 ease-out font-medium group 
                rounded-full 
                w-10 h-10 
                lg:w-auto lg:h-auto lg:px-5 lg:py-2.5
                ${className}
            `}
            aria-label="Voltar"
        >
            <i className="fas fa-arrow-left text-sm group-hover:-translate-x-0.5 transition-transform duration-200"></i>
            <span className="hidden lg:inline ml-2">Voltar</span>
        </button>
    );
};
