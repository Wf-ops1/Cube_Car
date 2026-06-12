import React from 'react';
import { Spinner } from '../ui/Spinner';

interface LoadingStateProps {
    type?: 'spinner' | 'skeleton'; // Skeleton support can be added later or simulated
    text?: string;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
    type = 'spinner',
    text,
    className = '',
    size = 'md'
}) => {
    return (
        <div className={`flex flex-col items-center justify-center p-4 text-slate-500 ${className}`}>
            <Spinner size={size as any} color="slate" className="mb-3" />
            {text && <p className="animate-pulse font-medium">{text}</p>}
        </div>
    );
};
