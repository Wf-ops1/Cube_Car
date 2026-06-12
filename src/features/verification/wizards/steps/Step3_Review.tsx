import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/core/auth/auth.store';
import { submitDocument, getOverallStatus } from '@/core/domain/verification/verification.logic';
import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';
import { Spinner } from '@/shared/components/ui/Spinner';

const Step3_Review: React.FC = () => {
    const { setAuth, user } = useAuthStore();
    const { data } = useUserVerificationWizardStore();

    useEffect(() => {
        if (!user || !user.verification) return;

        // SIMULATE BACKEND: Update local store to reflect "Pending Review"
        // In a real app, this would happen via React Query invalidation after API call

        let updatedDocs = [...user.verification.documents];

        // If we captured CNH, mark it as pending
        if (data.cnhImage || data.cnhFile) {
            updatedDocs = submitDocument(updatedDocs, 'CNH', 'User Upload');
        }

        // If we captured Selfie, mark it as pending
        if (data.selfieImage || data.selfieFile) {
            updatedDocs = submitDocument(updatedDocs, 'SELFIE', 'User Upload');
        }

        const updatedUser = {
            ...user,
            // isVerified removed to reflect actual state (false until approved)
            verification: {
                ...user.verification,
                status: getOverallStatus(updatedDocs), // Derive correct status (IN_REVIEW)
                documents: updatedDocs
            }
        };

        // Update Global State
        setAuth(updatedUser);

    }, []); // Run once on mount

    return (
        <div className="flex flex-col h-full justify-center items-center text-center">

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.6 }}
                className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100"
            >
                <i className="fas fa-shield-alt text-3xl text-slate-400"></i>
            </motion.div>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl md:text-3xl font-display font-bold mb-4 tracking-tight text-slate-800"
            >
                Documentos recebidos!
            </motion.h2>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm md:text-base leading-relaxed max-w-md mx-auto mb-10 text-slate-500"
                style={typeof window !== 'undefined' && window.innerWidth >= 768 ? { color: '#475569' } : {}}
            >
                Recebemos sua documentação. Nossa equipe fará a análise e você será notificado em breve.
            </motion.p>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 text-sm font-medium text-slate-400"
            >
                <Spinner size="md" color="primary" />
                Redirecionando...
            </motion.div>
        </div>
    );
};

export default Step3_Review;
