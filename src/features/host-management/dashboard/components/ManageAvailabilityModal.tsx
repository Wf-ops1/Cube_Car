import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MONTHS = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

interface DayStatus {
    date: string; // ISO string
    status: 'AVAILABLE' | 'RENTED' | 'BLOCKED';
}

interface ManageAvailabilityModalProps {
    carId: string;
    carModel: string;
    onClose: () => void;
}

export const ManageAvailabilityModal: React.FC<ManageAvailabilityModalProps> = ({ carId, carModel, onClose }) => {
    const [viewDate, setViewDate] = useState(new Date());
    // Mock initial data - in real app would fetch from backend available in logic
    const [statuses, setStatuses] = useState<DayStatus[]>([
        { date: new Date(new Date().setDate(new Date().getDate() + 2)).toDateString(), status: 'RENTED' },
        { date: new Date(new Date().setDate(new Date().getDate() + 3)).toDateString(), status: 'RENTED' },
        { date: new Date(new Date().setDate(new Date().getDate() + 4)).toDateString(), status: 'RENTED' },
    ]);

    const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

    const changeMonth = (offset: number) => {
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + offset, 1);
        setViewDate(newDate);
    };

    const toggleStatus = (date: Date) => {
        const dateStr = date.toDateString();
        const existing = statuses.find(s => s.date === dateStr);
        if (existing?.status === 'RENTED') return; // Cannot change rented days here
        if (existing?.status === 'BLOCKED') {
            setStatuses(prev => prev.filter(s => s.date !== dateStr)); // Set to Available (remove from list)
        } else {
            setStatuses(prev => [...prev, { date: dateStr, status: 'BLOCKED' }]);
        }
    };

    const getStatus = (date: Date) => {
        const s = statuses.find(s => s.date === date.toDateString());
        return s?.status || 'AVAILABLE';
    };

    // Calendar Generation
    const daysInMonth = getDaysInMonth(viewDate);
    const firstDay = getFirstDayOfMonth(viewDate);
    const days = [];

    // Empty slots
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
        const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), d);
        const isPast = currentDate < today;
        const status = getStatus(currentDate);
        let bgClass = 'hover:bg-slate-100 text-slate-600';

        if (status === 'RENTED') {
            bgClass = 'bg-blue-100 text-blue-600 font-bold shadow-sm ring-1 ring-blue-200';
        } else if (status === 'BLOCKED') {
            bgClass = 'bg-slate-100 text-slate-400 decoration-slate-300 line-through';
        } else if (!isPast) {
            // Available
            bgClass = 'hover:bg-slate-200 text-slate-700 cursor-pointer hover:font-bold hover:text-slate-900 group-hover/btn:scale-110';
        }

        if (isPast) {
            bgClass = 'text-slate-300 cursor-not-allowed';
        }

        days.push(
            <div key={d} className="flex justify-center group/btn">
                <button
                    disabled={isPast || status === 'RENTED'}
                    onClick={() => toggleStatus(currentDate)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm transition-all duration-200 ${bgClass}`}
                    title={status === 'AVAILABLE' ? 'Clique para Bloquear' : status}
                >
                    {d}
                </button>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/40 backdrop-blur-md"
                onClick={onClose}
            />
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden ring-1 ring-white/20"
            >
                {/* Header */}
                <div className="bg-[#3667AA] p-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-display font-bold">Disponibilidade</h2>
                            <p className="text-blue-100 text-xs mt-1 font-medium tracking-wide opacity-90">{carModel}</p>
                        </div>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors">
                            <i className="fas fa-times text-sm"></i>
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    {/* Calendar Nav */}
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={() => changeMonth(-1)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                            <i className="fas fa-chevron-left"></i>
                        </button>
                        <span className="font-display font-bold text-slate-800 text-lg capitalize">
                            {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                        </span>
                        <button onClick={() => changeMonth(1)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>

                    <div className="grid grid-cols-7 mb-2">
                        {WEEKDAYS.map(day => (
                            <div key={day} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-y-2 mb-6">
                        {days}
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-400"></div> Livre
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div> Alugado
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-slate-300"></div> Bloqueado
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                    <p className="text-xs text-slate-400">Clique nos dias livres para bloquear a agenda.</p>
                </div>
            </motion.div>
        </div>
    );
};
