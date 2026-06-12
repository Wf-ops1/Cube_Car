import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackButton } from '@/core/components/buttons/BackButton';
import { getStatusConfig, getDerivedBookingStatus } from '@/features/booking/logic/booking.logic';
import QuickChat from '@/features/catalog/components/CarDetails/QuickChat.view';
import { useAuthStore } from '@/core/auth/auth.store';
import { useChatStore } from '@/features/messaging/stores/chat.store';
import { messagingGateway } from '@/core/data/gateways/messaging.gateway';
// removed local gateway and modal imports

export interface Trip {
    id: string;
    carName: string;
    model: string;
    year?: string;
    imageUrl: string;
    dates: string;
    startDate?: string;
    endDate?: string;
    days?: number;
    time: string;
    location: string;
    status: string;
    owner: string;
    ownerId?: string; // Added for Chat
    carId?: string;   // Added for Chat
    avatarUrl?: string;
    price: number;
    code: string;
    bookingCode?: string;
    instructions?: string;
    paymentMethod?: string;
}

interface TripReservationDetailsProps {
    trip: Trip;
    onBack: () => void;
    onHelpClick: () => void;
    onCompleteTrip: (trip: Trip) => void;
    isCompleting?: boolean;
}

const TripReservationDetails: React.FC<TripReservationDetailsProps> = ({ trip, onBack, onHelpClick, onCompleteTrip, isCompleting }) => {
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(trip.status);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [codeCopied, setCodeCopied] = useState(false);

    // Keep local status in sync with any parent prop updates
    useEffect(() => {
        setCurrentStatus(trip.status);
    }, [trip.status]);

    // Quick Chat State
    const [isQuickChatOpen, setIsQuickChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const chatScrollRef = React.useRef<HTMLDivElement>(null);

    const { user } = useAuthStore();
    const { conversations, setConversations } = useChatStore();

    // Find active conversation for this trip
    const conversation = React.useMemo(() => {
        if (!trip.ownerId || !trip.carId) return undefined;
        return conversations.find(c => c.participantId === trip.ownerId && c.carRelated?.id === trip.carId);
    }, [conversations, trip.ownerId, trip.carId]);

    useEffect(() => {
        window.scrollTo(0, 0);
        // IMMERSION MODE: Hide Global UI
        document.body.classList.add('hide-global-ui');

        return () => {
            document.body.classList.remove('hide-global-ui');
        };
    }, []);



    // Human-centric titles based on the journey "Chapters"
    const chapters = {
        context: "",
        car: "",
        logistics: "Retirada e Devolução",
        finance: "Valores",
        host: "Anfitrião"
    };

    const serviceFee = trip.price * 0.10;
    const totalPaid = trip.price + serviceFee;

    const exactAddress = trip.location.includes('São Paulo')
        ? "Rua Oscar Freire, 1100 - Jardins, São Paulo - SP"
        : "Av. Brigadeiro Faria Lima, 3477 - Itaim Bibi, São Paulo - SP";


    // Get Status Configuration
    // Use local state if changed, otherwise trip prop
    const derivedStatus = getDerivedBookingStatus(currentStatus as any, trip.startDate || '', trip.endDate || '');
    const isCancelled = derivedStatus === 'cancelled';
    const isExpired = derivedStatus === 'expired' || isCancelled;

    const statusConfig = getStatusConfig(derivedStatus);

    const shouldPulse = !['expired', 'cancelled', 'completed'].includes(derivedStatus);

    const handleCancelClick = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        setCurrentStatus('CANCELLED');
        setShowCancelModal(false);
    };

    const handleContactHost = () => {
        setIsQuickChatOpen(true);
    };

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatInput.trim() || !user || !trip.carId || !trip.ownerId) return;

        try {
            // 1. Get or Create Conversation
            let activeConv = conversation;
            if (!activeConv) {
                activeConv = await messagingGateway.createConversation(trip.carId, user.id, trip.ownerId);
                setConversations([activeConv, ...conversations]);
            }

            // 2. Send Message
            const sentMessage = await messagingGateway.sendMessage(activeConv.id, user.id, chatInput);

            // 3. Update Store
            setConversations(useChatStore.getState().conversations.map(c =>
                c.id === activeConv!.id ? {
                    ...c,
                    lastMessage: sentMessage.text,
                    lastMessageTime: sentMessage.timestamp,
                    messages: [...(c.messages || []), sentMessage]
                } : c
            ));

            setChatInput('');
        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    // Removed handleCompleteTrip from here

    const renderMessageStatus = (status?: string, isRead?: boolean) => {
        return <i className="fas fa-check text-gray-400 text-[10px] ml-1"></i>;
    };

    // Construct mock objects for QuickChat
    const quickChatOwner = { name: trip.owner, avatar: trip.avatarUrl || `https://i.pravatar.cc/150?u=${trip.owner}` };
    const quickChatCar = { ...trip, make: trip.carName.split(' ')[0], model: trip.carName.split(' ').slice(1).join(' '), images: [trip.imageUrl], ownerId: 'host', features: [], rating: 4.9, location: trip.location, coordinates: [0, 0] } as any;

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="min-h-screen w-full overflow-x-hidden bg-transparent text-[#3A4150]"
            >
                {/* AMBIENT BACKGROUND */}
                <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden transition-all duration-700 ${isCancelled ? 'grayscale opacity-50' : ''}`}>
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3667AA]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
                </div>

                <div className={`relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-8 pb-32 lg:py-16`}>

                    {/* TOP NAVIGATION / STATUS */}
                    <div className="flex items-center justify-between mb-12 lg:mb-20">
                        <BackButton onClick={onBack} className="relative z-50 text-gray-400 hover:text-[#1C2230]" />


                        <div className="flex flex-col items-end gap-1.5 transition-all duration-500">
                            <div className={`inline-flex items-center gap-2.5 bg-[#1C2230] px-4 py-2 rounded-full border border-gray-100 shadow-sm text-white text-[9px] font-bold uppercase tracking-[0.2em] transition-all duration-300`}>
                                <span className={`w-1.5 h-1.5 rounded-full shadow-[0_0_8px_currentColor] ${shouldPulse ? 'animate-pulse' : ''} ${statusConfig.dotColor.replace('bg-', 'text-').replace('text-', 'bg-')}`}></span>
                                <span>{statusConfig.label}</span>
                            </div>
                        </div>
                    </div>

                    {/* EDITORIAL GRID - WRAPPED FOR CANCELLED STATE */}
                    <div className={`transition-all duration-700 ${isCancelled ? 'grayscale opacity-60 pointer-events-none select-none filter blur-[1px]' : ''}`}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">

                            {/* LEFT COLUMN: HERO & CHAPTERS */}
                            <div className="lg:col-span-8 space-y-20 lg:space-y-32">

                                {/* CHAPTER: THE COMPANION */}
                                <section className="space-y-6 md:space-y-10">
                                    <div className="space-y-2 md:space-y-3">

                                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-semibold leading-[1.1] tracking-tight text-[#1C2230]" style={{ color: '#1C2230' }}>
                                            {trip.carName}
                                        </h1>
                                    </div>

                                    {/* Main Image Container - Subtle Border & Shadow */}
                                    <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden group shadow-2xl bg-white border border-gray-100/50 p-2">
                                        <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
                                            <img src={trip.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[6s] ease-out" alt="" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#1C2230]/40 via-transparent to-transparent"></div>

                                            {/* Glass Spec Overlay */}
                                            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        const code = trip.bookingCode || trip.code;
                                                        navigator.clipboard.writeText(code).then(() => {
                                                            setCodeCopied(true);
                                                            setTimeout(() => setCodeCopied(false), 2000);
                                                        });
                                                    }}
                                                    className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl space-y-0.5 text-left cursor-pointer hover:bg-white/20 active:scale-[0.97] transition-all group/code"
                                                >
                                                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/70 flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.7)', visibility: 'visible', opacity: 1, display: 'flex' }}>
                                                        Código da Reserva
                                                        <i className={`fas ${codeCopied ? 'fa-check' : 'fa-copy'} text-[10px] md:text-xs transition-opacity`} style={{ color: codeCopied ? '#34d399' : '#ffffff', visibility: 'visible', opacity: 1, display: 'inline-block' }}></i>
                                                    </p>
                                                    <p className="text-base md:text-lg font-display font-medium text-white" style={{ color: '#ffffff', visibility: 'visible', opacity: 1, display: 'block' }}>
                                                        {codeCopied ? 'Copiado!' : `#${trip.bookingCode || trip.code}`}
                                                    </p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Spec Grid - Fixed Alignment & Spacing */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                                        {[
                                            { label: 'Câmbio', val: 'Automático', icon: 'fa-cog' },
                                            { label: 'Potência', val: 'Alta Perf.', icon: 'fa-bolt' },
                                            { label: 'Ocupação', val: '5 Assentos', icon: 'fa-users' },
                                            { label: 'Proteção', val: 'Completa', icon: 'fa-shield-alt' }
                                        ].map((spec, i) => (
                                            <div key={i} className="p-4 md:p-5 lg:p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-all group cursor-default flex flex-col items-start">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gray-50 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-[#3667AA]/5 transition-colors">
                                                    <i className={`fas ${spec.icon} text-gray-400 group-hover:text-[#3667AA] transition-colors text-base md:text-lg`}></i>
                                                </div>
                                                <div className="space-y-0.5 md:space-y-1">
                                                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400">{spec.label}</p>
                                                    <p className="text-xs md:text-sm font-bold uppercase tracking-wider text-[#1C2230]">{spec.val}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* CHAPTER: LOGISTICS */}
                                <section className="space-y-10">
                                    <div className="space-y-2">
                                        <p className="text-[#3667AA] font-bold uppercase tracking-[0.3em] text-[10px]">{chapters.logistics}</p>
                                        <h2 className="text-3xl md:text-4xl font-display font-semibold tracking-tight text-[#1C2230]">Logística</h2>
                                    </div>

                                    <div className="relative pl-8 md:pl-10">
                                        {/* Vertical Line (Mobile Only) */}
                                        <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-200 md:hidden"></div>

                                        {/* Desktop Horizontal Timeline (Bullets above Text) */}
                                        <div className="hidden md:block relative w-full mb-1">
                                            {/* Connection Line */}
                                            <div className="absolute top-[5px] left-0 w-[calc(50%+12px)] h-px bg-gray-200"></div>

                                            <div className="grid grid-cols-2 gap-12">
                                                <div className="relative">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#3667AA] shadow-[0_0_8px_rgba(54,103,170,0.4)] relative z-10"></div>
                                                </div>
                                                <div className="relative">
                                                    <div className="w-2.5 h-2.5 rounded-full border-2 border-gray-200 bg-[#F8F9FB] relative z-10"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                                            <div className="space-y-4">
                                                <div className="relative">
                                                    {/* Mobile Bullet */}
                                                    <div className="absolute -left-[20.5px] w-2.5 h-2.5 rounded-full bg-[#3667AA] shadow-[0_0_8px_rgba(54,103,170,0.4)] md:hidden"></div>

                                                    <p className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 md:mb-0">Check-in</p>
                                                    <p className="text-xl md:text-4xl font-display font-semibold text-[#1C2230]">{trip.startDate}<br /><span className="text-sm md:text-lg font-normal text-gray-400">{trip.time?.split('-')[0] || ''}</span></p>
                                                </div>
                                                <div
                                                    className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm cursor-pointer hover:bg-[#3667AA] hover:border-[#3667AA] hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 group"
                                                    onClick={() => setIsMapOpen(true)}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-white/20 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                                                            <i className="fas fa-location-arrow text-sm md:text-base"></i>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-100 mb-0.5 transition-colors">Localização</p>
                                                            <p className="text-xs md:text-sm font-medium text-[#374151] group-hover:text-white line-clamp-1 transition-colors">{trip.location}</p>
                                                        </div>
                                                        <i className="fas fa-chevron-right text-gray-500 group-hover:text-white text-[10px] transition-colors"></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="relative">
                                                    {/* Mobile Bullet */}
                                                    <div className="absolute -left-[20.5px] w-2.5 h-2.5 rounded-full border-2 border-gray-200 bg-[#F8F9FB] md:hidden"></div>

                                                    <p className="text-[9px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-1 md:mb-0" style={{ color: '#9CA3AF' }}>Devolução</p>
                                                    <p className="text-xl md:text-4xl font-display font-semibold text-[#1C2230]" style={{ color: '#1C2230' }}>{trip.endDate}<br /><span className="text-sm md:text-lg font-normal text-gray-400" style={{ color: '#9CA3AF' }}>{trip.time?.split('-')[1] || ''}</span></p>
                                                </div>
                                                <div className="p-5 rounded-2xl bg-gray-200/50 border border-gray-100">
                                                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">Ponto de Retorno</p>
                                                    <p className="text-xs md:text-sm font-medium text-gray-500">Mesmo local de retirada</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* RIGHT COLUMN: SIDEBAR INFORMATION */}
                            <div className="lg:col-span-4 space-y-10 lg:space-y-16">

                                {/* CHAPTER: FINANCE */}
                                <section className="p-6 md:p-10 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm space-y-8 lg:mt-24">
                                    <div className="space-y-1">
                                        <p className="text-[#3667AA] font-bold uppercase tracking-[0.3em] text-[10px]" style={{ color: '#3667AA' }}>{chapters.finance}</p>
                                        <h3 className="text-2xl font-display font-semibold tracking-tight text-[#1C2230]" style={{ color: '#1C2230' }}>Resumo</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400" style={{ color: '#9CA3AF' }}>Reserva Ativa</span>
                                            <span className="text-sm font-bold text-[#1C2230]" style={{ color: '#1C2230' }}>R$ {trip.price.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400" style={{ color: '#9CA3AF' }}>Plataforma</span>
                                            <span className="text-sm font-bold text-[#1C2230]" style={{ color: '#1C2230' }}>R$ {serviceFee.toFixed(2)}</span>
                                        </div>
                                        <div className="pt-6 border-t border-gray-100 flex justify-between items-baseline">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3667AA]" style={{ color: '#3667AA' }}>Total</span>
                                            <span className="text-xl md:text-2xl font-display font-bold tracking-tighter text-[#1C2230]" style={{ color: '#1C2230' }}>R$ {totalPaid.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 shadow-sm">
                                            <i className="fas fa-credit-card text-xs"></i>
                                        </div>
                                        <div>
                                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-400 mb-0.5">MÉTODO</p>
                                            <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1C2230]">•••• 4421</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {/* The Finalizar Viagem button has been moved to a sticky bottom bar for better UX */}
                                        <button
                                            disabled={isExpired}
                                            onClick={handleCancelClick}
                                            className={`w-full py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-colors
                                    ${isExpired
                                                    ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                                                    : 'border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200'}`}
                                        >
                                            {isCancelled ? 'Reserva Cancelada' : isExpired ? 'Solicitação Expirada' : derivedStatus === 'pending' ? 'Cancelar Solicitação' : 'Cancelar Reserva'}
                                        </button>
                                    </div>
                                </section>

                                {/* CHAPTER: HOST */}
                                <section className="p-6 md:p-10 rounded-[2.5rem] bg-[#1C2230] text-white space-y-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#3667AA]/20 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>

                                    <div className="relative z-10 space-y-8">
                                        <div className="space-y-1">
                                            <p className="text-white/30 font-bold uppercase tracking-[0.3em] text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>{chapters.host}</p>
                                            <h3 className="text-2xl font-display font-semibold tracking-tight" style={{ color: '#FFFFFF' }}>Contato</h3>
                                        </div>

                                        <div className="flex items-center gap-5">
                                            <div className="relative">
                                                <img src={trip.avatarUrl || `https://i.pravatar.cc/150?u=${trip.owner}`} className="w-16 h-16 rounded-2xl border-2 border-white/10 object-cover" alt="" />
                                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-[#1C2230]"></div>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-lg font-display font-semibold" style={{ color: '#FFFFFF' }}>{trip.owner}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-white/50" style={{ color: 'rgba(255,255,255,0.5)' }}><i className="fas fa-star mr-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}></i> 4.9</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleContactHost}
                                            disabled={false} // Allow specific contact even if expired? Keeping enabled for support.
                                            className={`w-full font-bold text-[10px] uppercase tracking-[0.2em] py-4 rounded-xl shadow-lg transition-all
                                    ${false // Always active for support
                                                    ? 'bg-gray-600/50 text-white/20 cursor-not-allowed shadow-none'
                                                    : 'bg-white text-[#1C2230] hover:shadow-xl hover:-translate-y-0.5'
                                                }`}
                                        >
                                            Falar com o Anfitrião
                                        </button>
                                    </div>
                                </section>

                                <div className="text-center md:px-6 mb-8">
                                    <p className="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-widest leading-relaxed" style={{ color: '#9CA3AF' }}>Dúvidas sobre a jornada?<br /><button onClick={onHelpClick} className="text-[#3667AA] font-bold hover:underline mt-1" style={{ color: '#3667AA' }}>Central de Ajuda Cube</button></p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* EXPIRED STATE OVERLAY (Click Blocker) - Enhanced */}
                    {isCancelled && (
                        <div className="absolute inset-x-0 top-32 bottom-0 z-20 bg-gray-100/10 backdrop-grayscale mix-blend-saturation pointer-events-auto cursor-not-allowed rounded-[3rem]"></div>
                    )}
                </div>

                {/* MAP OVERLAY (DESIGN SYSTEM ALIGNED) */}
                <AnimatePresence>
                    {isMapOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[300] bg-gray-900/40 backdrop-blur-md flex flex-col pt-12"
                        >
                            <div className="px-6 md:px-12 flex items-center justify-between mb-8 max-w-7xl mx-auto w-full">
                                <div>
                                    <p className="text-[#3667AA] font-bold uppercase tracking-[0.3em] text-[10px] mb-1">LOCALIZAÇÃO</p>
                                    <h3 className="text-2xl font-display font-semibold tracking-tight text-white">Ponto de Encontro</h3>
                                </div>
                                <button onClick={() => setIsMapOpen(false)} className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-[#1C2230] transition-all">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="flex-1 bg-white rounded-t-[3rem] overflow-hidden border-t border-white/20">
                                <iframe
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    loading="lazy"
                                    allowFullScreen
                                    src={`https://maps.google.com/maps?q=${encodeURIComponent(exactAddress)}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                                    title="Location"
                                    className="grayscale-[0.2]"
                                ></iframe>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ERROR / CONFIRMATION MODAL */}
                <AnimatePresence>
                    {showCancelModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[400] bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl space-y-6 text-center relative overflow-hidden"
                            >
                                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-2">
                                    <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-display font-semibold text-[#1C2230]">Cancelar Reserva?</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed px-4">
                                        Tem certeza que deseja cancelar? Essa ação não poderá ser desfeita e o valor reservado será estornado.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => setShowCancelModal(false)}
                                        className="py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors uppercase tracking-wider"
                                    >
                                        Voltar
                                    </button>
                                    <button
                                        onClick={confirmCancel}
                                        className="py-3 rounded-xl bg-red-500 text-white text-xs font-bold shadow-lg hover:bg-red-600 hover:shadow-red-500/20 transition-all uppercase tracking-wider"
                                    >
                                        Confirmar
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* QUICK CHAT INTEGRATION */}
                <QuickChat
                    isOpen={isQuickChatOpen}
                    onClose={() => setIsQuickChatOpen(false)}
                    owner={quickChatOwner}
                    car={quickChatCar}
                    conversation={conversation} // Pass active conversation
                    currentUserId={user?.id || 'gray-user'}
                    chatInput={chatInput}
                    setChatInput={setChatInput}
                    handleSubmit={handleSendMessage}
                    chatScrollRef={chatScrollRef}
                    renderMessageStatus={renderMessageStatus}
                    onProfileClick={() => { }}
                />
            </motion.div>

            {/* FLOATING ACTION BAR (Pill Style) */}
            <AnimatePresence>
                {(derivedStatus === 'confirmed' || derivedStatus === 'active') && !isCompleting && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center pointer-events-none"
                    >
                        <div className="bg-white/80 backdrop-blur-2xl border border-white/60 shadow-2xl shadow-blue-900/10 rounded-full p-2 flex items-center justify-center pointer-events-auto transform transition-all hover:scale-[1.02]">
                            <button
                                onClick={() => onCompleteTrip(trip)}
                                disabled={isExpired}
                                className={`bg-[#3667AA] text-white px-8 py-3 rounded-full font-bold text-sm tracking-wide shadow-lg shadow-blue-500/20 flex items-center gap-3 transition-all cursor-pointer hover:bg-blue-700 hover:shadow-blue-600/30 hover:-translate-y-0.5`}
                            >
                                Finalizar Viagem
                                <i className="fas fa-flag-checkered"></i>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export default TripReservationDetails;
