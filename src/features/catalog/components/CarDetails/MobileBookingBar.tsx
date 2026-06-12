import React from 'react';
import { Car } from '@/core/data/car/car.types';
import { Spinner } from '@/shared/components/ui/Spinner';

interface MobileBookingBarProps {
    car: Car;
    startDate: string;
    endDate: string;
    isBooking: boolean;
    onContinue: () => void;
    onOpenSelector?: () => void;
    isVisible?: boolean; // New prop to control visibility
    isVerificationPending?: boolean;
    onCheckVerificationStatus?: () => void;
}

export const MobileBookingBar: React.FC<MobileBookingBarProps> = ({
    car, startDate, endDate, isBooking, onContinue, onOpenSelector, isVisible = true, isVerificationPending = false, onCheckVerificationStatus
}) => {
    // If not visible, return null to unmount/hide completely
    if (!isVisible) return null;

    return (
        <div className="w-full bg-white border-t border-slate-200 px-6 py-4 flex items-center justify-between safe-area-bottom">
            <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-0.5">Total por dia</span>
                    <div className="flex items-baseline gap-1">
                        <span className="font-display font-bold text-xl text-slate-900">R$ {car.pricePerDay}</span>
                    </div>
                </div>

                <button
                    onClick={() => {
                        if (isVerificationPending && onCheckVerificationStatus) {
                            onCheckVerificationStatus();
                            return;
                        }
                        if (!startDate || !endDate) {
                            onOpenSelector?.();
                        } else {
                            onContinue();
                        }
                    }}
                    disabled={isBooking}
                    className={`px-8 py-3 rounded-full font-bold text-sm tracking-wide active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2
                        ${isVerificationPending ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer' : (!startDate || !endDate) ? 'bg-[#3667AA] text-white hover:bg-[#2B5288]' : 'bg-slate-900 text-white hover:bg-slate-800'}
                    `}
                >
                    {isBooking ? (
                        <Spinner variant="svg" size="sm" color="slate" />
                    ) : isVerificationPending ? (
                        <>
                            <span>Aguardando Aprovação</span>
                            <i className="fas fa-clock text-xs"></i>
                        </>
                    ) : (
                        <>
                            <span>{(!startDate || !endDate) ? 'Selecionar Datas' : 'Continuar'}</span>
                            <i className={(!startDate || !endDate) ? "fas fa-calendar-alt text-xs" : "fas fa-arrow-right text-xs"}></i>
                        </>
                    )}
                </button>
        </div>
    );
};
