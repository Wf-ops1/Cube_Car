import { useState, useEffect } from 'react';
import { User } from '@/core/data/auth/auth.types';
import { carsGateway } from '@/core/data/gateways/cars.gateway';
import { paymentGateway } from '@/core/data/gateways/payment.gateway';
import { useAuthStore } from '@/core/auth/auth.store';
import { Car } from '@/shared/types';
import { bookingService } from '@/features/booking/services/BookingService';
import { calculateRentalEstimation } from '@/core/domain/pricing.rules';
import { useIsMobile } from '@/shared/hooks/useIsMobile';
import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';

export interface CheckoutLogicProps {
    user: User | null;
    car: Car;
    initialStartDate: string;
    initialEndDate: string;
    initialStartTime: string;
    initialEndTime: string;
    onSuccess: () => void;
}

export const useCheckoutLogic = ({
    user,
    car,
    initialStartDate,
    initialEndDate,
    initialStartTime,
    initialEndTime,
    onSuccess
}: CheckoutLogicProps) => {
    // Logical Steps: 0 = Login, 1 = Input, 2 = Review, 3 = Success
    const [currentStep, setCurrentStep] = useState(user ? 1 : 0);
    // Visual Mobile Steps: 1 = Details, 2 = Payment, 3 = Review
    const [mobileStep, setMobileStep] = useState(1);

    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

    const [booking, setBooking] = useState({
        startDate: initialStartDate,
        endDate: initialEndDate,
        startTime: initialStartTime,
        endTime: initialEndTime
    });

    const [cardData, setCardData] = useState({
        name: '',
        surname: '',
        cpf: '',
        cardNumber: '',
        expiry: '',
        cvc: ''
    });

    // Verification and Modals State
    const [verificationJustSubmitted, setVerificationJustSubmitted] = useState(false);
    const [wasWizardOpen, setWasWizardOpen] = useState(false);
    const [isDateEditModalOpen, setDateEditModalOpen] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

    const isMobile = useIsMobile();
    const { isOpen: isWizardOpen, context: wizardContext } = useUserVerificationWizardStore();

    const needsVerification = user && user.verification?.status !== 'APPROVED';

    // Sync Auth Step
    useEffect(() => {
        if (user && currentStep === 0) setCurrentStep(1);
        else if (!user) setCurrentStep(0);
    }, [user, currentStep]);

    // Verification Wizard Effect
    useEffect(() => {
        if (isWizardOpen && wizardContext === 'booking') {
            setWasWizardOpen(true);
        }
        if (wasWizardOpen && !isWizardOpen && wizardContext === 'booking') {
            // Wizard just closed. Check if explicit submission happened.
            const hasSubmitted = useUserVerificationWizardStore.getState().hasSubmitted;

            if (user && user.verification?.status !== 'APPROVED' && hasSubmitted) {
                setVerificationJustSubmitted(true);
                useUserVerificationWizardStore.getState().reset(); // Reset now that we've consumed it
            }
            setWasWizardOpen(false);
        }
    }, [isWizardOpen, wasWizardOpen, wizardContext, user]);

    // Validation
    const validatePaymentForm = (): boolean => {
        setError(null);
        setFieldErrors({});

        if (!paymentMethod) {
            setError("Por favor, selecione uma forma de pagamento para continuar.");
            return false;
        }

        const newFieldErrors: Record<string, boolean> = {};
        if (paymentMethod === 'pix') {
            if (!cardData.name.trim()) newFieldErrors.name = true;
            if (!cardData.surname.trim()) newFieldErrors.surname = true;
            if (!cardData.cpf.trim()) newFieldErrors.cpf = true;
        } else if (paymentMethod === 'credit_card') {
            if (!cardData.cardNumber.trim()) newFieldErrors.cardNumber = true;
            if (!cardData.expiry.trim()) newFieldErrors.expiry = true;
            if (!cardData.cvc.trim()) newFieldErrors.cvc = true;
            if (!cardData.name.trim()) newFieldErrors.name = true;
            if (!cardData.cpf.trim()) newFieldErrors.cpf = true;
        }

        if (Object.keys(newFieldErrors).length > 0) {
            setFieldErrors(newFieldErrors);
            setError("Por favor, preencha todos os campos corretamente antes de continuar.");
            return false;
        }
        return true;
    };

    const handleNextStep = () => {
        if (validatePaymentForm()) {
            setCurrentStep(2);
            setMobileStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Calculation Logic
    const calculateTotals = () => {
        const start = `${booking.startDate}T${booking.startTime}`;
        const end = `${booking.endDate}T${booking.endTime}`;

        const { days, total: rentalCost } = calculateRentalEstimation(car.pricePerDay, start, end);

        // Service fee logic remains specific to checkout for now (or could be moved to domain if universal)
        const serviceFee = rentalCost * 0.10;
        const total = rentalCost + serviceFee;

        return { daysDiff: days, rentalCost, serviceFee, total };
    };

    const { total } = calculateTotals();

    const handleFinalPayment = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            // STEP 1: Availability Check
            const isStockAvailable = await carsGateway.checkAvailability(
                car.id,
                new Date(booking.startDate),
                new Date(booking.endDate)
            );

            if (!isStockAvailable) {
                setIsProcessing(false);
                setError("Este carro acabou de ser reservado por outro usuário. Por favor, escolha outras datas ou outro veículo.");
                return;
            }

            // STEP 2: Process Payment
            const result = await paymentGateway.processCreditCard({
                cardNumber: paymentMethod === 'credit_card' ? (cardData.cardNumber || '0000') : 'PIX',
                cardName: `${cardData.name} ${cardData.surname}`,
                expiry: cardData.expiry,
                cvc: cardData.cvc,
                amount: total
            });

            if (result.success) {
                // STEP 3: Create Booking
                if (car && user) {
                    await bookingService.createBooking({
                        car: car,
                        renter: user, // BookingParams usually expects 'renter'
                        startDate: booking.startDate,
                        endDate: booking.endDate,
                        startTime: booking.startTime || '10:00',
                        endTime: booking.endTime || '18:00',
                        totalPrice: total
                    });
                }
                setCurrentStep(3);
                window.scrollTo(0, 0);
            } else {
                setIsProcessing(false);
                switch (result.error) {
                    case 'INSUFFICIENT_FUNDS': setError("O pagamento foi recusado por saldo insuficiente. Tente outro cartão."); break;
                    case 'CARD_DECLINED': setError("O banco emissor recusou a transação. Entre em contato com seu banco ou tente outro cartão."); break;
                    case 'TIMEOUT': setError("O sistema bancário demorou para responder. Sua cobrança NÃO foi realizada. Tente novamente em alguns instantes."); break;
                    case 'NETWORK_ERROR': setError("Falha de conexão. Verifique sua internet e tente novamente."); break;
                    case 'FRAUD_DETECTED': setError("Transação bloqueada por segurança. Entre em contato com nosso suporte."); break;
                    default: setError("Ocorreu um erro inesperado. Tente novamente ou contate o suporte.");
                }
            }
        } catch (e) {
            setError("Erro crítico ao processar. Tente novamente.");
            setIsProcessing(false);
        }
    };

    const updateCardData = (field: string, val: string) => {
        let cleanValue = val;
        switch (field) {
            case 'cardNumber': cleanValue = val.replace(/\D/g, '').slice(0, 16); break;
            case 'cvc': cleanValue = val.replace(/\D/g, '').slice(0, 4); break;
            case 'expiry':
                const expNums = val.replace(/\D/g, '').slice(0, 4);
                cleanValue = expNums.length >= 2 ? `${expNums.slice(0, 2)}/${expNums.slice(2)}` : expNums;
                break;
            case 'cpf':
                const cpfNums = val.replace(/\D/g, '').slice(0, 11);
                if (cpfNums.length <= 3) cleanValue = cpfNums;
                else if (cpfNums.length <= 6) cleanValue = `${cpfNums.slice(0, 3)}.${cpfNums.slice(3)}`;
                else if (cpfNums.length <= 9) cleanValue = `${cpfNums.slice(0, 3)}.${cpfNums.slice(3, 6)}.${cpfNums.slice(6)}`;
                else cleanValue = `${cpfNums.slice(0, 3)}.${cpfNums.slice(3, 6)}.${cpfNums.slice(6, 9)}-${cpfNums.slice(9)}`;
                break;
            case 'name': case 'surname':
                cleanValue = val.replace(/[^a-zA-Z\u00C0-\u00FF\s]/g, '');
                break;
        }
        setCardData(prev => ({ ...prev, [field]: cleanValue }));
    };

    return {
        currentStep, setCurrentStep,
        mobileStep, setMobileStep,
        isProcessing,
        paymentMethod, setPaymentMethod,
        error, setError,
        fieldErrors, setFieldErrors,
        booking, setBooking,
        cardData, updateCardData,
        isMobile,
        needsVerification,
        verificationJustSubmitted, setVerificationJustSubmitted,
        isDateEditModalOpen, setDateEditModalOpen,
        isAvailable, setIsAvailable,
        handleNextStep,
        handleFinalPayment,
        calculateTotals
    };
};
