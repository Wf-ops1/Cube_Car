import React, { useState } from 'react';
import { Spinner } from '@/shared/components/ui/Spinner';

interface GoogleAuthButtonProps {
    onClick: () => void;
    loading: boolean;
    disabled?: boolean;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ onClick, loading, disabled }) => {
    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            className="w-full relative py-4 px-6 rounded-2xl bg-white 
                       text-slate-700 font-bold hover:bg-slate-50 transition-all duration-300 
                       flex items-center justify-center gap-3 
                       border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300
                       active:scale-[0.99]
                       disabled:opacity-70 disabled:cursor-not-allowed group"
        >
            {loading ? (
                <Spinner size="md" color="slate" />
            ) : (
                <>
                    <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                        alt="Google"
                        className="w-5 h-5 group-hover:scale-110 transition-transform duration-300"
                    />
                    <span className="tracking-tight text-slate-600">Continuar com Google</span>
                </>
            )}
        </button>
    );
};

export default GoogleAuthButton;
