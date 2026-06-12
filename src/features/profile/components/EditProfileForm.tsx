import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { UserAvatar } from '@/core/components/UserAvatar';
import { BackButton } from '@/core/components/buttons/BackButton';

interface EditProfileFormProps {
    formData: {
        name: string;
        bio: string;
        city: string;
        job: string;
        languages: string;
        avatar: string;
        selectedInterests: string[];
    };
    setters: {
        setCity: (v: string) => void;
        setLanguages: (v: string) => void;
        setJob: (v: string) => void;
        setBio: (v: string) => void;
    };
    isProfileEmpty: boolean;
    onBack: () => void;
    onCancelEditing: () => void;
    onSave: () => void;
    isSaving: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenInterests: () => void;
}

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
    formData, setters, isProfileEmpty, onBack, onCancelEditing, onSave, isSaving, onFileChange, onOpenInterests
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { bio, city, job, languages, avatar, selectedInterests, name } = formData;
    const { setBio, setCity, setJob, setLanguages } = setters;

    return (
        <motion.div
            key="edit-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex flex-col h-full relative z-10"
        >
            {/* Header - Minimalist */}
            <div className="relative z-20 px-4 md:px-8 py-8 lg:py-16 flex items-center justify-between max-w-7xl mx-auto w-full">
                <BackButton
                    onClick={isProfileEmpty ? onCancelEditing : onBack}
                    className="bg-white/60 backdrop-blur-md border border-white/50 shadow-sm relative z-50"
                />
                <div className="flex items-center gap-2 bg-white/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/50 shadow-sm">
                    <i className="fas fa-pen text-slate-500 text-xs"></i>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Personal Brand</span>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-4 md:px-8 w-full max-w-7xl mx-auto pb-32 relative z-10">

                <div className="grid md:grid-cols-[300px_1fr] gap-8 md:mt-8">
                    {/* Left Column: Avatar */}
                    <div className="flex flex-col items-center">
                        {/* Avatar Hero - " The Protagonist" */}
                        <div className="relative group cursor-pointer w-full max-w-[200px]" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-full aspect-square rounded-[2rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] bg-slate-100 relative group-hover:scale-[1.02] transition-transform duration-300">
                                <UserAvatar src={avatar} name={name} className="w-full h-full text-5xl" />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
                                    <i className="fas fa-crop-alt text-white text-2xl mb-1"></i>
                                    <span className="text-[10px] uppercase font-bold text-white tracking-widest">Ajustar Foto</span>
                                </div>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={onFileChange}
                                className="hidden"
                            />
                            {/* Edit Badge */}
                            <div className="absolute -bottom-4 -right-2 w-12 h-12 bg-[#181824] rounded-full flex items-center justify-center text-white border-[4px] border-white shadow-lg pointer-events-none">
                                <i className="fas fa-pen text-sm"></i>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Form Fields */}
                    <div className="space-y-12 bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 md:p-10 shadow-sm">

                        {/* 2. City (Mandatory) */}
                        <div className="group">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 group-focus-within:text-[#3667AA] transition-colors">Onde moro (Cidade)</label>
                            <div className="relative">
                                <i className="fas fa-map-marker-alt absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3667AA] transition-colors"></i>
                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3667AA]/20 focus:bg-white transition-all"
                                    placeholder="Sua cidade base"
                                />
                            </div>
                        </div>

                        {/* Grid for small inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* 3. Languages (Optional) */}
                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 group-focus-within:text-[#3667AA] transition-colors">Idiomas que falo</label>
                                <div className="relative">
                                    <i className="fas fa-language absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3667AA] transition-colors"></i>
                                    <input
                                        type="text"
                                        value={languages}
                                        onChange={(e) => setLanguages(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3667AA]/20 focus:bg-white transition-all"
                                        placeholder="Ex: Português, Inglês..."
                                    />
                                </div>
                            </div>

                            {/* 4. Job (Optional) */}
                            <div className="group">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 group-focus-within:text-[#3667AA] transition-colors">Meu trabalho</label>
                                <div className="relative">
                                    <i className="fas fa-briefcase absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3667AA] transition-colors"></i>
                                    <input
                                        type="text"
                                        value={job}
                                        onChange={(e) => setJob(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 text-base font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3667AA]/20 focus:bg-white transition-all"
                                        placeholder="Ex: Designer, Engenheiro..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 5. Interests (Renamed) - Preview & Trigger */}
                        <div className="group">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 group-focus-within:text-[#3667AA] transition-colors">Meus hobbies e interesses</label>
                            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                                Mostre o que te move. A afinidade gera confiança imediata e facilita a aprovação das suas reservas.
                            </p>

                            {/* Reference-Style Ghost Placeholders (if empty) */}
                            {selectedInterests.length === 0 && (
                                <div className="flex gap-4 mb-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="w-16 h-10 rounded-full border border-dashed border-slate-300 flex items-center justify-center text-slate-300">
                                            <i className="fas fa-plus text-xs"></i>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Selected Interests Preview */}
                            {selectedInterests.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedInterests.map(interest => (
                                        <span key={interest} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[11px] font-bold">
                                            {interest}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Trigger Button - Solid Light Gray (Reference Style) */}
                            <button
                                onClick={onOpenInterests}
                                className="px-6 py-3 bg-[#181824] text-white rounded-xl font-bold text-sm shadow-lg shadow-slate-900/10 hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                Adicionar interesses
                            </button>
                        </div>

                        {/* 6. Fun Fact (Optional) */}
                        <div className="group">
                            <div className="flex justify-between items-end mb-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 group-focus-within:text-[#3667AA] transition-colors">Uma curiosidade sobre mim</label>
                                <span className={`text-[10px] font-mono ${bio.length > 300 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                                    {bio.length}/300
                                </span>
                            </div>
                            <div className="relative">
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    rows={4}
                                    maxLength={300}
                                    className="w-full bg-slate-50 rounded-2xl p-4 text-base leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#3667AA]/10 focus:bg-white transition-all resize-none placeholder-slate-400"
                                    placeholder="Campo livre para se diferenciar..."
                                />
                                {/* Decorative Quote */}
                                <i className="fas fa-lightbulb absolute top-4 right-4 text-slate-400 text-xl pointer-events-none"></i>
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            {/* Sticky Action Footer - Floating */}
            <div className="fixed bottom-6 left-0 right-0 z-30 px-6">
                <div className="max-w-md mx-auto">
                    <button
                        onClick={onSave}
                        disabled={isSaving}
                        className="w-full bg-[#181824] text-white font-bold h-14 rounded-full shadow-2xl shadow-slate-900/20 active:scale-95 transition-all flex items-center justify-between px-2 pl-6"
                    >
                        <span>{isSaving ? 'Salvando...' : 'Salvar Perfil'}</span>
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            {isSaving ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-arrow-right"></i>}
                        </div>
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
