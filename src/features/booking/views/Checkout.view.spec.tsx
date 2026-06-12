import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CheckoutView from './Checkout.view';
import React from 'react';
import * as logicModule from '@/features/booking/logic/useCheckout.logic';

// Mock dependencies
vi.mock('@/features/booking/logic/useCheckout.logic', () => ({
    useCheckoutLogic: vi.fn()
}));
vi.mock('@/core/application/stores/UserVerificationWizard.store', () => ({
    useUserVerificationWizardStore: () => ({ openWizard: vi.fn() })
}));

describe('CheckoutView RTL', () => {
    const defaultProps = {
        user: { id: 'u1', name: 'Test User' },
        car: { id: 'c1', make: 'Fiat', model: 'Mobi', pricePerDay: 100 },
        startDate: '2023-10-01',
        endDate: '2023-10-05',
        startTime: '10:00',
        endTime: '10:00',
        onBack: vi.fn(),
        onSuccess: vi.fn(),
        onLoginClick: vi.fn(),
        onLogin: vi.fn(),
        onGoHome: vi.fn(),
        onGoToVerification: vi.fn()
    };

    const defaultLogicReturn = {
        currentStep: 1,
        mobileStep: 1,
        setMobileStep: vi.fn(),
        handleNextStep: vi.fn(),
        handleFinalPayment: vi.fn(),
        calculateTotals: () => ({ daysDiff: 4, rentalCost: 400, serviceFee: 40, total: 440 }),
        booking: { startDate: '2023-10-01', endDate: '2023-10-05' },
        isProcessing: false,
        error: null,
        setError: vi.fn(),
        needsVerification: false,
        verificationJustSubmitted: false,
        isDateEditModalOpen: false,
        setDateEditModalOpen: vi.fn(),
        isAvailable: true,
        paymentMethod: 'CREDIT_CARD',
        setPaymentMethod: vi.fn(),
        cardData: {},
        updateCardData: vi.fn(),
        fieldErrors: {},
        setFieldErrors: vi.fn()
    };

    it('should render the checkout view header properly', () => {
        (logicModule.useCheckoutLogic as any).mockReturnValue(defaultLogicReturn);
        
        render(<CheckoutView {...defaultProps as any} />);
        
        const headers = screen.getAllByText('Confirmar e pagar');
        expect(headers.length).toBeGreaterThan(0);
    });

    it('should show processing state when submitting at step 2', () => {
        (logicModule.useCheckoutLogic as any).mockReturnValue({
            ...defaultLogicReturn,
            currentStep: 2,
            isProcessing: true
        });

        render(<CheckoutView {...defaultProps as any} />);
        
        expect(screen.getByText(/Processing.../)).toBeDefined();
    });
});
