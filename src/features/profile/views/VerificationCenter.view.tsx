import React from 'react';
import { User } from '@/core/data/auth/auth.types';
import { motion } from 'framer-motion';
import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';
import { BackButton } from '@/core/components/buttons/BackButton';
import { AmbientBackground } from '@/shared/components/layout/AmbientBackground';
import { PageHeader } from '@/shared/components/layout/PageHeader';

interface VerificationCenterProps {
    user: User;
    onBack: () => void;
}

const VerificationCenter: React.FC<VerificationCenterProps> = ({ user, onBack }) => {
    const { openWizard } = useUserVerificationWizardStore();

    // Derived State
    const verification = user.verification;
    const overallStatus = verification?.status || 'NOT_STARTED';

    // Helper to find specific doc status
    const getDoc = (type: 'CNH' | 'SELFIE') => verification?.documents.find(d => d.type === type);
    const cnhDoc = getDoc('CNH');
    const selfieDoc = getDoc('SELFIE');

    return (
        <div className="min-h-screen bg-transparent relative z-50 overflow-hidden flex flex-col font-sans">

            {/* Content ... */}

            {/* Header (Standardized) */}
            <div className="relative z-20 px-4 md:px-8 py-8 lg:py-16 max-w-7xl mx-auto w-full mb-8">
                <div className="flex items-center justify-between">
                    <BackButton onClick={onBack} className="relative z-50" />

                    <div className="flex flex-col items-end gap-1.5">
                        <div className="inline-flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-[#1C2230] transition-all duration-300">
                            <i className="fas fa-shield-alt text-[#3667AA] text-xs"></i>
                            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1C2230]">Ambiente Seguro</span>
                        </div>
                    </div>
                </div>
            </div>

            <main className="flex-1 overflow-y-auto px-6 w-full max-w-7xl mx-auto pb-32 relative z-10">

                <div className="grid md:grid-cols-[1fr_380px] gap-12 lg:gap-24 md:mt-2">

                    {/* LEFT COLUMN: Context & Score */}
                    <div>
                        {/* Title Section */}
                        <div className="mb-12 mt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block"
                            >
                                <span className="text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] text-[#3667AA] mb-2 block">Identity Fortress</span>
                                <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium text-[#1C2230] leading-tight mb-3">
                                    Sua Reputação <br /><span className="text-[#9CA3AF]">é sua Moeda.</span>
                                </h1>
                                <p className="text-sm md:text-lg text-[#64748B] max-w-md leading-relaxed">
                                    Status Geral: <strong className="uppercase">{overallStatus?.replace('_', ' ')}</strong>
                                    <br />
                                    Complete sua verificação para desbloquear reservas instantâneas e acesso a carros exclusivos da categoria <strong>Black</strong>.
                                </p>
                            </motion.div>
                        </div>

                        {/* Trust Score Card (Desktop Only highlight) - Slimmer Padding */}
                        <div className="hidden md:block bg-gradient-to-br from-[#3667AA] to-blue-600 rounded-[2rem] p-6 lg:p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden group max-w-2xl">
                            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 block">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-[11px] md:text-sm uppercase font-bold text-blue-200 tracking-[0.2em] mb-2">Trust Score</p>
                                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">Level 2</h3>
                                    </div>
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                                        <i className="fas fa-layer-group text-xl md:text-3xl"></i>
                                    </div>
                                </div>
                                <div className="h-1.5 bg-blue-900/30 rounded-full overflow-hidden mb-3">
                                    <div className="h-full bg-white/90 w-[60%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.6)]"></div>
                                </div>
                                <p className="text-[10px] md:text-sm font-medium text-blue-100">+400 pontos para Level 3 (Isenção de Caução)</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Action Items */}
                    <div className="space-y-8">
                        <div>
                            <label className="block text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-6 border-b border-gray-200/60 pb-2">Etapas Concluídas</label>

                            <div className="space-y-3">
                                {/* Item: Phone - CLEAR/WHITE Style */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                            <i className="fas fa-check text-sm"></i>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-[#1C2230]">Telefone</span>
                                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Verificado</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Item: Email - CLEAR/WHITE Style */}
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white border border-gray-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                            <i className="fas fa-check text-sm"></i>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-[#1C2230]">E-mail</span>
                                            <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Confirmado</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            {(() => {
                                const allInReview = cnhDoc?.status === 'PENDING_REVIEW' && selfieDoc?.status === 'PENDING_REVIEW';
                                const someInReview = cnhDoc?.status === 'PENDING_REVIEW' || selfieDoc?.status === 'PENDING_REVIEW';
                                const sectionLabel = allInReview ? 'Em Análise' : someInReview ? 'Em Andamento' : 'Pendente (Obrigatório)';
                                return (
                                    <label className="block text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-6 border-b border-gray-200/60 pb-2">{sectionLabel}</label>
                                );
                            })()}

                            <div className="space-y-4">
                                {/* Item: CNH */}
                                <VerificationCard
                                    title="CNH Digital"
                                    icon="id-card"
                                    status={cnhDoc?.status || 'MISSING'}
                                    rejectionReason={cnhDoc?.rejectionReason}
                                    onClick={() => openWizard('profile', verification)}
                                />

                                {/* Item: Selfie */}
                                <VerificationCard
                                    title="Selfie de Segurança"
                                    icon="camera"
                                    status={selfieDoc?.status || 'MISSING'}
                                    rejectionReason={selfieDoc?.rejectionReason}
                                    onClick={() => openWizard('profile', verification)}
                                />
                            </div>
                        </div>

                        {/* Footer Lock */}
                        <div className="text-center pt-8 border-t border-gray-200/50">
                            <i className="fas fa-lock text-[#9CA3AF] mb-2 text-xl md:text-3xl"></i>
                            <p className="text-[10px] md:text-sm text-[#9CA3AF] leading-relaxed max-w-[250px] md:max-w-md mx-auto opacity-70">
                                Criptografia de ponta a ponta. Seus dados biométricos são processados apenas para validação.
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

// Internal Component for Card Logic
const VerificationCard: React.FC<{
    title: string;
    icon: string;
    status: string;
    rejectionReason?: string;
    onClick: () => void;
}> = ({ title, icon, status, rejectionReason, onClick }) => {

    // Logic for styling based on status
    const isApproved = status === 'APPROVED';
    const isRejected = status === 'REJECTED';
    const isPendingReview = status === 'PENDING_REVIEW';
    const isMissing = status === 'MISSING';

    if (isApproved) {
        return (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-emerald-100 shadow-sm opacity-80">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                        <i className={`fas fa-${icon} text-sm`}></i>
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-slate-700">{title}</span>
                        <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wide">Aprovado</span>
                    </div>
                </div>
            </div>
        );
    }

    if (isPendingReview) {
        return (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-blue-100 shadow-sm cursor-not-allowed">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                        <i className={`fas fa-clock text-sm`}></i>
                    </div>
                    <div>
                        <span className="block text-sm font-bold text-slate-700">{title}</span>
                        <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wide">Em Análise</span>
                    </div>
                </div>
            </div>
        );
    }

    // Default Action (Missing or Rejected)
    return (
        <button onClick={onClick} className={`w-full flex items-center justify-between p-1 rounded-[1.5rem] bg-white border ${isRejected ? 'border-red-200' : 'border-amber-100'} shadow-[0_8px_30px_rgba(251,191,36,0.08)] group hover:shadow-lg transition-all relative overflow-hidden`}>
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${isRejected ? 'bg-red-400' : 'bg-amber-400'}`}></div>
            <div className="flex-1 flex items-center gap-4 p-4 pl-5">
                <div className={`w-12 h-12 rounded-2xl ${isRejected ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'} flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm`}>
                    <i className={`fas fa-${icon} text-lg`}></i>
                </div>
                <div className="text-left">
                    <span className={`block text-base font-bold text-slate-900 ${isRejected ? 'group-hover:text-red-700' : 'group-hover:text-amber-700'} transition-colors`}>{title}</span>

                    {isRejected ? (
                        <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <i className="fas fa-times-circle"></i> Recusado: {rejectionReason || 'Verifique a foto'}
                        </span>
                    ) : (
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider flex items-center gap-1">
                            <i className="fas fa-exclamation-circle"></i> Ação Necessária
                        </span>
                    )}
                </div>
            </div>
            <div className="pr-6">
                <div className={`w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 ${isRejected ? 'group-hover:bg-red-500' : 'group-hover:bg-amber-500'} group-hover:text-white transition-all`}>
                    <i className="fas fa-arrow-right text-xs"></i>
                </div>
            </div>
        </button>
    );
}

export default VerificationCenter;
