import React, { Suspense, lazy } from 'react';
import { createPortal } from 'react-dom';
import { GuestState } from '@/shared/components/states/GuestState';
import { MessageCircle, Map, User as UserIcon } from 'lucide-react';
import ProfileHub from '@/features/profile/views/ProfileHub.view';
import UserVerificationWizard from '@/features/verification/wizards/UserVerificationWizard.view';
import { useDraftBookingStore } from '@/features/booking/stores/draftBooking.store'; // Import Draft Store
import { useNotificationStore } from '@/features/notifications/stores/notification.store'; // Import Notification Store

// View Imports - Lazy Loaded
const HomeView = lazy(() => import('@/features/home/views/Home.view'));

const Chat = lazy(() => import('@/features/messaging/views/Chat.view'));
const PublicProfile = lazy(() => import('@/features/profile/components/PublicProfile.view'));
const Checkout = lazy(() => import('@/features/booking/views/Checkout.view'));
const BecomeHost = lazy(() => import('@/features/host-management/fleet/views/BecomeHost.view'));
const HowItWorks = lazy(() => import('@/features/institucional/views/HowItWorks.view'));
const HelpCenter = lazy(() => import('@/features/institucional/views/HelpCenter.view'));
const Dashboard = lazy(() => import('@/features/dashboard/views/Dashboard.view'));
const WalletView = lazy(() => import('@/features/wallet/views/Wallet.view'));
const HostFleet = lazy(() => import('@/features/host-management/fleet/views/HostFleet.view'));
const OwnerCenter = lazy(() => import('@/features/host-management/dashboard/views/OwnerCenter.view'));

const EditProfile = lazy(() => import('@/features/profile/views/EditProfile.view'));
const AccountSettings = lazy(() => import('@/features/profile/views/AccountSettings.view'));
const VerificationCenter = lazy(() => import('@/features/profile/views/VerificationCenter.view'));
const Favorites = lazy(() => import('@/features/profile/views/Favorites.view'));
const CarDetails = lazy(() => import('@/features/catalog/views/CarDetails.view'));

import { useFavoritesStore } from '@/features/profile/stores/favorites.store';
import { useHostStore } from '@/features/host-management/stores/host.store';


// Components
import Header from '@/core/components/Header';
import Footer from '@/core/components/Footer';



interface RouterProps {
    currentPage: string;
    user: any;
    cars: any[];
    selectedCar: any;
    activeChatId: string | null;
    activeCarConversation: any;
    bookingData: any;
    conversations: any[];
    searchSummary: any;
    selectedCategory: string;
    isLoadingCars: boolean;
    error: string | null;
    isChatSearchFocused: boolean;

    // Actions
    navigateTo: (page: string) => void;
    openAuthModal: (type: 'login' | 'signup') => void;
    openLoginModal: () => void;
    openWizard: () => void;
    handleLogout: () => void;
    onCarClick: (car: any) => void;
    handleSearch: (filters: any) => void;
    setSelectedCategory: (category: string) => void;
    reloadCars: () => void;
    handleBookingContinue: (data: any) => void;
    handleContactHost: (message: string) => void;
    handleOpenProfile: (user: any) => void;
    handleLogin: (data: any) => void;
    handleOpenChat: (ownerId: string, carId: string) => void;
    goBack: () => void;
    setActiveChatId: (id: string | null) => void;
    handleSendMessageInChat: (text: string) => void;
    handleDeleteConversation: (chatId: string) => void;
    handleViewCarDetails: (carId: string) => void;
    setIsChatSearchFocused: (focused: boolean) => void;
    setIsSearchModalOpen: (isOpen: boolean) => void;
}


