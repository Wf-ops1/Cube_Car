import React from 'react';
import { UserAvatar } from '@/core/components/UserAvatar';

interface ProfileEmptyStateProps {
    avatar: string;
    name: string;
    onStartEditing: () => void;
}

export const ProfileEmptyState: React.FC<ProfileEmptyStateProps> = ({ avatar, name, onStartEditing }) => {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] py-12">
            <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-10 flex flex-col items-center mb-10 relative z-10 transition-transform hover:scale-[1.01]">
                <div className="w-28 h-28 rounded-full mb-6 ring-8 ring-white shadow-2xl grayscale opacity-60">
                    <UserAvatar src={avatar} name={name} className="w-full h-full rounded-full text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-slate-400 mb-2">{name}</h2>
                <span className="px-4 py-1.5 bg-slate-100 text-slate-400 rounded-full text-[11px] font-bold uppercase tracking-wider border border-slate-200 mb-2">
                    Perfil Incompleto
                </span>
            </div>

            {/* CTA Section */}
            <div className="text-center w-full max-w-md px-4">
                <h3 className="text-3xl font-display font-bold text-slate-900 mb-4 tracking-tight leading-tight">
                    Seu perfil,<br />seu passaporte.
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-8 max-w-xs mx-auto">
                    Membros com perfil completo têm <span className="text-slate-900 font-bold">3x mais aprovações</span>.<br />Leva menos de 2 minutos.
                </p>

                <button
                    onClick={onStartEditing}
                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl shadow-xl shadow-slate-900/20 active:scale-95 transition-all hover:shadow-slate-900/30 hover:bg-slate-800 flex items-center justify-center gap-3 group"
                >
                    <span>Completar Perfil</span>
                    <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
                </button>
            </div>
        </div>
    );
};
