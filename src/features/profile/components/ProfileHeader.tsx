import React from 'react';
import { UserAvatar } from '@/core/components/UserAvatar';
import { User } from '@/core/data/auth/auth.types';

interface ProfileHeaderProps {
    user: User;
    name: string;
    avatar: string;
    profileStrength: number;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, name, avatar, profileStrength }) => {
    return (
        <div className="md:sticky md:top-8">
            {/* User Info Card */}
            <div className="mb-8 bg-[#FAFAFA] backdrop-blur-xl p-1 rounded-[2.5rem] border border-slate-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
                <div className="flex flex-col items-center text-center relative overflow-hidden rounded-[2.2rem] px-6 pb-6 pt-10">
                    {/* Inner Shine (Desktop Only) */}
                    <div className="absolute inset-x-0 top-0 h-px bg-white/60"></div>

                    <div className="relative mb-4">
                        <UserAvatar
                            src={avatar}
                            name={name}
                            className="w-24 h-24 rounded-full ring-8 ring-white shadow-xl"
                        />
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md">
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">
                                <i className="fas fa-check"></i>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-2xl font-bold text-slate-900 tracking-tight mb-1">{name}</h2>
                    <p className="text-sm text-slate-500 mb-6 md:mb-4 font-medium">{user.email || 'email@exemplo.com'}</p>

                    <div className="flex items-center gap-2 mb-2 md:mb-0">
                        <span className="px-3 py-1 bg-gradient-to-r from-slate-800 to-slate-700 text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow-md">
                            Anfitrião
                        </span>
                        <span className="px-3 py-1 bg-white/50 border border-white text-slate-500 text-[10px] font-bold rounded-full uppercase tracking-wider backdrop-blur-sm">
                            Desde 2024
                        </span>
                    </div>
                </div>
            </div>

            {/* Status Text */}
            <div className="w-full bg-white/30 backdrop-blur-md rounded-3xl p-6 border border-white/50">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                        <i className="fas fa-eye text-slate-400"></i>
                        Força do Perfil
                    </h3>
                    <span className="text-[10px] bg-white text-slate-600 px-2 py-1 rounded-full font-bold shadow-sm">
                        {profileStrength} / 5
                    </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full bg-gradient-to-r from-blue-400 to-[#3667AA] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${(profileStrength / 5) * 100}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed mt-3">
                    Complete seu perfil para aumentar em 3x suas chances de aprovação.
                </p>
            </div>
        </div>
    );
};
