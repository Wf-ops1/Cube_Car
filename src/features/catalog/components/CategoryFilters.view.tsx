import React from 'react';
import { motion } from 'framer-motion';
import { CarCategory } from '../hooks/useCatalog.logic';

interface CategoryFiltersProps {
    selectedCategory: CarCategory;
    onSelectCategory: (category: CarCategory) => void;
}

const CATEGORIES: { label: CarCategory; icon?: string; imgUrl?: string }[] = [
    { label: 'Todos' },
    { label: 'Hatch', icon: 'fa-car', imgUrl: '/assets/3d-hatch.png' },
    { label: 'Sedan', icon: 'fa-car-side', imgUrl: '/assets/3d-sedan.png' },
];

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ selectedCategory, onSelectCategory }) => {
    return (
        <div className="flex items-center md:justify-center justify-start gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.label;
                const is3D = !!cat.imgUrl;

                return (
                    <button
                        key={cat.label}
                        onClick={() => onSelectCategory(cat.label)}
                        className={`relative h-12 md:h-14 rounded-2xl whitespace-nowrap transition-colors duration-200 md:font-medium font-bold text-xs md:text-sm flex items-center justify-center gap-2 md:gap-3 z-10 group cursor-pointer select-none
                            ${is3D ? 'pl-1.5 pr-3 md:pl-2 md:pr-4' : 'px-4 md:px-6'}
                            ${isActive
                                ? 'text-slate-900'
                                : 'text-slate-500 hover:text-slate-800'
                            }
                        `}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeCategory"
                                className="absolute inset-0 bg-white shadow-sm border border-slate-300 rounded-2xl -z-10"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                            />
                        )}

                        {cat.imgUrl ? (
                            <div className="relative w-14 md:w-16 h-8 md:h-10 flex items-center justify-center">
                                <img
                                    src={cat.imgUrl}
                                    alt={cat.label}
                                    className={`w-[130%] max-w-[130%] h-[130%] object-contain drop-shadow-md transition-transform duration-200 ease-out ${isActive ? 'scale-110' : 'grayscale-[0.3] group-hover:scale-110 group-hover:grayscale-0'}`}
                                />
                            </div>
                        ) : (
                            cat.icon && <i className={`fas ${cat.icon} text-xs ${isActive ? 'text-[#3667AA]' : 'text-slate-400 group-hover:text-slate-600'}`}></i>
                        )}

                        <span className={is3D ? 'font-bold' : ''}>{cat.label}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryFilters;
