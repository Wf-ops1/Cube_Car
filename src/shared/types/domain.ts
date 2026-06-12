import { UserVerification } from '@/core/domain/verification/verification.types';

export interface User {
    id: string;
    email: string;
    name: string;
    phone?: string;
    photoUrl?: string;
    avatar?: string; // Legacy alias for photoUrl
    role: 'traveler' | 'host' | 'moderator';
    isVerified?: boolean;
    isSuperhost?: boolean;
    // Profile Fields
    bio?: string;
    city?: string;
    verification?: UserVerification; // DDD Module Reference
    readReceiptsEnabled?: boolean;
    interests?: string[];
    funFact?: string;
    verificationStatus?: string;
    phoneNumber?: string;
    memberSince?: string;
    job?: string;
    languages?: string[];
}

import { Car } from '@/core/data/car/car.types';
export type { Car };

export interface Booking {
    id: string;
    carId: string;
    car: Car;
    renterId: string;
    renter: User;
    startDate: string;
    endDate: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
    totalPrice: number;
    createdAt: string;
}

export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    text: string;
    timestamp: string;
}

export interface Conversation {
    id: string;
    carId: string;
    car: Car;
    hostId: string;
    travelerId: string;
    lastMessage?: Message;
    unreadCount: number;
}
