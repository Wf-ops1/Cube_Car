import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=Carro+Indispon%C3%ADvel";

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = PLACEHOLDER_IMAGE;
};

interface ImageGalleryProps {
    images: string[];
    activeImage: string;
    onImageChange: (image: string) => void;
    onOpenLightbox: (index: number) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    activeImage,
    onImageChange,
    onOpenLightbox
}) => {
    return (
        <>
            {/* Desktop Grid Gallery */}
            <div className="hidden lg:grid grid-cols-1 md:grid-cols-2 gap-2 rounded-2xl overflow-hidden mb-8 h-[300px] sm:h-[400px] md:h-[500px]">
                <div className="h-full relative bg-gray-100 overflow-hidden group">
                    <AnimatePresence mode='wait'>
                        <motion.img
                            key={activeImage}
                            src={activeImage}
                            onError={handleImageError}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full object-cover absolute inset-0 cursor-pointer"
                            onClick={() => onOpenLightbox(images.indexOf(activeImage))}
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent md:bg-none md:group-hover:bg-black/5 transition-all pointer-events-none"></div>
                    <button
                        onClick={() => onOpenLightbox(0)}
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center gap-2 text-slate-900"
                    >
                        <i className="fas fa-th"></i>
                        <span className="md:hidden">Fotos</span>
                        <span className="hidden md:inline">Mostrar todas as fotos</span>
                    </button>
                </div>
                <div className="hidden md:grid grid-cols-2 gap-2 h-full">
                    {images.slice(1, 5).map((img, idx) => (
                        <div key={idx} className="relative h-full overflow-hidden group">
                            <img
                                src={img}
                                onError={handleImageError}
                                className={`w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110 ${activeImage === img ? 'opacity-50' : 'opacity-100'}`}
                                onClick={() => onOpenLightbox(images.indexOf(img))}
                            />
                            <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none ${activeImage === img ? 'bg-black/20' : ''}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};
