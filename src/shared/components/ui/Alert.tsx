import React from 'react';

interface AlertProps {
    type: 'error' | 'warning';
    title: string;
    children?: React.ReactNode;
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, title, children, onClose }) => {
    const isError = type === 'error';

    return (
        <div className={`relative bg-white border-l-4 rounded-r-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex items-start gap-4 animate-fade-in border ${isError ? 'border-l-red-500 border-y-gray-100 border-r-gray-100' : 'border-l-yellow-500 border-y-gray-100 border-r-gray-100'
            }`}>
            <div className={`shrink-0 w-6 h-6 rounded flex items-center justify-center mt-0.5 ${isError ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                }`}>
                <i className="fas fa-exclamation text-xs"></i>
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-bold text-[#181824] mb-0.5">
                    {title}
                </h3>
                {children && (
                    <div className="text-sm text-[#484848] leading-relaxed">
                        {children}
                    </div>
                )}
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="shrink-0 text-gray-400 hover:text-[#181824] transition-colors"
                >
                    <i className="fas fa-times"></i>
                </button>
            )}
        </div>
    );
};

export default Alert;
