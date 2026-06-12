import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { User } from '@/core/data/auth/auth.types';
import { useOwnerCenter } from '../../application/useOwnerCenter.logic';

// Components
import { OwnerHeader } from '../components/OwnerHeader';
import { ManageAvailabilityModal } from '../components/ManageAvailabilityModal';
import { DashboardOverview } from '../components/DashboardOverview';
import { FleetList } from '../components/FleetList';
import { RequestsList } from '../components/RequestsList';
import { Spinner } from '@/shared/components/ui/Spinner';

interface OwnerCenterProps {
    user: User;
    onNavigate: (path: string) => void;
    onAddCarClick?: () => void;
    onOpenChatById?: (chatId: string) => void;
    onViewCarDetails?: (carId: string) => void;
}

const OwnerCenter: React.FC<OwnerCenterProps> = (props) => {
    const { user, onNavigate, onAddCarClick, onViewCarDetails } = props;
    const {
        fleet, pendingRequests, metrics, loading,
        activeTab, setActiveTab,
        calendarModalState, setCalendarModalState,
        isHeaderCollapsed, setIsHeaderCollapsed,
        activeCar,
        handleUpdatePrice,
        handleToggleStatus,
        handlePublishDraft
    } = useOwnerCenter(user);

    if (loading) return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
            <Spinner size="lg" color="slate" />
        </div>
    );

    return (
        <div className="h-screen w-full bg-slate-50 text-slate-600 font-sans selection:bg-[#3667AA]/20 relative overflow-hidden flex flex-col">
            <AnimatePresence>
                {calendarModalState && (
                    <ManageAvailabilityModal
                        carId={calendarModalState.carId}
                        carModel={calendarModalState.carModel}
                        onClose={() => setCalendarModalState(null)}
                    />
                )}
            </AnimatePresence>

            {/* --- BACKGROUND (Clean Slate) --- */}
            <div className="absolute inset-0 pointer-events-none z-0 bg-slate-50">
                {/* Subtle noise/texture for premium feel without color */}
                <div className="absolute inset-0 opacity-[0.015] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            </div>

            {/* --- FIXED HEADER WRAPPER (Strict Anchor) --- */}
            {/* Flex-none ensures it never shrinks. z-50 keeps it above scroll. */}
            <div className="flex-none z-50 bg-slate-50/90 backdrop-blur-xl shadow-sm md:shadow-none pt-[env(safe-area-inset-top)]">

                {/* 1. Static Owner Header */}
                <div className="px-6 pt-12 pb-4 max-w-7xl mx-auto">
                    <OwnerHeader
                        user={user}
                        onNavigate={onNavigate}
                        title={
                            activeTab === 'frota' ? <span style={{ color: '#1e293b' }}>Garagem</span> :
                                activeTab === 'pedidos' ? <span style={{ color: '#1e293b' }}>Pedidos</span> :
                                    <span style={{ color: '#1e293b' }}>Painel</span>
                        }
                        subtitle={
                            activeTab === 'frota' ? (fleet.length === 1 ? 'Seu veículo cadastrado' : "Seus " + fleet.length + " veículos cadastrados") :
                                activeTab === 'pedidos' ? "Aprove ou recuse solicitações pendentes" :
                                    "Visão geral dos seus rendimentos e performance"
                        }
                    />
                </div>

                {/* 2. The Toggle (Tabs) - Pinned Below Header */}
                <div className="px-6 w-full max-w-7xl mx-auto border-b border-slate-200/60">
                    <div className="flex w-full md:w-auto md:justify-start md:gap-8 relative">
                        {/* Tab: Painel */}
                        <button
                            onClick={() => setActiveTab('painel')}
                            className="flex-1 md:flex-none pb-4 pt-2 group relative flex justify-center md:justify-start outline-none"
                        >
                            <div
                                style={{ color: activeTab === 'painel' ? '#2A528A' : '#334155' }}
                                className="flex items-center gap-2 text-sm md:text-base font-bold transition-colors"
                            >
                                <i className="fas fa-chart-pie text-xs md:text-sm"></i>
                                <span>Painel</span>
                            </div>
                            {activeTab === 'painel' && (
                                <motion.div layoutId="activeTabLine" className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#2A528A] rounded-t-full" />
                            )}
                        </button>

                        {/* Tab: Frota */}
                        <button
                            onClick={() => setActiveTab('frota')}
                            className="flex-1 md:flex-none pb-4 pt-2 group relative flex justify-center md:justify-start outline-none"
                        >
                            <div
                                style={{ color: activeTab === 'frota' ? '#2A528A' : '#334155' }}
                                className="flex items-center gap-2 text-sm md:text-base font-bold transition-colors"
                            >
                                <i className="fas fa-car text-xs md:text-sm"></i>
                                <span>Garagem</span>
                            </div>
                            {activeTab === 'frota' && (
                                <motion.div layoutId="activeTabLine" className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#2A528A] rounded-t-full" />
                            )}
                        </button>

                        {/* Tab: Pedidos */}
                        <button
                            onClick={() => setActiveTab('pedidos')}
                            className="flex-1 md:flex-none pb-4 pt-2 group relative flex justify-center md:justify-start outline-none"
                        >
                            <div
                                style={{ color: activeTab === 'pedidos' ? '#2A528A' : '#334155' }}
                                className="flex items-center gap-2 text-sm md:text-base font-bold transition-colors"
                            >
                                <i className="fas fa-bell text-xs md:text-sm"></i>
                                <span>Pedidos</span>
                                {pendingRequests.length > 0 && <span className="text-[9px] bg-amber-500 text-white w-4 h-4 flex items-center justify-center rounded-full shadow-sm ml-1">{pendingRequests.length}</span>}
                            </div>
                            {activeTab === 'pedidos' && (
                                <motion.div layoutId="activeTabLine" className="absolute bottom-[-1px] left-0 right-0 h-[3px] bg-[#2A528A] rounded-t-full" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- CONTENT SCROLL AREA (Flex Grow) --- */}
            {/* Removed fixed padding-top, letting flex layout handle spacing */}
            <main
                className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-6 pb-24 relative z-0 max-w-7xl mx-auto w-full scroll-smooth"
            >
                <AnimatePresence mode="wait">
                    {/* 1. VISÃO GERAL (PAINEL) */}
                    {activeTab === 'painel' && (
                        <motion.div
                            key="painel"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <DashboardOverview
                                activeCar={activeCar}
                                metrics={metrics}
                                onNavigate={onNavigate}
                                onAddCarClick={onAddCarClick}
                            />
                        </motion.div>
                    )}

                    {/* 2. FROTA (FLEET LIST) */}
                    {activeTab === 'frota' && (
                        <motion.div
                            key="frota"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <FleetList
                                fleet={fleet}
                                onOpenCalendar={(carId, carModel) => setCalendarModalState({ isOpen: true, carId, carModel })}
                                onViewCarDetails={onViewCarDetails}
                                onUpdatePrice={handleUpdatePrice}
                                onToggleStatus={handleToggleStatus}
                                onPublishDraft={handlePublishDraft}
                            />
                        </motion.div>
                    )}

                    {/* 3. PEDIDOS (REQUESTS) */}
                    {activeTab === 'pedidos' && (
                        <motion.div
                            key="pedidos"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <RequestsList
                                requests={pendingRequests}
                                loading={loading}
                                onApprove={(id) => console.log('Approved', id)}
                                onReject={(id) => console.log('Rejected', id)}
                                onChatClick={(id) => {
                                    if (props.onOpenChatById) {
                                        props.onOpenChatById(id);
                                    } else {
                                        onNavigate?.(`/host/messages/${id}`);
                                    }
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default OwnerCenter;
