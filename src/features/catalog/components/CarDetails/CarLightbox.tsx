import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface CarLightboxProps {
    isOpen: boolean;
    onClose: () => void;
    images: string[];
    initialIndex: number;
}

const SWIPE_CONFIDENCE_THRESHOLD = 500; // Lowered from 10000 for better sensitivity

export const CarLightbox: React.FC<CarLightboxProps> = ({
    isOpen,
    onClose,
    images,
    initialIndex
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    // Sync internal state when opened
    useEffect(() => {
        if (isOpen) setCurrentIndex(initialIndex);
    }, [isOpen, initialIndex]);

    const nextImage = useCallback(() =>
        setCurrentIndex((prev) => (prev + 1) % images.length),
        [images.length]
    );

    const prevImage = useCallback(() =>
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length),
        [images.length]
    );

    // Keyboard navigation
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (!isOpen) return;
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, nextImage, prevImage, onClose]);

    if (!typeof document) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 bg-black/10 backdrop-blur-2xl z-[100] flex items-center justify-center p-4 sm:p-8 cursor-grab active:cursor-grabbing"
                    onClick={(e) => {
                        // Only close if clicking the backdrop itself
                        if (e.target === e.currentTarget) onClose();
                    }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.05}
                    onDragEnd={(e, { offset, velocity }) => {
                        const swipe = Math.abs(offset.x) * velocity.x;
                        if (swipe < -SWIPE_CONFIDENCE_THRESHOLD) {
                            nextImage();
                        } else if (swipe > SWIPE_CONFIDENCE_THRESHOLD) {
                            prevImage();
                        }
                    }}
                >
                    <div
                        className="relative w-full max-w-7xl h-full flex items-center justify-center gap-4 sm:gap-6 mx-auto pointer-events-none"
                    >
                        {/* Close Button - Protection Zone */}
                        <button
                            onClick={(e) => { e.stopPropagation(); onClose(); }}
                            className="absolute top-4 right-4 sm:top-0 sm:-right-12 text-white/70 hover:text-white z-[110] transition-colors bg-black/20 hover:bg-black/40 rounded-full pointer-events-auto flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 backdrop-blur-md"
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <i className="fas fa-times text-xl sm:text-2xl"></i>
                        </button>

                        {/* Prev Button - Protection Zone */}
                        <button
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="static order-1 bg-black/20 hover:bg-black/60 text-white p-4 sm:p-5 rounded-full transition-all hidden sm:flex items-center justify-center backdrop-blur-md group shrink-0 pointer-events-auto"
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <i className="fas fa-chevron-left text-2xl sm:text-3xl group-hover:scale-110 transition-transform"></i>
                        </button>

                        {/* Image - No drag here anymore, wrapper handles it */}
                        <motion.img
                            key={currentIndex}
                            src={images[currentIndex]}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="order-2 w-full max-w-none sm:max-w-[calc(100%-120px)] max-h-[85vh] sm:max-h-full object-contain rounded-xl sm:rounded-[32px] shadow-2xl pointer-events-auto"
                        // Drag removed from image to allow full-screen drag
                        />

                        {/* Next Button - Protection Zone */}
                        <button
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="static order-3 bg-black/20 hover:bg-black/60 text-white p-4 sm:p-5 rounded-full transition-all hidden sm:flex items-center justify-center backdrop-blur-md group shrink-0 pointer-events-auto"
                            onPointerDown={(e) => e.stopPropagation()}
                        >
                            <i className="fas fa-chevron-right text-2xl sm:text-3xl group-hover:scale-110 transition-transform"></i>
                        </button>


                        {/* Counter Paginator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/90 text-sm font-medium bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full pointer-events-none border border-white/10">
                            {currentIndex + 1} / {images.length}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
};