export const Router: React.FC<RouterProps> = (props) => {
    const {
        currentPage, user, cars, selectedCar, activeChatId,
        navigateTo, openAuthModal, openWizard, handleLogout
    } = props;

    // Load favorites from store
    const { favoriteIds, toggleFavorite, isFavorite } = useFavoritesStore();
    const favoriteCars = React.useMemo(() => {
        return cars.filter(car => favoriteIds.includes(car.id));
    }, [cars, favoriteIds]);

    // Header Props Helper
    const headerProps = {
        user,
        onBecomeHostClick: () => {
            const isHost = user && useHostStore.getState().fleet.length > 0;
            if (isHost) {
                openWizard();
            } else {
                navigateTo('host');
            }
        },
        onLogoClick: () => navigateTo('home'),
        onHowItWorksClick: () => navigateTo('how-it-works'),
        onHelpCenterClick: () => navigateTo('help'),
        onLoginClick: () => openAuthModal('login'),
        onSignupClick: () => openAuthModal('signup'),
        onLogout: handleLogout,
        onChatClick: () => navigateTo('chat'),
        onDashboardClick: () => navigateTo('dashboard'),
        onFinancialClick: () => navigateTo('financial'),
        onOwnerCenterClick: () => navigateTo('owner-center'), // Added specifically for Host Panel
        onVerificationClick: () => navigateTo('verification'),
        onSettingsClick: () => navigateTo('settings'),
        onFavoritesClick: () => navigateTo('favorites'),
        onEditProfileClick: () => navigateTo('profile-edit'),
        onNotificationClick: (notif: any) => {
            if (notif.type === 'verification_approved' && notif.data?.carId) {
                // Deep link to checkout
                if (props.handleViewCarDetails) {
                    props.handleViewCarDetails(notif.data.carId);
                }
                // Wait a tick for state to update then go to checkout
                setTimeout(() => navigateTo('checkout'), 50);

                // Mark as read
                useNotificationStore.getState().markAsRead(notif.id);
            }
        },

        isSearchMode: false,
        searchProps: {
            location: props.searchSummary.location,
            dateRange: props.searchSummary.dateRange,
            time: props.searchSummary.time,
            onSearch: props.handleSearch,
            onModalOpen: () => props.setIsSearchModalOpen(true),
            cars: props.cars
        }
    };




    // 1. Host Page
    if (currentPage === 'host') {
        return (
            <BecomeHost
                onBackToHome={() => navigateTo('home')}
                onListCar={() => {
                    openWizard(); // New Wizard Flow
                    navigateTo('home');
                }}
            />
        );
    }

    // 3. Dashboard Page
    if (currentPage === 'dashboard') {
        if (!user) {
            return (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center overflow-hidden touch-none">
                    <GuestState
                        title="VIAGENS"
                        description="Acompanhe reservas ativas, histórico completo e gerencie todas as suas viagens de carro."
                        actionLabel="Entrar"
                        onAction={() => openAuthModal('login')}
                        icon={Map}
                    />
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-transparent relative z-10">
                <div id="global-header" className="hidden md:block">
                    <Header {...headerProps} />
                </div>
                <Dashboard user={user} onNavigateHome={() => navigateTo('home')} onNavigateHelp={() => navigateTo('help')} />

            </div>
        );
    }

    // 5. Financial Page
    if (currentPage === 'financial') {
        if (!user) {
            navigateTo('home');
            openAuthModal('login');
            return null;
        }
        return (
            <div className="min-h-screen bg-mercury-50">
                <Header {...headerProps} className="md:hidden" />
                <WalletView />

            </div>
        );
    }

    if (currentPage === 'garage') {
        if (!user) {
            setTimeout(() => {
                navigateTo('home');
                openAuthModal('login');
            }, 0);
            return null;
        }
        return (
            <div className="min-h-screen w-full overflow-x-hidden bg-[#FDFDFD]">
                <HostFleet
                    user={user}
                    onNavigateHome={() => navigateTo('home')}
                    onAddCarClick={openWizard}
                />
                <Footer
                    onHowItWorksClick={() => navigateTo('how-it-works')}
                    onHelpCenterClick={() => navigateTo('help')}
                />
            </div>
        );
    }

    if (currentPage === 'owner-center') {
        if (!user) return null;
        return (
            <OwnerCenter
                user={user}
                onNavigate={navigateTo}
                onAddCarClick={openWizard}
                onOpenChatById={(chatId) => {
                    navigateTo('chat');
                    setTimeout(() => props.setActiveChatId(chatId), 0);
                }}
                onViewCarDetails={props.handleViewCarDetails}
            />
        );
    }



    // 5.0 Chat Feature
    if (currentPage === 'chat') {
        if (!user) {
            return (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center overflow-hidden touch-none z-[40]" style={{ height: 'var(--app-height)' }}>
                    <GuestState
                        title="MENSAGENS"
                        description="Faça login para acessar suas conversas e negociar aluguéis."
                        actionLabel="Entrar"
                        onAction={() => openAuthModal('login')}
                        icon={MessageCircle}
                    />
                </div>
            );
        }

        return (
            <div className="fixed inset-0 bg-transparent z-[40] flex flex-col" style={{ height: 'var(--app-height)' }}>
                {/* Desktop Header - Hidden on Mobile */}
                <div className="hidden md:block shrink-0">
                    <Header {...headerProps} />
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <Suspense fallback={<div className="flex h-full items-center justify-center"><i className="fas fa-circle-notch fa-spin text-2xl text-blue-600"></i></div>}>
                        <Chat
                            currentUser={user!}
                            onBack={props.goBack}
                            conversations={props.conversations}
                            activeChatId={props.activeChatId}
                            onSelectChat={props.setActiveChatId}
                            onSendMessage={props.handleSendMessageInChat}
                            onDeleteChat={props.handleDeleteConversation}
                            onViewCarDetails={props.handleViewCarDetails}
                            onSearchFocus={props.setIsChatSearchFocused}
                        />
                    </Suspense>
                </div>
            </div>
        );
    }

    // 5. Profile Hub Page
    if (currentPage === 'profile') {
        if (!user) {
            return (
                <div className="fixed inset-0 bg-transparent flex items-center justify-center overflow-hidden touch-none">
                    <GuestState
                        title="PERFIL"
                        description="Acesse sua conta exclusiva."
                        actionLabel="Entrar"
                        onAction={() => openAuthModal('login')}
                        icon={UserIcon}
                    />
                </div>
            );
        }
        return (
            <div className="min-h-screen bg-transparent relative z-10">
                <ProfileHub
                    user={user}
                    onNavigate={navigateTo}
                    onLogout={handleLogout}
                />
            </div>
        );
    }

    // 5.1 Edit Profile Page
    if (currentPage === 'profile-edit') {
        if (!user) {
            navigateTo('home');
            openAuthModal('login');
            return null;
        }
        return (
            <EditProfile
                user={user}
                onSave={(updated) => {
                    console.log('Update User:', updated);
                    props.goBack();
                }}
                onBack={props.goBack}
            />
        );
    }

    // 5.2 Account Settings Page
    if (currentPage === 'settings') {
        if (!user) {
            navigateTo('home');
            openAuthModal('login');
            return null;
        }
        return (
            <AccountSettings user={user} onBack={props.goBack} />
        );
    }

    // 5.3 Verification Center Page
    if (currentPage === 'verification') {
        if (!user) {
            navigateTo('home');
            openAuthModal('login');
            return null;
        }
        return (
            <VerificationCenter user={user} onBack={props.goBack} />
        );
    }

    // 5.4 Favorites Page
    if (currentPage === 'favorites') {
        return (
            <Favorites
                user={user}
                onBack={props.goBack}
                favorites={favoriteCars}
                onCarClick={props.onCarClick}
                onLogin={() => openAuthModal('login')}
            />
        );
    }

    if (currentPage === 'details' && selectedCar) {
        return createPortal(
            <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
                <CarDetails
                    car={selectedCar}
                    conversation={props.activeCarConversation}
                    currentUser={user}
                    isGuest={!user}
                    isFavorite={!!user && isFavorite(selectedCar.id)}
                    onToggleFavorite={() => {
                        if (!user) {
                            openAuthModal('login');
                        } else {
                            toggleFavorite(selectedCar.id);
                        }
                    }}
                    onLoginReq={() => openAuthModal('login')}
                    onClose={props.goBack}
                    onContinue={props.handleBookingContinue}
                    onContactHost={props.handleContactHost}
                    onOpenProfile={props.handleOpenProfile}
                    onNavigate={(page, params) => {
                        if (page === 'chat' && params?.userId && params?.carId) {
                            props.handleOpenChat(params.userId, params.carId);
                        } else {
                            navigateTo(page);
                        }
                    }}
                    headerProps={headerProps}
                />
            </div>,
            document.body
        );
    }

    // 5. Checkout Page
    if (currentPage === 'checkout' && selectedCar) {
        return (
            <Checkout
                user={user}
                car={selectedCar}
                startDate={props.bookingData.startDate}
                endDate={props.bookingData.endDate}
                startTime={props.bookingData.startTime}
                endTime={props.bookingData.endTime}
                onBack={props.goBack}
                onSuccess={() => navigateTo('dashboard')}
                onLoginClick={() => openAuthModal('login')}
                onLogin={props.handleLogin}
                onOpenChat={props.handleOpenChat}
                onGoHome={() => navigateTo('home')}
                onGoToVerification={() => navigateTo('verification')}
            />
        );
    }

    // 6. How It Works
    if (currentPage === 'how-it-works') {
        return (
            <div className="min-h-screen bg-transparent flex flex-col">
                <div className="flex-1 flex flex-col">
                    <HowItWorks
                        onBackToHome={() => navigateTo('home')}
                        onHelpCenterClick={() => navigateTo('help')}
                        onBecomeHost={() => {
                            const isHost = user && useHostStore.getState().fleet.length > 0;
                            if (isHost) {
                                openWizard();
                            } else {
                                navigateTo('host');
                            }
                        }}
                    />
                </div>
                <Footer
                    onHowItWorksClick={() => navigateTo('how-it-works')}
                    onHelpCenterClick={() => navigateTo('help')}
                />
            </div>
        );
    }

    // 7. Help Center
    if (currentPage === 'help') {
        return (
            <div className="min-h-screen bg-transparent flex flex-col">
                <Header {...headerProps} />
                <div className="flex-1 flex flex-col">
                    <HelpCenter
                        onBackToHome={() => navigateTo('home')}
                        onContactSupport={() => alert("Função de suporte em breve!")}
                        onHowItWorksClick={() => navigateTo('how-it-works')}
                    />
                </div>
            </div>
        );
    }



    // Default: Home Page
    return (
        <div className="min-h-screen bg-transparent">
            <HomeView
                user={user}
                headerProps={headerProps}
                searchSummary={props.searchSummary}
                handleSearch={props.handleSearch}
                setIsSearchModalOpen={props.setIsSearchModalOpen}
                // Actually original App.view.tsx passed setIsSearchModalOpen from useAppLogic
                // I should add this to props if needed, or handle it via a wrapper.
                // Let's assume passed in props. But HomeView prop type might need matching.
                // For now sticking to explicit props.
                selectedCategory={props.selectedCategory}
                setSelectedCategory={props.setSelectedCategory}
                isLoadingCars={props.isLoadingCars}
                cars={cars}
                error={props.error}
                reloadCars={props.reloadCars}
                onCarClick={props.onCarClick}
                navigateTo={navigateTo}
            />
        </div>
    );
};
