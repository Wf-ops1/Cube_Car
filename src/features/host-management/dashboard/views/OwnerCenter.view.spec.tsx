import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import OwnerCenterView from './OwnerCenter.view';
import React from 'react';

// Mock dependencies
const mockUseOwnerCenter = vi.fn();
vi.mock('../../application/useOwnerCenter.logic', () => ({
    useOwnerCenter: () => mockUseOwnerCenter()
}));
vi.mock('@/shared/components/ui/Spinner', () => ({ Spinner: () => <div data-testid="spinner-mock" /> }));

describe('OwnerCenterView RTL', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should render spinner when loading', () => {
        mockUseOwnerCenter.mockReturnValue({ loading: true });
        render(<OwnerCenterView user={{ id: 'u1' } as any} onNavigate={vi.fn()} />);
        expect(screen.getByTestId('spinner-mock')).toBeDefined();
    });

    it('should render owner dashboard and allow tab switching', () => {
        const mockSetActiveTab = vi.fn();
        mockUseOwnerCenter.mockReturnValue({
            fleet: [],
            pendingRequests: [{ id: 'r1' }],
            metrics: { netEarnings: 1000, activeBookings: 2, overallRating: 4.8 },
            loading: false,
            activeTab: 'painel',
            setActiveTab: mockSetActiveTab,
            calendarModalState: null,
            setCalendarModalState: vi.fn(),
            isHeaderCollapsed: false,
            setIsHeaderCollapsed: vi.fn(),
            activeCar: null,
            handleUpdatePrice: vi.fn(),
            handleToggleStatus: vi.fn(),
            handlePublishDraft: vi.fn()
        });

        render(<OwnerCenterView user={{ id: 'u1', name: 'John', email: 'john@test.com' } as any} onNavigate={vi.fn()} />);
        
        // We use getAllByText because "Painel" appears both in Header and Tab Navigation
        expect(screen.getAllByText('Painel').length).toBeGreaterThan(0);
        expect(screen.getByText('Garagem')).toBeDefined();
        expect(screen.getByText('Pedidos')).toBeDefined();

        // Switch tab
        const garagemTab = screen.getByText('Garagem');
        fireEvent.click(garagemTab);
        
        expect(mockSetActiveTab).toHaveBeenCalledWith('frota');
    });
});
