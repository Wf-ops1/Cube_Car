import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface NotificationAction {
    label: string;
    actionRef?: string;
    href?: string;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'booking_request' | 'booking_approved' | 'booking_rejected' | 'verification_submitted' | 'verification_approved' | 'verification_rejected' | 'system';
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    data?: any; // For linking to Booking ID etc
    
    primaryAction?: NotificationAction;
    priority?: 'low' | 'normal' | 'high';
}

interface NotificationState {
    notifications: Notification[];
    toastQueue: Notification[];
    
    addNotification: (notification: Notification) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: (userId: string) => void;
    
    getUnreadCount: (userId: string) => number;
    getNotificationsByUser: (userId: string) => Notification[];
    
    dismissToast: (id: string, readStatusTrigger?: boolean) => void;
}

export const useNotificationStore = create<NotificationState>()(
    devtools(
        persist(
            (set, get) => ({
                notifications: [],
                toastQueue: [],

                addNotification: (notification) => set((state) => {
                    const isToastable = notification.priority !== 'low';
                    return {
                        notifications: [notification, ...state.notifications],
                        toastQueue: isToastable ? [notification, ...state.toastQueue] : state.toastQueue
                    };
                }, false, 'notification/add'),

                markAsRead: (id) => set((state) => ({
                    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
                }), false, 'notification/markAsRead'),

                markAllAsRead: (userId) => set((state) => ({
                    notifications: state.notifications.map(n => n.userId === userId ? { ...n, read: true } : n)
                }), false, 'notification/markAllAsRead'),

                dismissToast: (id, readStatusTrigger = false) => set((state) => {
                    // Se a dispensa for marcada como leitura (ex: o usuário fechou explicitamente)
                    const updatedNotifications = readStatusTrigger
                        ? state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
                        : state.notifications;

                    return {
                        toastQueue: state.toastQueue.filter(t => t.id !== id),
                        notifications: updatedNotifications
                    };
                }, false, 'notification/dismissToast'),

                getUnreadCount: (userId) => {
                    return get().notifications.filter(n => n.userId === userId && !n.read).length;
                },

                getNotificationsByUser: (userId) => {
                    return get().notifications.filter(n => n.userId === userId);
                }
            }),
            {
                name: 'cube-car-notification-storage',
                partialize: (state) => ({
                    notifications: state.notifications // Evita persistir a toastQueue entre reloads da página
                })
            }
        ),
        { name: 'NotificationStore' }
    )
);

