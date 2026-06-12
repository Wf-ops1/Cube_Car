import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, Clock, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';
import { useDraftBookingStore } from '@/features/booking/stores/draftBooking.store';
import { useUser } from '@/core/auth/auth.store'; // Hook for direct subscription
import { Car } from '@/core/data/car/car.types';
import { User } from '@/core/data/auth/auth.types';

import { SharedVerificationStepper } from '@/features/verification/components/SharedVerificationStepper';

interface VerificationCheckoutStepperProps {
    user: User;
    car: Car;
    bookingData: {
        startDate: string;
        endDate: string;
        startTime: string;
        endTime: string;
        totalPrice: number;
        days: number;
        rentalCost: number; // Added for draft snapshot
        serviceFee: number; // Added for draft snapshot
    };
}

export const VerificationCheckoutStepper: React.FC<VerificationCheckoutStepperProps> = ({
    user,
    car,
    bookingData
}) => {
    // [FIX] Subscribe directly to store to avoid prop propagation delay
    const globalUser = useUser();
    // Prefer globalUser (reactive) over prop user (potentially stale), but fallback to prop if store is initializing
    const activeUser = globalUser || user;

    const { openWizard } = useUserVerificationWizardStore();
    const { createDraft } = useDraftBookingStore();

    const handleStartVerification = () => {
        // 1. Create Draft Booking
        createDraft({
            carId: car.id,
            carSnapshot: {
                make: car.make,
                model: car.model,
                imageUrl: car.imageUrl,
                pricePerDay: car.pricePerDay
            },
            dates: {
                startDate: bookingData.startDate,
                endDate: bookingData.endDate,
                startTime: bookingData.startTime,
                endTime: bookingData.endTime
            },
            priceSnapshot: {
                rentalCost: bookingData.rentalCost,
                serviceFee: bookingData.serviceFee,
                total: bookingData.totalPrice,
                days: bookingData.days
            },
            userId: user.id
        });

        // 2. Open Wizard
        openWizard('booking');
    };

    return (
        <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100/50 shadow-[0_20px_40px_-4px_rgba(0,0,0,0.08)] animate-fade-in-up">
            <SharedVerificationStepper
                title="🧩 Confirmar sua reserva"
                subtitle="Você está a 2 etapas de finalizar sua reserva."
                step1Title="Verificação da conta"
                step1Status={activeUser.verification?.status === 'IN_REVIEW' ? 'IN_REVIEW' : 'PENDING'}
                step1Description="Validamos todos os motoristas para proteger proprietários e garantir segurança na plataforma."
                step1Notice="Suas datas ficam salvas enquanto sua verificação é processada. Se houver alguma mudança na disponibilidade, avisaremos imediatamente."
                step2Title={
                    <>
                        Pagamento e confirmação
                    </>
                }
                step2Description="Desbloqueado após aprovação da conta."
                onStartVerification={handleStartVerification}
                actionButtonText="Iniciar verificação"
            />
        </div>
    );
};
