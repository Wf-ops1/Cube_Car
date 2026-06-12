import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '@/core/data/auth/auth.types';
import ImageCropper from '@/core/components/ImageCropper';
import { useEditProfile } from '../logic/useEditProfile.logic';
import { BackButton } from '@/core/components/buttons/BackButton';
import { AmbientBackground } from '@/shared/components/layout/AmbientBackground';

// Extracted Components
import { ProfileEmptyState } from '../components/ProfileEmptyState';
import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileAboutSection } from '../components/ProfileAboutSection';
import { EditProfileForm } from '../components/EditProfileForm';
import { InterestsSheet } from '../components/InterestsSheet';

interface EditProfileProps {
    user: User;
    onSave: (updatedUser: Partial<User>) => void;
    onBack: () => void;
}

const EditProfile: React.FC<EditProfileProps> = (props) => {
    const { user, onBack } = props;

    // Logic Hook
    const logic = useEditProfile(props);
    const {
        isProfileEmpty,
        isEditing, setIsEditing,
        isInterestsSheetOpen, setIsInterestsSheetOpen,
        cropImage, setCropImage,
        isSaving,
        formData, setters,
        toggleInterest,
        handleFileChange,
        handleCropComplete,
        handleSaveProfile,
        calculateProfileStrength
    } = logic;

    return (
        <>
            {/* Cropper Overlay */}
            {cropImage && (
                <ImageCropper
                    imageSrc={cropImage}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setCropImage(null)}
                />
            )}

            <div className="min-h-screen bg-transparent relative z-50 overflow-hidden flex flex-col font-sans">

                {/* Main scrollable content region */}
                <AnimatePresence mode="wait">
                    {/* --- EMPTY STATE (PREVIEW MODE) --- */}
                    {!isEditing ? (
                        <motion.div
                            key="empty-state"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col h-full relative z-20"
                        >
                            <div className="flex-1 overflow-y-auto w-full relative z-10">
                                <div className="max-w-7xl mx-auto w-full px-4 md:px-8 pt-8 lg:pt-16 pb-24 flex flex-col min-h-full">

                                    {/* Header Actions (Floating) - Standardized */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="relative z-50">
                                            <BackButton
                                                onClick={onBack}
                                            />
                                        </div>
                                        {!isProfileEmpty && (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-5 py-2.5 bg-white text-[#1C2230] rounded-full text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm border border-gray-100 flex items-center gap-2"
                                            >
                                                <span>Editar</span>
                                                <i className="fas fa-pen text-[10px]"></i>
                                            </button>
                                        )}
                                    </div>

                                    {isProfileEmpty ? (
                                        <ProfileEmptyState
                                            avatar={formData.avatar}
                                            name={formData.name}
                                            onStartEditing={() => setIsEditing(true)}
                                        />
                                    ) : (
                                        /* --- STATE 2: THE EDITORIAL HERO (Open Profile) --- */
                                        <div className="w-full max-w-7xl mx-auto">
                                            <div className="grid grid-cols-1 md:grid-cols-[340px_1fr] gap-8 items-start">

                                                {/* --- COL 1: IDENTITY (Sticky on Desktop) --- */}
                                                <ProfileHeader
                                                    user={user}
                                                    name={formData.name}
                                                    avatar={formData.avatar}
                                                    profileStrength={calculateProfileStrength()}
                                                />

                                                {/* --- COL 2: DETAILS (Main Content) --- */}
                                                <ProfileAboutSection
                                                    bio={formData.bio}
                                                    job={formData.job}
                                                    city={formData.city}
                                                    languages={formData.languages}
                                                    selectedInterests={formData.selectedInterests}
                                                    onEdit={() => setIsEditing(true)}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* --- EDIT FORM --- */
                        <EditProfileForm
                            formData={formData}
                            setters={setters}
                            isProfileEmpty={isProfileEmpty}
                            onBack={onBack}
                            onCancelEditing={() => setIsEditing(false)}
                            onSave={handleSaveProfile}
                            isSaving={isSaving}
                            onFileChange={handleFileChange}
                            onOpenInterests={() => setIsInterestsSheetOpen(true)}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* --- INTERESTS SHEET --- */}
            <InterestsSheet
                isOpen={isInterestsSheetOpen}
                onClose={() => setIsInterestsSheetOpen(false)}
                selectedInterests={formData.selectedInterests}
                onToggleInterest={toggleInterest}
            />
        </>
    );
};

export default EditProfile;
