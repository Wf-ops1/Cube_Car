import React from 'react';
import { Car } from '@/core/data/car/car.types';

interface BookingSummaryCardProps {
    car: Car;
    booking: {
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
    };
    daysDiff: number;
    rentalCost: number;
    serviceFee: number;
    total: number;
    onEditDates: () => void;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
    car, booking, daysDiff, rentalCost, serviceFee, total, onEditDates
}) => {
    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="lg:sticky lg:top-32 bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_20px_40px_-4px_rgba(0,0,0,0.08)] border border-gray-100/50">
            <div className="flex gap-3 lg:gap-5 pb-4 lg:pb-8 border-b border-gray-100">
                <div className="w-20 h-16 lg:w-28 lg:h-24 rounded-2xl overflow-hidden shadow-sm shrink-0">
                    <img src={car.imageUrl} alt={car.model} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: '#555B66' }}>Cube Car Select</p>
                    <h3 className="font-display font-bold text-lg lg:text-xl leading-tight mb-2" style={{ color: '#1C2230' }}>{car.make} {car.model}</h3>
                    <div className="flex items-center gap-1.5 text-sm">
                        <i className="fas fa-star text-xs text-[#1C2230]"></i>
                        <span className="font-bold" style={{ color: '#1C2230' }}>{car.rating}</span>
                        <span className="font-medium" style={{ color: '#6F7684' }}>({car.trips} viagens)</span>
                    </div>
                </div>
            </div>
            <div className="py-4 lg:py-8 border-b border-gray-100">
                <h4 className="font-bold text-xs uppercase tracking-widest mb-2 lg:mb-3" style={{ color: '#555B66' }}>Política de cancelamento</h4>
                <p className="text-sm font-medium leading-relaxed" style={{ color: '#1C2230' }}>Cancelamento gratuito até 48h antes da retirada.</p>
            </div>
            <div className="py-4 lg:py-8 border-b border-gray-100">
                <div className="flex justify-between items-center mb-4 lg:mb-6">
                    <h4 className="font-bold text-xs uppercase tracking-widest" style={{ color: '#555B66' }}>Sua viagem</h4>
                    <button onClick={onEditDates} className="bg-gray-50 hover:bg-gray-100 text-[#1C2230] px-4 py-1.5 lg:px-5 lg:py-2 rounded-xl text-xs lg:text-sm font-bold transition-colors" style={{ color: '#1C2230' }}>Alterar data</button>
                </div>
                <div className="flex gap-4">
                    <div className="flex flex-col items-center mr-1 pt-1.5">
                        <div className="w-3 h-3 rounded-full bg-[#2563EB] ring-4 ring-white z-10 shrink-0"></div>
                        <div className="w-[2px] bg-gray-100 flex-grow my-[-2px]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#1C2230] ring-4 ring-white z-10 shrink-0"></div>
                    </div>
                    <div className="flex flex-col gap-4 lg:gap-6 pb-1">
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: '#6F7684' }}>RETIRADA</p>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg leading-none" style={{ color: '#1C2230' }}>{formatDate(booking.startDate)}.</span>
                                <span className="font-medium text-base leading-none" style={{ color: '#3A4150' }}>{booking.startTime}</span>
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide mb-1" style={{ color: '#6F7684' }}>DEVOLUÇÃO</p>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-lg leading-none" style={{ color: '#1C2230' }}>{formatDate(booking.endDate)}.</span>
                                <span className="font-medium text-base leading-none" style={{ color: '#3A4150' }}>{booking.endTime}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="pt-4 lg:pt-8">
                <h3 className="font-bold text-xs uppercase tracking-widest mb-3 lg:mb-5" style={{ color: '#555B66' }}>Detalhamento do preço</h3>
                <div className="space-y-2 lg:space-y-3 text-sm font-medium" style={{ color: '#3A4150' }}>
                    <div className="flex justify-between"><span>Diária ({daysDiff}x)</span><span>R${rentalCost.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span>Taxa de serviço (10%)</span><span>R${serviceFee.toFixed(2)}</span></div>
                </div>
                <div className="border-t border-gray-100 mt-4 lg:mt-6 pt-4 lg:pt-6 flex justify-between items-end">
                    <span className="font-bold text-base" style={{ color: '#1C2230' }}>Total</span>
                    <span className="font-display font-bold text-2xl" style={{ color: '#1C2230' }}>R${total.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};
