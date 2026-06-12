import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotificationStore, Notification } from '../stores/notification.store';
import { useAuthStore } from '@/core/auth/auth.store';

interface NotificationsViewProps {
    isOpen: boolean;
    onClose: () => void;
    onNotificationClick: (notification: Notification) => void;
}

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min atrás`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} h atrás`;
    return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
};

const NotificationsView: React.FC<NotificationsViewProps> = ({ isOpen, onClose, onNotificationClick }) => {
    const { user } = useAuthStore();
    const { markAsRead, markAllAsRead, getNotificationsByUser } = useNotificationStore();
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    const myNotifications = user ? getNotificationsByUser(user.id) : [];
    
    const displayList = myNotifications.filter(n => filter === 'all' || !n.read);
    const sortedNotifications = [...displayList].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const checkUnreadCount = myNotifications.filter(n => !n.read).length;

    // Lock body scroll when overlay is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            return () => {
                document.body.style.overflow = 'unset';
            };
        }
    }, [isOpen]);

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
                        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                    />

                    {/* Popover centralizado num grid fantasma de max-w-7xl para espelhar a UI do sino */}
                    <div className="fixed inset-0 z-[110] pointer-events-none flex justify-center">
                        <div className="w-full max-w-7xl relative h-full">
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
                                className="absolute pointer-events-auto top-20 left-4 right-4 sm:left-auto sm:right-8 lg:right-0 xl:right-0 sm:w-[400px] max-h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 ring-1 ring-black/5"
                            >
                                {/* Header e Tabs */}
                                <div className="border-b border-slate-100 bg-white shrink-0">
                                    <div className="p-4 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-800 text-lg">Notificações</h3>
                                        {checkUnreadCount > 0 && user && (
                                            <button 
                                                onClick={() => markAllAsRead(user.id)}
                                                className="text-xs font-semibold text-[#3667AA] hover:text-[#254575] transition-colors"
                                            >
                                                Marcar lidas
                                            </button>
                                        )}
                                    </div>
                                    <div className="px-4 flex gap-4 text-sm font-medium border-t border-slate-50 pt-2">
                                        <button 
                                            onClick={() => setFilter('all')}
                                            className={`pb-3 border-b-2 transition-colors ${filter === 'all' ? 'border-[#3667AA] text-[#3667AA]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Todas
                                        </button>
                                        <button 
                                            onClick={() => setFilter('unread')}
                                            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${filter === 'unread' ? 'border-[#3667AA] text-[#3667AA]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                        >
                                            Não Lidas
                                            {checkUnreadCount > 0 && (
                                                <span className="bg-[#3667AA]/10 text-[#3667AA] px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                                                    {checkUnreadCount}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Lista de Notificações */}
                                <div className="overflow-y-auto overscroll-contain flex-1 bg-slate-50/30">
                                    {sortedNotifications.length === 0 ? (
                                        <div className="p-10 flex flex-col items-center justify-center text-center text-slate-400">
                                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                                                <i className="fas fa-check-double text-2xl text-slate-300"></i>
                                            </div>
                                            <p className="text-sm font-medium text-slate-600">Você está em dia!</p>
                                            <p className="text-xs mt-1">
                                                {filter === 'unread' 
                                                    ? 'Nenhuma notificação não lida no momento.'
                                                    : 'Nenhuma notificação nas suas atividades.'}
                                            </p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-slate-100/80">
                                            {sortedNotifications.map((notif) => (
                                                <li
                                                    key={notif.id}
                                                    onClick={() => {
                                                        if (!notif.read) markAsRead(notif.id);
                                                        if (notif.primaryAction) {
                                                            console.log("Mock Navegação do Histórico para:", notif.primaryAction.actionRef || notif.primaryAction.href);
                                                        }
                                                        onNotificationClick(notif);
                                                    }}
                                                    className={`p-4 hover:bg-slate-50 transition-colors relative group cursor-pointer ${!notif.read ? 'bg-blue-50/20' : 'bg-white'}`}
                                                >
                                                    {!notif.read && (
                                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#3667AA]"></div>
                                                    )}

                                                    <div className="flex gap-4">
                                                        <div className={`mt-0.5 w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                                            notif.type === 'booking_request' ? 'bg-amber-100 text-amber-600' :
                                                            notif.type === 'booking_approved' ? 'bg-emerald-100 text-emerald-600' :
                                                            'bg-blue-100 text-blue-600'
                                                        }`}>
                                                            <i className={`fas ${
                                                                notif.type === 'booking_request' ? 'fa-clock' :
                                                                notif.type === 'booking_approved' ? 'fa-check' :
                                                                'fa-info'
                                                            } text-sm`}></i>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={`text-sm font-semibold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                                                {notif.title}
                                                            </h4>
                                                            <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                                                                {notif.message}
                                                            </p>
                                                            
                                                            {/* Render Primary Action se existir */}
                                                            {notif.primaryAction && (
                                                                <button className="mt-3 text-xs font-bold text-[#005A70] bg-[#005A70]/5 hover:bg-[#005A70]/10 px-3 py-1.5 rounded-lg transition-colors inline-block active:scale-95">
                                                                    {notif.primaryAction.label}
                                                                </button>
                                                            )}
                                                            
                                                            <div className="mt-2 flex items-center">
                                                                <span className="text-[10px] text-slate-400 font-medium tracking-tight">
                                                                    {formatRelativeTime(notif.createdAt)}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationsView;
