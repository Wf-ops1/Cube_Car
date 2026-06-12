import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/core/components/Header';
import Footer from '@/core/components/Footer';
import CarCard from '@/shared/components/visuals/CarCard.view';
import { HeroSearch, CategoryFilters } from '@/features/catalog/components';
import { Spinner } from '@/shared/components/ui/Spinner';

interface HomeViewProps {
    user: any;
    headerProps: any;
    searchSummary: any;
    handleSearch: (filters: any) => void;
    setIsSearchModalOpen: (isOpen: boolean) => void;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    isLoadingCars: boolean;
    cars: any[];
    error: string | null;
    reloadCars: () => void;
    onCarClick: (car: any) => void;
    navigateTo: (page: string) => void;
}

const HomeView: React.FC<HomeViewProps> = ({
    headerProps,
    searchSummary,
    handleSearch,
    setIsSearchModalOpen,
    selectedCategory,
    setSelectedCategory,
    isLoadingCars,
    cars,
    error,
    reloadCars,
    onCarClick,
    navigateTo
}) => {
    return (
        <div className="min-h-screen bg-transparent flex flex-col relative w-full">
            {/* Header */}
            <Header {...headerProps} />

            {/* Main Content */}
            <main className="flex-1 w-full flex flex-col pb-24">

                {/* Hero section with blue container */}
                <div className="w-full max-w-7xl mx-auto px-0 md:px-6 lg:px-8 mt-0 md:mt-8 mb-6 md:mb-10 relative z-[75]">
                    <div className="relative w-full rounded-none md:rounded-[1.5rem] bg-[#005A70] pt-12 pb-14 md:pt-16 md:pb-20 flex flex-col items-center justify-start min-h-[300px] sm:min-h-[360px]">
                        {/* Background Image */}
                        <div className="absolute inset-0 z-0 rounded-none md:rounded-[1.5rem] overflow-hidden">
                            <img 
                                src="/hero-bg.jpg" 
                                alt="Aluguel de carros de luxo" 
                                className="w-full h-full object-cover object-center"
                            />
                            <div className="absolute inset-0 bg-slate-900/60"></div>
                        </div>

                        <div className="w-full mx-auto relative z-10 flex flex-col items-center px-4 md:px-0">
                            <h1 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-white mb-2 text-center tracking-tight">
                                Esqueça o balcão da locadora
                            </h1>
                            <p className="text-white/95 text-sm sm:text-base font-medium mb-8 text-center">
                                Qualquer carro que quiser, em qualquer lugar
                            </p>

                            <div className="w-full max-w-[850px] mx-auto px-2">
                                <HeroSearch
                                    location={searchSummary.location}
                                    dateRange={searchSummary.dateRange}
                                    time={searchSummary.time}
                                    onSearch={handleSearch}
                                    onModalOpen={() => setIsSearchModalOpen(true)}
                                    cars={cars}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories - Using pseudo-element to bleed background upwards and overlap subpixels without altering DOM layout padding/margins */}
                <div className="relative w-full bg-[#F8F9FB] pt-0 pb-2 transition-all sticky top-[72px] md:top-[80px] z-[70] before:content-[''] before:absolute before:-top-[2px] before:left-0 before:w-full before:h-[4px] before:bg-[#F8F9FB] before:-z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <CategoryFilters
                            selectedCategory={selectedCategory}
                            onSelectCategory={setSelectedCategory}
                        />
                    </div>
                </div>

                {/* Car Grid Region */}
                <div className="w-full bg-transparent flex-1 py-8 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        {isLoadingCars ? (
                            <div className="w-full py-32 flex flex-col items-center justify-center">
                                <Spinner size="lg" color="blue" />
                                <p className="mt-4 text-slate-500 font-medium animate-pulse">Buscando os melhores carros...</p>
                            </div>
                        ) : error ? (
                            <div className="w-full py-20 flex flex-col items-center text-center">
                                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
                                    <i className="fas fa-exclamation-triangle text-rose-400 text-3xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Ops, algo deu errado</h3>
                                <p className="text-slate-500 max-w-md mb-8">{error}</p>
                                <button
                                    onClick={reloadCars}
                                    className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95"
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        ) : cars.length === 0 ? (
                            <div className="w-full py-20 flex flex-col items-center text-center">
                                <div className="w-24 h-24 bg-slate-100/80 rounded-[2rem] flex items-center justify-center mb-6 rotate-3">
                                    <i className="fas fa-search text-slate-300 text-4xl -rotate-3"></i>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Nenhum carro encontrado</h3>
                                <p className="text-slate-500 max-w-md">Tente ajustar seus filtros ou buscar em outra localização para ver mais opções.</p>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                            >
                                <AnimatePresence mode="popLayout">
                                    {cars.map((car, index) => (
                                        <motion.div
                                            key={car.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ delay: Math.min(index * 0.05, 0.3) }}
                                        >
                                            <CarCard
                                                car={car}
                                                onClick={() => onCarClick(car)}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </div>
                </div>

            </main>

            {/* Footer */}
            <Footer
                onHowItWorksClick={() => navigateTo('how-it-works')}
                onHelpCenterClick={() => navigateTo('help')}
            />
        </div>
    );
};

export default HomeView;
