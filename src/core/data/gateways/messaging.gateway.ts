import { Conversation, Message } from '../messaging/messaging.types';
import { carsGateway } from './cars.gateway';

export interface MessagingGatewayContract {
    sendMessage(conversationId: string, senderId: string, text: string): Promise<Message>;
    createConversation(carId: string, travelerId: string, hostId: string): Promise<Conversation>;
}

class MockMessagingGateway implements MessagingGatewayContract {
    async sendMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        const message: Message = {
            id: `msg-${Date.now()}`,
            senderId,
            text,
            timestamp: `${hours}:${minutes}`,
            status: 'sent',
            isRead: false
        };

        return message;
    }

    async createConversation(carId: string, travelerId: string, hostId: string): Promise<Conversation> {
        const car = await carsGateway.getById(carId);
        if (!car) throw new Error('Car not found');

        const conversation: Conversation = {
            id: `conv-${Date.now()}`,
            participantId: hostId,
            otherUser: {
                id: hostId,
                name: car.ownerDetails?.name || 'Anfitrião',
                avatar: car.ownerDetails?.avatar || `https://i.pravatar.cc/150?u=${hostId}`,
                isOnline: false,
                lastSeen: 'Agora'
            },
            carRelated: {
                id: car.id,
                make: car.make,
                model: car.model,
                imageUrl: car.imageUrl,
                hostId,
                renterId: travelerId
            },
            lastMessage: '',
            lastMessageTime: '',
            unreadCount: 0,
            messages: []
        };

        return conversation;
    }
}

export const messagingGateway = new MockMessagingGateway();
