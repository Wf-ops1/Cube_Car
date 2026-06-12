import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardView from './Dashboard.view';
import React from 'react';

// Mock dependencies
const mockUseDashboard = vi.fn();
vi.mock('../logic/useDashboard.logic', () => ({
    useDashboard: () => mockUseDashboard()
}));
vi.mock('@/shared/components/ui/Spinner', () => ({ Spinner: () => <div data-testid="spinner-mock" /> }));

describe('DashboardView RTL', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render dashboard correctly', () => {
        mockUseDashboard.mockReturnValue({
            myTrips: [],
            activeReservation: null,
            selectedTripDetail: null,
            setSelectedTripDetail: vi.fn(),
            handleCompleteTrip: vi.fn(),
            completingTripId: null,
            reviewModalData: { isOpen: false, trip: null },
            setReviewModalData: vi.fn(),
            showSuccessOverlay: false,
            pendingReviewTrips: [],
            reviewedTripIds: [],
            handleReviewTrip: vi.fn(),
            handleReviewClose: vi.fn(),
            handleReviewSubmitted: vi.fn()
        });

        render(<DashboardView user={{ id: 'u1', name: 'John Test', email: 'j@j.com' } as any} onNavigateHome={vi.fn()} onNavigateHelp={vi.fn()} />);
        
        expect(screen.getByText(/Viagens/i)).toBeDefined();
    });

    it('should show trip details when a trip is selected', () => {
        const mockSetSelected = vi.fn();
        mockUseDashboard.mockReturnValue({
            myTrips: [],
            activeReservation: null,
            selectedTripDetail: { id: 't1', carName: 'Tesla Mobi', location: 'São Paulo', price: 100 },
            setSelectedTripDetail: mockSetSelected,
            handleCompleteTrip: vi.fn(),
            completingTripId: null,
            reviewModalData: { isOpen: false, trip: null },
            setReviewModalData: vi.fn(),
            showSuccessOverlay: false,
            pendingReviewTrips: [],
            reviewedTripIds: [],
            handleReviewTrip: vi.fn(),
            handleReviewClose: vi.fn(),
            handleReviewSubmitted: vi.fn()
        });

        render(<DashboardView user={{ id: 'u1', name: 'John Test', email: 'j@j.com' } as any} onNavigateHome={vi.fn()} onNavigateHelp={vi.fn()} />);
        
        expect(screen.getByText(/Tesla Mobi/i)).toBeDefined();
    });
});
