import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnrichedCar } from '../../application/useOwnerCenter.logic';
import { useAddCarWizardStore } from '../../fleet/wizards/AddCarWizard.store';

interface FleetListProps {
    fleet: EnrichedCar[];
    onOpenCalendar: (carId: string, carModel: string) => void;
    onViewCarDetails?: (carId: string) => void;
    onUpdatePrice?: (carId: string, delta: number) => void;
    onToggleStatus?: (carId: string) => void;
    onPublishDraft?: (carId: string) => void;
}

export const FleetList: React.FC<FleetListProps> = ({ fleet, onOpenCalendar, onViewCarDetails, onUpdatePrice, onToggleStatus, onPublishDraft }) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            {/* RESTORED & MODIFIED: Adicionar Ativo Button with New Blue Gradient (User Request) */}
            {/* RESTORED & MODIFIED: Adicionar Ativo Button with New Blue Gradient (User Request) */}
            {/* RESTORED & MODIFIED: Adicionar Ativo Button with New Blue Gradient (User Request) */}
            <button
                onClick={() => useAddCarWizardStore.getState().openWizard()}
                className="w-full bg-gradient-to-r from-[#3667AA] to-[#254B85] text-white rounded-[2rem] p-5 shadow-2xl shadow-blue-900/20 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 flex items-center justify-between text-left gap-4 border border-white/10"
            >
                <div className="absolute top-0 right-0 p-20 bg-white/10 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2"></div>
                {/* Icon & Text Wrapper */}
                <div className="relative z-10 flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white group-hover:rotate-90 transition-transform shrink-0">
                        <i className="fas fa-plus text-lg"></i>
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-base font-bold truncate">Adicionar Carro</p>
                        <p className="text-xs text-blue-100 font-medium truncate">Adicionar veículo à garagem</p>
                    </div>
                </div>
                {/* Arrow for Desktop */}
                <div className="relative z-10 pr-2">
                    <i className="fas fa-chevron-right text-white/50 group-hover:text-white transition-colors text-xs"></i>
                </div>
            </button>


            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {fleet.map((car) => (
                    <div key={car.id} className="bg-white border border-slate-200 p-0 rounded-[2rem] shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 relative overflow-hidden group hover:-translate-y-1 flex flex-col">

                        {/* BLOCK 3: Managerial State (Header) - Control */}
                        {/* FIXED: Removed bg-slate-50 to anchor visually to card body. Added simple bottom padding for separation. */}
                        <div className="px-7 pt-7 pb-2 flex items-center justify-between">
                            <span className={`text-xs font-bold uppercase tracking-wider ${car.contextStatus === 'AVAILABLE' || car.contextStatus === 'RENTED' ? 'text-slate-600' : car.contextStatus === 'PENDING_APPROVAL' ? 'text-blue-500' : 'text-slate-400'}`}>
                                {car.contextStatus === 'PENDING_APPROVAL' ? 'Rascunho' : car.isActiveAd !== false ? 'Aceitando Reservas' : 'Pausado'}
                            </span>

                            {/* Toggle Control (Hidden for Drafts) */}
                            {car.contextStatus !== 'PENDING_APPROVAL' && (
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onToggleStatus) {
                                            onToggleStatus(car.id);
                                        }
                                    }}
                                    className={`w-12 h-7 rounded-full p-1 flex items-center transition-colors cursor-pointer ${car.isActiveAd !== false ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'}`}
                                >
                                    <motion.div layout className="w-5 h-5 bg-white rounded-full shadow-sm"></motion.div>
                                </div>
                            )}
                        </div>

                        <div className="px-7 pb-10 pt-4 flex-1 flex flex-col">
                            {/* Middle Section: Image (Block 2) + Identity (Block 1) */}
                            <div className="flex gap-6 mb-8 items-start">

                                {/* BLOCK 2: Operational State (Visual) */}
                                <div className="w-24 h-24 rounded-2xl relative overflow-hidden shrink-0 border border-slate-100 shadow-sm bg-slate-100">
                                    <img src={car.imageUrl} className="w-full h-full object-cover" alt={car.model} />
                                    {/* Status Badge Overlay */}
                                    <div className={`absolute bottom-0 inset-x-0 py-1 text-center font-bold text-[9px] uppercase tracking-wide text-white backdrop-blur-sm ${car.contextStatus === 'RENTED' ? 'bg-blue-600/90' : 'bg-emerald-500/90'}`}>
                                        {car.contextStatus === 'RENTED' ? 'Em Uso' : 'Livre'}
                                    </div>
                                </div>

                                {/* BLOCK 1: Identity (Who) */}
                                <div className="flex-1 flex flex-col justify-start gap-1 min-w-0 pt-0.5">
                                    <div className="flex justify-between items-start w-full">
                                        <h3 className="text-xl font-display font-bold text-slate-900 leading-tight tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2 pr-2">{car.model}</h3>

                                        {/* Actions Menu */}
                                        {/* FIXED: Larger hit area (w-10 h-10), darker icon, bg-slate-50 default for visibility */}
                                        <div className="relative -mt-1 -mr-2 shrink-0">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setActiveMenu(activeMenu === car.id ? null : car.id);
                                                }}
                                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 border ${activeMenu === car.id ? 'bg-slate-100 text-[#1C2230] border-slate-200' : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100 hover:border-slate-200'}`}
                                            >
                                                <i className="fas fa-ellipsis-v text-sm"></i>
                                            </button>

                                            <AnimatePresence>
                                                {activeMenu === car.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-40" onClick={(e) => { e.stopPropagation(); setActiveMenu(null); }}></div>
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9, y: 10, x: 10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                            transition={{ duration: 0.15 }}
                                                            className="absolute right-0 top-12 bg-white border border-slate-100 rounded-xl shadow-xl w-48 z-50 overflow-hidden ring-1 ring-black/5"
                                                        >
                                                            <div className="py-1">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onOpenCalendar(car.id, car.model);
                                                                        setActiveMenu(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center gap-3"
                                                                >
                                                                    <i className="fas fa-calendar-alt w-3.5 text-center text-slate-400"></i> Calendário
                                                                </button>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (onViewCarDetails) {
                                                                            onViewCarDetails(car.id);
                                                                        }
                                                                        setActiveMenu(null);
                                                                    }}
                                                                    className="w-full text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors flex items-center gap-3"
                                                                >
                                                                    <i className="fas fa-external-link-alt w-3.5 text-center text-blue-400"></i> Ver Anúncio
                                                                </button>
                                                                <div className="h-px bg-slate-100 mx-2 my-1"></div>
                                                                <button className="w-full text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center gap-3">
                                                                    <i className="fas fa-trash w-3.5 text-center text-rose-400"></i> Excluir
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    </>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-500 font-mono tracking-tight mb-2.5">{car.plate}</p>

                                    {/* FIXED: High Contrast Rating Signal */}
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                                        <i className="fas fa-star text-slate-400 text-xs"></i>
                                        <span className="font-bold text-slate-800">{car.rating}</span>
                                        <span className="text-slate-400 font-bold">· Excelente (12)</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer: Price Control or Publish Button */}
                            {car.contextStatus === 'PENDING_APPROVAL' ? (
                                <div className="mt-auto flex p-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (onPublishDraft) onPublishDraft(car.id); }}
                                        className="w-full bg-[#3667AA] text-white rounded-xl py-3 text-sm font-bold shadow-md shadow-blue-900/20 hover:bg-blue-700 transition-colors"
                                    >
                                        Publicar Anúncio
                                    </button>
                                </div>
                            ) : (
                                <div className="mt-auto flex bg-slate-50 border border-slate-200/60 rounded-2xl p-2 items-center justify-between shadow-inner">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (onUpdatePrice) onUpdatePrice(car.id, -50); }}
                                        className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-600 bg-white rounded-xl transition-all shadow-sm border border-slate-200 hover:border-slate-300 active:scale-95"
                                    >
                                        <i className="fas fa-minus text-xs"></i>
                                    </button>

                                    <div className="flex flex-col items-center flex-1">
                                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mb-0.5">Valor Diária</span>
                                        <span className="text-lg font-bold text-slate-800 tracking-tight">R$ {car.pricePerDay}</span>
                                    </div>

                                    <button
                                        onClick={(e) => { e.stopPropagation(); if (onUpdatePrice) onUpdatePrice(car.id, 50); }}
                                        className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-600 bg-white rounded-xl transition-all shadow-sm border border-slate-200 hover:border-slate-300 active:scale-95"
                                    >
                                        <i className="fas fa-plus text-xs"></i>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
