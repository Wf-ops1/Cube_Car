import React, { useState } from 'react';
import { useAuthStore } from '@/core/auth/auth.store';
import { CarSchema, CarFormData } from '@/core/data/car/car.types';
import { Car } from '@/shared/types';
import { carsGateway } from '@/core/data/gateways/cars.gateway';
import { useHostStore } from '../../stores/host.store';

export const useAddCarLogic = (onClose: () => void, onCarAdded: () => void) => {
    const [formData, setFormData] = useState<CarFormData>({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        pricePerDay: 50,
        location: '',
        type: 'Sedan',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CarFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (field: keyof CarFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user changes field
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        const result = CarSchema.safeParse(formData);
        if (!result.success) {
            const flattenedErrors = result.error.flatten().fieldErrors;
            const fieldErrors: any = {};
            Object.keys(flattenedErrors).forEach(key => {
                fieldErrors[key] = (flattenedErrors as any)[key]?.[0];
            });
            setErrors(fieldErrors);
            return;
        }

        setIsSubmitting(true);
        try {
            // Unification: Save to Persistent Store (Local "Database")
            const newCar: Car = {
                ...formData,
                id: Math.random().toString(36).substr(2, 9),
                imageUrl: `https://picsum.photos/800/600?random=${Math.floor(Math.random() * 1000)}`,
                coordinates: { lat: 0, lng: 0 }, // Mock coords
                rating: 5.0,
                trips: 0,
                status: 'pending', // Default status
                ownerId: useAuthStore.getState().user?.id || 'guest',
                category: formData.type || 'Sedan'
            } as Car;

            // Direct Store Access (acting as Controller)
            useHostStore.getState().addCar(newCar);

            setShowSuccess(true);
            onCarAdded();
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        errors,
        isSubmitting,
        showSuccess,
        handleChange,
        handleSubmit
    };
};
