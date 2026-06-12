import React from 'react';
import { motion } from 'framer-motion';
import { CalendarX, Search, Bell, ArrowRight } from 'lucide-react';
import { Car } from '@/core/data/car/car.types';

interface UnavailableRedirectScreenProps {
    car: Car;
    onViewSimilar: () => void;
    onChangeDates: () => void;
    onNotifyMe: () => void;
}

export const UnavailableRedirectScreen: React.FC<UnavailableRedirectScreenProps> = ({
    car, mViewSimilar, onChangeDates, onNotifyMe
}) => {
    return (
        <div className="max-w-2xl mx-auto mt-8 animate-fade-in-up">
            <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_40px_-4px_rgba(0,0,0,0.08)] border border-gray-100/50 text-center">

                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarX className="w-10 h-10 text-red-400" />
                </div>

                <h2 className="text-2xl font-bold text-[#1C2230] mb-3">Ah não! As datas não estão mais disponíveis.</h2>
                <p className="text-gray-500 mb-8 leading-relaxed max-w-md mx-auto">
                    Enquanto sua verificação estava sendo processada, o <strong>{car.make} {car.model}</strong> foi reservado por outro motorista para este período.
                </p>

                <div className="bg-green-50 rounded-xl p-4 mb-10 inline-flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs font-bold shrink-0">
                        <i className="fas fa-check"></i>
                    </div>
                    <span className="text-sm font-medium text-green-800">
                        Sua conta foi verificada com sucesso! ✅
                    </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-left">
                    {/* Option 1: View Similar */}
                    <button
                        onClick={mViewSimilar}
                        className="group bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 p-6 rounded-2xl transition-all shadow-sm hover:shadow-md"
                    >
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Search className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-[#1C2230] mb-1">Ver carros similares</h3>
                        <p className="text-xs text-gray-500 mb-4">Encontre outros modelos disponíveis para suas datas.</p>
                        <div className="flex items-center text-blue-600 text-xs font-bold">
                            Buscar agora <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </button>

                    {/* Option 2: Change Dates */}
                    <button
                        onClick={onChangeDates}
                        className="group bg-gray-50 hover:bg-white border border-transparent hover:border-gray-200 p-6 rounded-2xl transition-all shadow-sm hover:shadow-md"
                    >
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <i className="far fa-calendar-alt text-lg"></i>
                        </div>
                        <h3 className="font-bold text-[#1C2230] mb-1">Escolher outras datas</h3>
                        <p className="text-xs text-gray-500 mb-4">Verifique a disponibilidade deste carro em outros dias.</p>
                        <div className="flex items-center text-amber-600 text-xs font-bold">
                            Ver calendário <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <button onClick={onNotifyMe} className="text-gray-400 hover:text-gray-600 text-xs font-medium flex items-center justify-center gap-2 mx-auto transition-colors">
                        <Bell className="w-3 h-3" />
                        Avise-me se estas datas ficarem disponíveis
                    </button>
                </div>

            </div>
        </div>
    );
};
