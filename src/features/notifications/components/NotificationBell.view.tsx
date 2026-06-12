import React from 'react';
import { useNotificationStore } from '@/features/notifications/stores/notification.store';
import { User } from '@/core/data/auth/auth.types';

interface NotificationBellProps {
    user: User | null | undefined;
    onClick: () => void;
    className?: string; // Allow external layout tweaks if needed
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ user, onClick, className = '' }) => {
    const { getUnreadCount } = useNotificationStore();

    if (!user) return null;

    const unreadCount = getUnreadCount(user.id);

    return (
        <button
            onClick={onClick}
            className={`relative w-[40px] h-[40px] rounded-full bg-white border border-slate-200 shadow-sm text-slate-700 flex items-center justify-center hover:bg-slate-50 transition-all active:scale-95 ${className}`}
        >
            <i className="far fa-bell text-lg"></i>
            {unreadCount > 0 && (
                <span className="absolute -top-[2px] -right-[2px] min-w-[20px] h-[20px] px-1 bg-red-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white z-10 transition-all duration-300">
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </button>
    );
};
