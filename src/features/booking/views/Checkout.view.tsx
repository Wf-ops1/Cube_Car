import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { GuestState } from '@/shared/components/states/GuestState';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Car } from '@/core/data/car/car.types';
import { User } from '@/core/data/auth/auth.types';
import Alert from '@/shared/components/ui/Alert';

// Refactored Components
import { useCheckoutLogic } from '@/features/booking/logic/useCheckout.logic';
import { PaymentForm } from '@/features/booking/components/checkout/PaymentForm';
import { BookingSummaryCard } from '@/features/booking/components/checkout/BookingSummaryCard';
import { SuccessScreen } from '@/features/booking/components/checkout/SuccessScreen';
import { MobileFooter } from '@/features/booking/components/checkout/MobileFooter';
import { MobileReviewStep } from '@/features/booking/components/checkout/MobileReviewStep';

import { DateSelectionModal } from '@/features/booking/components/modals/DateSelectionModal';
import { VerificationCheckoutStepper } from '@/features/booking/components/checkout/VerificationCheckoutStepper';
import { VerificationSubmittedScreen } from '@/features/booking/components/checkout/VerificationSubmittedScreen';
import { UnavailableRedirectScreen } from '@/features/booking/components/checkout/UnavailableRedirectScreen';

import { useUserVerificationWizardStore } from '@/core/application/stores/UserVerificationWizard.store';

interface CheckoutProps {
    user: User | null;
    car: Car;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    onBack: () => void;
    onSuccess: () => void;
    onLoginClick: () => void;
    onLogin: (user: User) => void;
    onOpenChat?: (ownerId: string, carId: string) => void;
    onGoHome: () => void;
    onGoToVerification: () => void;
}

