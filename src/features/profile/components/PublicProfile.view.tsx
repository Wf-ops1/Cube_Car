import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Globe } from 'lucide-react';
import { User } from '@/core/data/auth/auth.types';
import { Car } from '@/core/data/car/car.types';
import TrustBadgeStack from './TrustBadgeStack.view';
import ReputationTabs, { ReputationTabType } from './ReputationTabs.view';


interface PublicProfileProps {
    user: User;
    cars?: Car[]; // Cars owned by this user
    isOpen: boolean;
    onClose: () => void;
    onCarClick: (car: Car) => void;
    onContactClick?: () => void;
}

const PublicProfile: React.FC<PublicProfileProps> = ({
    user,
    cars = [], // Default to empty if not provided (should be populated by logic)
    isOpen,
    onClose,
    onCarClick,
    onContactClick
}) => {
    const [activeTab, setActiveTab] = useState<ReputationTabType>('host');

    // Elite ease from Header
    const eliteEase = [0.23, 1, 0.32, 1];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#1C2230]/40 backdrop-blur-sm z-[90]"
                    />

                    {/* Sheet / Modal */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: '0%' }}
                        exit={{ y: '100%' }}
                        transition={{ duration: 0.6, ease: eliteEase }}
                        className="fixed inset-x-0 bottom-0 md:inset-y-0 md:left-auto md:right-0 md:w-[480px] bg-white z-[100] md:shadow-2xl overflow-hidden rounded-t-[32px] md:rounded-l-[32px] md:rounded-tr-none flex flex-col max-h-[92vh] md:max-h-screen"
                    >
                        {/* Header Actions */}
                        <div className="absolute top-4 right-4 z-50">
                            <button
                                onClick={onClose}
                                className="w-9 h-9 flex items-center justify-center rounded-full bg-white shadow-sm border border-gray-100/50 hover:bg-gray-50 text-slate-400 hover:text-[#1C2230] transition-all backdrop-blur-md"
                            >
                                <X size={20} strokeWidth={2.5} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto flex-1 pb-32 scrollbar-hide relative">

                            {/* 1. Identity Header - Floating */}
                            <div className="relative pt-8 px-6 pb-4 text-center">
                                {/* Avatar - Floating with Glow */}
                                <div className="relative inline-block mb-3">
                                    <div className="w-20 h-20 rounded-full overflow-hidden shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border-4 border-white mx-auto transform hover:scale-105 transition-transform duration-500">
                                        <img
                                            src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {/* Verification Badge - Jewel */}
                                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-0.5 shadow-md">
                                        <div className="w-5 h-5 bg-[#3667AA] text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
                                            <i className="fas fa-check text-[9px]"></i>
                                        </div>
                                    </div>
                                </div>

                                <h2 className="font-display font-medium text-2xl text-[#1C2230] mb-2 tracking-tight">
                                    {user.name}
                                </h2>

                                <div className="flex items-center justify-center gap-2 text-[#9CA3AF] text-[13px] mb-4 font-medium">
                                    <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-2.5 py-1 rounded-full shadow-sm">
                                        <MapPin size={12} />
                                        <span>Florianópolis, SC</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 bg-white border border-gray-100 px-2.5 py-1 rounded-full shadow-sm">
                                        <Globe size={12} />
                                        <span>EN / PT</span>
                                    </div>
                                </div>

                                {/* Trust Stack */}
                                <TrustBadgeStack
                                    isIdentityVerified={true} // Hardcoded for demo/MVP or map from user object
                                    isEmailVerified={true}
                                    isPhoneVerified={true}
                                    memberSince="Maio 2024"
                                    className="items-center justify-center mb-5 opacity-100"
                                />

                                {/* Bio - Editorial Quote */}
                                <div className="relative">
                                    <span className="absolute -top-3 left-0 text-5xl text-slate-200/50 font-serif leading-none select-none">“</span>
                                    <p className="text-[#64748B] leading-snug text-[14px] font-normal max-w-sm mx-auto mb-2 italic relative z-10 px-2">
                                        {user.bio || "Motorista entusiasta e Host dedicado. Adoro compartilhar meu carro e garantir a melhor experiência possível. Conte comigo!"}
                                    </p>
                                </div>
                            </div>

                            {/* 2. Reputation Section */}
                            <div className="px-6 mb-10">
                                <ReputationTabs
                                    activeTab={activeTab}
                                    onTabChange={setActiveTab}
                                    hostRating={user.rating || 4.98}
                                    guestRating={5.0}
                                    hostReviewCount={42}
                                    guestReviewCount={15}
                                    className="mb-6"
                                />

                                {/* Featured Review - Glass Bubble */}
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/95 backdrop-blur-xl border border-slate-100/80 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.12)] rounded-[2rem] p-6 relative"
                                >
                                    <div className="flex gap-1 text-slate-400 mb-3 text-[11px]">
                                        {[1, 2, 3, 4, 5].map(i => <i key={i} className="fas fa-star"></i>)}
                                    </div>
                                    <p className="text-slate-700 text-[15px] leading-relaxed mb-4 font-medium">
                                        "{activeTab === 'host'
                                            ? 'Carro impecável! O Wallace foi super atencioso e me explicou tudo sobre o Tesla.'
                                            : 'Excelente motorista, cuidou muito bem do meu carro. Devolveu limpo e carregado.'}"
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
                                        <div>
                                            <span className="block text-xs font-bold text-slate-900">
                                                {activeTab === 'host' ? 'Sarah M.' : 'Roberto J.'}
                                            </span>
                                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Out 2024</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>


                        </div>

                        {/* Sticky Bottom Action (Contact) */}
                        <div className="absolute bottom-0 inset-x-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50">
                            <button 
                                onClick={onContactClick}
                                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-[#3667AA] hover:bg-[#2a5188] text-white font-bold tracking-wide shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all"
                            >
                                <i className="fas fa-comment-dots text-lg text-white/80"></i>
                                Falar com Anfitrião
                            </button>
                        </div>

                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default PublicProfile;
