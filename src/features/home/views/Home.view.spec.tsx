import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HomeView from './Home.view';
import React from 'react';

// Mock child components to isolate HomeView rendering
vi.mock('@/core/components/Header', () => ({ default: () => <div data-testid="header-mock" /> }));
vi.mock('@/core/components/Footer', () => ({ default: () => <div data-testid="footer-mock" /> }));
vi.mock('@/shared/components/visuals/CarCard.view', () => ({ default: ({ car }: any) => <div data-testid="car-card">{car.make}</div> }));
vi.mock('@/features/catalog/components', () => ({
    HeroSearch: () => <div data-testid="hero-search" />,
    CategoryFilters: () => <div data-testid="category-filters" />
}));

describe('HomeView (Catalog) RTL', () => {
    const defaultProps = {
        user: null,
        headerProps: {},
        searchSummary: {},
        handleSearch: vi.fn(),
        setIsSearchModalOpen: vi.fn(),
        selectedCategory: 'Todos',
        setSelectedCategory: vi.fn(),
        isLoadingCars: false,
        cars: [],
        error: null,
        reloadCars: vi.fn(),
        onCarClick: vi.fn(),
        navigateTo: vi.fn(),
    };

    it('should display the loading spinner when isLoadingCars is true', () => {
        render(<HomeView {...defaultProps} isLoadingCars={true} />);
        expect(screen.getByText('Buscando os melhores carros...')).toBeDefined();
    });

    it('should display error state when error is present', () => {
        render(<HomeView {...defaultProps} error="Erro ao carregar veículos" />);
        expect(screen.getByText('Erro ao carregar veículos')).toBeDefined();
    });

    it('should display the empty state when there are no cars', () => {
        render(<HomeView {...defaultProps} cars={[]} />);
        expect(screen.getByText('Nenhum carro encontrado')).toBeDefined();
    });

    it('should render car cards when cars are provided', () => {
        const mockCars = [
            { id: '1', make: 'Fiat', model: 'Mobi' },
            { id: '2', make: 'Jeep', model: 'Renegade' }
        ];
        render(<HomeView {...defaultProps} cars={mockCars} />);
        
        const carCards = screen.getAllByTestId('car-card');
        expect(carCards).toHaveLength(2);
        expect(screen.getByText('Fiat')).toBeDefined();
        expect(screen.getByText('Jeep')).toBeDefined();
    });
});
