import React, { useState, useEffect, useRef } from 'react';
import { Car } from '@/core/data/car/car.types';
import { Conversation } from '@/core/data/messaging/messaging.types';

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400?text=Carro+Indispon%C3%ADvel";

export interface UseCarDetailsLogicProps {
    car: Car;
    conversation?: Conversation;
    onContactHost: (message: string) => void;
}

export const useCarDetailsLogic = ({ car, conversation, onContactHost }: UseCarDetailsLogicProps) => {
    const images = car.features && car.images && car.images.length > 0
        ? [car.imageUrl, ...car.images.filter(img => img !== car.imageUrl)]
        : [car.imageUrl, car.imageUrl, car.imageUrl];

    const features = car.features && car.features.length > 0
        ? car.features
        : ['Ar Condicionado', 'Direção Hidráulica', 'Vidros Elétricos', 'Trava Elétrica', 'Airbag', 'Freios ABS', 'Som Bluetooth', 'Câmera de Ré'];

    const owner = car.ownerDetails || {
        name: "Anfitrião",
        avatar: `https://i.pravatar.cc/150?u=${car.ownerId}`,
        isSuperhost: false,
        yearsHosting: 1,
        job: "Membro da Comunidade",
        quote: "Bem vindo! Adoro viajar e conhecer novas pessoas. O carro é higienizado a cada viagem.",
        school: ""
    };

    const [activeImage, setActiveImage] = useState(images[0] || PLACEHOLDER_IMAGE);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    // Lightbox State
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
    };

    // Chat State
    const [isQuickChatOpen, setIsQuickChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const chatScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isQuickChatOpen && !conversation) {
            setChatInput(`Oi, ${owner.name}! Tudo bem? Tenho interesse no seu ${car.make} ${car.model} ${car.year}.`);
        }
    }, [isQuickChatOpen, conversation, car, owner.name]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!chatInput.trim()) return;
        onContactHost(chatInput);
        setChatInput('');
    };

    const renderMessageStatus = (status?: string, isRead?: boolean) => {
        const effectiveStatus = status || (isRead ? 'read' : 'delivered');
        if (effectiveStatus === 'read') return <i className="fas fa-check-double text-green-500 text-[10px] ml-1" > </i>;
        return <i className="fas fa-check text-gray-400 text-[10px] ml-1" > </i>;
    };

    // Click Outside Logic (for dropdowns)
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isQuickChatOpen) return;
            const target = event.target as HTMLElement;
            if (!target.closest('.date-picker-container')) setActiveDropdown(null);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isQuickChatOpen]);

    return {
        owner,
        images,
        features,
        activeImage, setActiveImage,
        activeDropdown, setActiveDropdown,
        isLightboxOpen, setIsLightboxOpen,
        lightboxIndex, setLightboxIndex,
        openLightbox,
        isQuickChatOpen, setIsQuickChatOpen,
        chatInput, setChatInput,
        chatScrollRef,
        handleSendMessage,
        renderMessageStatus,
        PLACEHOLDER_IMAGE
    };
};
