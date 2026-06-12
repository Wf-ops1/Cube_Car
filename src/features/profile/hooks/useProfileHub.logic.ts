import { useState } from 'react';
import { User } from '@/core/data/auth/auth.types';
import { getProfileMenuSections } from '../logic/profileMenu.logic';

export type ProfileView = 'main' | 'profile-edit' | 'settings' | 'verification';

export const useProfileHubLogic = (user: User, onNavigate: (page: string) => void, onLogout: () => void) => {
    const [currentView, setCurrentView] = useState<ProfileView>('main');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Helper for membership date (mocked for now)
    const memberSince = user.memberSince || "2024";

    // Dynamic Status Logic
    const getVerificationBadge = () => {
        switch (user.verificationStatus) {
            case 'verified': return { text: 'Verificado', color: 'bg-emerald-100 text-emerald-600' };
            case 'pending': return { text: 'Em Análise', color: 'bg-amber-100 text-amber-600' };
            case 'rejected': return { text: 'Ação Necessária', color: 'bg-rose-100 text-rose-600' };
            default: return { text: 'Não Verificado', color: 'bg-slate-100 text-slate-500' };
        }
    };

    const verifStatus = getVerificationBadge();

    // Use shared logic for menu sections to ensure consistency across Mobile/Desktop/ProfileHub
    const sections = getProfileMenuSections(user);

    const handleNavigate = (id: string) => {
        // Micro-interaction: Tactile feedback (Benchmark recommendation)
        if (navigator.vibrate) navigator.vibrate(10);

        if (id === 'logout') {
            setShowLogoutConfirm(true);
            return;
        }

        // Special mapping if needed, otherwise pass ID
        if (id === 'wallet') onNavigate('financial');
        else if (id === 'trips') onNavigate('trips'); // Assuming a trips route exists or will exist
        else if (id === 'help') onNavigate('help');
        else onNavigate(id);
    };

    const handleLogoutConfirm = () => {
        onLogout();
    };

    return {
        currentView,
        setCurrentView,
        showLogoutConfirm,
        setShowLogoutConfirm,
        memberSince,
        verifStatus,
        sections,
        handleNavigate,
        handleLogoutConfirm
    };
};
