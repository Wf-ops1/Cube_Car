import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Car } from '@/core/data/car/car.types';
import { User } from '@/core/data/auth/auth.types';
import { Conversation } from '@/core/data/messaging/messaging.types';

export interface BookingDetails {
    car: Car;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
}

export const ALL_TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
    const totalMinutes = i * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

export const useCarDetailsLogic = (
    car: Car,
    conversation: Conversation | undefined,
    onContinue: (data: BookingDetails) => void,
    onContactHost: (message: string) => void
) => {
    const defaultStart = car.availabilityHours?.start || '08:00';
    const defaultEnd = car.availabilityHours?.end || '18:00';
    const availability = car.availabilityHours || { start: "08:00", end: "18:00" };

    const [activeImage, setActiveImage] = useState(car.imageUrl || (car.images && car.images[0]) || '');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState(defaultStart);
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState(defaultEnd);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [viewDate, setViewDate] = useState(new Date());
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isQuickChatOpen, setIsQuickChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState('');

    const chatScrollRef = useRef<HTMLDivElement>(null);
    const datePickerContainerRef = useRef<HTMLDivElement>(null);
    const mobileDatePickerContainerRef = useRef<HTMLDivElement>(null);

    const owner: User = (car.ownerDetails as unknown as User) || {
        id: car.ownerId || 'host-1',
        email: 'host@example.com',
        name: "Anfitrião",
        avatar: `https://i.pravatar.cc/150?u=${car.ownerId}`,
        isSuperhost: false,
        city: "Florianópolis",
        verificationStatus: 'verified',
        job: "Membro da Comunidade",
        funFact: "Bem vindo!",
        bio: "Apaixonado por compartilhar experiências incríveis.",
        role: 'host'
    };

    const images = (car.images && car.images.length > 0)
        ? [car.imageUrl, ...car.images.filter(img => img !== car.imageUrl)]
        : [car.imageUrl, car.imageUrl, car.imageUrl];

    // Scroll Lock
    // Scroll Lock REMOVED - Was causing issues with stuck scroll on some devices
    /*
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);
    */

    // Derived Messages
    const displayMessages = conversation?.messages.map(m => ({
        id: m.id,
        type: m.senderId === car.ownerId ? 'host' : 'user',
        text: m.text,
        time: m.timestamp,
        isRead: m.isRead,
        status: m.status
    })) || [];

    // Chat auto-scroll
    useEffect(() => {
        if (isQuickChatOpen && chatScrollRef.current) {
            setTimeout(() => {
                if (chatScrollRef.current) {
                    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
                }
            }, 50);
        }
    }, [isQuickChatOpen, displayMessages.length]);

    // Initial Chat Message
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

    const handleContinue = () => {
        onContinue({ car, startDate, endDate, startTime, endTime });
    };

    const getCalculatedCosts = useCallback(() => {
        const defaultDays = 3;
        const insurance = 30;
        const serviceFee = 45;

        if (!startDate || !endDate) {
            const rentalCost = car.pricePerDay * defaultDays;
            return { days: defaultDays, rentalCost, insurance, serviceFee, total: rentalCost + insurance + serviceFee };
        }

        const start = new Date(`${startDate}T${startTime}`);
        const end = new Date(`${endDate}T${endTime}`);
        const diffMs = end.getTime() - start.getTime();
        let daysDiff = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        if (daysDiff < 1) daysDiff = 1;

        const rentalCost = car.pricePerDay * daysDiff;
        return { days: daysDiff, rentalCost, insurance, serviceFee, total: rentalCost + insurance + serviceFee };
    }, [startDate, endDate, startTime, endTime, car.pricePerDay]);

    return {
        state: {
            activeImage, setActiveImage,
            startDate, setStartDate,
            startTime, setStartTime,
            endDate, setEndDate,
            endTime, setEndTime,
            activeDropdown, setActiveDropdown,
            viewDate, setViewDate,
            isLightboxOpen, setIsLightboxOpen,
            lightboxIndex, setLightboxIndex,
            isQuickChatOpen, setIsQuickChatOpen,
            chatInput, setChatInput,
            displayMessages,
            costs: getCalculatedCosts(),
            owner,
            images,
            availability
        },
        refs: {
            chatScrollRef,
            datePickerContainerRef,
            mobileDatePickerContainerRef
        },
        actions: {
            handleSendMessage,
            handleContinue
        }
    };
};
