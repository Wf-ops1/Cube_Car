import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/core/data/auth/auth.types';
import CarCard from '@/shared/components/visuals/CarCard.view';
import { Car } from '@/core/data/car/car.types';
import { BackButton } from '@/core/components/buttons/BackButton';
import { AmbientBackground } from '@/shared/components/layout/AmbientBackground';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { useFavoritesStore } from '@/features/profile/stores/favorites.store';

import { GuestState } from '@/shared/components/states/GuestState';

interface FavoritesProps {
    user: User | null;
    favorites?: Car[]; // Optional for now, assuming logic will fetch or pass this
    onBack: () => void;
    onCarClick: (car: Car) => void;
    onLogin: () => void;
}

const Favorites: React.FC<FavoritesProps> = ({ user, favorites = [], onBack, onCarClick, onLogin }) => {
    const { toggleFavorite } = useFavoritesStore();
    const [carToRemove, setCarToRemove] = useState<Car | null>(null);

    // 0. Guest State (Unauthenticated)
    if (!user) {
        return (
            <div className="min-h-screen bg-white relative z-50 overflow-hidden flex flex-col font-sans">
                {/* Header for Guest */}
                <div className="px-6 py-4 flex items-center justify-between">
                    <BackButton onClick={onBack} className="shadow-none bg-slate-100/50 hover:bg-slate-100" />
                </div>

                <div className="flex-1 flex flex-col justify-center -mt-20">
                    <GuestState
                        title="Favoritos"
                        description="Acesse sua conta para visualizar seus veículos favoritos. Você pode criar, visualizar ou editar listas depois de fazer login."
                        actionLabel="Entrar"
                        onAction={onLogin}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent relative z-50 overflow-hidden flex flex-col font-sans">

            {/* Content */}

            {/* Header (Standardized) */}
            <PageHeader
                title=""
                badgeText="Wishlist Collection"
                badgeIcon="fa-heart"
                onBack={onBack}
            />

            <main className="flex-1 overflow-y-auto px-6 w-full max-w-7xl mx-auto pb-32 relative z-10">
                <div className="mb-10 mt-2">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h1 className="text-3xl font-display font-medium text-[#1C2230] leading-tight mb-2">Meus Favoritos</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">Veículos salvos</p>
                    </motion.div>
                </div>

                {favorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {favorites.map(car => (
                            <CarCard
                                key={car.id}
                                car={car}
                                onClick={onCarClick}
                                renderAction={(c) => (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCarToRemove(c);
                                        }}
                                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-white/90 flex items-center justify-center transition-all hover:bg-white hover:border-slate-200 hover:scale-110 active:scale-95 z-10 shadow-sm group/remove"
                                        title="Remover dos favoritos"
                                    >
                                        <i className="far fa-trash-alt text-slate-400 group-hover/remove:text-slate-600 transition-colors"></i>
                                    </button>
                                )}
                            />
                        ))}
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col items-center justify-center py-20 text-center"
                    >
                        <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center mb-6 ring-8 ring-white/50 border border-gray-100">
                            <i className="far fa-heart text-4xl text-slate-300"></i>
                        </div>
                        <h3 className="text-xl font-bold text-[#1C2230] mb-2">Sua coleção está vazia</h3>
                        <p className="text-[#64748B] max-w-xs mx-auto mb-8 leading-relaxed">
                            Salve os carros que você ama para encontrá-los facilmente depois.
                        </p>
                        <button
                            onClick={onBack}
                            className="bg-[#181824] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all active:scale-95"
                        >
                            Explorar Carros
                        </button>
                    </motion.div>
                )}
            </main>

            {/* Remove Confirmation Modal */}
            <AnimatePresence>
                {carToRemove && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
                        onClick={() => setCarToRemove(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-slate-100 flex flex-col items-center text-center"
                        >
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                                <i className="fas fa-trash text-slate-400 text-lg"></i>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Remover favorito?</h3>
                            <p className="text-slate-500 mb-6 leading-relaxed">
                                Tem certeza que deseja excluir o <strong>{carToRemove.make} {carToRemove.model}</strong> da sua lista de veículos salvos?
                            </p>

                            <div className="flex items-center gap-3 w-full">
                                <button
                                    onClick={() => setCarToRemove(null)}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => {
                                        toggleFavorite(carToRemove.id);
                                        setCarToRemove(null);
                                    }}
                                    className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-900 shadow-lg shadow-slate-900/10 transition-all active:scale-95"
                                >
                                    Remover
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default Favorites;
