import { describe, it, expect, vi, beforeEach } from 'vitest';
vi.mock('zustand/middleware', () => ({ persist: (c: any) => c, devtools: (c: any) => c }));
import { messagingFacade } from './MessagingFacade';
import { messagingGateway } from '@/core/data/gateways/messaging.gateway';
import { useChatStore } from '../stores/chat.store';

vi.mock('@/core/data/gateways/messaging.gateway', () => ({
    messagingGateway: {
        createConversation: vi.fn(),
        sendMessage: vi.fn()
    }
}));

describe('MessagingFacade', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useChatStore.setState({ conversations: [], activeConversationId: null });
    });

    it('should throw Zod error for invalid contactHost payload', async () => {
        await expect(messagingFacade.contactHost({
            carId: '', // invalid
            hostId: 'h1',
            userId: 'u1',
            message: 'Hello'
        })).rejects.toThrow();
    });

    it('should create conversation and send message when payload is valid', async () => {
        const mockConv = { id: 'conv1', carId: 'c1', hostId: 'h1', userId: 'u1', messages: [] };
        (messagingGateway.createConversation as any).mockResolvedValue(mockConv);
        (messagingGateway.sendMessage as any).mockResolvedValue({
            id: 'm1', text: 'Hello', timestamp: '10:00'
        });

        const conv = await messagingFacade.contactHost({
            carId: 'c1',
            hostId: 'h1',
            userId: 'u1',
            message: 'Hello'
        });

        expect(conv.id).toBe('conv1');
        expect(messagingGateway.createConversation).toHaveBeenCalledWith('c1', 'u1', 'h1');
        expect(messagingGateway.sendMessage).toHaveBeenCalledWith('conv1', 'u1', 'Hello');
        
        const state = useChatStore.getState();
        expect(state.conversations).toHaveLength(1);
    });

    it('should throw Zod error for invalid notifyBookingEvent payload', async () => {
        await expect(messagingFacade.notifyBookingEvent({
            carId: 'c1',
            hostId: 'h1',
            renterId: 'u1',
            bookingId: 'b1',
            message: 'Pending',
            bookingDetails: {
                startDate: '2023-10-01',
                endDate: '2023-10-05',
                price: -100 // invalid
            }
        })).rejects.toThrow();
    });

    it('should successfully notify booking event', async () => {
        const mockConv = { id: 'conv1', carId: 'c1', hostId: 'h1', userId: 'u1', messages: [] };
        (messagingGateway.createConversation as any).mockResolvedValue(mockConv);

        const conv = await messagingFacade.notifyBookingEvent({
            carId: 'c1',
            hostId: 'h1',
            renterId: 'u1',
            bookingId: 'b1',
            message: 'New Booking',
            bookingDetails: {
                startDate: '2023-10-01',
                endDate: '2023-10-05',
                price: 100
            }
        });

        expect(conv.id).toBe('conv1');
        
        const state = useChatStore.getState();
        const storedConv = state.conversations[0];
        expect(storedConv.carRelated?.bookingDetails?.price).toBe(100);
        expect(storedConv.lastMessage).toBe('New Booking');
    });
});
