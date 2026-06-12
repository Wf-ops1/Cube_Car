import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface PendingVerificationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const PendingVerificationModal: React.FC<PendingVerificationModalProps> = ({
    isOpen, onClose
}) => {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                    />
                    
                    {/* Modal Wrapper for Centering */}
                    <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="pointer-events-auto w-full bg-white rounded-t-[2rem] p-6 sm:p-8 flex flex-col shadow-2xl md:w-[480px] md:rounded-[2rem]"
                        >
                            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 mb-6 shrink-0">
                                <i className="fas fa-puzzle-piece text-2xl"></i>
                            </div>
                            
                            <h2 className="text-2xl font-display font-bold text-slate-900 mb-3">
                                Reserva temporariamente indisponível
                            </h2>
                            
                            <p className="text-slate-600 leading-relaxed mb-8">
                                Sua conta ainda está aguardando aprovação dos documentos enviados. <br/><br/>
                                Você poderá concluir reservas assim que a análise for finalizada.
                            </p>

                            <button
                                onClick={onClose}
                                className="w-full bg-[#3667AA] text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:brightness-110 active:scale-95 transition-all text-base"
                            >
                                Entendi
                            </button>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};
