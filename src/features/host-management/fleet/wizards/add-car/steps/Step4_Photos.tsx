import React from 'react';
import { useAddCarWizardStore } from '../../AddCarWizard.store';

const Step4_Photos: React.FC = () => {
    const { data, updateData, setStepValidity } = useAddCarWizardStore();

    // Always valid to proceed (can add photos later), but logically we encourage it
    React.useEffect(() => {
        setStepValidity(true);
        return () => setStepValidity(false);
    }, [setStepValidity]);

    // Mock Upload Logic
    const handleUpload = () => {
        // Simulating 4 photos uploaded
        updateData({
            photos: [
                "https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800",
                "https://images.unsplash.com/photo-1503376763036-066120622c74?auto=format&fit=crop&q=80&w=800"
            ]
        });
    };

    const hasPhotos = (data.photos?.length || 0) > 0;

    return (
        <div className="h-full flex flex-col justify-center">
            <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-medium text-slate-900 mb-2 tracking-tight">Fotos do Veículo</h2>
                <p className="text-slate-500">Mostre o melhor do seu carro para os locatários.</p>
            </div>

            {/* Photo Grid / Upload Area */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Main Photo (Big) */}
                <div
                    onClick={handleUpload}
                    className={`col-span-2 row-span-2 aspect-square rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${hasPhotos ? 'border-transparent' : 'border-slate-200 hover:border-[#3667AA] hover:bg-white'
                        }`}
                >
                    {hasPhotos ? (
                        <img src={data.photos![0]} alt="Main" className="w-full h-full object-cover rounded-[2rem] shadow-sm transform transition-transform hover:scale-[1.02]" />
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300 group-hover:text-[#3667AA]">
                                <i className="fas fa-camera text-2xl"></i>
                            </div>
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Adicionar Principal</span>
                        </>
                    )}
                </div>

                {/* Secondary Slots */}
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="aspect-square rounded-[1.5rem] bg-slate-50/50 border border-slate-100 flex items-center justify-center relative group overflow-hidden"
                    >
                        {hasPhotos && data.photos![i] ? (
                            <img src={data.photos![i]} alt={`Slot ${i}`} className="w-full h-full object-cover rounded-[1.5rem]" />
                        ) : (
                            <span className="text-[9px] font-bold text-slate-300 uppercase group-hover:text-slate-500 transition-colors">Vazio</span>
                        )}
                    </div>
                ))}
            </div>

            {!hasPhotos && (
                <p className="text-center text-xs text-slate-400 mt-8">
                    Você pode continuar sem fotos e adicionar depois.
                </p>
            )}
        </div>
    );
};

export default Step4_Photos;
