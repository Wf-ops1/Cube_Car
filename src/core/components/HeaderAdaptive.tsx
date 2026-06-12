import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/core/data/auth/auth.types';
import Logo from '@/shared/components/ui/Logo';

interface HeaderAdaptiveProps {
    user: any;
    isHidden: boolean;
    isSearchExpanded: boolean;
    onSearchClick: () => void;
    navigateTo: (page: string) => void;
}

const HeaderAdaptive: React.FC<HeaderAdaptiveProps> = ({
    user,
    isHidden,
    isSearchExpanded,
    onSearchClick,
    navigateTo
}) => {
    return (
        <>
            <motion.nav
                initial={{ y: 0 }}
                animate={{
                    y: isHidden && !isSearchExpanded ? -100 : 0,
                    backgroundColor: isSearchExpanded ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.8)'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }} // Antigravity Physics
                className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-xl border-b border-slate-200/50 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                    {/* Logo Area - Hides on Search Expand */}
                    <AnimatePresence>
                        {!isSearchExpanded && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => navigateTo('home')}
                            >
                                <Logo className="h-8 text-indigo-600" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Search & Actions Area */}
                    <div className={`flex items-center gap-4 transition-all duration-500 ${isSearchExpanded ? 'w-full' : ''}`}>

                        {/* Morphing Search Pill */}
                        <motion.button
                            layoutId="search-pill"
                            onClick={onSearchClick}
                            className={`flex items-center bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-all ${isSearchExpanded
                                    ? 'flex-1 h-12 px-6 bg-slate-50 border border-slate-200 shadow-inner'
                                    : 'w-10 h-10 justify-center'
                                }`}
                        >
                            <i className={`fas fa-search ${isSearchExpanded ? 'mr-3 text-indigo-500' : ''}`}></i>
                            {isSearchExpanded && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-slate-400 font-medium"
                                >
                                    Para onde vamos hoje?
                                </motion.span>
                            )}
                        </motion.button>

                        {/* User Profile - Hides on Search Expand */}
                        <AnimatePresence>
                            {!isSearchExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200 relative"
                                >
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-bold">
                                            {user?.name?.charAt(0) || 'U'}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Close Search Button */}
                        <AnimatePresence>
                            {isSearchExpanded && (
                                <motion.button
                                    initial={{ opacity: 0, rotation: -90 }}
                                    animate={{ opacity: 1, rotation: 0 }}
                                    exit={{ opacity: 0, rotation: 90 }}
                                    onClick={onSearchClick} // Toggles back
                                    className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600"
                                >
                                    Cancel
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.nav>

            {/* Search Backdrop Overlay */}
            <AnimatePresence>
                {isSearchExpanded && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onSearchClick}
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[90]"
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default HeaderAdaptive;
