import { useState } from 'react';
import { User } from '@/core/data/auth/auth.types';

export type SettingsView = 'main' | 'notifications';
export type EditField = 'phone' | 'password' | null;

export const useAccountSettingsLogic = (user: User, onBack: () => void) => {
    // UI View State
    const [activeView, setActiveView] = useState<SettingsView>('main');
    const [editingField, setEditingField] = useState<EditField>(null);

    // Mock settings state
    const [notifications, setNotifications] = useState({
        promotions: true,
        trips: true,
        messages: true
    });

    // Form states
    const [phoneForm, setPhoneForm] = useState(user.phoneNumber || '+55 11 99999-9999');
    const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleBack = () => {
        // On mobile, if in sub-view, go back to main
        if (activeView !== 'main' && window.innerWidth < 768) {
            setActiveView('main');
        } else {
            onBack();
        }
    };

    const handleEditClick = (field: EditField) => {
        if (editingField === field) {
            setEditingField(null); // Toggle off if already open
        } else {
            setEditingField(field);
        }
    };

    return {
        activeView,
        setActiveView,
        editingField,
        setEditingField,
        notifications,
        toggleNotification,
        phoneForm,
        setPhoneForm,
        passwordForm,
        setPasswordForm,
        handleBack,
        handleEditClick
    };
};
