import React from 'react';
import { useAddCarWizardStore } from '../../AddCarWizard.store';

const Step7_Review: React.FC = () => {
    const { data, setStepValidity } = useAddCarWizardStore();

    React.useEffect(() => {
        setStepValidity(true);
        return () => setStepValidity(false);
    }, [setStepValidity]);

    return (
        <div className="h-full flex flex-col justify-start w-full">
            <div className="mb-6">
                <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-900 mb-2 tracking-tight">Revisão Final</h2>
                <p className="text-slate-500">
                    Revise seu anúncio antes de publicar.
                </p>
            </div>

            {/* Preview Card - Flex Row (Desktop) / Col (Mobile) */}
            <div className="bg-slate-50/80 rounded-[2rem] overflow-hidden mb-8 ring-1 ring-slate-200/60 relative z-10 w-full flex flex-col md:flex-row shadow-sm text-left">

                {/* Left Side: Image */}
                <div className="w-full md:w-5/12 h-64 md:h-auto min-h-[300px] relative mt-0">
                    <img
                        src={(data.photos && data.photos.length > 0) ? data.photos[0] : 'https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&q=80&w=800'}
                        alt="Car Preview"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent"></div>

                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">Diária</span>
                        <span className="text-lg font-bold text-[#3667AA]">R$ {data.pricePerDay || '--'}</span>
                    </div>
                </div>

                {/* Right Side: Details */}
                <div className="w-full md:w-7/12 p-8 flex flex-col justify-center bg-white/40">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-2xl font-display font-bold text-slate-900 leading-tight mb-1">{data.make || 'Marca'} {data.model || 'Modelo'}</h3>
                            <p className="text-slate-500 font-medium text-sm">{data.year || 'Ano'} • {data.color || 'Cor'} • {data.transmission || 'Câmbio'}</p>
                        </div>
                        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm self-start">
                            <span className="text-xs font-bold text-slate-600 tracking-widest uppercase">{data.licensePlate || 'PLACA'}</span>
                        </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-8 line-clamp-3">
                        {data.description || 'Descrição não informada. Edite o passo anterior para tornar seu anúncio mais atrativo.'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {(data.features && data.features.length > 0 ? data.features : ['Completão', 'Econômico']).slice(0, 4).map(f => (
                            <span key={f} className="text-[10px] font-bold uppercase tracking-wider bg-white text-slate-500 px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                                {f}
                            </span>
                        ))}
                        {(data.features?.length || 0) > 4 && (
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-400 px-3 py-1.5 rounded-lg border border-slate-200">
                                +{((data.features?.length || 0) - 4)}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-slate-500 border-t border-slate-200/60 pt-6 mt-auto">
                        <i className="fas fa-map-marker-alt text-[#3667AA]"></i>
                        <span className="font-medium">{data.neighborhood || data.location || 'Localização não definida'}</span>
                        {data.address && <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 ml-2">Endereço Privado OK</span>}
                    </div>
                </div>
            </div>

            <p className="text-center text-xs text-slate-400 mt-4 mx-auto max-w-xs">
                Ao publicar, você concorda com nossos termos de serviço e política de privacidade.
            </p>
        </div>
    );
};

export default Step7_Review;
