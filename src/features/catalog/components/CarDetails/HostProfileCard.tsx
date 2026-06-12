import React from 'react';
import { UserAvatar } from '@/core/components/UserAvatar';

interface HostCardProps {
    owner: any;
    rating?: number;
    reviewsCount?: number;
    onOpenProfile: (user: any) => void;
    onContactHost?: () => void;
}

export const HostHeaderCard: React.FC<HostCardProps> = ({ owner, rating = 5.0, reviewsCount = 0, onOpenProfile }) => {
    return (
        <div className="flex items-center gap-4 group cursor-pointer transition-colors" onClick={() => onOpenProfile(owner)}>
            <div className="relative shrink-0">
                <UserAvatar
                    src={owner.avatar}
                    name={owner.name}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover ring-4 ring-white shadow-sm grayscale-0"
                    style={{ filter: 'grayscale(0%)', WebkitFilter: 'grayscale(0%)' }}
                />
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <div className="w-4 h-4 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <i className="fas fa-check text-[8px]"></i>
                    </div>
                </div>
            </div>
            <div>
                <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-[10px] uppercase tracking-widest text-[#3667AA] font-extrabold">Proprietário</p>
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-[#1C2230] group-hover:text-[#3667AA] transition-colors leading-tight">{owner.name}</h3>

                {reviewsCount > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium mt-0.5">
                        <i className="fas fa-star text-gray-400 text-[10px]"></i>
                        <span>{rating}</span>
                        <span className="text-gray-400">({reviewsCount} avaliações)</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export const HostSignatureCard: React.FC<HostCardProps> = ({ owner, onOpenProfile, onContactHost }) => {
    return (
        <div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-center">
                {/* Left: Avatar (No Badge) */}
                <div className="shrink-0 relative">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 border border-gray-200">
                        <img
                            src={owner.avatar}
                            className="w-full h-full object-cover rounded-full grayscale-0"
                            alt={owner.name}
                            style={{ filter: 'grayscale(0%)', WebkitFilter: 'grayscale(0%)' }}
                        />
                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 space-y-4 text-center md:text-left">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-[#3667AA] mb-1">Anfitrião</p>
                        <h3 className="text-2xl md:text-3xl font-display font-bold text-[#1C2230]">{owner.name}</h3>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-1">
                            <i className="fas fa-star text-gray-300 text-xs"></i>
                            <span className="text-sm font-bold text-[#1C2230]">{owner.rating || "4.98"}</span>
                        </div>
                    </div>

                    <p className="text-gray-600 font-light leading-relaxed max-w-2xl text-lg">
                        "{owner.bio?.substring(0, 150) || "Motorista entusiasta e Host dedicado. Adoro compartilhar meu Tesla e garantir a melhor experiência possível. Conte comigo!"}"
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                        {onContactHost && (
                            <button
                                onClick={onContactHost}
                                className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 md:py-4 rounded-[2rem] bg-gray-100 text-slate-800 font-bold hover:bg-gray-200 active:scale-95 transition-all group/chat overflow-hidden"
                            >
                                <i className="fas fa-comment-dots text-lg text-gray-400 group-hover/chat:text-[#3667AA] transition-colors"></i>
                                <span className="text-sm tracking-wide">Falar com Anfitrião</span>
                            </button>
                        )}
                        <button
                            onClick={() => onOpenProfile(owner)}
                            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-3 md:py-4 rounded-[2rem] border border-gray-200 text-slate-800 font-bold hover:bg-gray-50 active:scale-95 transition-all mx-auto md:mx-0"
                        >
                            <span className="text-sm tracking-wide">Ver Perfil Completo</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
