import React from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { mockUser } from '@/core/data/auth/user.mock';

const DevSync: React.FC = () => {
    // Only show in development
    if (import.meta.env.MODE !== 'development') return null;

    const { setAuth, user } = useAuthStore();

    const handleSync = () => {
        console.log('🔄 Syncing with mockUser...', mockUser);
        setAuth(mockUser);
        alert('Estado sincronizado com user.mock.ts!');
    };

    return (
        <div className="fixed bottom-4 right-4 z-[9999] group">
            <button
                onClick={handleSync}
                className="bg-slate-800 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center gap-2 opacity-50 hover:opacity-100"
                title="Sync Mock Data"
            >
                <i className="fas fa-sync-alt"></i>
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold whitespace-nowrap">
                    Sync Mock
                </span>
            </button>
        </div>
    );
};

export default DevSync;
