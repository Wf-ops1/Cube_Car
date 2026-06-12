import React from 'react';

interface ErrorStateProps {
    message: string;
    title?: string;
    retryAction?: () => void;
    className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
    message,
    title = 'Algo deu errado',
    retryAction,
    className = ''
}) => {
    return (
        <div className={`flex flex-col items-center justify-center p-6 text-center bg-red-50/50 rounded-2xl border border-red-100 ${className}`}>
            <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-3">
                <i className="fas fa-exclamation-triangle"></i>
            </div>
            <h4 className="text-slate-800 font-bold mb-1">{title}</h4>
            <p className="text-sm text-slate-500 mb-4 max-w-sm">{message}</p>

            {retryAction && (
                <button
                    onClick={retryAction}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-full hover:bg-red-50 transition-colors text-sm font-medium shadow-sm hover:shadow"
                >
                    <i className="fas fa-redo-alt"></i>
                    Tentar Novamente
                </button>
            )}
        </div>
    );
};
