import { useState, useCallback } from 'react';
import { calculateRentalEstimation } from '@/core/domain/pricing.rules';
import { Car } from '@/core/data/car/car.types';
import { carsGateway } from '@/core/data/gateways/cars.gateway';

export interface BookingDetails {
    car: Car;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    totalDays: number;
}

export const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
export const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export const ALL_TIME_SLOTS = Array.from({ length: 48 }).map((_, i) => {
    const totalMinutes = i * 30;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
});

export const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
export const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

export const useBookingLogic = (car: Car, onContinueProp: (data: BookingDetails) => void) => {
    const defaultStart = car.availabilityHours?.start || '08:00';
    const defaultEnd = car.availabilityHours?.end || '18:00';

    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState(defaultStart);
    const [endDate, setEndDate] = useState('');
    const [endTime, setEndTime] = useState(defaultEnd);

    const [isBooking, setIsBooking] = useState(false);
    const [bookError, setBookError] = useState<string | null>(null);

    // Derived Logic
    const calculateTotals = useCallback(() => {
        const { days, total } = calculateRentalEstimation(car.pricePerDay, startDate, endDate);
        return { days, price: total };
    }, [startDate, endDate, car.pricePerDay]);

    const { days: totalDays, price: totalPrice } = calculateTotals();

    const handleContinue = async () => {
        setIsBooking(true);
        setBookError(null);
        try {
            await carsGateway.lockCar(car.id, 'guest', 15);
            onContinueProp({ car, startDate, endDate, startTime, endTime, totalPrice, totalDays });
        } catch (e: any) {
            setBookError(e.message === 'RACE_CONDITION'
                ? "⚠️ ALERTA: Veículo reservado por outro usuário agora."
                : "Erro ao verificar disponibilidade.");
        } finally {
            setIsBooking(false);
        }
    };

    const handleClearDates = useCallback(() => {
        setStartDate('');
        setEndDate('');
    }, []);

    const isDateDisabled = useCallback((dateStr: string) => {
        if (!dateStr) return false;
        const [y, m, d] = dateStr.split('-').map(Number);
        const checkDate = new Date(y, m - 1, d);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Block strict past
        if (checkDate < today) return true;

        // Block today if passed cutoff time
        const isToday = checkDate.getTime() === today.getTime();
        if (isToday) {
            const currentHour = new Date().getHours();
            const [endHour] = (car.availabilityHours?.end || "18:00").split(':').map(Number);
            if (currentHour >= endHour) return true;
        }

        return false;
    }, [car.availabilityHours]);

    const isTimeDisabled = useCallback((time: string, dateStr: string) => {
        if (!dateStr) return false;
        const [y, m, d] = dateStr.split('-').map(Number);
        const checkDate = new Date(y, m - 1, d);
        checkDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (checkDate.getTime() === today.getTime()) {
            const [hours] = time.split(':').map(Number);
            const currentHour = new Date().getHours();
            return hours <= currentHour;
        }
        return false;
    }, []);

    return {
        startDate, setStartDate,
        endDate, setEndDate,
        startTime, setStartTime,
        endTime, setEndTime,
        totalDays, totalPrice,
        isBooking,
        bookError, setBookError,
        handleContinue,
        handleClearDates,
        isDateDisabled,
        isTimeDisabled
    };
};
