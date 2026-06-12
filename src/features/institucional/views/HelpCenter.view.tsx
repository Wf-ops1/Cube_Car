import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackButton } from '@/core/components/buttons/BackButton';

import { useUser } from '@/core/auth/auth.store';

// Extracted Data & Components
import * as faqData from '@/core/data/support/helpCenter.data';
import { SupportSearchHero } from '../components/SupportSearchHero';
import { FaqAccordion } from '../components/FaqAccordion';
import { ContactSupportCard } from '../components/ContactSupportCard';
import Footer from '@/core/components/Footer';

interface HelpCenterProps {
  onBackToHome: () => void;
  onContactSupport: () => void;
  onHowItWorksClick?: () => void;
}

type Tab = 'driver' | 'host';
type ViewState = 'main' | 'category-details';

// Pre-compute aggregated FAQs for search
const allDriverFaqs = [
  ...faqData.mainFaqs.driver,
  ...faqData.accountProfileDriverFaqs,
  ...faqData.tripsReservationsDriverFaqs,
  ...faqData.securityTrustDriverFaqs,
  ...faqData.paymentsDriverFaqs,
];

const allHostFaqs = [
  ...faqData.mainFaqs.host,
  ...faqData.registerCarFaqs,
  ...faqData.reservationManagementHostFaqs,
  ...faqData.financeHostFaqs,
  ...faqData.supportProtectionHostFaqs,
];

