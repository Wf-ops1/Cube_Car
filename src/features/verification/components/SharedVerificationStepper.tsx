import React from 'react';
import { Clock, CheckCircle2, ChevronRight, Lock } from 'lucide-react';

export interface SharedVerificationStepperProps {
    title: React.ReactNode;
    subtitle: React.ReactNode;

    // Step 1
    step1Title: React.ReactNode;
    step1Status: 'PENDING' | 'IN_REVIEW';
    step1Description: React.ReactNode;
    step1TimeLabel?: string;
    step1FrequencyLabel?: string;
    step1Notice: React.ReactNode;

    // Step 2
    step2Title: React.ReactNode;
    step2Description: React.ReactNode;

    // Actions
    onStartVerification: () => void;
    actionButtonText?: string;
}

export const SharedVerificationStepper: React.FC<SharedVerificationStepperProps> = ({
    title,
    subtitle,
    step1Title,
    step1Status,
    step1Description,
    step1TimeLabel = "Pode levar até 48h",
    step1FrequencyLabel = "Feita apenas uma vez",
    step1Notice,
    step2Title,
    step2Description,
    onStartVerification,
    actionButtonText = "Iniciar verificação"
}) => {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-2 text-[#1C2230]">{title}</h2>
            <p className="text-slate-500 mb-8">{subtitle}</p>

            {/* STEPPER CONTAINER */}
            <div className="space-y-6 relative ml-4 border-l-2 border-slate-100 pl-8 pb-4">

                {/* STEP 1: VERIFICATION (ACTIVE) */}
                <div className="relative">
                    {/* Bullet */}
                    <div className="absolute -left-[41px] top-0 w-6 h-6 rounded-full bg-amber-100 border-2 border-amber-500 flex items-center justify-center z-10">
                        <span className="text-[10px] font-bold text-amber-700">1</span>
                    </div>

                    <div className="mb-2 flex items-center gap-2">
                        <h3 className="text-lg font-bold text-[#1C2230]">{step1Title}</h3>
                        {step1Status === 'IN_REVIEW' ? (
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex items-center gap-1">
                                <i className="fas fa-circle-notch fa-spin text-[8px]"></i> Em Análise
                            </span>
                        ) : (
                            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">Pendente</span>
                        )}
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed mb-4 max-w-md">
                        {step1Description}
                    </p>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <Clock className="w-3.5 h-3.5 text-amber-500" />
                            <span>{step1TimeLabel}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{step1FrequencyLabel}</span>
                        </div>
                    </div>

                    {step1Status === 'IN_REVIEW' ? (
                        <div className="w-full bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
                            <div className="bg-blue-100 p-2 rounded-full shrink-0">
                                <Clock className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm mb-1">Análise em andamento</h4>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Recebemos seus documentos e nossa equipe já está analisando. Você será notificado assim que concluirmos.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={onStartVerification}
                            className="flex w-full sm:w-auto bg-[#3667AA] hover:bg-[#2c558f] text-white px-6 py-3.5 rounded-xl font-bold text-sm items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/10 active:scale-[0.98]"
                        >
                            {actionButtonText}
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}

                    <p className="mt-4 text-xs text-slate-400 max-w-sm leading-relaxed">
                        <span className="font-semibold text-slate-500">Nota:</span> {step1Notice}
                    </p>
                </div>

                {/* STEP 2: NEXT ACTION (DISABLED) */}
                <div className="relative pt-8 opacity-40 grayscale select-none">
                    {/* Bullet */}
                    <div className="absolute -left-[41px] top-8 w-6 h-6 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center z-10">
                        <span className="text-[10px] font-bold text-slate-400">2</span>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-bold text-[#1C2230] flex items-center gap-2">
                            {step2Title}
                            <Lock className="w-3.5 h-3.5 text-slate-400" />
                        </h3>
                    </div>
                    <p className="text-sm text-slate-500">
                        {step2Description}
                    </p>
                </div>

            </div>
        </div>
    );
};
