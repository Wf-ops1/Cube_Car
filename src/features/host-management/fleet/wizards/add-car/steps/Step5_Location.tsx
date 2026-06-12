import React, { useState, useEffect } from 'react';
import { useAddCarWizardStore } from '../../AddCarWizard.store';

const Step5_Location: React.FC = () => {
    const { data, updateData, setStepValidity } = useAddCarWizardStore();
    const [isLoadingCep, setIsLoadingCep] = useState(false);
    const [cepError, setCepError] = useState(false);

    // CEP Formatting & Input
    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Extract only digits
        if (val.length > 5) {
            val = val.substring(0, 5) + '-' + val.substring(5, 8); // Format 00000-000
        }
        updateData({ zipCode: val });
    };

    // Auto-fetch via ViaCEP
    useEffect(() => {
        const fetchCep = async () => {
            if (!data.zipCode) return;
            const pureCep = data.zipCode.replace(/\D/g, '');

            if (pureCep.length === 8) {
                setIsLoadingCep(true);
                setCepError(false);
                try {
                    const res = await fetch(`https://viacep.com.br/ws/${pureCep}/json/`);
                    const json = await res.json();

                    if (json.erro) {
                        setCepError(true);
                    } else {
                        // Success - Auto-fill fields and format strictly "City, UF"
                        updateData({
                            address: json.logradouro,
                            neighborhood: json.bairro,
                            location: `${json.localidade}, ${json.uf}`,
                            number: '' // Reset the number when a new CEP is searched
                        });
                    }
                } catch (error) {
                    setCepError(true);
                } finally {
                    setIsLoadingCep(false);
                }
            } else {
                // Clear error if user is changing CEP back to incomplete
                setCepError(false);
            }
        };

        fetchCep();
    }, [data.zipCode, updateData]);

    // Validation Effect
    useEffect(() => {
        const isValid = !!(data.address && data.address.length > 5 && data.number && data.neighborhood && data.location && data.location.length > 3);
        setStepValidity(isValid);

        return () => setStepValidity(false);
    }, [data, cepError, setStepValidity]);

    return (
        <div className="h-full flex flex-col justify-center">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-900 mb-2 tracking-tight">Onde está o veículo?</h2>
                <p className="text-slate-500">Defina o endereço de retirada para os locatários.</p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 relative">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center justify-between">
                        <span>CEP <span className="text-slate-400 font-normal normal-case">(Opcional)</span></span>
                    </label>
                    <div className="relative">
                        <input
                            value={data.zipCode || ''}
                            onChange={handleCepChange}
                            placeholder="00000-000"
                            maxLength={9}
                            className={`w-full bg-slate-50 border-0 ring-1 ${cepError ? 'ring-red-400 focus:ring-red-500' : 'ring-slate-100 focus:ring-[#3667AA]'} rounded-2xl px-5 py-4 font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 transition-all shadow-sm`}
                        />
                        {isLoadingCep && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                <div className="w-5 h-5 border-2 border-[#3667AA] border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                        {cepError && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500">
                                <i className="fas fa-exclamation-circle"></i>
                            </div>
                        )}
                    </div>
                    {cepError && <span className="text-xs text-red-500 mt-2 block font-medium">CEP não encontrado.</span>}
                </div>

                <div className="col-span-8 relative group">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                        Endereço
                    </label>
                    <input
                        value={data.address || ''}
                        onChange={e => updateData({ address: e.target.value })}
                        placeholder="Sua rua..."
                        className="w-full bg-slate-50 border-0 ring-1 ring-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#3667AA] transition-all shadow-sm"
                    />

                    {/* Privacy Tooltip */}
                    <div className="absolute right-0 top-0 -mt-8 bg-slate-900 text-white border border-slate-800 text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 text-center shadow-xl z-10 font-medium h-auto">
                        Só será revelado após a reserva confirmada.
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1 w-2 h-2 bg-slate-900 rotate-45"></div>
                    </div>
                </div>

                <div className="col-span-4 relative group">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                        Número
                    </label>
                    <input
                        value={data.number || ''}
                        onChange={e => updateData({ number: e.target.value })}
                        placeholder="123"
                        className="w-full bg-slate-50 border-0 ring-1 ring-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#3667AA] transition-all shadow-sm"
                    />
                </div>

                <div className="col-span-6 relative group">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                        Bairro
                    </label>
                    <input
                        value={data.neighborhood || ''}
                        onChange={e => updateData({ neighborhood: e.target.value })}
                        placeholder="Seu bairro"
                        className="w-full bg-slate-50 border-0 ring-1 ring-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#3667AA] transition-all shadow-sm"
                    />
                </div>

                <div className="col-span-6">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-2">
                        Cidade
                        <i className="fas fa-magic text-[10px] text-indigo-500" title="Preenchimento facilitado pelo CEP"></i>
                    </label>
                    <input
                        value={data.location || ''}
                        onChange={e => updateData({ location: e.target.value })}
                        placeholder="Sua cidade"
                        className="w-full bg-slate-50 border-0 ring-1 ring-slate-100 rounded-2xl px-5 py-4 font-bold text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-[#3667AA] transition-all shadow-sm"
                    />
                </div>
            </div>
        </div>
    );
};

export default Step5_Location;
