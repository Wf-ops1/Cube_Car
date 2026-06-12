import { Conversation } from './messaging.types';

export const mockConversations: Conversation[] = [
    // CENÁRIO 1: SOLICITAÇÃO PENDENTE (Card Amarelo) - Visão do Host
    {
        id: 'conv-1',
        participantId: 'user-123',
        otherUser: {
            id: 'user-123',
            name: 'João Locatário',
            avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            isOnline: true,
            lastSeen: 'Agora'
        },
        carRelated: {
            id: '3',
            make: 'BMW',
            model: 'M3 Competition',
            imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800',
            hostId: 'user-1', // This makes the current user the host of this car
            renterId: 'user-123',
            bookingStatus: 'pending',
            bookingDetails: {
                startDate: '10 Dez',
                endDate: '13 Dez',
                startTime: '10:00',
                endTime: '18:00',
                price: 3600
            }
        },
        lastMessage: 'Aguardando aprovação da reserva...',
        lastMessageTime: '14:25',
        unreadCount: 1,
        messages: [
            {
                id: 'msg-1',
                senderId: 'user-123',
                text: 'Olá, fiz a solicitação de reserva para o fim de semana.',
                timestamp: '14:20',
                status: 'read',
                isRead: true
            },
            {
                id: 'msg-2',
                senderId: 'user-1', // Simulando a resposta do host
                text: 'Recebi aqui! Vou verificar a disponibilidade e te aviso.',
                timestamp: '14:25',
                status: 'delivered',
                isRead: false
            }
        ]
    },
    // CENÁRIO 2: RESERVA CONFIRMADA (Card Verde)
    {
        id: 'conv-2',
        participantId: 'host-2',
        otherUser: {
            id: 'host-2',
            name: 'Fernanda Lima',
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            isOnline: false,
            lastSeen: 'Visto às 10:30'
        },
        carRelated: {
            id: '3', // Make sure this correlates to some car or is handled gracefully
            make: 'Mercedes',
            model: 'C180',
            imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
            hostId: 'host-2', // The other user is the host here (current user is renter)
            renterId: 'user-1',
            bookingStatus: 'confirmed',
            bookingDetails: {
                startDate: '15 Jan',
                endDate: '20 Jan',
                startTime: '09:00',
                endTime: '12:00',
                price: 2500
            }
        },
        lastMessage: 'Reserva confirmada! P pode retirar o carro.',
        lastMessageTime: 'Ontem',
        unreadCount: 0,
        messages: [
            {
                id: 'msg-3',
                senderId: 'host-2',
                text: 'Pagamento recebido! Sua reserva está confirmada.',
                timestamp: '10:30',
                status: 'read',
                isRead: true
            }
        ]
    },
    // CENÁRIO 3: CHAT NORMAL (Sem Card Especial)
    {
        id: 'conv-3',
        participantId: 'host-3',
        otherUser: {
            id: 'host-3',
            name: 'Carlos Santos',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
            isOnline: true,
            lastSeen: 'Online'
        },
        carRelated: {
            id: '5',
            make: 'Mercedes-Benz',
            model: 'C 300',
            imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800',
            // bookingStatus undefined = Chat Normal
        },
        lastMessage: 'O carro tem seguro total?',
        lastMessageTime: '09:15',
        unreadCount: 2,
        messages: [
            {
                id: 'msg-4',
                senderId: 'user-123',
                text: 'Olá, o carro tem seguro total?',
                timestamp: '09:15',
                status: 'sent',
                isRead: true
            }
        ]
    }
];
