import React from 'react';

import Logo from '@/shared/components/ui/Logo';
import { AmbientBackground } from '@/shared/components/layout/AmbientBackground';
import {
  HostHero,
  SocialProofBar,
  HowItWorks,
  ProtectionSection,
  BenefitsSection,
  Testimonials,
  Transparency,
  HostFAQ,
  FinalCTA
} from '../components/BecomeHost';

interface BecomeHostProps {
  onBackToHome: () => void;
  onListCar: () => void;
}

const BecomeHost: React.FC<BecomeHostProps> = ({ onBackToHome, onListCar }) => {
  return (
    <div className="min-h-screen bg-[#F8F9FB] font-sans text-typography-primary relative overflow-x-hidden">
      
      {/* Background ambiente para dar unidade visual */}
      <AmbientBackground />

      {/* Header Minimalista (Logo) - Altura exata da Home */}
      <div className="w-full h-[72px] md:h-[80px] z-[80] relative bg-[#F8F9FB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <button 
            onClick={onBackToHome}
            className="group hover:opacity-80 transition-opacity focus:outline-none"
            aria-label="Voltar para a página inicial"
          >
            <Logo className="h-[82px] md:h-[85px] w-auto sm:h-[5.6rem] group-hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" />
          </button>
        </div>
      </div>

      {/* Nova Arquitetura de Componentes da Página (Cro/UX Audit) */}
      <HostHero onListCar={onListCar} />
      
      <SocialProofBar />
      
      <HowItWorks />
      
      <ProtectionSection />
      
      <BenefitsSection />
      
      <Testimonials />
      
      <Transparency />
      
      <HostFAQ />
      
      <FinalCTA onListCar={onListCar} />



      {/* Mobile Floating Action Button (Mantido para CRO mobile) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-gray-100 z-[60] md:hidden shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button
          onClick={onListCar}
          className="w-full text-white bg-[#3667AA] hover:bg-[#2B5288] font-bold rounded-full text-lg px-5 py-4 text-center shadow-glow active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Anunciar grátis
        </button>
      </div>

    </div>
  );
};

export default BecomeHost;