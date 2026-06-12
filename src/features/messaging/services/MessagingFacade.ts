import { messagingGateway } from '@/core/data/gateways/messaging.gateway';
import { useChatStore } from '../stores/chat.store';
import { Conversation } from '@/core/data/messaging/messaging.types';
import { z } from 'zod';

export const contactHostSchema = z.object({
    carId: z.string().min(1),
    hostId: z.string().min(1),
    userId: z.string().min(1),
    message: z.string().min(1).max(2000)
});

export const notifyBookingSchema = z.object({
    carId: z.string().min(1),
    hostId: z.string().min(1),
    renterId: z.string().min(1),
    bookingId: z.string().min(1),
    message: z.string().min(1),
    bookingDetails: z.object({
        startDate: z.string(),
        endDate: z.string(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        price: z.number().positive()
    })
});

/**
 * MessagingFacade
 * Centralized service for all messaging operations.
 * Single source of truth for chat logic - no duplicated code.
 */
export class MessagingFacade {

    /**
     * Find or Create Conversation
     * Gets existing conversation or creates a new one without sending a message.
     * Used by: "Open Chat" buttons
     */
    async findOrCreateConversation(
        carId: string,
        userId: string,
        hostId: string
    ): Promise<Conversation> {
        const chatStore = useChatStore.getState();

        let conversation = chatStore.findConversation(carId, hostId);

        if (!conversation) {
            conversation = await messagingGateway.createConversation(
                carId,
                userId,
                hostId
            );
            chatStore.addConversation(conversation);
        }

        return conversation;
    }

    /**
     * Contact Host - Initiates or continues conversation with car owner
     * Used by: CarDetails "Contact Host" button
     */
    async contactHost(params: {
        carId: string;
        hostId: string;
        userId: string;
        message: string;
    }): Promise<Conversation> {
        const validated = contactHostSchema.parse(params);
        const chatStore = useChatStore.getState();

        // 1. Find or create conversation
        let conversation = chatStore.findConversation(params.carId, params.hostId);

        if (!conversation) {
            conversation = await messagingGateway.createConversation(
                params.carId,
                params.userId,
                params.hostId
            );
            chatStore.addConversation(conversation);
        }

        // 2. Send user message
        const message = await messagingGateway.sendMessage(
            conversation.id,
            validated.userId,
            validated.message
        );

        // 3. Update conversation with new message
        chatStore.updateConversation(conversation.id, {
            lastMessage: message.text,
            lastMessageTime: message.timestamp,
            messages: [...(conversation.messages || []), message]
        });

        return conversation;
    }

    /**
     * Notify Booking Event - Sends system notification about booking
     * Used by: BookingService after booking creation
     */
    async notifyBookingEvent(params: {
        carId: string;
        hostId: string;
        renterId: string;
        bookingId: string;
        message: string;
        bookingDetails: {
            startDate: string;
            endDate: string;
            startTime?: string;
            endTime?: string;
            price: number;
        }
    }): Promise<Conversation> {
        const validated = notifyBookingSchema.parse(params);
        const chatStore = useChatStore.getState();

        // 1. Find or create conversation
        let conversation = chatStore.findConversation(params.carId, params.hostId);

        if (!conversation) {
            // Create new conversation using Gateway to ensure consistent structure
            conversation = await messagingGateway.createConversation(
                validated.carId,
                validated.renterId, // User is renter
                validated.hostId
            );
            chatStore.addConversation(conversation);
        }

        // 2. Add system notification message
        const systemMessage = {
            id: `msg-${Date.now()}`,
            senderId: 'system',
            text: validated.message,
            timestamp: new Date().toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit'
            }),
            status: 'sent' as const,
            isRead: false
        };

        // 3. Update conversation with booking status, details and message
        chatStore.updateConversation(conversation.id, {
            lastMessage: systemMessage.text,
            lastMessageTime: systemMessage.timestamp,
            messages: [...(conversation.messages || []), systemMessage],
            carRelated: {
                ...conversation.carRelated!,
                bookingStatus: 'pending',
                bookingDetails: validated.bookingDetails
            }
        });

        return conversation;
    }
}

// Singleton instance
export const messagingFacade = new MessagingFacade();
