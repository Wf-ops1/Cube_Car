import React from 'react';
import { useAddCarWizardStore } from '../../AddCarWizard.store';
import { motion } from 'framer-motion';

const Step2_BasicInfo: React.FC = () => {
    const { data, updateData, setStepValidity, extractedData } = useAddCarWizardStore();

    // Validation Effect
    React.useEffect(() => {
        const isValid = !!(data.make && data.model && data.year && data.color && data.licensePlate);
        setStepValidity(isValid);

        return () => setStepValidity(false); // Reset on unmount
    }, [data, setStepValidity]);

    const handleChange = (field: string, value: any) => {
        updateData({ [field]: value });
    };

    // Helper para UX "Wow factor" do Smart Scan
    const isAutoFilled = (key: keyof typeof extractedData) => !!extractedData[key];

    const inputClasses = () => `w-full border-0 rounded-2xl px-5 py-4 font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-[#3667AA] outline-none transition-all placeholder:text-slate-300 bg-slate-50 ring-1 ring-slate-100`;

    return (
        <div className="h-full flex flex-col justify-start">
            <div className="mb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-900 mb-6 tracking-tight">Confirme os dados</h2>
                {Object.values(extractedData).some(val => !!val) ? (
                    <div className="text-amber-800 p-3 rounded-xl flex gap-3 items-start border border-amber-200 justify-start text-left shadow-sm max-w-sm mx-auto" style={{ backgroundColor: '#fffbeb' }}>
                        <i className="fas fa-exclamation-triangle mt-0.5 shrink-0 text-amber-500"></i>
                        <p className="text-sm font-medium leading-snug">
                            Revise seus dados: Preenchemos alguns campos para adiantar. Confira se está tudo certinho!
                        </p>
                    </div>
                ) : (
                    <p className="text-slate-500">Verifique as informações extraídas do documento.</p>
                )}
            </div>

            <div className="grid grid-cols-2 gap-6">
                {/* Plate - Highlighted */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`col-span-2 py-3 px-5 rounded-3xl flex items-center justify-between backdrop-blur-sm border ${data.licensePlate?.length === 7 ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}
                >
                    <div className="w-full">
                        <label className={`text-xs font-bold uppercase tracking-wider mb-1 block ${data.licensePlate?.length === 7 ? 'text-emerald-700' : 'text-slate-500'}`}>Placa</label>
                        <input
                            value={data.licensePlate || ''}
                            onChange={(e) => handleChange('licensePlate', e.target.value.toUpperCase())}
                            placeholder="ABC1234"
                            maxLength={7}
                            className="bg-transparent text-3xl font-mono font-bold tracking-wider outline-none w-full uppercase placeholder:text-slate-300"
                        />
                    </div>
                </motion.div>

                <div className="relative">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">Marca</label>
                    <input
                        value={data.make || ''}
                        onChange={(e) => handleChange('make', e.target.value)}
                        className={inputClasses()}
                        placeholder="Ex: VW"
                    />
                </div>

                <div className="relative">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">Modelo</label>
                    <input
                        value={data.model || ''}
                        onChange={(e) => handleChange('model', e.target.value)}
                        className={inputClasses()}
                        placeholder="Ex: CROSSFOX"
                    />
                </div>

                <div className="relative">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">Ano Manual/Fab</label>
                    <input
                        type="number"
                        value={data.year || ''}
                        onChange={(e) => handleChange('year', parseInt(e.target.value))}
                        className={inputClasses()}
                        placeholder="2024"
                    />
                </div>

                <div className="relative">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">Cor</label>
                    <input
                        value={data.color || ''}
                        onChange={(e) => handleChange('color', e.target.value)}
                        className={inputClasses()}
                        placeholder="Ex: PRETA"
                    />
                </div>

                <div className="relative col-span-2">
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider ml-1">Renavam (Opccional)</label>
                    <input
                        value={data.renavam || ''}
                        onChange={(e) => handleChange('renavam', e.target.value)}
                        className={inputClasses()}
                        placeholder="00000000000"
                    />
                </div>
            </div>

        </div>
    );
};

export default Step2_BasicInfo;
