import React, { useState } from 'react';
import { Car } from '@/core/data/car/car.types';
import { motion, AnimatePresence } from 'framer-motion';
import { Spinner } from '@/shared/components/ui/Spinner';

interface MobileReviewStepProps {
    car: Car;
    booking: {
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
    };
    total: number;
    rentalCost: number;
    serviceFee: number;
    daysDiff: number;
    paymentMethod: 'credit_card' | 'pix' | null;
    cardData: any;
    onEdit: () => void;
    handleFinalPayment: () => void;
    isProcessing: boolean;
}

export const MobileReviewStep: React.FC<MobileReviewStepProps> = ({
    car, booking, total, rentalCost, serviceFee, daysDiff, paymentMethod, cardData, onEdit, handleFinalPayment, isProcessing
}) => {
    const [showDetails, setShowDetails] = useState(false);

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '';
        const [y, m, d] = dateStr.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const getPaymentLabel = () => {
        if (paymentMethod === 'pix') return 'Pix (Aprovação Imediata)';
        if (paymentMethod === 'credit_card') return `Cartão final ${cardData.cardNumber.slice(-4) || '****'}`;
        return 'Não selecionado';
    };

    const getPaymentIcon = () => {
        if (paymentMethod === 'pix') return <div className="w-8 h-8 rounded-full bg-green-50 text-[#00B686] flex items-center justify-center"><i className="fas fa-qrcode"></i></div>;
        return <div className="w-8 h-8 rounded-full bg-blue-50 text-[#3667AA] flex items-center justify-center"><i className="far fa-credit-card"></i></div>;
    };

    return (
        <div className="lg:hidden space-y-6 animate-fade-in pb-32 relative">
            {/* 1. Car Summary */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4">
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img src={car.imageUrl} alt={car.model} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1">Cube Car Select</p>
                    <h3 className="font-display font-bold text-lg leading-tight text-[#1C2230]">{car.make} {car.model}</h3>
                    <div className="flex items-center gap-1 mt-1">
                        <i className="fas fa-star text-xs text-[#1C2230]"></i>
                        <span className="text-xs font-bold text-[#1C2230]">{car.rating}</span>
                        <span className="text-xs text-gray-400">({car.trips})</span>
                    </div>
                </div>
            </div>

            {/* 2. Trip Details */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                    <h4 className="font-bold text-[#1C2230]">Sua viagem</h4>
                    <button onClick={onEdit} className="bg-gray-50 hover:bg-gray-100 text-[#1C2230] px-4 py-1.5 rounded-xl text-xs font-bold transition-colors">Alterar data</button>
                </div>
                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Retirada</p>
                            <p className="font-bold text-[#1C2230]">{formatDate(booking.startDate)}</p>
                            <p className="text-sm text-gray-500">{booking.startTime}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Devolução</p>
                            <p className="font-bold text-[#1C2230]">{formatDate(booking.endDate)}</p>
                            <p className="text-sm text-gray-500">{booking.endTime}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Price Breakdown */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-[#1C2230]">Informações de preço</h4>
                    <button onClick={() => setShowDetails(true)} className="text-sm font-bold text-[#1C2230] underline">Detalhes</button>
                </div>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between text-gray-600">
                        <span>Total (R$)</span>
                        <span className="font-bold text-[#1C2230] text-lg">R$ {total.toFixed(2)}</span>
                    </div>
                    {paymentMethod === 'credit_card' && (
                        <p className="text-xs text-gray-400 mt-1">
                            em até 12x de R$ {(total / 12).toFixed(2)}
                        </p>
                    )}
                </div>
            </div>

            {/* 4. Payment Method Summary */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-[#1C2230]">Forma de pagamento</h4>
                    <button onClick={onEdit} className="text-sm font-bold text-[#1C2230] underline">Alterar</button>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                    {getPaymentIcon()}
                    <div>
                        <p className="font-bold text-sm text-[#1C2230]">{getPaymentLabel()}</p>
                        <div className="flex gap-2 mt-1">
                            {/* Generic Card Logos for visual trust */}
                            <div className="h-3 w-8 bg-gray-200 rounded"></div>
                            <div className="h-3 w-8 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 5. Cancellation Policy */}
            <div>
                <h4 className="font-bold text-[#1C2230] mb-2 text-sm">Cancelamento gratuito</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                    Cancele até 48h antes da retirada para receber reembolso integral. <span className="underline font-bold text-[#1C2230]">Política completa</span>.
                </p>
            </div>

            {/* ACTION BUTTON */}
            <button
                onClick={handleFinalPayment}
                disabled={isProcessing}
                className="w-full bg-[#3667AA] text-white font-bold py-4 rounded-2xl text-lg shadow-[0_4px_14px_rgba(54,103,170,0.3)] active:scale-[0.98] transition-all flex items-center justify-center animate-fade-in-up hover:opacity-95"
            >
                {isProcessing ? (
                    <div className="flex items-center gap-2">
                        <Spinner variant="svg" size="sm" color="white" />
                        <span>Processando...</span>
                    </div>
                ) : 'Confirmar e pagar'}
            </button>

            {/* Terms Agreement Hint */}
            <p className="text-xs text-center text-gray-400 px-4 mt-4">
                Ao clicar no botão, eu concordo com os <span className="underline">termos de reserva</span> da Cube Car.
            </p>

            {/* PRICE DETAIL SHEET MODAL */}
            <AnimatePresence>
                {showDetails && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetails(false)}
                            className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-[2px]"
                        />

                        {/* Bottom Sheet */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2rem] z-[70] p-6 pb-12 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-display font-bold text-[#1C2230]">Detalhamento do preço</h3>
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full"
                                >
                                    <i className="fas fa-times text-lg"></i>
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>{daysDiff} diárias (R$ {car.pricePerDay}/dia)</span>
                                    <span>R$ {rentalCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-gray-600">
                                    <span>Taxa de serviço (10%)</span>
                                    <span>R$ {serviceFee.toFixed(2)}</span>
                                </div>

                                <div className="h-px bg-gray-200 my-4" />

                                <div className="flex justify-between items-center font-bold text-lg text-[#1C2230]">
                                    <span>Total</span>
                                    <span>R$ {total.toFixed(2)}</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
