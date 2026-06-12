import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INTERESTS_CATEGORIES } from '../logic/useEditProfile.logic';

interface InterestsSheetProps {
    isOpen: boolean;
    onClose: () => void;
    selectedInterests: string[];
    onToggleInterest: (interest: string) => void;
}

export const InterestsSheet: React.FC<InterestsSheetProps> = ({
    isOpen, onClose, selectedInterests, onToggleInterest
}) => {
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
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Sheet - Centered Desktop Modal, Bottom Sheet Mobile */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed bottom-0 left-0 right-0 h-[97%] md:h-auto md:max-h-[80vh] md:max-w-2xl md:inset-0 md:m-auto bg-white rounded-t-[2rem] md:rounded-[2rem] z-[70] flex flex-col overflow-hidden shadow-2xl"
                    >
                        {/* Sheet Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                            <h3 className="text-xl font-display font-bold text-slate-900">Seus Interesses</h3>
                            <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
                                <i className="fas fa-times text-sm"></i>
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 pb-32">
                            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                                Selecione os tópicos que você mais curte. Isso ajuda anfitriões e membros a encontrarem pontos em comum com você.
                            </p>

                            <div className="space-y-10">
                                {Object.entries(INTERESTS_CATEGORIES).map(([category, interests]) => (
                                    <div key={category}>
                                        <h5 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                                            <span className="w-1 h-4 bg-[#3667AA] rounded-full"></span>
                                            {category}
                                        </h5>
                                        <div className="flex flex-wrap gap-2.5">
                                            {interests.map((interest) => {
                                                const isSelected = selectedInterests.includes(interest);
                                                return (
                                                    <button
                                                        key={interest}
                                                        onClick={() => onToggleInterest(interest)}
                                                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center gap-2 ${isSelected
                                                            ? 'bg-[#3667AA] text-white border-[#3667AA] shadow-md shadow-blue-900/10'
                                                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-white hover:border-slate-300'
                                                            }`}
                                                    >
                                                        {isSelected && <i className="fas fa-check text-[10px]"></i>}
                                                        {interest}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Action */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-slate-100">
                            <button
                                onClick={onClose}
                                className="w-full bg-[#181824] text-white font-bold h-14 rounded-full shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                            >
                                <span>Concluir Seleção</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded text-xs">
                                    {selectedInterests.length}
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
