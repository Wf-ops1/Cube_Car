import React from 'react';
import { mockReviews } from '@/core/data/reputation/reputation.mock';

interface ProfileAboutSectionProps {
    bio: string;
    job: string;
    city: string;
    languages: string;
    selectedInterests: string[];
    onEdit: () => void;
}

export const ProfileAboutSection: React.FC<ProfileAboutSectionProps> = ({
    bio, job, city, languages, selectedInterests, onEdit
}) => {

    const renderRow = (icon: string, label: string, value: string, placeholder: string) => (
        <div
            onClick={onEdit}
            className="group flex items-center gap-6 p-4 rounded-2xl hover:bg-white/60 transition-all cursor-pointer border border-transparent hover:border-slate-200/60"
        >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${value ? 'text-slate-700 bg-slate-100' : 'text-slate-300 bg-slate-50'}`}>
                <i className={`fas ${icon} text-lg`}></i>
            </div>
            <div className="flex-1">
                {value ? (
                    <div>
                        <span className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-0.5">{label}</span>
                        <p className={`text-sm text-slate-900 ${label === 'Sobre' ? 'font-medium leading-normal line-clamp-3' : 'font-bold'}`}>
                            {label === 'Sobre' ? `"${value}"` : value}
                        </p>
                    </div>
                ) : (
                    <span className="text-sm font-medium text-slate-400 group-hover:text-slate-600 transition-colors">{placeholder}</span>
                )}
            </div>
            <i className="fas fa-chevron-right text-slate-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity"></i>
        </div>
    );

    const divider = <div className="h-px bg-slate-100 ml-14"></div>;

    return (
        <div className="flex flex-col gap-6">
            {/* About Me List - Glass Container */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/60 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2 px-2">
                    <i className="fas fa-user-circle text-slate-300"></i>
                    Sobre mim
                </h3>

                <div className="flex flex-col gap-1 w-full">
                    {renderRow('fa-quote-left', 'Sobre', bio, 'Adicionar biografia')}
                    {divider}
                    {renderRow('fa-briefcase', 'Profissão', job, 'Adicionar profissão')}
                    {divider}
                    {renderRow('fa-map-marker-alt', 'Localização', city, 'Adicionar localização')}
                    {divider}
                    {renderRow('fa-globe', 'Idiomas', languages, 'Adicionar idiomas')}
                </div>
            </div>

            {/* INTERESTS SECTION */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6 px-2">Meus interesses</h3>
                <div
                    onClick={onEdit}
                    className={`p-4 rounded-2xl border border-transparent hover:bg-white/50 hover:border-slate-100 transition-all cursor-pointer ${selectedInterests.length === 0 ? 'bg-slate-50/50 border-dashed !border-slate-200' : ''}`}
                >
                    {selectedInterests.length > 0 ? (
                        <div className="flex flex-wrap gap-3">
                            {selectedInterests.map((interest, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-700 bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm">
                                    <i className={`fas ${['fa-utensils', 'fa-camera', 'fa-music', 'fa-running', 'fa-book'][i % 5]} text-slate-400`}></i>
                                    <span className="text-sm font-medium">{interest}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex items-center gap-3 text-slate-400">
                            <i className="fas fa-plus-circle"></i>
                            <span className="text-sm font-medium">O que você gosta de fazer?</span>
                        </div>
                    )}
                </div>
            </div>

            {/* REVIEWS SECTION */}
            <div className="bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/60 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 mb-6 px-2">
                    <h3 className="text-lg font-bold text-slate-900">Avaliações escritas por mim</h3>
                    <span className="bg-[#3667AA]/10 text-[#3667AA] px-2 py-0.5 rounded-full text-xs font-bold">{mockReviews.length}</span>
                </div>

                {mockReviews.length > 0 ? (
                    <div className="flex flex-col gap-4">
                        {mockReviews.map(review => (
                            <div key={review.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-50 transition-colors"></div>

                                <div className="flex items-start gap-4 relative z-10">
                                    <img src={review.authorAvatar || "https://i.pravatar.cc/150"} alt={review.authorName || "Anônimo"} className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200" />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-800 text-sm truncate">{review.authorName || "Anônimo"}</h4>
                                            <span className="text-xs font-medium text-slate-400 shrink-0">{new Date(review.createdAt).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '')}</span>
                                        </div>
                                        <div className="flex gap-0.5 text-[#3667AA] text-[10px] mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <i key={i} className={`fas fa-star ${i < review.overallRating ? '' : 'text-slate-200'}`}></i>
                                            ))}
                                        </div>
                                        <p className="text-sm font-medium text-slate-600 leading-relaxed">"{review.body}"</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 flex gap-4 opacity-50 grayscale">
                        <i className="fas fa-comment-alt text-slate-300 text-xl mt-1"></i>
                        <div>
                            <p className="text-sm font-bold text-slate-800">Nenhuma avaliação ainda</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
