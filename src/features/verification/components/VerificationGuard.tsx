import React from 'react';
import { User } from '@/core/data/auth/auth.types';
import { VerificationBlock } from './VerificationBlock';
import { VerificationMissing } from '@/core/data/verification/verification.types';

interface VerificationGuardProps {
    user: User;
    children: React.ReactNode;
    fallback?: React.ReactNode; // Optional custom fallback
    onSolveAction?: (missingType: VerificationMissing) => void;
}

/**
 * Pure Access Control Component
 * If user is verified -> Renders children
 * If user is pending/none -> Renders VerificationBlock (or custom fallback)
 */
export const VerificationGuard: React.FC<VerificationGuardProps> = ({
    user,
    children,
    fallback,
    onSolveAction
}) => {
    // 🧠 LOGIC: Check DDD Status directly
    const isVerified = user?.verification?.status === 'APPROVED';

    if (isVerified) {
        return <>{children}</>;
    }

    // Access Denied: Show Block
    if (fallback) return <>{fallback}</>;

    return (
        <VerificationBlock
            missing={['cnh', 'selfie']} // Default missing for now, or derive from docs
            onAction={onSolveAction}
        />
    );
};
