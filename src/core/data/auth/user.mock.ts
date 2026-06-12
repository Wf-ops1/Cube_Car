import { User } from './auth.types';

export const mockUser: User = {
    id: 'user-1',
    name: 'Roberto Silva',
    email: 'roberto@example.com',
    avatar: 'https://i.pravatar.cc/150?u=roberto',
    role: 'traveler',
    isVerified: false,
    bio: 'Apaixonado por viagens e novas experiências. Sempre em busca do próximo destino incrível!',
    verification: {
        id: 'ver-1',
        userId: 'user-1',
        status: 'NOT_STARTED',
        documents: [
            { type: 'CNH', status: 'MISSING' },
            { type: 'SELFIE', status: 'MISSING' }
        ]
    }
};

export const mockHost: User = {
    id: 'host-1',
    name: 'Carla Mendez',
    email: 'carla@example.com',
    avatar: 'https://i.pravatar.cc/150?u=carla',
    role: 'host',
    isVerified: true,
    bio: 'Motorista entusiasta e Host dedicada. Adoro compartilhar meu carro e garantir a melhor experiência possível. Conte comigo para dicas locais!',
    verification: {
        id: 'ver-2',
        userId: 'host-1',
        status: 'NOT_STARTED',
        documents: []
    }
};
