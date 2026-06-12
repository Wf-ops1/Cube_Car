import { useState, useCallback, useMemo, useEffect } from 'react';
import { Car } from '@/core/data/car/car.types';
import { User } from '@/core/data/auth/auth.types';
import { Conversation } from '@/core/data/messaging/messaging.types';
import { useAuthStore, useAuthActions } from './core/auth/auth.store';
import { useCatalog } from './features/catalog/hooks/useCatalog.logic';
import { initialCars } from '@/core/data/car/car.mock';
import { mockConversations } from '@/core/data/messaging/messaging.mock';

import { messagingGateway } from '@/core/data/gateways/messaging.gateway';
import { useChatStore } from '@/features/messaging/stores/chat.store';
import { messagingFacade } from '@/features/messaging/services/MessagingFacade';
import { useDraftBookingStore } from '@/features/booking/stores/draftBooking.store';
import { useNotificationStore } from '@/features/notifications/stores/notification.store';
import { useAddCarWizardStore } from '@/features/host-management/fleet/wizards/AddCarWizard.store';
import { useHostStore } from '@/features/host-management/stores/host.store';

/**
 * App Shell Logic Hook
 * Orchestrates global states, navigation and handlers for the main application shell.
 */
export const useAppLogic = () => {
    // Session Stack for true contextual navigation (Architecture Fix)
    const [historyStack, setHistoryStack] = useState<string[]>([]);

    // Navigation parent map for hierarchical back button (Fallback only)
    // All sub-pages go to 'home' for desktop safety (profile is mobile-only)
    const navigationParents: Record<string, string> = {
        'profile-edit': 'home',
        'settings': 'home',
        'verification': 'home',
        'favorites': 'home',
        'owner-center': 'home',
        'financial': 'home',
        'details': 'home',
        'checkout': 'details',
    };

    // Initialize from URL hash or query params
    const getInitialPage = () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('car')) return 'details';
        const hash = window.location.hash.replace('#', '');
        return hash || 'home';
    };

    const [currentPage, setCurrentPage] = useState(getInitialPage);

    // Sync with browser back/forward + disable auto scroll restoration
    useEffect(() => {
        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }

        const handlePopState = (event: PopStateEvent) => {
            const page = event.state?.page || window.location.hash.replace('#', '') || 'home';
            setCurrentPage(page);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const catalog = useCatalog();
    const { cars, isLoading: isLoadingCars, error, refreshCatalog: reloadCars, handleSearch } = catalog;
    const [selectedCar, setSelectedCar] = useState<Car | null>(initialCars[0]);

    // Handle Deep Linking on Initial Load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const carId = urlParams.get('car');
        if (carId && cars.length > 0) {
            // Check if we haven't set this car yet (prevents infinite loops if they navigate away)
            if (!selectedCar || selectedCar.id !== carId) {
                const car = cars.find(c => c.id === carId);
                if (car) {
                    setSelectedCar(car);
                    setCurrentPage('details');
                }
            }
        }
    }, [cars, selectedCar]);

    // Force refresh catalog when returning to home page
    useEffect(() => {
        if (currentPage === 'home') {
            // we use the local reference to refreshCatalog
            reloadCars();
        }
    }, [currentPage, reloadCars]);

    const { user, isLoading: isAuthLoading } = useAuthStore();
    const { setAuth, logout: logoutAction } = useAuthActions();

    const [bookingData, setBookingData] = useState({
        startDate: '2023-12-10',
        endDate: '2023-12-13',
        startTime: '10:00',
        endTime: '10:00'
    });

    // Use Global Store for Conversations (Single Source of Truth)
    const { conversations, setConversations } = useChatStore();

    // Handle Fresh User State & Init
    useEffect(() => {
        if (user?.id === 'user-fresh') {
            setConversations([]);
        } else if (conversations.length === 0) {
            // Only load mocks if store is empty (prevents overwriting read status)
            setConversations(mockConversations);
        }
    }, [user, setConversations]); // Removed conversations.length dependency to avoid loop? No, it's safe if we check length inside.
    // Actually, if we add conversations.length to dep array, it might loop.
    // Safe bet: [user, setConversations]. Inside: verify length.

    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    // Draft Sync Effect (Lazy Registration)
    useEffect(() => {
        if (user && user.id !== 'user-fresh') {
            const wizardState = useAddCarWizardStore.getState();
            if (wizardState.data?.make && wizardState.currentStep === 'review') {
                const data = wizardState.data;
                const carType = data.type || 'Sedan';
                const newCar = {
                    id: Math.random().toString(36).substr(2, 9),
                    ownerId: user.id,
                    make: data.make || 'Marca',
                    model: data.model || 'Modelo',
                    year: data.year || 2024,
                    pricePerDay: data.pricePerDay || 150,
                    imageUrl: data.photos?.[0] || 'https://images.unsplash.com/photo-1555215695-3004980adade?auto=format&fit=crop&q=80&w=800',
                    category: carType,
                    type: carType,
                    rating: 5.0,
                    trips: 0,
                    location: data.location || 'São Paulo, SP',
                    neighborhood: data.neighborhood,
                    coordinates: { lat: -23.5505, lng: -46.6333 },
                    status: 'pending' as const, // Treat as draft
                    isActiveAd: false,
                    description: data.description,
                    features: data.features,
                    images: data.photos
                };

                useHostStore.getState().addCar(newCar as any);
                wizardState.reset();
                wizardState.closeWizard();

                // (Removed notification as requested)

                // Se o usuário logado não for verificado, chamamos o modal de verificação imediatamente
                if (!user.isVerified) {
                    setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('open-verification-modal'));
                    }, 500);
                }
            }
        }
    }, [user]);


    // Auth Modals State (Consolidated)
    const [authModalMode, setAuthModalMode] = useState<'login' | 'signup' | null>(null);
    const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);
    const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

    // Search Context
    const [searchSummary, setSearchSummary] = useState({
        location: '',
        dateRange: ''
    });

    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [selectedUserProfile, setSelectedUserProfile] = useState<User | null>(null);
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

    useEffect(() => {
        const handleOpenVerification = () => setIsVerificationModalOpen(true);
        window.addEventListener('open-verification-modal', handleOpenVerification);
        return () => window.removeEventListener('open-verification-modal', handleOpenVerification);
    }, []);

    const activeCarConversation = useMemo(() => {
        if (!selectedCar) return undefined;
        return conversations.find(c =>
            c.carRelated?.id === selectedCar.id &&
            (c.participantId === selectedCar.ownerId || c.otherUser?.id === selectedCar.ownerId)
        );
    }, [selectedCar, conversations]);

    // Navbar Control for Mobile Chat Search
    const [isChatSearchFocused, setIsChatSearchFocused] = useState(false);



    const navigateTo = (page: string, params?: { carId?: string }) => {
        // Login intercept for profile
        if (page === 'profile' && !user) {
            setAuthModalMode('login');
            return;
        }

        // [UX] Always reset to Chat List when navigating via Navbar
        if (page === 'chat') {
            setActiveChatId(null);
        }

        // Push to custom internal history stack (contextual routing)
        setHistoryStack(prev => {
            const newStack = [...prev];
            if (newStack[newStack.length - 1] !== currentPage) {
                newStack.push(currentPage);
            }
            return newStack;
        });

        setCurrentPage(page);

        // Push state and update URL for deep linking
        let newUrl = window.location.pathname;
        if (page === 'details') {
            const carId = params?.carId || selectedCar?.id;
            if (carId) newUrl += `?car=${carId}`;
        } else {
            newUrl += window.location.hash;
        }

        history.pushState({ page, scrollY: 0 }, '', newUrl);
    };

    const openAuthModal = (mode: 'login' | 'signup') => setAuthModalMode(mode);
    const closeAuthModal = () => setAuthModalMode(null);

    const handleLogin = (loggedInUser: User) => {
        setAuth(loggedInUser);
        const wasSignup = authModalMode === 'signup';
        closeAuthModal();
        // if (wasSignup) {
        //     setIsOnboardingModalOpen(true);
        // }
    };

    const handleLogout = () => {
        logoutAction();
        navigateTo('home');
    };

    const onCarClick = (car: Car) => {
        setSelectedCar(car);
        navigateTo('details', { carId: car.id });
    };

    const handleBookingContinue = (data: any) => {
        setBookingData({
            startDate: data.startDate,
            endDate: data.endDate,
            startTime: data.startTime,
            endTime: data.endTime
        });
        navigateTo('checkout');
    };

    // Messaging Facade Usage
    // Refactored to use centralized service for chat operations (DDD / Facade Pattern)

    const handleOpenChat = async (ownerId: string, carId: string) => {
        if (!user) {
            openAuthModal('login');
            return;
        }

        try {
            const conversation = await messagingFacade.findOrCreateConversation(
                carId,
                user.id,
                ownerId
            );

            if (conversation) {
                navigateTo('chat');
                // Small timeout to ensure navigation state settles before setting active chat
                // validation: navigateTo sets activeChatId(null). We must override it after.
                setTimeout(() => setActiveChatId(conversation.id), 0);
            }
        } catch (err) {
            console.error("Failed to open chat", err);
            navigateTo('chat');
        }
    };

    const handleContactHost = async (message: string) => {
        if (!selectedCar || !user) return;

        try {
            const conversation = await messagingFacade.contactHost({
                carId: selectedCar.id,
                hostId: selectedCar.ownerId,
                userId: user.id,
                message
            });

            if (conversation) {
                setActiveChatId(conversation.id);
            }
        } catch (err) {
            console.error("Failed to contact host", err);
        }
    };

    const handleSendMessageInChat = async (chatId: string, text: string) => {
        if (!user) return;

        try {
            const conversation = useChatStore.getState().conversations.find(c => c.id === chatId);
            if (!conversation) return;

            const message = await messagingGateway.sendMessage(chatId, user.id, text);

            useChatStore.getState().updateConversation(chatId, {
                lastMessage: message.text,
                lastMessageTime: message.timestamp,
                messages: [...(conversation.messages || []), message]
            });

        } catch (err) {
            console.error("Failed to send message", err);
        }
    };

    const handleChatProfileClick = (userId: string) => {
        const conversation = conversations.find(c => c.otherUser.id === userId || c.participantId === userId);
        if (conversation) {
            // @ts-ignore - Adapter for generic User vs specialized ChatUser
            handleOpenProfile(conversation.otherUser);
        }
    };

    const handleDeleteConversation = (chatId: string) => {
        setConversations(conversations.filter(c => c.id !== chatId));
        if (activeChatId === chatId) {
            setActiveChatId(null);
        }
    };

    const handleViewCarDetails = (carId: string) => {
        // Priority 1: Catalog (Active Ads)
        let car = cars.find(c => c.id === carId);

        // Priority 2: Host Fleet (Paused/Blocked Ads that owner wants to see)
        if (!car) {
            car = useHostStore.getState().fleet.find(c => c.id === carId) as any;
        }

        if (car) {
            onCarClick(car);
        } else {
            console.warn(`Car not found in catalog or fleet for ID: ${carId}. Falling back to conversation data...`);

            // Priority 3: Failsafe: Create a temporary Car object from conversation data so the user is always redirected.
            const conv = conversations.find(c => c.carRelated?.id === carId);
            if (conv?.carRelated) {
                const tempCar: Car = {
                    id: conv.carRelated.id,
                    make: conv.carRelated.make,
                    model: conv.carRelated.model,
                    imageUrl: conv.carRelated.imageUrl,
                    year: new Date().getFullYear(),
                    pricePerDay: conv.carRelated.bookingDetails?.price || 0,
                    category: 'Sedan',
                    type: 'Sedan',
                    ownerId: conv.otherUser.id,
                    rating: 5,
                    trips: 1,
                    location: 'Local do Anúncio',
                    coordinates: { lat: -8.0476, lng: -34.8770 },
                    status: 'approved'
                };
                onCarClick(tempCar);
            } else {
                console.error(`Não foi possível encontrar dados para o carro ${carId} nas conversas.`);
            }
        }
    };

    const handleSearchWrapper = (params: any) => {
        // Handle new Date objects from SearchModal safely
        const startDate = params.startDate instanceof Date ? params.startDate : (params.pickupDate ? new Date(params.pickupDate) : null);
        const endDate = params.endDate instanceof Date ? params.endDate : (params.returnDate ? new Date(params.returnDate) : null);

        const start = startDate && !isNaN(startDate.getTime()) ? startDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) : '';
        const end = endDate && !isNaN(endDate.getTime()) ? endDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) : '';

        setSearchSummary({
            location: params.location || '',
            dateRange: (start && end) ? `${start} - ${end}` : 'Datas flexíveis'
        });

        handleSearch(params);
    };

    const handleOpenProfile = (user: User) => {
        setSelectedUserProfile(user);
        setIsProfileModalOpen(true);
    };

    return {
        currentPage,
        user,
        cars,
        selectedCar,
        bookingData,
        conversations,
        activeChatId,
        activeCarConversation,
        authModalMode,
        isAddCarModalOpen,
        isOnboardingModalOpen,
        isLoadingCars,
        isAuthLoading,
        selectedCategory: catalog.selectedCategory,
        setSelectedCategory: catalog.setSelectedCategory,
        handleSearch: handleSearchWrapper,
        searchSummary,
        error,
        navigateTo,
        openAuthModal,
        closeAuthModal,
        handleLogin,
        handleLogout,
        onCarClick,
        handleBookingContinue,
        handleContactHost,
        handleOpenChat,
        handleSendMessageInChat,
        setActiveChatId,
        setIsAddCarModalOpen,
        setIsOnboardingModalOpen,
        reloadCars,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        selectedUserProfile,
        handleOpenProfile,
        handleChatProfileClick,
        handleDeleteConversation,
        handleViewCarDetails,
        isChatSearchFocused,
        setIsChatSearchFocused,

        isVerificationModalOpen,
        setIsVerificationModalOpen,

        openWizard: () => {
            useAddCarWizardStore.getState().openWizard();
        },
        goBack: () => {
            // Se houver histórico de navegação no navegador, usamos ele (dispara popstate)
            if (window.history.length > 1 && window.history.state !== null) {
                window.history.back();
            } else {
                // Caso contrário (ex: abriu link direto), usamos o fallback hierárquico
                const parentPage = navigationParents[currentPage];
                if (parentPage) {
                    navigateTo(parentPage);
                } else {
                    navigateTo('home');
                }
            }
        }
    };
};
