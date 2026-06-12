import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/shared/components/ui/Logo';
import { User } from '@/core/data/auth/auth.types';
import NotificationsView from '@/features/notifications/views/Notifications.view';
import { useNotificationStore } from '@/features/notifications/stores/notification.store';
import { NotificationBell } from '@/features/notifications/components';

import { DesktopMenu } from './header/DesktopMenu';
import { ELITE_EASE } from './header/constants';
import { HeroSearch } from '@/features/catalog/components';
import { HeroSearchProps } from '@/features/catalog/components/HeroSearch.view';
interface HeaderProps {
  user?: User | null;
  onBecomeHostClick: () => void;
  onLogoClick: () => void;
  onHelpCenterClick?: () => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onLogout?(): void;
  onDashboardClick?: () => void;
  onFinancialClick?: () => void;
  onOwnerCenterClick?: () => void;
  onVerificationClick?: () => void;
  onSettingsClick?: () => void;
  onFavoritesClick?: () => void;
  onEditProfileClick?: () => void;
  onChatClick?: () => void;
  onNotificationClick?: (notification: any) => void;

  isSearchMode?: boolean;
  searchProps?: HeroSearchProps;
  innerClassName?: string;
  hideBecomeHost?: boolean;
  className?: string;
  fullWidth?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onBecomeHostClick,
  onLogoClick,
  onHelpCenterClick,
  onLoginClick,
  onSignupClick,
  onLogout,
  onDashboardClick,
  onFinancialClick,
  onOwnerCenterClick,
  onVerificationClick,
  onSettingsClick,
  onFavoritesClick,
  onEditProfileClick,
  onChatClick,
  onNotificationClick,

