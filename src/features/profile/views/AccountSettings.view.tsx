import React from 'react';
import { User } from '@/core/data/auth/auth.types';
import { motion, AnimatePresence } from 'framer-motion';
import { BackButton } from '@/core/components/buttons/BackButton';
import { AmbientBackground } from '@/shared/components/layout/AmbientBackground';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { useAccountSettingsLogic } from '../hooks/useAccountSettings.logic';

interface AccountSettingsProps {
    user: User;
    onBack: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({ user, onBack }) => {
    const {
        activeView, setActiveView,
        editingField, setEditingField,
        notifications, toggleNotification,
        phoneForm, setPhoneForm,
        passwordForm, setPasswordForm,
        handleBack, handleEditClick
    } = useAccountSettingsLogic(user, onBack);

    return (
        <div className="min-h-screen bg-transparent relative z-50 overflow-hidden flex flex-col font-sans">

            {/* Content */}

            {/* Header (Standardized) */}
            <PageHeader
                title=""
                badgeText="Control Room"
                badgeIcon="fa-cog"
                onBack={handleBack}
            />

            <main className="flex-1 overflow-y-auto px-6 w-full max-w-7xl mx-auto pb-32 relative z-10">

                {/* Responsive Grid Layout */}
                <div className="grid md:grid-cols-[280px_1fr] gap-12 md:mt-0">

                    {/* Left Column: Navigation (Visible mostly on Desktop, or as title on Mobile) */}
                    <div className="md:block">
                        <div className="mb-8 mt-2">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-block"
                            >
                                <h1 className="text-3xl font-display font-medium text-[#1C2230] leading-tight mb-2">Configurações</h1>
                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">Gerenciar conta</p>
                            </motion.div>
                        </div>

                        {/* Desktop Sidebar Navigation */}
                        <div className="hidden md:flex flex-col gap-2">
                            <button
                                onClick={() => setActiveView('main')}
                                className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeView === 'main' ? 'bg-white shadow-md text-[#1C2230] border border-gray-100' : 'text-slate-500 hover:bg-white/50'}`}
                            >
                                <i className="fas fa-user-shield w-6"></i> Geral
                            </button>
                            <button
                                onClick={() => setActiveView('notifications')}
                                className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeView === 'notifications' ? 'bg-white shadow-md text-[#1C2230] border border-gray-100' : 'text-slate-500 hover:bg-white/50'}`}
                            >
                                <i className="fas fa-bell w-6"></i> Notificações
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Content Content */}
                    <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 md:p-10 shadow-sm">
                        <AnimatePresence mode="wait">

                            {/* --- GENERAL SETTINGS (Main) --- */}
                            {activeView === 'main' && (
                                <motion.div
                                    key="main"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full"
                                >
                                    <h2 className="text-xl font-bold text-slate-900 mb-8 md:hidden">Geral</h2>

                                    <div className="space-y-12">
                                        {/* Section 1: Credentials */}
                                        <div className="group">
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-200/50 pb-2">Credenciais</label>

                                            <div className="space-y-6">
                                                {/* Email Row (Read Only) */}
                                                <div className="flex items-center justify-between group/item opacity-75">
                                                    <div>
                                                        <span className="block text-base md:text-lg font-medium text-slate-900">ID de Acesso</span>
                                                        <span className="text-sm text-slate-400">{user.email}</span>
                                                    </div>
                                                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wide border border-emerald-100 flex items-center gap-1">
                                                        <i className="fas fa-check"></i> Verificado
                                                    </div>
                                                </div>

                                                {/* Phone Row */}
                                                <div className="border-b border-slate-100 pb-6 mb-6">
                                                    {editingField !== 'phone' ? (
                                                        <div className="flex items-center justify-between group/item">
                                                            <div>
                                                                <span className="block text-base md:text-lg font-medium text-slate-900">Telefone</span>
                                                                <span className="text-sm text-slate-400">{phoneForm}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleEditClick('phone')}
                                                                className="text-sm font-bold text-[#3667AA] hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1 rounded-lg"
                                                            >
                                                                Editar
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
                                                        >
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h3 className="text-base font-bold text-slate-900">Editar Telefone</h3>
                                                                <button
                                                                    onClick={() => setEditingField(null)}
                                                                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                                                                >
                                                                    CANCELAR
                                                                </button>
                                                            </div>

                                                            <div className="space-y-4">
                                                                <input
                                                                    type="text"
                                                                    value={phoneForm}
                                                                    onChange={(e) => setPhoneForm(e.target.value)}
                                                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3667AA]/20 transition-all"
                                                                />
                                                                <div className="flex justify-end">
                                                                    <button
                                                                        onClick={() => setEditingField(null)}
                                                                        className="bg-black text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-black/10"
                                                                    >
                                                                        Salvar
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                {/* Password Row */}
                                                <div className="border-b border-slate-100 pb-6">
                                                    {editingField !== 'password' ? (
                                                        <div className="flex items-center justify-between group/item">
                                                            <div>
                                                                <span className="block text-base md:text-lg font-medium text-slate-900">Senha</span>
                                                                <span className="text-sm text-slate-400">Alterar segurança</span>
                                                            </div>
                                                            <button
                                                                onClick={() => handleEditClick('password')}
                                                                className="text-sm font-bold text-[#3667AA] hover:text-blue-700 transition-colors bg-blue-50 px-3 py-1 rounded-lg"
                                                            >
                                                                Editar
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="w-full bg-white p-4 rounded-2xl shadow-sm border border-slate-100"
                                                        >
                                                            <div className="flex justify-between items-center mb-4">
                                                                <h3 className="text-base font-bold text-slate-900">Nova Senha</h3>
                                                                <button
                                                                    onClick={() => setEditingField(null)}
                                                                    className="text-xs font-bold text-slate-400 hover:text-slate-600"
                                                                >
                                                                    CANCELAR
                                                                </button>
                                                            </div>
                                                            <div className="space-y-4">
                                                                <input type="password" placeholder="Nova senha" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3667AA]/20" />
                                                                <input type="password" placeholder="Confirmar senha" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#3667AA]/20" />
                                                                <div className="flex justify-end">
                                                                    <button onClick={() => setEditingField(null)} className="bg-black text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg shadow-black/10">Atualizar</button>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile Only: Navigation to Notifications */}
                                        <div className="group md:hidden">
                                            <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-100 pb-2">Preferências</label>
                                            <button
                                                onClick={() => setActiveView('notifications')}
                                                className="w-full flex items-center justify-between group/btn text-left"
                                            >
                                                <div>
                                                    <span className="block text-lg font-medium text-slate-900 group-hover/btn:text-[#3667AA] transition-colors">Notificações</span>
                                                    <span className="text-sm text-slate-400">Viagens, ofertas e alertas</span>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover/btn:bg-[#3667AA] group-hover/btn:text-white transition-all">
                                                    <i className="fas fa-arrow-right text-xs"></i>
                                                </div>
                                            </button>
                                        </div>

                                        {/* Danger Zone */}
                                        <div className="pt-8 border-t border-slate-50">
                                            <button className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest flex items-center gap-2 hover:bg-red-50 px-4 py-2 rounded-lg -ml-4">
                                                <i className="fas fa-trash-alt"></i> Encerrar Conta
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- NOTIFICATIONS SETTINGS --- */}
                            {activeView === 'notifications' && (
                                <motion.div
                                    key="notifications"
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    className="w-full"
                                >
                                    <div className="flex items-center gap-4 mb-8 md:hidden">
                                        <BackButton onClick={() => setActiveView('main')} className="shadow-none bg-slate-100 w-8 h-8 p-0" />
                                        <h2 className="text-xl font-bold text-slate-900">Notificações</h2>
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-8 hidden md:block">Preferências de Notificação</h2>

                                    <div className="space-y-8">
                                        {[
                                            { id: 'trips', label: 'Notificações de Viagem', sub: 'Status, horários e alertas em tempo real' },
                                            { id: 'messages', label: 'Mensagens', sub: 'Novas conversas e atualizações do chat' },
                                            { id: 'promotions', label: 'Novidades e Ofertas', sub: 'Dicas exclusivas, descontos e lançamentos' }
                                        ].map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-white/50 transition-colors">
                                                <div className="pr-4">
                                                    <span className="block text-base md:text-lg font-medium text-slate-900">{item.label}</span>
                                                    <span className="text-sm text-slate-400 leading-snug block mt-1">{item.sub}</span>
                                                </div>

                                                {/* Smart Toggle */}
                                                <button
                                                    onClick={() => toggleNotification(item.id as keyof typeof notifications)}
                                                    className={`w-12 h-7 rounded-full transition-all duration-300 p-1 relative flex-shrink-0 ${notifications[item.id as keyof typeof notifications] ? 'bg-[#3667AA]' : 'bg-slate-200'}`}
                                                >
                                                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${notifications[item.id as keyof typeof notifications] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                </button>
                                            </div>
                                        ))}

                                        <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mt-8">
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#3667AA] flex items-center justify-center flex-shrink-0">
                                                    <i className="fas fa-info text-xs"></i>
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-[#3667AA] mb-1">Smart Alerts</p>
                                                    <p className="text-xs text-slate-500 leading-relaxed">
                                                        O Cube Car usa "Smart Delivery" para garantir que você só receba notificações realmente importantes quando estiver dirigindo ou em horário de trabalho.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default AccountSettings;
