import React from 'react';
import { Spinner } from '@/shared/components/ui/Spinner';

interface MobileFooterProps {
    mobileStep: number;
    totalSteps: number;
    buttonText: string;
    onButtonClick: () => void;
    isProcessing: boolean;
}

export const MobileFooter: React.FC<MobileFooterProps> = ({ 
    mobileStep, 
    totalSteps,
    buttonText,
    onButtonClick,
    isProcessing
}) => {
    if (mobileStep === 3) return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 pt-2 pb-2 z-50 safe-area-bottom shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
            <div className="flex gap-2 mb-2 px-1">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                    <div key={step} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step <= mobileStep ? 'bg-[#3667AA]' : 'bg-gray-200'}`}></div>
                ))}
            </div>
            <button
                onClick={onButtonClick}
                disabled={isProcessing || buttonText === 'Aguardando Análise'}
                className={`w-full font-bold py-2.5 rounded-xl text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 
                    ${buttonText === 'Aguardando Análise' ? 'bg-amber-100 text-amber-700 opacity-80' : 'bg-gradient-to-tr from-[#3667AA] to-blue-500 text-white shadow-blue-900/20 hover:brightness-110'}
                `}
            >
                {isProcessing && mobileStep === 3 ? (
                    <div className="flex items-center gap-3"><Spinner variant="svg" size="sm" color="white" /><span>Processando...</span></div>
                ) : (
                    buttonText
                )}
            </button>
        </div>
    );
};
