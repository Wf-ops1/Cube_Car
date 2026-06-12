import { Car } from '@/shared/types';
import { initialCars } from '../car/car.mock';

export interface CarsGatewayContract {
    // Catalog operations
    getAll(): Promise<Car[]>;
    getById(id: string): Promise<Car | null>;
    search(query: string, category?: string): Promise<Car[]>;

    // Host fleet operations
    getOwnerFleet(hostId: string): Promise<Car[]>;
    create(car: Omit<Car, 'id'>): Promise<Car>;
    updateCar(id: string, data: Partial<Car>): Promise<Car>;
    deleteCar(id: string): Promise<void>;
    updateStatus(id: string, status: 'approved' | 'rejected' | 'pending', reason?: string): Promise<void>;
    lockCar(id: string, userId: string, durationMinutes: number): Promise<void>;
    checkAvailability(carId: string, startDate: Date, endDate: Date): Promise<boolean>;
}

class MockCarsGateway implements CarsGatewayContract {
    private cars: Car[] = [...initialCars];

    async getAll(): Promise<Car[]> {
        return this.cars;
    }

    async getById(id: string): Promise<Car | null> {
        return this.cars.find(c => c.id === id) || null;
    }

    async search(query: string, category?: string): Promise<Car[]> {
        return this.cars.filter(car => {
            const matchesQuery = !query ||
                car.make.toLowerCase().includes(query.toLowerCase()) ||
                car.model.toLowerCase().includes(query.toLowerCase());

            const matchesCategory = !category || category === 'Todos' || car.type === category;

            return matchesQuery && matchesCategory;
        });
    }

    async getOwnerFleet(hostId: string): Promise<Car[]> {
        return this.cars.filter(c => c.ownerId === hostId);
    }

    async create(car: Omit<Car, 'id'>): Promise<Car> {
        const newCar: Car = {
            ...car,
            id: Date.now().toString()
        };
        this.cars.push(newCar);
        return newCar;
    }

    async updateCar(id: string, data: Partial<Car>): Promise<Car> {
        const index = this.cars.findIndex(c => c.id === id);
        if (index === -1) throw new Error('Car not found');

        this.cars[index] = { ...this.cars[index], ...data };
        return this.cars[index];
    }

    async deleteCar(id: string): Promise<void> {
        this.cars = this.cars.filter(c => c.id !== id);
    }
    async updateStatus(id: string, status: 'approved' | 'rejected' | 'pending', reason?: string): Promise<void> {
        const car = this.cars.find(c => c.id === id);
        if (car) {
            car.status = status;
        }
    }

    async lockCar(id: string, userId: string, durationMinutes: number): Promise<void> {
        // Mock implementation
        const car = this.cars.find(c => c.id === id);
        if (!car) throw new Error('Car not found');
    }

    async checkAvailability(carId: string, startDate: Date, endDate: Date): Promise<boolean> {
        return true;
    }
}

export const carsGateway = new MockCarsGateway();
