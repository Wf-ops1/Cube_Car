import React from 'react';
import { Car } from '@/core/data/car/car.types';
import { useFavoritesStore } from '@/features/profile/stores/favorites.store';

interface CarCardProps {
    car: Car;
    onClick: (car: Car) => void;
    renderAction?: (car: Car) => React.ReactNode;
}

const CarCard: React.FC<CarCardProps> = ({ car, onClick, renderAction }) => {
    const { isFavorite, toggleFavorite } = useFavoritesStore();
    const isFav = isFavorite(car.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleFavorite(car.id);
    };

    return (
        <div
            onClick={() => onClick(car)}
            className="group flex flex-col gap-3 cursor-pointer w-full"
        >
            {/* Image Container - Floating Glass Effect */}
            <div className="relative aspect-[4/3] w-full rounded-[1.5rem] overflow-hidden bg-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-500">
                <img
                    src={car.imageUrl}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {renderAction ? (
                    renderAction(car)
                ) : (
                    <button
                        onClick={handleFavoriteClick}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-white/90 flex items-center justify-center transition-all hover:bg-white hover:border-slate-200 hover:scale-110 active:scale-95 z-10 shadow-sm group/fav"
                        title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                    >
                        <i className={`fa-heart text-lg transition-transform ${isFav ? 'fas text-rose-500 scale-110' : 'far text-slate-400 group-hover/fav:text-rose-400'}`}></i>
                    </button>
                )}

                {/* Badge Overlay (Optional: e.g. "Rare Find") */}
                {car.rating >= 4.9 && (
                    <div className="absolute top-3 left-3 px-2 py-1 bg-black/70 rounded-lg border border-white/10 pointer-events-none">
                        <span className="text-[10px] font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1">
                            {/* Rarity Label Removed */}
                        </span>
                    </div>
                )}
            </div>

            {/* Tech Info Block */}
            <div className="flex flex-col px-1 gap-0.5">
                <div className="flex justify-between items-end">
                    <h3 className="font-bold text-lg text-slate-900 tracking-tight leading-none group-hover:text-[#3667AA] transition-colors">
                        {car.make} <span className="font-normal text-[#3667AA]">{car.model}</span>
                    </h3>

                    {/* Price - The Focus */}
                    <div className="flex items-baseline gap-0.5">
                        <span className="font-bold text-xl text-[#3667AA] tracking-tight">R$ {car.pricePerDay}</span>
                    </div>
                </div>

                {/* Secondary Data - Technical Look */}
                <div className="flex items-center justify-between mt-1">
                    <p className="text-xs font-medium text-slate-400 font-mono uppercase tracking-wide">
                        {car.year} • {car.type || car.category}
                    </p>

                    <div className="flex items-center gap-1">
                        <i className="fas fa-star text-[10px] text-slate-400"></i>
                        <span className="text-xs font-bold text-slate-700 font-mono">{car.rating.toFixed(1)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