  isSearchMode = false,
  searchProps,
  innerClassName = '',
  hideBecomeHost = false,
  className = '',
  fullWidth = false,
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { getUnreadCount } = useNotificationStore();
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  useEffect(() => {
    const handleScroll = () => {
      // Threshold where the main hero search disappears
      if (window.scrollY > 300) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      // If click is on button or menu, do nothing (toggle handles button)
      if (
        buttonRef.current?.contains(event.target as Node) ||
        menuRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setIsMenuOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => setIsMenuOpen(false);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userAvatar = user?.avatar;

  return (
    <>
      {/* We use a before: pseudo-element to bleed the background 4px upwards, eradicating subpixel viewport gaps at Y=0 without messing any internal pixel alignment */}
      <nav className={`sticky top-0 bg-[#F8F9FB] w-full z-[80] h-[72px] md:h-[80px] transition-all duration-300 m-0 before:content-[''] before:absolute before:-top-1 before:left-0 before:w-full before:h-2 before:bg-[#F8F9FB] before:-z-10 ${className}`}>
        <div className={`${fullWidth ? 'w-full px-8' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'} h-full ${innerClassName}`}>
          <div className="flex justify-between items-center h-full">

            {/* 1. IDENTITY (LEFT) */}
            <div
              className={`relative z-10 flex items-center gap-3 cursor-pointer select-none shrink-0 group transition-all duration-400 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                isSearchMode ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'
              } ${isScrolled ? 'max-w-0 opacity-0 overflow-hidden md:max-w-none md:opacity-100 md:overflow-visible' : 'max-w-[200px]'}`}
              onClick={() => {
                onLogoClick();
                if (isMenuOpen) toggleMenu();
              }}
            >
              <div className="relative">
                <Logo className="h-[82px] md:h-[85px] w-auto sm:h-[5.6rem] text-primary group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
                <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-full" />
              </div>
            </div>

            {/* 2. CENTRAL ACTION (PLG HUB) — Always mounted, crossfade via opacity */}
            <div className="flex items-center absolute left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] md:w-full max-w-[850px] md:px-6">

              {/* HeroSearch — fades in when scrolled */}
              <div className={`w-full transition-all duration-300 ease-in-out ${isScrolled || isSearchMode ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-95'}`}>
                <HeroSearch {...searchProps} />
              </div>

            </div>

            {/* 3. PROFILE & GESTURE (RIGHT) */}
            <div className={`relative z-10 flex items-center gap-2 sm:gap-4 ${fullWidth ? 'mr-32' : ''}`}>
              {/* MOBILE ACTIONS */}
              <div className={`md:hidden flex items-center gap-3 transition-all duration-300 self-end mb-1.5 ${isSearchMode || isScrolled ? 'opacity-0 pointer-events-none scale-95 max-w-0 overflow-hidden' : 'opacity-100 scale-100 max-w-[100px]'}`}>
                {user && (
                  <>
                    <NotificationBell
                      user={user}
                      onClick={() => setIsNotificationsOpen(true)}
                    />

                  </>
                )}
              </div>

              {/* DESKTOP ACTIONS HUB */}
              <div className="hidden md:flex items-center gap-4">
                {!user ? (
                  <>
                    {/* STATE 1: TOP OF PAGE -> TEXT BUTTONS */}
                    <div className={`flex items-center gap-4 transition-all duration-300 origin-right ${isScrolled || isSearchMode ? 'opacity-0 scale-95 w-0 overflow-hidden pointer-events-none absolute right-0' : 'opacity-100 scale-100 w-auto relative'}`}>
                      <button 
                        onClick={onBecomeHostClick} 
                        className="text-[15px] font-bold text-primary hover:text-primaryDark transition-colors whitespace-nowrap"
                      >
                        Anuncie seu carro
                      </button>
                      
                      <div className="w-[1px] h-4 bg-slate-300/60 mx-1"></div>
                      
                      <button 
                        onClick={onHelpCenterClick} 
                        className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-300 hover:text-slate-700 transition-colors"
                      >
                        <i className="fas fa-question text-[13px]"></i>
                      </button>
                      
                      <div className="w-[1px] h-4 bg-slate-300/60 mx-1"></div>

                      <button 
                        onClick={onLoginClick} 
                        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap px-2"
                      >
                        <i className="fas fa-sign-in-alt text-[15px]"></i>
                        <span className="text-[15px] font-bold">Entrar</span>
                      </button>

                      <button 
                        onClick={onSignupClick} 
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full hover:bg-primaryDark transition-all hover:shadow-md ml-1 whitespace-nowrap"
                      >
                        <i className="fas fa-user text-[13px]"></i>
                        <span className="text-[15px] font-bold">Cadastre-se</span>
                      </button>
                    </div>

                    {/* STATE 2: SCROLLED OR SEARCH -> HAMBURGER MENU */}
                    <div className={`flex items-center relative transition-all duration-300 origin-right ${!(isScrolled || isSearchMode) ? 'opacity-0 scale-95 w-0 overflow-hidden pointer-events-none absolute right-0' : 'opacity-100 scale-100 w-auto relative'}`}>
                      <button
                        ref={buttonRef}
                        onClick={toggleMenu}
                        className={`flex items-center gap-4 p-1.5 pl-4 pr-1.5 rounded-full border transition-all duration-700 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] active:scale-95 ${isMenuOpen
                          ? 'bg-slate-50 border-[#3667AA]/30 ring-4 ring-[#3667AA]/5'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        {/* Left: Hamburger Bars */}
                        <div className="flex flex-col gap-1 w-4 group">
                          <div className={`h-[2px] bg-slate-700 rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'w-4 rotate-45 translate-y-[3px]' : 'w-4'}`}></div>
                          <div className={`h-[2px] bg-slate-700 rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'opacity-0 scale-0' : 'w-2'}`}></div>
                          <div className={`h-[2px] bg-slate-700 rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'w-4 -rotate-45 -translate-y-[2px]' : 'w-3'}`}></div>
                        </div>

                        {/* Right: Generic User Indicator */}
                        <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 relative shadow-inner group-hover:scale-105 transition-transform duration-500">
                           <i className="fas fa-user text-slate-400 text-[12px]"></i>
                        </div>
                      </button>

                      <div ref={menuRef} className="hidden md:block absolute right-0 top-full mt-2">
                        <DesktopMenu
                          isOpen={isMenuOpen}
                          onClose={() => setIsMenuOpen(false)}
                          user={user}
                          onBecomeHostClick={onBecomeHostClick}
                          onLoginClick={onLoginClick}
                          onSignupClick={onSignupClick}
                          onHelpCenterClick={onHelpCenterClick}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Desktop Notification Bell (Left of Menu) */}
                    <NotificationBell
                      user={user}
                      onClick={() => setIsNotificationsOpen(true)}
                    />

                    <div className="flex items-center relative">
                      <button
                        ref={buttonRef}
                        onClick={toggleMenu}
                        className={`flex items-center gap-4 p-1.5 pl-4 pr-1.5 rounded-full border transition-all duration-700 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] active:scale-95 ${isMenuOpen
                          ? 'bg-slate-50 border-[#3667AA]/30 ring-4 ring-[#3667AA]/5'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        {/* Left: Hamburger Bars with elite micro-animation */}
                        <div className="flex flex-col gap-1 w-4 group">
                          <div className={`h-[2px] bg-slate-700 rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'w-4 rotate-45 translate-y-[3px]' : 'w-4'}`}></div>
                          <div className={`h-[2px] bg-slate-700 rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'opacity-0 scale-0' : 'w-2'}`}></div>
                          <div className={`h-[2px] bg-slate-700 rounded-full transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isMenuOpen ? 'w-4 -rotate-45 -translate-y-[2px]' : 'w-3'}`}></div>
                        </div>

                        {/* Right: User Indicator */}
                        <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center overflow-hidden border border-slate-100 relative shadow-inner group-hover:scale-105 transition-transform duration-500">
                          {userAvatar ? (
                            <img src={userAvatar} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <i className="fas fa-user text-slate-400 text-[10px]"></i>
                          )}

                          {user && (
                            <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full shadow-sm"></span>
                          )}
                        </div>
                      </button>

                      <div ref={menuRef} className="hidden md:block absolute right-[-105px] top-full mt-2">
                        <DesktopMenu
                          isOpen={isMenuOpen}
                          onClose={() => setIsMenuOpen(false)}
                          user={user}
                          onBecomeHostClick={onBecomeHostClick}
                          onLoginClick={onLoginClick}
                          onSignupClick={onSignupClick}
                          onEditProfileClick={onEditProfileClick}
                          onDashboardClick={onDashboardClick}
                          onFavoritesClick={onFavoritesClick}
                          onChatClick={onChatClick}
                          onFinancialClick={onFinancialClick}
                          onOwnerCenterClick={onOwnerCenterClick}
                          onVerificationClick={onVerificationClick}
                          onSettingsClick={onSettingsClick}
                          onLogout={onLogout}
                          onHelpCenterClick={onHelpCenterClick}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - Full Screen (md and below) */}


        {/* Desktop Menu - Relative to trigger area (md and above) */}

      </nav>

      {/* Shared Notifications View (Mobile & Desktop) */}
      {user && (
        <NotificationsView
          isOpen={isNotificationsOpen}
          onClose={() => setIsNotificationsOpen(false)}
          onNotificationClick={(n) => {
            setIsNotificationsOpen(false);
            onNotificationClick && onNotificationClick(n);
          }}
        />
      )}
    </>
  );
};

export default Header;