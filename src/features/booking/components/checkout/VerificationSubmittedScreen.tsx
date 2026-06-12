import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft, Calendar, User } from 'lucide-react';
import { Car } from '@/core/data/car/car.types';

interface VerificationSubmittedScreenProps {
    car: Car;
    booking: { startDate: string; endDate: string };
    onBackToCar: () => void;
    onEnableNotifications: () => void;
    onGoHome: () => void;
    onGoToVerification: () => void;
}

export const VerificationSubmittedScreen: React.FC<VerificationSubmittedScreenProps> = ({
    car,
    booking,
    onBackToCar,
    onEnableNotifications,
    onGoHome,
    onGoToVerification
}) => {
    const startDate = new Date(booking.startDate);
    const endDate = new Date(booking.endDate);

    // Formatting helper since I can't be sure of shared utils availability
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="max-w-xl mx-auto mt-8 animate-fade-in-up">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_40px_-4px_rgba(0,0,0,0.08)] border border-gray-100/50 text-center">

                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    >
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </motion.div>
                </div>

                <h2 className="text-2xl font-bold text-[#1C2230] mb-3">Verificação enviada!</h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                    Recebemos seus documentos. Nossa equipe fará a análise em breve e você será avisado assim que for aprovado.
                </p>

                {/* Booking Snapshot */}
                {booking.startDate && booking.endDate && (
                    <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left flex gap-4 items-center">
                        <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0">
                            <img src={car.imageUrl} alt={car.model} className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">Sua reserva desejada</p>
                            <h3 className="font-bold text-[#1C2230] text-sm">{car.make} {car.model}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(startDate)} - {formatDate(endDate)}</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={onGoToVerification}
                        className="w-full bg-[#3667AA] hover:bg-[#2c558f] text-white px-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98]"
                    >
                        <User className="w-4 h-4" />
                        Acompanhar verificação
                    </button>

                    <button
                        onClick={onGoHome}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar ao início
                    </button>
                </div>

            </div>
        </div>
    );
};