const Checkout: React.FC<CheckoutProps> = (props) => {
    const { user, car, onBack, onLoginClick } = props;

    // Logic Hook
    const logic = useCheckoutLogic({
        user: props.user,
        car: props.car,
        initialStartDate: props.startDate,
        initialEndDate: props.endDate,
        initialStartTime: props.startTime,
        initialEndTime: props.endTime,
        onSuccess: props.onSuccess
    });

    const {
        currentStep, mobileStep, setMobileStep,
        handleNextStep, handleFinalPayment, calculateTotals, booking,
        isProcessing, error, setError,
        needsVerification, verificationJustSubmitted,
        isDateEditModalOpen, setDateEditModalOpen,
        isAvailable
    } = logic;

    const { daysDiff, rentalCost, serviceFee, total } = calculateTotals();

    // Derived UI State
    const headerTitle = mobileStep === 3 ? "Revisar e pagar" : "Confirmar e pagar";
    
    const mobileTotalSteps = (!user || needsVerification) ? 2 : 3;

    const { openWizard } = useUserVerificationWizardStore();
    const handleStartVerification = () => {
        if (!user) return;
        openWizard('booking');
    };
    
    const getMobileFooterText = () => {
        if (mobileStep === 3) return isProcessing ? 'Processando...' : 'Revisar e pagar';
        if (mobileStep === 2) {
            if (!user) return 'Entrar para continuar';
            if (user?.verification?.status === 'IN_REVIEW') return 'Aguardando Análise';
            if (needsVerification) return 'Iniciar verificação';
        }
        return 'Próximo';
    };

    const handleMobileFooterClick = () => {
        if (mobileStep === 1) {
            setMobileStep(2);
        } else if (mobileStep === 2) {
            if (!user) {
                onLoginClick();
            } else if (user?.verification?.status === 'IN_REVIEW') {
                return; // Do nothing, they are stuck waiting
            } else if (needsVerification) {
                handleStartVerification();
            } else {
                handleNextStep();
            }
        } else {
            handleFinalPayment();
        }
    };

    return (
        <div
            className={`min-h-screen font-sans animate-fade-in flex flex-col relative selection:bg-blue-100 selection:text-blue-900 ${mobileStep === 3 ? 'pb-12' : 'pb-48'} lg:pb-0`}
        >
            {/* AMBIENT BACKGROUND (MATCHING HELP CENTER & CAR DETAILS) */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-white"></div>

            {/* DESKTOP HEADER */}
            {!verificationJustSubmitted && currentStep !== 3 && (
                <header className="hidden lg:block sticky top-0 z-40 shrink-0 bg-white/80 backdrop-blur-md">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center">
                        <button onClick={onBack} className="p-3 -ml-2 hover:bg-white rounded-full transition-all mr-6 text-[#1C2230] hover:shadow-sm"><i className="fas fa-chevron-left text-lg"></i></button>
                        <h1 className="text-3xl font-display font-medium tracking-tight" style={{ color: '#1C2230' }}>{headerTitle}</h1>
                    </div>
                </header>
            )}

            {/* MOBILE HEADER */}
            {!verificationJustSubmitted && currentStep !== 3 && (
                <header className="lg:hidden bg-transparent relative z-10">
                    <div className="p-4 flex items-center justify-between">
                        <h1 className="text-2xl font-display font-medium" style={{ color: '#1C2230' }}>{headerTitle}</h1>
                        <button onClick={() => mobileStep > 1 ? setMobileStep(mobileStep - 1) : onBack()} className="text-[#1C2230] p-2 hover:bg-gray-100 rounded-full">
                            <i className="fas fa-chevron-left text-lg"></i>
                        </button>
                    </div>
                </header>
            )}

            <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12 w-full relative z-10">
                {isAvailable === false ? (
                    <UnavailableRedirectScreen
                        car={car}
                        onViewSimilar={() => props.onBack()} // Fallback to list
                        onChangeDates={() => setDateEditModalOpen(true)}
                        onNotifyMe={() => { /* Logic */ }}
                    />
                ) : verificationJustSubmitted ? (
                    <VerificationSubmittedScreen
                        car={car}
                        booking={booking}
                        onBackToCar={props.onBack}
                        onEnableNotifications={() => {}}
                        onGoHome={props.onGoHome}
                        onGoToVerification={props.onGoToVerification}
                    />
                ) : currentStep === 3 ? (
                    <SuccessScreen
                        car={car} user={user} onSuccess={props.onSuccess} onContactHost={props.onOpenChat}
                    />
                ) : (
                    <div className={`flex ${mobileStep === 3 ? 'flex-col' : 'flex-col-reverse'} lg:flex-row gap-8 lg:gap-16`}>
                        {/* MOBILE: STEP 3 (REVIEW) - NEW REDESIGN */}
                        {mobileStep === 3 && (
                            <MobileReviewStep
                                car={car}
                                booking={booking}
                                total={total}
                                rentalCost={rentalCost}
                                serviceFee={serviceFee}
                                daysDiff={daysDiff}
                                paymentMethod={logic.paymentMethod}
                                cardData={logic.cardData}
                                onEdit={() => setDateEditModalOpen(true)}
                                handleFinalPayment={handleFinalPayment}
                                isProcessing={isProcessing}
                            />
                        )}

                        {/* LEFT COLUMN: Steps (Hidden on Mobile Step 3) */}
                        <div className={`flex-1 space-y-6 ${mobileStep === 3 ? 'hidden lg:block' : ''} ${mobileStep === 1 ? 'hidden lg:block' : 'block'} `}>
                            {error && <div className="mb-6"><Alert type="error" title="Atenção" onClose={() => setError(null)}>{error}</Alert></div>}

                            {needsVerification ? (
                                /* ── UNVERIFIED USER: Show Stepper directly ── */
                                <VerificationCheckoutStepper
                                    user={user}
                                    car={car}
                                    bookingData={{
                                        startDate: booking.startDate,
                                        endDate: booking.endDate,
                                        startTime: booking.startTime,
                                        endTime: booking.endTime,
                                        totalPrice: total,
                                        days: daysDiff,
                                        rentalCost,
                                        serviceFee
                                    }}
                                />
                            ) : (
                                /* ── VERIFIED USER: Normal Payment + Confirm flow ── */
                                <>
                                    {/* STEP 1: Login / Payment */}
                                    {user ? (
                                        <PaymentForm
                                            paymentMethod={logic.paymentMethod} setPaymentMethod={logic.setPaymentMethod}
                                            cardData={logic.cardData} updateField={logic.updateCardData}
                                            fieldErrors={logic.fieldErrors} setFieldErrors={logic.setFieldErrors}
                                            total={total} handleNextStep={handleNextStep}
                                            showFooter={currentStep === 1}
                                        />
                                    ) : (
                                        <div className="space-y-6">
                                            {/* STEP 1: Login */}
                                            <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100/50 shadow-[0_20px_40px_-4px_rgba(0,0,0,0.08)]">
                                                <h2 className="text-2xl font-bold mb-4">1. Entrar ou cadastrar-se</h2>
                                                <p className="mb-6 text-gray-500">Faça login para continuar sua reserva com segurança.</p>
                                                <button onClick={onLoginClick} className="hidden lg:block bg-[#3667AA] text-white px-8 py-4 rounded-2xl font-bold w-full md:w-auto hover:brightness-110 transition-all">Entrar</button>
                                            </div>

                                            {/* GHOST STEP 2 */}
                                            <div className="hidden lg:block bg-gray-50/40 rounded-[2rem] p-6 lg:p-8 border border-gray-200/50 opacity-60">
                                                <h2 className="text-xl font-bold text-gray-400">2. Adicione uma forma de pagamento</h2>
                                            </div>

                                            {/* GHOST STEP 3 */}
                                            <div className="hidden lg:block bg-gray-50/40 rounded-[2rem] p-6 lg:p-8 border border-gray-200/50 opacity-60">
                                                <h2 className="text-xl font-bold text-gray-400">3. Revise e confirme</h2>
                                            </div>
                                        </div>
                                    )}

                                    {/* STEP 2: Confirm & Pay (Desktop only — Mobile uses MobileFooter) */}
                                    {currentStep >= 2 && (
                                        <div className="hidden lg:block bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100/50 shadow-[0_20px_40px_-4px_rgba(0,0,0,0.08)] animate-fade-in-up">
                                            <h2 className="text-2xl font-bold mb-4" style={{ color: '#1C2230' }}>2. Confirmar reserva</h2>
                                            <p className="mb-8 text-gray-500">Ao clicar em confirmar, você concorda com nossos termos de serviço e política de cancelamento.</p>

                                            <div className="flex justify-end">
                                                <button
                                                    onClick={handleFinalPayment}
                                                    disabled={isProcessing}
                                                    className="bg-[#3667AA] text-white font-bold py-4 px-12 rounded-2xl hover:opacity-95 transition-all text-lg shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-3"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <Spinner variant="svg" color="white" size="sm" />
                                                            Processing...
                                                        </>
                                                    ) : (
                                                        <>
                                                            Confirmar e Pagar
                                                            <i className="fas fa-arrow-right"></i>
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Summary (Hidden on Mobile Step 3 in favor of new component) */}
                        <div className={`w-full lg:w-[420px] ${mobileStep === 3 ? 'hidden lg:block' : ''} ${mobileStep === 2 ? 'hidden lg:block' : 'block'} `}>
                            <BookingSummaryCard
                                car={car} booking={booking} daysDiff={daysDiff} rentalCost={rentalCost} serviceFee={serviceFee} total={total}
                                onEditDates={() => setDateEditModalOpen(true)}
                            />
                        </div>
                    </div>
                )}
            </main>

            {!verificationJustSubmitted && isAvailable !== false && currentStep !== 3 && (
                <MobileFooter
                    mobileStep={mobileStep}
                    totalSteps={mobileTotalSteps}
                    buttonText={getMobileFooterText()}
                    onButtonClick={handleMobileFooterClick}
                    isProcessing={isProcessing}
                />
            )}

            {/* Using Shared DateSelectionModal */}
            <DateSelectionModal
                isOpen={isDateEditModalOpen}
                onClose={() => setDateEditModalOpen(false)}
                startDate={booking.startDate}
                setStartDate={(d) => logic.setBooking(prev => ({ ...prev, startDate: d }))}
                endDate={booking.endDate}
                setEndDate={(d) => logic.setBooking(prev => ({ ...prev, endDate: d }))}
                startTime={booking.startTime}
                setStartTime={(t) => logic.setBooking(prev => ({ ...prev, startTime: t }))}
                endTime={booking.endTime}
                setEndTime={(t) => logic.setBooking(prev => ({ ...prev, endTime: t }))}
                totalPrice={total} // Pass total price
                totalDays={daysDiff} // Pass days
                onConfirm={() => setDateEditModalOpen(false)}
                confirmLabel="Alterar datas"
                priceLabel="Total"
            />
        </div>
    );
};

export default Checkout;