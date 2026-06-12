import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/core/data/auth/auth.types';
import { getProfileMenuSections } from '@/features/profile/logic/profileMenu.logic';
import { ELITE_EASE, Z_INDEX } from './constants';

interface HeaderDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    user?: User | null;
    onHelpCenterClick?: () => void;
    onBecomeHostClick: () => void;
    onLoginClick?: () => void;
    onSignupClick?: () => void;
    onEditProfileClick?: () => void;
    onDashboardClick?: () => void;
    onFavoritesClick?: () => void;
    onChatClick?: () => void;
    onFinancialClick?: () => void;
    onOwnerCenterClick?: () => void;
    onVerificationClick?: () => void;
    onSettingsClick?: () => void;
    onLogout?: () => void;
}

export const HeaderDropdown: React.FC<HeaderDropdownProps> = ({
    isOpen,
    onClose,
    user,
    onHelpCenterClick,
    onBecomeHostClick,
    onLoginClick,
    onSignupClick,
    onEditProfileClick,
    onDashboardClick,
    onFavoritesClick,
    onChatClick,
    onFinancialClick,
    onOwnerCenterClick,
    onVerificationClick,
    onSettingsClick,
    onLogout,
}) => {
    const userAvatar = user?.avatar;

    const sections = user ? getProfileMenuSections(user) : [];

    const handleMenuClick = (id: string) => {
        onClose();
        switch (id) {
            case 'host': onBecomeHostClick(); break;
            case 'owner-center': onOwnerCenterClick && onOwnerCenterClick(); break;
            case 'trips': onDashboardClick && onDashboardClick(); break;
            case 'wallet': onFinancialClick && onFinancialClick(); break;
            case 'chat': onChatClick && onChatClick(); break;
            case 'profile-edit': onEditProfileClick && onEditProfileClick(); break;
            case 'settings': onSettingsClick && onSettingsClick(); break;
            case 'favorites': onFavoritesClick && onFavoritesClick(); break;
            case 'verification': onVerificationClick && onVerificationClick(); break;
            case 'help': onHelpCenterClick && onHelpCenterClick(); break;
            default: break;
        }
    };

    const dropdownRef = React.useRef<HTMLDivElement>(null);

    // Manual Click Outside Listener
    React.useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && dropdownRef.current.contains(event.target as Node)) return;
            onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop: Subtle overlay to help focus */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                        className={`fixed inset-0 z-[${Z_INDEX.BACKDROP}] bg-slate-900/[0.02] backdrop-blur-[1px]`}
                    />

                    {/* Dropdown Menu: Absolutely Positioned for native behavior */}
                    <motion.div
                        ref={dropdownRef}
                        initial={{ opacity: 0, y: 15, scale: 0.98, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 15, scale: 0.98, filter: 'blur(10px)' }}
                        transition={{ duration: 0.5, ease: ELITE_EASE }}
                        className={`absolute right-0 top-full mt-4 w-[320px] bg-white/95 backdrop-blur-3xl rounded-[28px] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.02)] border border-white/60 z-[${Z_INDEX.DROPDOWN}] overflow-hidden origin-top-right antialiased`}
                    >
                        {!user ? (
                            /* GUEST MENU (Elite Design) */
                            <motion.div
                                initial="closed"
                                animate="open"
                                variants={{
                                    open: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
                                    closed: { transition: { staggerChildren: 0.03, staggerDirection: -1 } }
                                }}
                                className="flex flex-col py-3"
                            >
                                <div className="px-3">
                                    <span className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 block">Bem-vindo</span>

                                    <motion.button
                                        variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 10 } }}
                                        onClick={() => { onClose(); onBecomeHostClick(); }}
                                        className="w-full text-left px-4 py-3 rounded-xl hover:bg-slate-50 transition-all duration-300 group relative overflow-hidden mb-3"
                                    >
                                        <div className="flex justify-between items-center relative z-10">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[14px] font-bold text-primary transition-colors">Anuncie seu carro</span>
                                                <span className="text-[11px] text-slate-500 font-medium leading-snug max-w-[160px]">É fácil anunciar seu carro e ganhar uma renda extra.</span>
                                            </div>
                                            <img src="/assets/car-3d-blue.png" alt="Carro 3D" className="w-24 h-auto object-contain -mr-2 group-hover:scale-110 transition-transform duration-500" />
                                        </div>
                                    </motion.button>

                                    <div className="flex flex-col gap-1">
                                        {[
                                            { label: 'Central de Ajuda', icon: 'fa-circle-question', onClick: onHelpCenterClick },
                                            { label: 'Cadastre-se', icon: 'fa-user-plus', onClick: onSignupClick },
                                            { label: 'Entrar', icon: 'fa-sign-in-alt', onClick: onLoginClick }
                                        ].map((item) => (
                                            <motion.button
                                                key={item.label}
                                                variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -10 } }}
                                                onClick={() => { onClose(); item.onClick && item.onClick(); }}
                                                className="w-full flex items-center gap-3 py-1.5 px-4 rounded-xl hover:bg-slate-50 transition-all duration-300 group text-left"
                                            >
                                                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-transparent text-slate-500 group-hover:text-slate-600 transition-all duration-500">
                                                    <i className={`fas ${item.icon} text-[13px]`}></i>
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <span className="text-[14px] font-semibold tracking-tight transition-colors text-slate-900 group-hover:text-slate-900">{item.label}</span>
                                                </div>
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            /* MEMBER MENU (Elite Design) */
                            <motion.div
                                initial="closed"
                                animate="open"
                                variants={{
                                    open: { transition: { staggerChildren: 0.04, delayChildren: 0.1 } },
                                    closed: { transition: { staggerChildren: 0.02, staggerDirection: -1 } }
                                }}
                                className="flex flex-col"
                            >
                                {/* Active Profile Section */}
                                <motion.div
                                    variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: -10 } }}
                                    className="p-6 bg-slate-50/50 border-b border-slate-100/50 mb-1 cursor-pointer group"
                                    onClick={() => { onClose(); onEditProfileClick && onEditProfileClick(); }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-500">
                                                {userAvatar ? (
                                                    <img src={userAvatar} alt={user.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-primary font-bold text-xl">{user.name.charAt(0)}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full"></div>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[17px] font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">{user.name}</span>
                                            <div className="mt-1">
                                                {(() => {
                                                    const status = user.verification?.status;
                                                    let text = 'Não Verificado';
                                                    let colorClass = 'bg-slate-100 text-slate-500 border-slate-200';

                                                    if (status === 'APPROVED') {
                                                        text = 'Verificado';
                                                        colorClass = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                                                    } else if (status === 'IN_REVIEW') {
                                                        text = 'Em Análise';
                                                        colorClass = 'bg-amber-50 text-amber-600 border-amber-100';
                                                    } else if (status === 'REJECTED') {
                                                        text = 'Ação Necessária';
                                                        colorClass = 'bg-rose-50 text-rose-600 border-rose-100';
                                                    }

                                                    return (
                                                        <span className={`px-3 py-1 mt-0.5 rounded-full text-xs font-bold tracking-wide border ${colorClass} inline-flex items-center gap-1.5`}>
                                                            {status === 'APPROVED' && <i className="fas fa-check text-[10px]"></i>}
                                                            {text}
                                                        </span>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Scrollable Content */}
                                <div className="py-2 overflow-y-auto max-h-[calc(100vh-320px)] custom-scrollbar">
                                    {sections.map((section, idx) => (
                                        <div key={section.title} className={`px-3 ${idx > 0 ? 'mt-4 pt-4 border-t border-slate-100/50' : ''}`}>
                                            <span className="px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2 block">{section.title}</span>
                                            <div className="flex flex-col gap-0.5">
                                                {section.items.map((item) => (
                                                    <motion.button
                                                        key={item.id}
                                                        variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: -10 } }}
                                                        onClick={() => handleMenuClick(item.id)}
                                                        className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group text-left ${item.highlight ? 'bg-primary/[0.03] hover:bg-primary/[0.06]' : 'hover:bg-slate-50'}`}
                                                    >
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-500 ${item.highlight ? 'bg-primary/10 text-primary scale-105' : 'bg-white border border-slate-100 text-slate-400 group-hover:text-slate-600 shadow-sm'}`}>
                                                            <i className={`fas ${item.icon} text-[13px]`}></i>
                                                        </div>
                                                        <div className="flex flex-col flex-1">
                                                            <span className={`text-[14.5px] font-semibold tracking-tight ${item.highlight ? 'text-primary' : 'text-slate-700 group-hover:text-slate-900'}`}>{item.label}</span>
                                                            {item.sub && <span className="text-[10px] text-slate-400 font-medium">{item.sub}</span>}
                                                        </div>
                                                        {item.badge && (
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${item.badgeColor || 'bg-primary text-white'}`}>
                                                                {item.badge}
                                                            </span>
                                                        )}
                                                    </motion.button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Logout Footer */}
                                <motion.div
                                    variants={{ open: { opacity: 1 }, closed: { opacity: 0 } }}
                                    className="p-3 bg-slate-50/50 border-t border-slate-100 mt-2"
                                >
                                    <button
                                        onClick={() => { onClose(); onLogout && onLogout(); }}
                                        className="w-full py-3 text-center text-[12px] font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-500 uppercase tracking-widest"
                                    >
                                        Sair da conta
                                    </button>
                                </motion.div>
                            </motion.div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};


