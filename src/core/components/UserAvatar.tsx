import React, { useState } from 'react';

interface UserAvatarProps {
    src?: string | null;
    name: string;
    className?: string; // Expects w-*, h-*, rounded-* classes
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({ src, name, className = "w-10 h-10 rounded-full", onClick, style }) => {
    const [imgError, setImgError] = useState(false);

    // Extract first letter of first name
    const initial = name ? name.trim().split(' ')[0][0].toUpperCase() : '?';

    if (src && !imgError) {
        return (
            <img
                src={src}
                alt={name}
                className={`${className} object-cover`}
                onError={() => setImgError(true)}
                onClick={onClick}
                style={style}
            />
        );
    }

    return (
        <div
            className={`${className} bg-[#3667AA] flex items-center justify-center text-white font-display font-medium shadow-sm select-none`}
            onClick={onClick}
        >
            <span className="text-[1.2em]">{initial}</span>
        </div>
    );
};
