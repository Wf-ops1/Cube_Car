import { Booking } from '@/shared/types';

export interface BookingGatewayContract {
    create(booking: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking>;
    getById(id: string): Promise<Booking | null>;
    getByRenter(renterId: string): Promise<Booking[]>;
    getByOwner(hostId: string): Promise<Booking[]>;
    updateStatus(id: string, status: Booking['status']): Promise<Booking>;
    cancel(id: string): Promise<void>;
}

class MockBookingGateway implements BookingGatewayContract {
    private bookings: Booking[] = [
        {
            id: 'conv-1',
            carId: '3',
            car: { id: '3', ownerId: 'user-1', make: 'BMW', model: 'M3 Competition', imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=800' } as any,
            renterId: 'renter-1',
            renter: { id: 'renter-1', name: 'João Locatário', avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', rating: 5.0, trips: 4 } as any,
            startDate: '2026-12-10',
            endDate: '2026-12-13',
            status: 'PENDING',
            totalPrice: 3600,
            createdAt: new Date(Date.now() - 30 * 60000).toISOString()
        },
        {
            id: 'req-2',
            carId: 'porsche-macan',
            car: { id: 'porsche-macan', ownerId: 'user-1', make: 'Porsche', model: 'Macan', imageUrl: 'https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=1000&auto=format&fit=crop' } as any,
            renterId: 'renter-2',
            renter: { id: 'renter-2', name: 'Ana Souza', avatar: 'https://i.pravatar.cc/150?u=ana', rating: 5.0, trips: 3 } as any,
            startDate: '2026-10-20',
            endDate: '2026-10-22',
            status: 'PENDING',
            totalPrice: 900,
            createdAt: new Date(Date.now() - 120 * 60000).toISOString()
        }
    ];

    async create(data: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> {
        const booking: Booking = {
            ...data,
            id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        this.bookings.push(booking);
        return booking;
    }

    async getById(id: string): Promise<Booking | null> {
        return this.bookings.find(b => b.id === id) || null;
    }

    async getByRenter(renterId: string): Promise<Booking[]> {
        return this.bookings.filter(b => b.renterId === renterId);
    }

    async getByOwner(hostId: string): Promise<Booking[]> {
        return this.bookings.filter(b => b.car.ownerId === hostId);
    }

    async updateStatus(id: string, status: Booking['status']): Promise<Booking> {
        const booking = this.bookings.find(b => b.id === id);
        if (!booking) throw new Error('Booking not found');

        booking.status = status;
        return booking;
    }

    async cancel(id: string): Promise<void> {
        const index = this.bookings.findIndex(b => b.id === id);
        if (index === -1) throw new Error('Booking not found');

        this.bookings[index].status = 'CANCELLED';
    }
}

export const bookingGateway = new MockBookingGateway();
