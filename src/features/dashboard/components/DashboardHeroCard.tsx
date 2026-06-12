import React from 'react';
import { motion } from 'framer-motion';
import { getStatusConfig, DerivedBookingStatus } from '@/features/booking/logic/booking.logic';

interface DashboardHeroCardProps {
    reservation: any;
    onClick: (trip: any) => void;
    onComplete?: (trip: any) => void;
    isCompleting?: boolean;
}

export const DashboardHeroCard: React.FC<DashboardHeroCardProps> = ({ reservation, onClick, onComplete, isCompleting }) => {
    const statusConfig = getStatusConfig(reservation.status);
    const [codeCopied, setCodeCopied] = React.useState(false);

    const renderDynamicContent = () => {
        const { status } = reservation;

        const baseProps = {
            label: statusConfig.label,
            labelColor: statusConfig.textColor,
            dotClass: `${statusConfig.dotColor} ${['active', 'pending'].includes(status) ? 'animate-pulse' : ''}`,
            title: <></>,
            subtitle: '',
            showLocation: false,
            showButton: false,
            buttonLabel: '',
            buttonIcon: '',
            buttonAction: () => { },
        };

        switch (status as DerivedBookingStatus) {
            case 'pending':
                baseProps.title = <>O anfitrião tem até 24 horas</>;
                baseProps.subtitle = 'para aprovar seu pedido de reserva.';
                break;
            case 'rejected':
                baseProps.title = <>O anfitrião não pôde aceitar</>;
                baseProps.subtitle = 'Sugerimos buscar outro veículo incrível para suas datas.';
                break;
            case 'cancelled':
                baseProps.title = <>Reserva cancelada</>;
                baseProps.subtitle = 'Esta viagem foi cancelada e não ocorrerá mais.';
                break;
            case 'expired':
                baseProps.title = <>O tempo de resposta esgotou</>;
                baseProps.subtitle = 'Infelizmente o anfitrião não respondeu a tempo.';
                break;
            case 'completed':
                baseProps.title = <>Esperamos que tenha sido incrível</>;
                baseProps.subtitle = 'Sua viagem foi concluída com sucesso.';
                break;
            case 'confirmed':
                baseProps.title = <>Retirada em <span className="text-[#3667AA] font-bold">{reservation.startDate}</span> às <span className="text-[#3667AA] font-bold">{reservation.pickupTime}</span></>;
                baseProps.subtitle = reservation.location;
                baseProps.showLocation = true;
                break;
            case 'active':
            default:
                baseProps.title = <>Devolução hoje às <span className="text-[#3667AA] font-bold">{reservation.dropoffTime}</span></>;
                baseProps.subtitle = reservation.location;
                baseProps.showLocation = true;
                baseProps.showButton = true;
                baseProps.buttonLabel = 'Finalizar Viagem';
                baseProps.buttonIcon = 'fa-flag-checkered';
                break;
        }

        return baseProps;
    };

    const content = renderDynamicContent();

    // ACTIVE COCKPIT LAYOUT — Unified Vertical Card
    return (
        <motion.div
            className="mb-8 md:mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row relative group/herocard">

                {/* --- LADO ESQUERDO: CONTEXTO (Mobile: full, Desktop: 40%) --- */}
                <div className="md:w-2/5 md:border-r border-slate-100 flex flex-col z-10 relative">
                    {/* 1️⃣ Faixa superior — Status Dinâmico */}
                    <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 flex items-center gap-2.5">
                        <span className={`w-2 h-2 rounded-full shadow-sm ${content.dotClass.replace('text-', 'bg-')}`}></span>
                        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] ${content.labelColor}`}>
                            {content.label}
                        </span>
                    </div>

                    {/* 2️⃣ Imagem do carro */}
                    <div onClick={() => onClick(reservation)} className="relative mx-6 md:mx-8 h-[160px] md:h-[200px] lg:h-[220px] rounded-2xl md:rounded-[1.5rem] overflow-hidden cursor-pointer group shrink-0 border border-slate-100 shadow-sm">
                        <img src={reservation.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>

                    {/* 3️⃣ Identificação do veículo */}
                    <div className="px-6 md:px-8 pt-5 pb-6 md:pb-8 flex items-center justify-between gap-4 mt-auto">
                        <div className="min-w-0">
                            <p className="text-[11px] md:text-xs font-bold text-[#3667AA] uppercase tracking-[0.15em] leading-none mb-1.5 md:mb-2">{reservation.model}</p>
                            <h3 className="text-xl md:text-2xl font-display font-semibold text-[#1C2230] leading-tight truncate">{reservation.carName}</h3>
                        </div>
                        <button
                            className="text-slate-700 hover:text-slate-900 transition-colors flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-slate-50 uppercase tracking-widest font-bold text-[10px] md:text-xs shrink-0"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onClick(reservation);
                            }}
                            aria-label="Ver Detalhes"
                        >
                            <span>Detalhes</span>
                            <i className="fas fa-chevron-right text-[10px] md:text-xs"></i>
                        </button>
                    </div>
                </div>

                {/* --- LADO DIREITO: OPERAÇÃO (Mobile: full, Desktop: 60%) --- */}
                <div className="md:w-3/5 flex flex-col relative z-10 bg-transparent">
                    <div className="mx-6 my-0 h-px bg-slate-100 md:hidden"></div>

                    <div className="px-6 md:px-10 lg:px-12 py-6 md:py-10 flex-1 flex flex-col justify-center">
                        <p className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 md:mb-2">{content.label}</p>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-medium text-[#1C2230] tracking-tight leading-tight">
                            {content.title}
                        </h2>

                        {content.showLocation ? (
                            <p className="text-slate-600 font-medium text-[11px] md:text-sm mt-2.5 flex items-center gap-1.5">
                                <i className="fas fa-map-marker-alt text-slate-400"></i> {content.subtitle}
                            </p>
                        ) : (
                            <p 
                                className="text-[#1C2230] text-sm md:text-base font-medium mt-3 md:mt-4"
                                style={
                                    [
                                        'para aprovar seu pedido de reserva.',
                                        'Sugerimos buscar outro veículo incrível para suas datas.',
                                        'Sua viagem foi concluída com sucesso.',
                                        'Esta viagem foi cancelada e não ocorrerá mais.',
                                        'Infelizmente o anfitrião não respondeu a tempo.'
                                    ].includes(content.subtitle) 
                                        ? { color: '#1C2230', display: 'block', visibility: 'visible', opacity: 1 }
                                        : undefined
                                }
                            >
                                {content.subtitle}
                            </p>
                        )}

                        {content.showButton && onComplete && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onComplete(reservation);
                                }}
                                disabled={isCompleting}
                                className={`mt-6 md:mt-8 w-full md:w-auto md:self-start px-6 md:px-8 py-3.5 md:py-4 rounded-2xl md:rounded-full font-bold text-xs md:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${!isCompleting
                                    ? 'bg-[#3667AA] text-white hover:bg-blue-600 shadow-lg shadow-blue-500/15 hover:shadow-blue-500/30 hover:-translate-y-0.5 active:scale-[0.98]'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isCompleting ? <><i className="fas fa-spinner fa-spin"></i> Finalizando</> : <><i className={`fas ${content.buttonIcon} text-[10px]`}></i> {content.buttonLabel}</>}
                            </button>
                        )}
                    </div>

                    {/* 6️⃣ Ações rápidas — Dinâmicas conforme relevância */}
                    <div className="px-6 md:px-10 lg:px-12 pb-6 md:pb-10 lg:pb-12">
                        {['rejected', 'cancelled', 'expired'].includes(reservation.status) ? (
                            <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] p-5 shadow-sm relative">
                                <img src={reservation.avatarUrl} className="w-12 h-12 rounded-full object-cover shrink-0 grayscale opacity-80 border border-slate-200 shadow-sm" alt="Host" />
                                <div className="space-y-4">
                                    <h4 className="text-sm md:text-base font-semibold text-[#1C2230]" style={{ color: '#1C2230', visibility: 'visible', opacity: 1, display: 'block' }}>Motivo:</h4>
                                    <p className="text-base md:text-lg text-slate-700 italic" style={{ color: '#334155', visibility: 'visible', opacity: 1, display: 'block' }}>&ldquo;{reservation.rejectionReason}&rdquo;</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-[8px] md:text-xs font-bold uppercase tracking-[0.15em] text-slate-700 mb-2.5 px-1">Ações rápidas</p>
                                <div className="grid grid-cols-2 gap-3 md:gap-5">
                                    {/* Código */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const code = reservation.bookingCode || reservation.code;
                                            navigator.clipboard.writeText(code).then(() => {
                                                setCodeCopied(true);
                                                setTimeout(() => setCodeCopied(false), 2000);
                                            });
                                        }}
                                        className={`bg-slate-50 rounded-2xl p-3 md:px-6 md:py-5 flex items-center gap-2.5 md:gap-4 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-300 active:scale-[0.98] group/code relative overflow-hidden`}
                                    >
                                        <div className={`relative z-10 w-9 h-9 md:w-12 md:h-12 shrink-0 rounded-full flex items-center justify-center transition-all shadow-sm border border-slate-200 ${codeCopied ? 'bg-emerald-500/20 text-emerald-600' : 'bg-white text-slate-700 group-hover/code:text-slate-900'}`}>
                                            <i className={`${codeCopied ? 'fas fa-check' : 'far fa-copy'} text-[13px] md:text-base`} style={{ color: codeCopied ? '#059669' : '#334155', visibility: 'visible', opacity: 1, display: 'inline-block' }}></i>
                                        </div>
                                        <div className="flex-1 text-left min-w-0 relative z-10 flex flex-col justify-center">
                                            <p className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-slate-700">Código</p>
                                            <p className="font-mono text-sm md:text-base font-bold text-[#1C2230] break-all leading-tight mt-0.5" style={{ color: '#1C2230', visibility: 'visible', opacity: 1, display: 'block' }}>
                                                {codeCopied ? 'Copiado!' : `#${reservation.bookingCode || reservation.code}`}
                                            </p>
                                        </div>
                                    </button>

                                    {/* Anfitrião */}
                                    <div onClick={() => onClick(reservation)} className="bg-slate-50 rounded-2xl p-3 md:px-6 md:py-5 flex items-center gap-2.5 md:gap-4 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-300 cursor-pointer group/chat relative overflow-hidden">
                                        <div className="relative shrink-0 z-10">
                                            <img src={reservation.avatarUrl} className="w-9 h-9 md:w-12 md:h-12 rounded-full object-cover border border-slate-200 shadow-sm" alt="Host" />
                                            <div className="absolute -bottom-1 -right-1 w-[18px] h-[18px] md:w-6 md:h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-700 group-hover/chat:text-[#3667AA] transition-colors">
                                                <i className="fas fa-comment text-[8px] md:text-sm"></i>
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 text-left relative z-10 flex flex-col justify-center">
                                            <p className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-slate-700">Anfitrião</p>
                                            <p className="font-display font-semibold text-sm md:text-base text-[#1C2230] break-words leading-tight mt-0.5" style={{ color: '#1C2230', visibility: 'visible', opacity: 1, display: 'block' }}>
                                                {reservation.owner?.split(' ')[0]}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