const HelpCenter: React.FC<HelpCenterProps> = ({ onBackToHome, onContactSupport, onHowItWorksClick }) => {
  const user = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('driver');
  const [currentView, setCurrentView] = useState<ViewState>('main');
  const [selectedCategoryTitle, setSelectedCategoryTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleCategoryClick = (title: string) => {
    const validTitles = [
      'Cadastrar Meu Carro', 'Conta e Perfil', 'Viagens e Reservas',
      'Ganhos e Financeiro', 'Segurança e Confiança', 'Pagamentos',
      'Gestão de Reservas', 'Suporte e Proteção'
    ];

    if (validTitles.includes(title)) {
      setSelectedCategoryTitle(title);
      setCurrentView('category-details');
      setOpenFaqIndex(null);
      setSearchQuery('');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBackToMain = () => {
    setCurrentView('main');
    setSelectedCategoryTitle('');
    setOpenFaqIndex(null);
  };

  // Categories Definition
  const driverCategories = [
    { icon: 'fa-user-circle', title: 'Conta e Perfil', desc: 'Gerenciar configurações e verificação.' },
    { icon: 'fa-car', title: 'Viagens e Reservas', desc: 'Como reservar, alterar ou cancelar.' },
    { icon: 'fa-shield-alt', title: 'Segurança e Confiança', desc: 'Seguros, regras e diretrizes.' },
    { icon: 'fa-credit-card', title: 'Pagamentos', desc: 'Faturas, reembolsos e ganhos.' },
  ];

  const hostCategories = [
    { icon: 'fa-car-side', title: 'Cadastrar Meu Carro', desc: 'Como listar e aprovar seu veículo.' },
    { icon: 'fa-calendar-check', title: 'Gestão de Reservas', desc: 'Check-in, Check-out e solicitações.' },
    { icon: 'fa-chart-line', title: 'Ganhos e Financeiro', desc: 'Taxas, recebimentos e saques.' },
    { icon: 'fa-shield-alt', title: 'Suporte e Proteção', desc: 'Avarias, multas e seguros.' },
  ];

  const currentCategories = activeTab === 'driver' ? driverCategories : hostCategories;

  // Determine FAQs
  let displayedFaqs: { q: string, a: string }[] = [];

  const isSearching = searchQuery.trim() !== '';

  if (currentView === 'category-details') {
    switch (selectedCategoryTitle) {
      case 'Cadastrar Meu Carro': displayedFaqs = faqData.registerCarFaqs; break;
      case 'Gestão de Reservas': displayedFaqs = faqData.reservationManagementHostFaqs; break;
      case 'Ganhos e Financeiro': displayedFaqs = faqData.financeHostFaqs; break;
      case 'Suporte e Proteção': displayedFaqs = faqData.supportProtectionHostFaqs; break;
      case 'Conta e Perfil': displayedFaqs = faqData.accountProfileDriverFaqs; break;
      case 'Viagens e Reservas': displayedFaqs = faqData.tripsReservationsDriverFaqs; break;
      case 'Segurança e Confiança': displayedFaqs = faqData.securityTrustDriverFaqs; break;
      case 'Pagamentos': displayedFaqs = faqData.paymentsDriverFaqs; break;
      default: displayedFaqs = [];
    }
  } else {
    // If searching, use the aggregated lists. Otherwise, show only mainFaqs.
    if (isSearching) {
      displayedFaqs = activeTab === 'driver' ? allDriverFaqs : allHostFaqs;
    } else {
      displayedFaqs = activeTab === 'driver' ? faqData.mainFaqs.driver : faqData.mainFaqs.host;
    }
  }

  const filteredFaqs = displayedFaqs.filter(item =>
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#F8F9FB] overflow-y-auto flex flex-col font-sans">
      {/* AMBIENT BACKGROUND (MATCHING TRIP DETAILS) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F8F9FB]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#3667AA]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#3667AA]/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      {/* Header (MATCHING TRIP DETAILS NAV) */}
      <div className="relative z-20 px-4 md:px-8 py-8 lg:py-16 max-w-6xl mx-auto w-full mb-8">
        <div className="flex items-center justify-between">
          <BackButton onClick={onBackToHome} className="relative z-50" />

          <div className="flex flex-col items-end gap-1.5">
            <div className="inline-flex items-center gap-2.5 bg-white px-5 py-2.5 rounded-full border border-gray-100 shadow-sm text-[#1C2230] transition-all duration-300">
              <i className="fas fa-life-ring text-[#3667AA] text-xs" style={{ color: '#3667AA' }}></i>
              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#1C2230]" style={{ color: '#1C2230' }}>Central de Ajuda</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        {currentView === 'main' ? (
          <>
            <SupportSearchHero userAvatar={user?.avatar || ''} onSearch={setSearchQuery} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pb-12">
              {/* Tabs */}
              <div className="flex justify-center mb-12">
                <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-slate-200 shadow-lg shadow-slate-200/50 flex items-center relative w-full max-w-[400px]">
                  <button onClick={() => setActiveTab('driver')} className={`relative z-10 flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'driver' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`} style={{ color: activeTab === 'driver' ? '#FFFFFF' : '#64748B' }}>Motoristas</button>
                  <button onClick={() => setActiveTab('host')} className={`relative z-10 flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${activeTab === 'host' ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`} style={{ color: activeTab === 'host' ? '#FFFFFF' : '#64748B' }}>Proprietários</button>
                  <motion.div className="absolute bg-[#3667AA] shadow-md rounded-full h-[calc(100%-12px)] top-1.5" initial={false} animate={{ left: activeTab === 'driver' ? '6px' : 'calc(50% + 2px)', width: 'calc(50% - 8px)' }} transition={{ type: "spring", stiffness: 400, damping: 35 }} />
                </div>
              </div>

              {/* Grid - Hidden smoothly when searching */}
              <AnimatePresence>
                {!isSearching && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 overflow-hidden"
                  >
                    {currentCategories.map((cat, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        onClick={() => handleCategoryClick(cat.title)}
                        className="bg-white p-5 md:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all cursor-pointer group flex flex-col items-center md:items-start text-center md:text-left h-full relative overflow-hidden"
                      >
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gray-50 flex items-center justify-center text-slate-600 mb-4 md:mb-6 group-hover:bg-[#3667AA]/5 group-hover:text-[#3667AA] transition-colors">
                          <i className={`fas ${cat.icon} text-base md:text-lg`} style={{ color: '#475569' }}></i>
                        </div>

                        <h3 className="text-xs md:text-sm font-bold uppercase tracking-wide text-[#1C2230] mb-1.5 md:mb-2 group-hover:text-[#3667AA] transition-colors" style={{ color: '#1C2230' }}>{cat.title}</h3>
                        <p className="text-[10px] md:text-[11px] leading-relaxed text-gray-400 w-full font-medium" style={{ color: '#9CA3AF' }}>{cat.desc}</p>

                        <div className="mt-auto pt-4 md:pt-6 w-full flex justify-center md:justify-start opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-[#3667AA]" style={{ color: '#3667AA' }}>Ver Tópicos</span>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* FAQ Section */}
              <motion.div layout className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1 bg-slate-200/60"></div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400" style={{ color: '#9CA3AF' }}>
                  {isSearching ? 'Resultados da Busca' : 'Dúvidas Comuns'}
                </h2>
                <div className="h-px flex-1 bg-slate-200/60"></div>
              </motion.div>

              <motion.div layout className="mb-8">
                <FaqAccordion faqs={filteredFaqs} openIndex={openFaqIndex} onToggle={toggleFaq} searchQuery={searchQuery} />
                
                {isSearching && filteredFaqs.length === 0 && (
                  <div className="text-center py-12">
                    <i className="fas fa-search text-4xl text-slate-300 mb-4"></i>
                    <p className="text-slate-500 font-medium">Nenhum resultado encontrado para "{searchQuery}"</p>
                    <p className="text-sm text-slate-400 mt-2">Tente buscar com outras palavras-chave ou entre em contato com o suporte.</p>
                  </div>
                )}
              </motion.div>

              <motion.div layout>
                <ContactSupportCard onContact={onContactSupport} />
              </motion.div>
            </div>
          </>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 pt-6 pb-12">
            {/* Detail View Header */}
            <div className="mb-8 pb-8 border-b border-slate-200/50">
              <div className="flex items-center gap-2 mb-8 group">
                <BackButton onClick={handleBackToMain} />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider group-hover:text-[#3667AA] transition-colors cursor-pointer" onClick={handleBackToMain}>
                  Voltar para Central de Ajuda
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-white rounded-[1.5rem] flex items-center justify-center text-[#3667AA] shrink-0 shadow-lg shadow-blue-900/5 ring-1 ring-white">
                  <i className={`fas ${currentCategories.find(c => c.title === selectedCategoryTitle)?.icon || 'fa-question-circle'} text-3xl`} style={{ color: '#3667AA' }}></i>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1 block" style={{ color: '#3667AA' }}>Categoria</span>
                  <h2 className="text-3xl md:text-4xl font-display font-medium text-slate-900 leading-tight" style={{ color: '#1C2230' }}>{selectedCategoryTitle}</h2>
                </div>
              </div>
            </div>

            <div className="mb-16">
              <FaqAccordion faqs={filteredFaqs} openIndex={openFaqIndex} onToggle={toggleFaq} searchQuery={searchQuery} />
            </div>

          </div>
        )}
      </div>

      <Footer 
        onHowItWorksClick={onHowItWorksClick} 
        onHelpCenterClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
      />

    </div>
  );
};

export default HelpCenter;