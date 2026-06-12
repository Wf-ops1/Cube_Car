"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Car, Key, ArrowRight, ShieldCheck, UserCheck, Headset } from 'lucide-react';
import Logo from '@/shared/components/ui/Logo';

interface HowItWorksProps {
  onBackToHome: () => void;
  onBecomeHost: () => void;
  onHelpCenterClick: () => void;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

const HowItWorks: React.FC<HowItWorksProps> = ({ onBackToHome, onBecomeHost, onHelpCenterClick }) => {
  return (
    <div className="min-h-screen bg-mercury-50 font-sans selection:bg-primary selection:text-white noise-bg">
      
      {/* Header Minimalista (Logo) - Altura exata da Home */}
      <div className="w-full h-[72px] md:h-[80px] z-[80] relative bg-mercury-50">
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

      {/* INFORMATIVE HERO SECTION: Contained Banner (HostHero Style) */}
      <div className="w-full max-w-7xl mx-auto px-0 md:px-6 lg:px-8 mt-0 mb-6 md:mb-10 relative z-20">
        <div className="relative w-full rounded-none md:rounded-[1.5rem] bg-mercury-900 overflow-hidden flex flex-col justify-center min-h-[500px] md:min-h-[600px] shadow-2xl">
          
          {/* Background Image with Overlay (Darkened & Blurred, No Gradient) */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/how-it-works-hero.jpg"
              alt="Cliente sorrindo no carro"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[3px]"></div>
          </div>

          {/* Content Container */}
          <div className="relative z-10 w-full lg:w-[65%] p-8 md:p-14 flex flex-col justify-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeUp}
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tighter text-white leading-[1.1] mb-6">
                Como funciona o <br className="hidden lg:block" />
                aluguel na <span className="text-primary-100 font-bold">Cube Car</span>.
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-mercury-200 max-w-[50ch] leading-relaxed mb-8 sm:mb-10">
                Transparência, rapidez e segurança. Encontre um carro perto de você e saia dirigindo. Use pelo tempo que precisar e devolva no final. Simples assim.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button 
                  onClick={onBecomeHost}
                  className="w-full sm:w-auto bg-primary text-white rounded-full px-8 py-3.5 font-medium flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-hover hover:bg-primaryDark transition-all active:scale-[0.98]"
                >
                  Consultar veículos disponíveis <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* STEPS SECTION: Staggered Asymmetrical Vertical Stack */}
      <section className="pt-6 md:pt-12 pb-20 md:pb-32 bg-mercury-50 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="mb-10 md:mb-20"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-typography-primary leading-tight">
              O processo de ponta a ponta.
            </h2>
            <p className="text-typography-secondary mt-4 text-lg max-w-[60ch]">
              Entenda exatamente o que acontece antes, durante e depois da sua reserva. Sem burocracia oculta.
            </p>
          </motion.div>

          <div className="space-y-12 md:space-y-32">
            {/* Step 1 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start"
            >
              <div className="hidden md:block md:col-span-3 text-mercury-200 font-bold text-7xl lg:text-9xl tracking-tighter leading-none -mt-4 select-none">
                01
              </div>
              <div className="md:col-span-9 relative">
                <div className="md:hidden absolute -top-6 left-0 text-mercury-200 opacity-40 font-bold text-7xl tracking-tighter leading-none -z-10 select-none">
                  01
                </div>
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary shrink-0 border border-mercury-200">
                    <MapPin className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-typography-primary tracking-tight">Antes da viagem</h3>
                </div>
                <div className="text-typography-secondary text-base sm:text-lg leading-relaxed max-w-[50ch]">
                  Busque um carro perto de você informando localização, data e hora. Escolha o veículo ideal, confira o valor com total transparência e envie o pedido de reserva ao proprietário.
                </div>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start"
            >
               <div className="hidden md:block md:col-span-3 text-mercury-200 font-bold text-7xl lg:text-9xl tracking-tighter leading-none -mt-4 select-none">
                02
              </div>
              <div className="md:col-span-9 relative">
                <div className="md:hidden absolute -top-6 left-0 text-mercury-200 opacity-40 font-bold text-7xl tracking-tighter leading-none -z-10 select-none">
                  02
                </div>
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary shrink-0 border border-mercury-200">
                    <Car className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-typography-primary tracking-tight">Durante a viagem</h3>
                </div>
                <div className="text-typography-secondary text-base sm:text-lg leading-relaxed max-w-[50ch]">
                  No horário combinado, encontre o proprietário para pegar as chaves e fazer a checagem rápida do estado do carro. Tudo validado e resolvido diretamente no app da Cube Car.
                </div>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeUp}
              className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start"
            >
               <div className="hidden md:block md:col-span-3 text-mercury-200 font-bold text-7xl lg:text-9xl tracking-tighter leading-none -mt-4 select-none">
                03
              </div>
              <div className="md:col-span-9 relative">
                <div className="md:hidden absolute -top-6 left-0 text-mercury-200 opacity-40 font-bold text-7xl tracking-tighter leading-none -z-10 select-none">
                  03
                </div>
                <div className="flex items-center gap-4 mb-4 md:mb-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary shrink-0 border border-mercury-200">
                    <Key className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-typography-primary tracking-tight">Após a viagem</h3>
                </div>
                <div className="text-typography-secondary text-base sm:text-lg leading-relaxed max-w-[50ch]">
                  Devolva o carro ao proprietário no local combinado. Faça a checagem final (nível de combustível, estado geral), confirme a devolução no app e a viagem estará encerrada com segurança.
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* TRUST & SAFETY SECTION: 3-Column Feature Grid */}
      <section className="py-20 md:py-32 bg-white relative overflow-hidden border-t border-mercury-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-center mb-16 md:mb-24"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tighter text-typography-primary leading-tight">
              Segurança em primeiro lugar.
            </h2>
            <p className="text-typography-secondary mt-4 text-base sm:text-lg max-w-[60ch] mx-auto leading-relaxed">
              Não é apenas sobre encontrar um veículo. É sobre ter paz de espírito do início ao fim da sua viagem.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }
              }}
              className="bg-mercury-50 rounded-3xl p-8 border border-mercury-200 hover:shadow-premium transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mb-6 shadow-sm border border-mercury-200">
                <ShieldCheck className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold text-typography-primary tracking-tight mb-3">Proteção Completa</h3>
              <p className="text-typography-secondary leading-relaxed">
                Seguro e proteção contra danos já estão inclusos em todas as viagens aprovadas pela plataforma. Cobertura de ponta a ponta.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
              }}
              className="bg-mercury-50 rounded-3xl p-8 border border-mercury-200 hover:shadow-premium transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mb-6 shadow-sm border border-mercury-200">
                <UserCheck className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold text-typography-primary tracking-tight mb-3">Perfis Verificados</h3>
              <p className="text-typography-secondary leading-relaxed">
                Segurança é via de mão dupla. Todos os locatários e anfitriões passam por uma checagem rigorosa de identidade antes da primeira reserva.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }
              }}
              className="bg-mercury-50 rounded-3xl p-8 border border-mercury-200 hover:shadow-premium transition-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-primary mb-6 shadow-sm border border-mercury-200">
                <Headset className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-semibold text-typography-primary tracking-tight mb-3">Suporte 24/7</h3>
              <p className="text-typography-secondary leading-relaxed">
                Nossa equipe acompanha você durante toda a locação. Se algum imprevisto acontecer na estrada, você nunca estará sozinho.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION: Informative Centered Block */}
      <section className="py-12 md:py-24 relative overflow-hidden bg-mercury-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="relative overflow-hidden rounded-[2.5rem] bg-[#0F172A] text-white p-8 md:p-10 text-center shadow-2xl shadow-slate-900/40 flex flex-col items-center"
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 flex flex-col items-center w-full">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-white mb-2 md:mb-4">
                Ficou alguma dúvida?
              </h2>

              <div className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[480px] md:h-[480px] mb-2 md:mb-4 relative -mt-6">
                <img 
                  src="/images/duvida-avatar.png" 
                  alt="Personagem pensando"
                  className="w-full h-full object-contain drop-shadow-2xl" 
                />
              </div>

              <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-6 md:mb-8 font-light max-w-lg mx-auto">
                Nossa equipe de suporte e nossa central de ajuda detalham desde as políticas de seguro até os termos de locação para anfitriões e locatários.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <button 
                  onClick={onHelpCenterClick}
                  className="w-full sm:w-auto bg-primary text-white rounded-full px-8 py-3.5 font-medium flex items-center justify-center gap-2 shadow-glow hover:shadow-glow-hover hover:bg-primaryDark transition-all active:scale-[0.98]"
                >
                  Central de Ajuda
                </button>
                <button 
                  onClick={onBackToHome}
                  className="w-full sm:w-auto bg-transparent text-white border border-mercury-700 hover:bg-mercury-800 rounded-full px-8 py-3.5 font-medium flex items-center justify-center transition-all active:scale-[0.98]"
                >
                  Voltar ao início
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default HowItWorks;