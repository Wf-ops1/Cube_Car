export interface Message {
    id: string;
    senderId: string;
    text: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
    isRead: boolean;
    type?: 'text' | 'image';
    metadata?: {
        src?: string;
    };
}

export interface Conversation {
    id: string;
    participantId: string;
    otherUser?: {
        id: string;
        name: string;
        avatar: string;
        isOnline?: boolean;
        lastSeen?: string;
    };
    carRelated?: {
        id: string;
        make: string;
        model: string;
        imageUrl: string;
        hostId?: string;
        renterId?: string;
        bookingId?: string;
        bookingStatus?: 'inquiry' | 'pending' | 'confirmed' | 'completed';
        bookingDetails?: {
            startDate: string;
            endDate: string;
            startTime?: string;
            endTime?: string;
            price: number;
        };
    };
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
    messages: Message[];
}
