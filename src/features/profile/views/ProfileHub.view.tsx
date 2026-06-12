import React from 'react';
import { createPortal } from 'react-dom';
import { User } from '@/core/data/auth/auth.types';
import { UserAvatar } from '@/core/components/UserAvatar';
import { useProfileHubLogic } from '../hooks/useProfileHub.logic';


interface ProfileHubProps {
    user: User;
    onNavigate: (page: string) => void;
    onLogout: () => void;
}

const ProfileHub: React.FC<ProfileHubProps> = ({ user, onNavigate, onLogout }) => {
    const {
        memberSince,
        sections,
        handleNavigate,
        showLogoutConfirm,
        setShowLogoutConfirm,
        handleLogoutConfirm
    } = useProfileHubLogic(user, onNavigate, onLogout);

    return (
        <div className="bg-transparent min-h-screen pb-24 font-sans relative overflow-hidden">

            {/* Content Wrapper */}
            <div className="relative z-10 max-w-7xl mx-auto w-full">

                {/* Header (Standardized) - No Back Button needed for Hub usually, but sticking to design system */}
                <div className="px-6 pt-6 pb-2 flex justify-between items-center">
                    <div>
                        <h1 className="text-[26px] md:text-[32px] font-display font-bold text-[#1C2230] tracking-tight">Meu Perfil</h1>
                    </div>

                </div>

                {/* LOGOUT CONFIRMATION MODAL */}
                {/* LOGOUT CONFIRMATION MODAL - "Private Glass Sheet" Design */}
                {showLogoutConfirm && createPortal(
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
                            onClick={() => setShowLogoutConfirm(false)}
                        ></div>

                        {/* Floating Card */}
                        <div className="relative z-[101] w-full max-w-sm bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)] rounded-[2.5rem] p-8 animate-in zoom-in-95 fade-in duration-300">

                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-slate-100/50 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full"></div>
                                    <i className="fas fa-sign-out-alt text-3xl text-slate-400 relative z-10"></i>
                                </div>
                                <h3 className="text-2xl font-bold text-[#1C2230] mb-3 tracking-tight">Sair?</h3>
                                <p className="text-[#64748B] text-sm leading-relaxed px-4">
                                    Ao sair, você precisará fazer login novamente para acessar sua conta.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleLogoutConfirm}
                                    className="w-full py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                                >
                                    <span>Sair</span>
                                </button>
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="w-full py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-100/50 hover:text-slate-700 transition-all"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}

                <div className="px-6 space-y-8 mt-2">

                    {/* User Info Card - Standardized White Card */}
                    <button
                        onClick={() => handleNavigate('profile-edit')}
                        className="w-full bg-white rounded-3xl p-1 shadow-sm md:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] border border-slate-200 md:border-gray-100 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm group relative overflow-hidden"
                    >
                        {/* Top Highlight */}
                        <div className="absolute inset-x-0 top-0 h-px bg-white/60"></div>

                        <div className="rounded-[2.2rem] px-6 pb-6 pt-10 flex flex-col items-center text-center relative z-10">

                            <div className="relative mb-4">
                                <UserAvatar
                                    src={user.avatar}
                                    name={user.name}
                                    className="w-24 h-24 rounded-full ring-8 ring-white shadow-xl"
                                />
                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md">
                                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-[10px]">
                                        <i className="fas fa-check"></i>
                                    </div>
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-[#1C2230] tracking-tight mb-1 group-hover:text-[#3667AA] transition-colors">{user.name}</h2>
                            <p className="text-sm text-[#9CA3AF] mb-4 font-medium">{user.email}</p>

                            <div className="flex items-center gap-2">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                    <i className="fas fa-star text-slate-300"></i>
                                    5.0
                                </span>
                                <span className="text-xs text-slate-400 font-medium tracking-wide">
                                    Desde {memberSince}
                                </span>
                            </div>
                        </div>
                    </button>

                    {/* Premium List - With Section Granularity */}
                    <div className="flex flex-col gap-6 w-full pb-0">
                        {sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className={section.items.every(item => item.desktopOnly) ? 'hidden md:block' : ''}>
                                {/* Section Title - Granularity - UPDATED: Darker Title */}
                                <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#1C2230] mb-3 px-4 flex items-center gap-2 opacity-100">
                                    <div className="w-1 h-1 rounded-full bg-slate-400"></div>
                                    {section.title}
                                </h3>

                                <div className="flex flex-col gap-1">
                                    {section.items.map((action, index) => (
                                        <React.Fragment key={action.id}>
                                            {action.highlight ? (
                                                <button
                                                    onClick={() => handleNavigate(action.id)}
                                                    className={`w-full bg-white rounded-3xl p-4 flex items-center gap-4 shadow-sm md:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] border border-slate-200 md:border-gray-100 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm group relative overflow-hidden ${action.desktopOnly ? 'hidden md:flex' : ''}`}
                                                >
                                                    {/* Top Highlight (Lighting from above) */}
                                                    <div className="absolute inset-x-0 top-0 h-px bg-white/60"></div>

                                                    {/* 3D Car Image - Scale up slightly for impact */}
                                                    <div className="w-28 h-20 shrink-0 relative -ml-4 z-10 flex items-center justify-center">
                                                        <img
                                                            src="/assets/car-3d-blue.png"
                                                            alt="Carro 3D"
                                                            className="w-full h-full object-contain drop-shadow-lg transform transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    </div>

                                                    {/* Text Content */}
                                                    <div className="flex-1 text-left z-10 min-w-0">
                                                        <h3 className="text-base font-bold text-primary mb-0.5 whitespace-nowrap">Anuncie seu carro</h3>
                                                        <p className="text-xs text-[#64748B] font-medium leading-tight group-hover:text-slate-600">
                                                            É fácil anunciar seu carro<br />e ganhar uma renda extra.
                                                        </p>
                                                    </div>


                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleNavigate(action.id)}
                                                    className={`group flex items-center gap-4 md:gap-5 py-3.5 px-4 md:p-5 rounded-2xl hover:bg-white border border-transparent hover:border-gray-100 hover:shadow-sm transition-all cursor-pointer w-full ${action.desktopOnly ? 'hidden md:flex' : ''}`}
                                                >
                                                    <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 text-slate-400 transition-colors ${action.id === 'logout' ? 'group-hover:text-slate-500 group-hover:bg-slate-100' : 'group-hover:text-[#3667AA]'}`}>
                                                        <i className={`fas ${action.icon} text-lg`}></i>
                                                    </div>

                                                    <div className="flex-1 text-left">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-sm font-bold transition-colors ${action.id === 'logout' ? 'text-slate-500 group-hover:text-slate-600' : 'text-[#1C2230] group-hover:text-[#3667AA]'}`}>{action.label}</span>
                                                            {action.badge && (
                                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide whitespace-nowrap ${action.badgeColor}`}>
                                                                    {action.badge}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {action.sub && (
                                                            <span className="text-[11px] text-[#9CA3AF] font-medium block">
                                                                {action.sub}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <i className={`fas fa-chevron-right text-xs transition-colors ${action.id === 'logout' ? 'text-slate-300 group-hover:text-slate-400' : 'text-slate-300 group-hover:text-[#3667AA]'}`}></i>
                                                </button>
                                            )
                                            }

                                            {/* Divider - Exact replica of EditProfile style */}
                                            {/* Only show if not the last item */}
                                            {
                                                index < section.items.length - 1 && (
                                                    <div className="hidden md:block h-px bg-slate-200/50 w-full ml-14"></div>
                                                )
                                            }
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Logout Button moved to menu list */}

                </div>
            </div>
        </div >
    );
};

export default ProfileHub;
