import React, { Suspense, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlobalErrorBoundary from './core/error/GlobalErrorBoundary';

import EliteBackground from './core/components/EliteBackground.view';
import BottomNavbar from './core/components/BottomNavbar';
import { Router } from './core/router/Router.view';
import { useAppLogic } from './App.logic';

// Search & Modals
import { SearchModal } from '@/features/catalog/components';
import LoginModal from '@/features/auth-modals/components/LoginModal.view';
import SignupModal from '@/features/auth-modals/components/SignupModal.view';
import OnboardingModal from '@/features/auth-modals/components/OnboardingModal.view';
import AddCarWizard from '@/features/host-management/fleet/wizards/add-car/AddCarWizard.view';
import { VerificationRequiredModal } from '@/features/host-management/fleet/components/VerificationRequiredModal.view';
import UserVerificationWizard from '@/features/verification/wizards/UserVerificationWizard.view';
import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';
import PublicProfile from '@/features/profile/components/PublicProfile.view';

import DevSync from '@/core/dev/DevSync';
import { NotificationToastProvider } from '@/features/notifications/components/NotificationToastProvider';

// Stores
import { useAuthStore } from '@/core/auth/auth.store';
import { useNotificationStore } from '@/features/notifications/stores/notification.store';

const App: React.FC = () => {
  const appLogic = useAppLogic();
  const {
    currentPage,
    user,
    cars,
    activeChatId,
    authModalMode,
    openAuthModal,
    closeAuthModal,
    isOnboardingModalOpen,
    setIsOnboardingModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    onCarClick,
    handleLogin,
    handleSearch,
    navigateTo,
    selectedUserProfile,
    searchSummary,
    isAuthLoading,
    isChatSearchFocused,
    reloadCars,
    isVerificationModalOpen,
    setIsVerificationModalOpen
  } = appLogic;

  // Dynamic Viewport Height Fix (Industry Standard)
  useEffect(() => {
    const setVh = () => {
      const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      document.documentElement.style.setProperty('--app-height', `${height}px`);
    };

    setVh();
    window.visualViewport?.addEventListener('resize', setVh);
    window.addEventListener('resize', setVh);

    // (Removed test notification as requested)

    // [UI Demo] Notificação promocional demonstrativa
    const promoTimeout = setTimeout(() => {
        const authUser = useAuthStore.getState().user;
        if (authUser) {
            useNotificationStore.getState().addNotification({
                id: `promo-coupon-${Date.now()}`,
                userId: authUser.id,
                type: 'system',
                title: '🎁 Presente Especial',
                message: 'Ganhe 15% OFF no seu próximo aluguel neste fim de semana! Use o cupom CUBE15.',
                read: false,
                createdAt: new Date().toISOString(),
                priority: 'normal' // Vai disparar um toast
            });
        }
    }, 5000); // 5 segundos

    return () => {
      window.visualViewport?.removeEventListener('resize', setVh);
      window.removeEventListener('resize', setVh);
      clearTimeout(promoTimeout);
    };
  }, []);

  // 0. Global Auth Loading (Initial Hydration only)
  if (isAuthLoading && !user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="load-row scale-150">
          <span className="bg-primary"></span>
          <span className="bg-primary"></span>
          <span className="bg-primary"></span>
          <span className="bg-primary"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent relative selection:bg-blue-100 selection:text-blue-900">
      
      {/* Action Loading Overlay (e.g., Document Submission) */}
      <AnimatePresence>
        {isAuthLoading && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-50"
          >
            <div className="load-row scale-150">
              <span className="bg-primary"></span>
              <span className="bg-primary"></span>
              <span className="bg-primary"></span>
              <span className="bg-primary"></span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <GlobalErrorBoundary>
        <EliteBackground />

        <div className="w-full relative">
          <Suspense fallback={<div className="min-h-screen bg-transparent" />}>
            {/* Main Routing Logic extracted to Router.view.tsx for maintainability */}
            <Router {...appLogic} />
          </Suspense>
        </div>

        {/* Persistent Bottom Navbar (Mobile Only) - Logic synced with Router visibility */}
        {currentPage !== 'owner-center' && currentPage !== 'host' && currentPage !== 'profile-edit' && currentPage !== 'settings' && currentPage !== 'verification' && currentPage !== 'details' && currentPage !== 'checkout' && !(currentPage === 'chat' && activeChatId) && currentPage !== 'financial' && currentPage !== 'favorites' && currentPage !== 'help' && currentPage !== 'how-it-works' && (
          <BottomNavbar
            activePage={currentPage}
            onNavigate={navigateTo}
            user={user}
            onLoginClick={() => openAuthModal('login')}
            forceHidden={isChatSearchFocused} // [UX] Smooth Slide Hide
          />
        )}

        {/* Modals Layer */}
        <AnimatePresence>
          {authModalMode === 'login' && (
            <Suspense fallback={null}>
              <LoginModal
                onClose={closeAuthModal}
                onOpenSignup={() => openAuthModal('signup')}
                onLogin={handleLogin}
              />
            </Suspense>
          )}

          {authModalMode === 'signup' && (
            <Suspense fallback={null}>
              <SignupModal
                onClose={closeAuthModal}
                onOpenLogin={() => openAuthModal('login')}
                onSignup={(user) => {
                  handleLogin(user);
                  // Trigger Verification Wizard
                  useUserVerificationWizardStore.getState().openWizard();
                }}
              />
            </Suspense>
          )}

          {isOnboardingModalOpen && user && (
            <Suspense fallback={null}>
              <OnboardingModal
                userName={user.name}
                onClose={() => setIsOnboardingModalOpen(false)}
              />
            </Suspense>
          )}

          {isSearchModalOpen && (
            <SearchModal
              isOpen={isSearchModalOpen}
              onClose={() => setIsSearchModalOpen(false)}
              initialLocation={searchSummary.location}
              onSearch={handleSearch}
              user={user}
            />
          )}

          {isProfileModalOpen && selectedUserProfile && (
            <Suspense fallback={null}>
              <PublicProfile
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={selectedUserProfile}
                onCarClick={(car) => {
                  setIsProfileModalOpen(false);
                  onCarClick(car);
                }}
                cars={cars.filter(c => c.ownerId === selectedUserProfile.id)} // Dynamic garage
                onContactClick={() => {
                  setIsProfileModalOpen(false);
                  if (currentPage === 'details') {
                    window.dispatchEvent(new CustomEvent('open-quick-chat'));
                  } else if (selectedCar && selectedUserProfile) {
                    handleOpenChat(selectedUserProfile.id, selectedCar.id);
                  }
                }}
              />
            </Suspense>
          )}
        </AnimatePresence>

        {/* Global Wizard Overlay */}
        <AddCarWizard onComplete={reloadCars} openAuthModal={openAuthModal} />
        <UserVerificationWizard />

        <VerificationRequiredModal
          isOpen={isVerificationModalOpen}
          onClose={() => setIsVerificationModalOpen(false)}
          onNavigateToVerification={() => {
            setIsVerificationModalOpen(false);
            useUserVerificationWizardStore.getState().openWizard();
          }}
        />

        {/* Global Toast Notifications Provider */}
        <NotificationToastProvider />

        {/* Dev Tools */}
        <DevSync />
      </GlobalErrorBoundary>
    </div>
  );
};


export default App;