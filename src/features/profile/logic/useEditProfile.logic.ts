import React, { useState, useEffect } from 'react';
import { User } from '@/shared/types';
import { useAuthActions } from '@/core/auth/auth.store';

export const INTERESTS_CATEGORIES = {
    "Esportes e Aventura": [
        "Futebol ⚽", "Beach Tennis 🎾", "Corrida de Rua 🏃", "CrossFit", "Yoga & Meditação 🧘",
        "Trilhas & Natureza 🌿", "Surf 🏄", "Skate", "Ciclismo 🚴", "Motos"
    ],
    "Cultura e Entretenimento": [
        "Viagens", "Música ao Vivo", "Cinema & Séries", "Leitura 📚", "Podcasts 🎙️",
        "Games 🎮", "Arte & Museus 🎨", "Teatro", "Fotografia 📸", "Astrologia ✨"
    ],
    "Estilo de Vida e Gastronomia": [
        "Gastronomia", "Cafés Especiais ☕", "Vinho 🍷", "Cerveja Artesanal 🍺", "Churrasco",
        "Drinks 🍸", "Culinária (Cozinhar)", "Moda & Estilo", "Decoração (DIY)", "Pets 🐾"
    ],
    "Negócios e Sociedade": [
        "Tecnologia", "Empreendedorismo", "Investimentos", "Sustentabilidade ♻️", "Voluntariado",
        "Carros", "Dança", "Jardinagem 🌵"
    ]
};

interface UseEditProfileProps {
    user: User;
    onSave: (updatedUser: Partial<User>) => void;
    onBack: () => void;
}

export const useEditProfile = ({ user, onSave, onBack }: UseEditProfileProps) => {
    // Determine if profile is "empty"
    const isProfileEmpty = !user.bio && !user.city && (!user.interests || user.interests.length === 0);

    // UI State
    const [isEditing, setIsEditing] = useState(false);
    const [isInterestsSheetOpen, setIsInterestsSheetOpen] = useState(false);
    const [cropImage, setCropImage] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form Data State
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || '');
    const [city, setCity] = useState(user.city || '');
    const [job, setJob] = useState(user.job || '');
    const [languages, setLanguages] = useState(user.languages || '');
    const [avatar, setAvatar] = useState(user.avatar || '');
    const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(user.readReceiptsEnabled ?? true);
    const [selectedInterests, setSelectedInterests] = useState<string[]>(user.interests || []);

    const { setAuth } = useAuthActions();

    // Sync from props
    useEffect(() => {
        setName(user.name);
        setBio(user.bio || '');
        setCity(user.city || '');
        setAvatar(user.avatar || '');
        setReadReceiptsEnabled(user.readReceiptsEnabled ?? true);
        setSelectedInterests(user.interests || []);
    }, [user]);

    // Handlers
    const toggleInterest = (interest: string) => {
        if (selectedInterests.includes(interest)) {
            setSelectedInterests(selectedInterests.filter(i => i !== interest));
        } else {
            setSelectedInterests([...selectedInterests, interest]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCropImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
        e.target.value = '';
    };

    const handleCropComplete = (croppedUrl: string) => {
        setAvatar(croppedUrl);
        setCropImage(null);
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        const updatedUser = {
            // ...user, // Spread handled by store/parent usually, but we return the delta here
            ...user,
            name,
            bio,
            city,
            job,
            languages,
            avatar,
            readReceiptsEnabled,
            interests: selectedInterests
        };

        setAuth(updatedUser);
        onSave(updatedUser);
        setIsSaving(false);
        onBack();
    };

    const calculateProfileStrength = () => {
        const filledFields = Object.values({ bio, city, job, languages }).filter(Boolean).length;
        const hasInterests = selectedInterests.length > 0 ? 1 : 0;
        return Math.min(5, filledFields + hasInterests);
    };

    return {
        // State
        isProfileEmpty,
        isEditing, setIsEditing,
        isInterestsSheetOpen, setIsInterestsSheetOpen,
        cropImage, setCropImage,
        isSaving,

        // Form Fields
        formData: { name, bio, city, job, languages, avatar, selectedInterests },
        setters: { setName, setBio, setCity, setJob, setLanguages, setAvatar, setSelectedInterests },

        // Actions
        toggleInterest,
        handleFileChange,
        handleCropComplete,
        handleSaveProfile,
        calculateProfileStrength
    };
};
