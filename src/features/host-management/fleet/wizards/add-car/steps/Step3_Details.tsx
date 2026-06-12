import React, { useState } from 'react';
import { useAddCarWizardStore } from '../../AddCarWizard.store';

const Step3_Details: React.FC = () => {
    const { data, updateData, setStepValidity, extractedData } = useAddCarWizardStore();
    const [isGenerating, setIsGenerating] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<'transmission' | 'fuel' | null>(null);

    // Helper para UX "Wow factor" do Smart Scan
    const isAutoFilled = (key: keyof typeof extractedData) => !!extractedData[key];

    // Click outside handler for dropdowns
    React.useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as HTMLElement;
            if (!target.closest('.custom-select-container')) {
                setOpenDropdown(null);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Validation Effect
    React.useEffect(() => {
        const isValid = !!(data.description && data.description.length > 10 && data.transmission && data.fuel && data.hasInsurance !== undefined);
        setStepValidity(isValid);

        return () => setStepValidity(false);
    }, [data, setStepValidity]);

    const generateDescription = () => {
        setIsGenerating(true);
        setTimeout(() => {
            updateData({
                description: `Este ${data.make} ${data.model} ${data.year} é a combinação perfeita de estilo e conforto. Equipado com bancos de couro, teto solar e sistema de som premium, é ideal para viagens de fim de semana ou reuniões de negócios. Econômico e revisado.`
            });
            setIsGenerating(false);
        }, 1500);
    };

    const featuresList = [
        'Ar Condicionado', 'Direção Hidráulica', 'Vidros Elétricos', 'Trava Elétrica',
        'Airbag', 'Freios ABS', 'Bluetooth', 'Câmera de Ré',
        'Sensor de Estacionamento', 'Bancos de Couro', 'Teto Solar',
        'Porta-malas Grande', 'Pet Friendly', 'Cadeirinha de Bebê',
        'Tag de Pedágio', 'Suporte Celular', 'Rack de Teto'
    ];

    const toggleFeature = (feature: string) => {
        const current = data.features || [];
        if (current.includes(feature)) {
            updateData({ features: current.filter(f => f !== feature) });
        } else {
            updateData({ features: [...current, feature] });
        }
    };

    return (
        <div className="h-full flex flex-col justify-start max-h-[100%] md:max-h-[75vh]">
            <div className="mb-8 shrink-0">
                <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-900 mb-2 tracking-tight">Detalhes do Veículo</h2>
                <p className="text-slate-500">Vamos tornar seu anúncio irresistível.</p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-8 custom-scrollbar">
                {/* Description with AI */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</label>
                        <button
                            onClick={generateDescription}
                            disabled={isGenerating}
                            className="text-xs font-bold text-[#3667AA] flex items-center gap-1 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors"
                        >
                            {isGenerating ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-magic"></i>}
                            Gerar com IA
                        </button>
                    </div>
                    <textarea
                        rows={4}
                        value={data.description || ''}
                        onChange={e => updateData({ description: e.target.value })}
                        placeholder="Ex: carro bem conservado, ideal para viagens..."
                        className="w-full bg-slate-50 border-0 ring-1 ring-slate-100 rounded-2xl p-4 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-[#3667AA] outline-none transition-all resize-none leading-relaxed shadow-sm"
                    />
                </div>

                {/* Insurance */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Possui seguro?</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => updateData({ hasInsurance: true })}
                            className={`px-4 py-3 rounded-2xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${data.hasInsurance === true
                                ? 'bg-[#3667AA] border-[#3667AA] text-white shadow-md shadow-blue-500/20'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                                }`}
                        >
                            Sim
                        </button>
                        <button
                            onClick={() => updateData({ hasInsurance: false })}
                            className={`px-4 py-3 rounded-2xl text-sm font-bold border transition-all flex items-center justify-center gap-2 ${data.hasInsurance === false
                                ? 'bg-slate-800 border-slate-800 text-white shadow-md shadow-slate-800/20'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white'
                                }`}
                        >
                            Não
                        </button>
                    </div>
                </div>

                {/* Categories / Specs */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="custom-select-container relative">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Câmbio</label>
                        <div
                            className="w-full bg-slate-50 border-0 ring-1 ring-slate-100 rounded-2xl px-4 py-3.5 text-slate-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3667AA] shadow-sm cursor-pointer flex justify-between items-center transition-all"
                            onClick={() => setOpenDropdown(openDropdown === 'transmission' ? null : 'transmission')}
                        >
                            <span className="font-medium">{data.transmission || 'Selecione'}</span>
                            <i className={`fas fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${openDropdown === 'transmission' ? 'rotate-180' : ''}`}></i>
                        </div>
                        {openDropdown === 'transmission' && (
                            <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                                {['Automático', 'Manual'].map((option) => (
                                    <div
                                        key={option}
                                        className={`px-4 py-3 hover:bg-slate-50 cursor-pointer font-medium transition-colors ${data.transmission === option ? 'text-[#3667AA] bg-blue-50/50' : 'text-slate-700'}`}
                                        onClick={() => {
                                            updateData({ transmission: option });
                                            setOpenDropdown(null);
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="custom-select-container relative">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Combustível</label>
                        <div
                            className="w-full bg-slate-50 border-0 ring-1 ring-slate-100 rounded-2xl px-4 py-3.5 text-slate-900 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#3667AA] shadow-sm cursor-pointer flex justify-between items-center transition-all"
                            onClick={() => setOpenDropdown(openDropdown === 'fuel' ? null : 'fuel')}
                        >
                            <span className="font-medium">{data.fuel || 'Selecione'}</span>
                            <i className={`fas fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${openDropdown === 'fuel' ? 'rotate-180' : ''}`}></i>
                        </div>
                        {openDropdown === 'fuel' && (
                            <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2">
                                {['Flex', 'Gasolina', 'Híbrido', 'Elétrico', 'Diesel'].map((option) => (
                                    <div
                                        key={option}
                                        className={`px-4 py-3 hover:bg-slate-50 cursor-pointer font-medium transition-colors ${data.fuel === option ? 'text-[#3667AA] bg-blue-50/50' : 'text-slate-700'}`}
                                        onClick={() => {
                                            updateData({ fuel: option });
                                            setOpenDropdown(null);
                                        }}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Features Checkboxes */}
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">Recursos</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {featuresList.map(feature => (
                            <button
                                key={feature}
                                onClick={() => toggleFeature(feature)}
                                className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${(data.features || []).includes(feature)
                                    ? 'bg-[#3667AA] border-[#3667AA] text-white shadow-md shadow-blue-500/20 transform scale-[1.02]'
                                    : 'bg-slate-50 border-transparent text-slate-500 hover:bg-white hover:border-slate-200'
                                    }`}
                            >
                                <i className={`fas ${(data.features || []).includes(feature) ? 'fa-check' : 'fa-plus'
                                    }`}></i>
                                {feature}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step3_Details;
