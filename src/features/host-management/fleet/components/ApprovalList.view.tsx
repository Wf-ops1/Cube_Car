import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApprovalListLogic } from './hooks/useApprovalList.logic';
import { Spinner } from '@/shared/components/ui/Spinner';

interface ApprovalListProps {
    onUpdate: () => void;
}

const ApprovalList: React.FC<ApprovalListProps> = ({ onUpdate }) => {
    const { pendingCars, isLoading, actioningId, handleAction } = useApprovalListLogic(onUpdate);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner size="lg" color="primary" />
            </div>
        );
    }

    if (pendingCars.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <i className="fas fa-check-circle text-2xl"></i>
                </div>
                <h3 className="text-lg font-bold text-[#181824] mb-1">Tudo limpo!</h3>
                <p className="text-gray-500">Nenhum veículo aguardando aprovação no momento.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <AnimatePresence mode="popLayout">
                {pendingCars.map(car => (
                    <motion.div
                        key={car.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-white rounded-3xl border border-gray-100 p-5 flex flex-col md:flex-row items-center gap-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="w-full md:w-40 h-28 shrink-0 relative rounded-2xl overflow-hidden">
                            <img src={car.imageUrl} className="w-full h-full object-cover" alt={car.model} />
                            <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                                Pendente
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg text-[#181824]">{car.make} {car.model}</h3>
                                    <p className="text-sm text-gray-500">Ano: {car.year} • {car.category}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-[#3667AA]">R$ {car.pricePerDay}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Por dia</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <i className="fas fa-map-marker-alt text-[#3667AA]"></i>
                                <span>{car.location}</span>
                            </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto">
                            <button
                                onClick={() => handleAction(car.id, 'approved')}
                                disabled={actioningId === car.id}
                                className="flex-1 bg-green-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                            >
                                Aprovar
                            </button>
                            <button
                                onClick={() => handleAction(car.id, 'rejected')}
                                disabled={actioningId === car.id}
                                className="flex-1 border border-red-200 text-red-600 font-bold py-2.5 px-6 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50 text-sm"
                            >
                                Recusar
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default ApprovalList;
