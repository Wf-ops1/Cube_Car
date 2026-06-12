import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Notification } from '../stores/notification.store';

interface NotificationToastProps {
    notification: Notification;
    onDismiss: (id: string, readFlag?: boolean) => void;
    index: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ notification, onDismiss, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        // Pause-on-Hover mechanic
        if (isHovered) return;
        
        const timer = setTimeout(() => {
            onDismiss(notification.id, false); // Auto-dismiss doesn't necessarily mean it was read
        }, 5000); // 5 seconds duration
        
        return () => clearTimeout(timer);
    }, [isHovered, notification.id, onDismiss]);

    const handleActionClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // Em um cenário real, integrariamos com um router (ex: navigate(action.href))
        if(notification.primaryAction) {
             console.log("Mock Navegação para:", notification.primaryAction.actionRef || notification.primaryAction.href);
        }
        onDismiss(notification.id, true); // Ação disparada = Notificação lida
    };

    const handleDismissClick = () => {
        onDismiss(notification.id, true); // Dismiss explícito = Notificação lida
    };

    const getIcon = () => {
        switch (notification.type) {
            case 'booking_request': return <i className="fas fa-clock text-amber-400 text-sm"></i>;
            case 'booking_approved': return <i className="fas fa-check text-emerald-400 text-sm"></i>;
            default: return <i className="fas fa-info text-blue-400 text-sm"></i>;
        }
    };

    const getIconBg = () => {
        switch (notification.type) {
            case 'booking_request': return 'bg-amber-500/20 ring-1 ring-amber-500/30';
            case 'booking_approved': return 'bg-emerald-500/20 ring-1 ring-emerald-500/30';
            default: return 'bg-blue-500/20 ring-1 ring-blue-500/30';
        }
    };

    // Configurando valores do Stack 3D Baseado no Componente da Uiverse
    // O mais recente (index=0) fica 100% visível, e os antigos recuam em escala, descendo no eixo Z e subindo no eixo Y.
    const isFront = index === 0;
    const stackY = index * -18; // Empurra os cartões antigos magicamente para cima
    const stackScale = 1 - (index * 0.05); // 1, 0.95, 0.90
    const stackOpacity = 1 - (index * 0.25); // 1, 0.75, 0.50

    return (
        <motion.div
            layout
            // Animação Snappy iOS: Menos deslocamento inicial e física mais leve
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
                opacity: stackOpacity, 
                y: stackY, 
                scale: stackScale,
                zIndex: 50 - index 
            }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 400, damping: 30, mass: 0.8 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            /* 
              NOVA MÁGICA IOS GLASSMORPHISM:
              - Refinamento de bordas, translucidez densa e realce interno (reflexo de vidro).
            */
            className={`pointer-events-auto flex items-start gap-3 px-5 py-4 w-full md:w-[380px] bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-white/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.15)] overflow-hidden cursor-default transition-all duration-300 ${isFront ? 'relative' : 'absolute bottom-0 md:bottom-0'}`}
        >
            <div className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 mt-0.5 bg-white/5 border border-white/10 backdrop-blur-md`}>
                {getIcon()}
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="pr-10">
                    <div className="flex items-start justify-between mb-0.5">
                        <p className="text-[15px] font-semibold text-white leading-tight truncate pr-2">
                            {notification.title}
                        </p>
                        <span className="text-xs text-white/50 font-medium whitespace-nowrap mt-0.5 leading-none">agora</span>
                    </div>
                    <p className="text-[13px] text-white/80 leading-snug line-clamp-2 mt-0.5">
                        {notification.message}
                    </p>
                </div>
                
                {/* Primary Action Button (Dark Mode Adaptation) */}
                {notification.primaryAction && (
                    <button 
                        onClick={handleActionClick}
                        className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-[13px] font-semibold rounded-xl transition-all border border-white/10 active:scale-95"
                    >
                        {notification.primaryAction.label}
                    </button>
                )}
            </div>

            {/* Botão com Área de Toque Expandida (Hitbox invisível maior) */}
            <button 
                onClick={handleDismissClick}
                className="absolute top-2 right-2 w-10 h-10 flex items-center justify-center rounded-full text-white/30 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Dismiss notification"
            >
                <i className="fas fa-times text-[11px]"></i>
            </button>
        </motion.div>
    );
};
