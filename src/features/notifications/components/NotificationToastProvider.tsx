import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNotificationStore } from '../stores/notification.store';
import { NotificationToast } from './NotificationToast.view';

export const NotificationToastProvider: React.FC = () => {
    // Agora o Provider é limpo e apenas desenha o que está na fila da nuvem de avisos
    const { toastQueue, dismissToast } = useNotificationStore();

    // Controle de poluição visual: Máximo de 3 toasts visíveis simultaneamente
    const activeToasts = toastQueue.slice(0, 3);

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none flex justify-center">
            {/* Wrapper delimitador que copia o palco (container max-w-7xl) do layout global */}
            <div className="w-full max-w-7xl relative h-full px-0 sm:px-6 lg:px-8">
                <div className="absolute top-4 md:top-auto md:bottom-8 left-4 right-4 md:left-auto md:right-8 xl:right-0 md:w-[380px]">
                    <div className="relative w-full flex flex-col items-center md:items-end">
                        <AnimatePresence mode="popLayout">
                            {activeToasts.map((toast, index) => (
                                <NotificationToast 
                                    key={toast.id} 
                                    notification={toast} 
                                    onDismiss={dismissToast} 
                                    index={index}
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
