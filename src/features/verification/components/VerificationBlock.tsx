import React from 'react';
import { VerificationMissing } from '@/core/data/verification/verification.types';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, ShieldAlert, ChevronRight, Camera, FileText, Smartphone } from 'lucide-react';

interface VerificationBlockProps {
    missing: VerificationMissing[];
    onAction?: (action: VerificationMissing) => void;
}

export const VerificationBlock: React.FC<VerificationBlockProps> = ({ missing, onAction }) => {
    // Helper to get consistent UI config for each missing type
    const getConfig = (type: VerificationMissing) => {
        switch (type) {
            case 'phone': return {
                icon: Smartphone,
                label: 'Confirmar Celular',
                desc: 'Necessário para contatos de emergência e segurança.',
                color: 'text-blue-500',
                bg: 'bg-blue-50',
                actionLabel: 'Validar SMS'
            };
            case 'cnh': return {
                icon: FileText,
                label: 'Foto da CNH',
                desc: 'Para verificarmos sua habilitação válida.',
                color: 'text-amber-500',
                bg: 'bg-amber-50',
                actionLabel: 'Enviar Foto'
            };
            case 'selfie': return {
                icon: Camera,
                label: 'Selfie de Segurança',
                desc: 'Para garantir que é você mesmo.',
                color: 'text-purple-500',
                bg: 'bg-purple-50',
                actionLabel: 'Tirar Selfie'
            };
        }
    };

    // We only show the FIRST missing item as the primary CTA (Precedence Rule UX)
    const primaryMissing = missing[0]; // Logic ensures this respects precedence
    const config = primaryMissing ? getConfig(primaryMissing) : null;

    if (!config) return null;

    return (
        <div className="w-full max-w-sm mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden font-sans">
            {/* Header State */}
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-slate-800">Verificação Necessária</h3>
                    <p className="text-xs text-slate-500">Complete seu perfil para acessar.</p>
                </div>
            </div>

            {/* Body */}
            <div className="p-5">
                <div className="flex items-start gap-4 mb-6">
                    <div className={`w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center shrink-0`}>
                        <config.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 mb-1">{config.label}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-[200px]">{config.desc}</p>
                    </div>
                </div>

                {/* Progress Bar (Visual Refinement) */}
                <div className="flex gap-1 mb-6">
                    {/* Render Step Indicators based on what is NOT missing vs missing */}
                    {['phone', 'cnh', 'selfie'].map((step, idx) => {
                        const isCompleted = !missing.includes(step as any);
                        const isCurrent = step === primaryMissing;

                        return (
                            <div key={step} className={`h-1 flex-1 rounded-full ${isCompleted ? 'bg-emerald-400' :
                                    isCurrent ? 'bg-amber-400' : 'bg-slate-200'
                                }`} />
                        );
                    })}
                </div>

                <button
                    onClick={() => onAction && onAction(primaryMissing)}
                    className="w-full py-3 bg-[#181824] hover:bg-[#2b2b3d] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                    {config.actionLabel} <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};
