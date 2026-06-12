import React from 'react';
import { motion } from 'framer-motion';
import { Car } from '@/core/data/car/car.types';
import { User } from '@/core/data/auth/auth.types';

interface SuccessScreenProps {
    car: Car;
    user: User | null;
    onSuccess: () => void;
    onContactHost?: (ownerId: string, carId: string) => void;
}

export const SuccessScreen: React.FC<SuccessScreenProps> = ({ car, user, onSuccess, onContactHost }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center pt-8 md:pt-16"
        >
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200 animate-bounce-slow">
                <i className="fas fa-check text-4xl text-white"></i>
            </div>

            <h2 className="text-3xl font-display font-bold text-[#1C2230] mb-3">Solicitação Enviada!</h2>
            <p className="text-gray-500 mb-10 leading-relaxed">
                Aguardando a aprovação de <strong>{car.ownerDetails?.name || 'Proprietário'}</strong>.<br />
                Você será notificado assim que ele responder.
            </p>

            {/* Owner Card - Gentle Nudge */}
            <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-4 text-left shadow-sm mb-8 mx-4 md:mx-0">
                <img
                    src={car.ownerDetails?.avatar || 'https://i.pravatar.cc/150'}
                    alt={car.ownerDetails?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                    <p className="text-xs font-bold uppercase text-gray-400 tracking-wider">Proprietário</p>
                    <p className="font-bold text-[#1C2230] text-sm">{car.ownerDetails?.name}</p>
                    <p className="text-xs text-green-600 font-medium mt-0.5 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span>
                        Costuma responder em 1h
                    </p>
                </div>
            </div>

            <div className="space-y-4 px-4 md:px-0">
                {/* Primary Action: Minhas Viagens */}
                <button
                    onClick={onSuccess}
                    className="w-full bg-[#1C2230] text-white font-bold py-4 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm uppercase tracking-wide"
                >
                    Minhas Viagens
                </button>

                {/* Secondary Action: Contact (Nudge) */}
                <button
                    onClick={() => onContactHost && onContactHost(car.ownerId || 'unknown', car.id)}
                    className="w-full text-gray-500 hover:text-[#1C2230] font-bold py-3 rounded-xl transition-colors text-sm"
                >
                    Entrar em contato
                </button>
            </div>
        </motion.div>
    );
};
