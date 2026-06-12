import React from 'react';
import { useAddCarWizardStore } from '../../AddCarWizard.store';

const Step6_Pricing: React.FC = () => {
    const { data, updateData, setStepValidity } = useAddCarWizardStore();

    // Validation Effect
    React.useEffect(() => {
        const isValid = !!(data.pricePerDay && data.pricePerDay > 0);
        setStepValidity(isValid);

        return () => setStepValidity(false);
    }, [data, setStepValidity]);

    // Platform Fee Logic (Example 10%)
    const price = data.pricePerDay || 0;
    const fee = price * 0.1;
    const netIncome = price - fee;
    const monthlyEstimate = netIncome * 15; // 15 days usage

    return (
        <div className="h-full flex flex-col justify-start">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-900 mb-2 tracking-tight">Defina o valor</h2>
                <p className="text-slate-500">Quanto você quer receber por dia?</p>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl shadow-blue-900/5 p-6 md:p-8 mb-8 relative overflow-hidden">
                <div className="text-center mb-8">
                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Preço por Dia</span>
                    <div className="flex items-center justify-center gap-1 mt-2">
                        <span className="text-2xl font-bold text-slate-400">R$</span>
                        <input
                            type="number"
                            value={data.pricePerDay}
                            onChange={e => updateData({ pricePerDay: parseInt(e.target.value) })}
                            className="text-4xl md:text-6xl font-display font-medium text-slate-900 w-full max-w-[12rem] text-center outline-none border-b-2 border-transparent focus:border-[#3667AA] transition-all bg-transparent placeholder-slate-200"
                        />
                    </div>
                </div>

                {/* Slider */}
                <div className="mb-8 px-4">
                    <input
                        type="range"
                        min="50"
                        max="1000"
                        step="10"
                        value={data.pricePerDay}
                        onChange={e => updateData({ pricePerDay: parseInt(e.target.value) })}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#3667AA]"
                    />
                    <div className="flex justify-between text-xs font-bold text-slate-400 mt-2 uppercase">
                        <span>Econômico</span>
                        <span>Luxo</span>
                    </div>
                </div>

                {/* Earnings Breakdown */}
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3 border border-slate-100">
                    <div className="grid grid-cols-[1fr_auto] gap-4 items-center text-sm">
                        <span className="text-slate-500 font-medium">Taxa da plataforma (10%)</span>
                        <span className="text-slate-500 font-medium whitespace-nowrap text-right">- R$ {fee.toFixed(0)}</span>
                    </div>
                    <div className="h-px bg-slate-200 w-full"></div>
                    <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
                        <span className="text-slate-900 font-bold">Você recebe</span>
                        <span className="text-[#3667AA] font-bold text-xl whitespace-nowrap text-right">R$ {netIncome.toFixed(0)}</span>
                    </div>
                </div>
            </div>

            {/* Monthly Estimate Banner */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-[1.5rem] p-4 flex items-center justify-between mb-2 cursor-pointer hover:bg-emerald-100/50 transition-colors group backdrop-blur-sm shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-200 group-hover:text-emerald-800 transition-colors">
                        <i className="fas fa-coins"></i>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-emerald-600 uppercase tracking-wide">Estimativa Mensal</p>
                        <p className="text-emerald-800 font-bold">Ganhe até R$ {monthlyEstimate.toFixed(0)}/mês</p>
                    </div>
                </div>
                <i className="fas fa-chevron-right text-emerald-400"></i>
            </div>
        </div>
    );
};

export default Step6_Pricing;
