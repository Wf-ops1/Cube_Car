import React from 'react';
import { Camera, Smartphone, Banknote } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export const HowItWorks: React.FC = () => {
  return (
    <div className="py-16 md:py-32 bg-[#F8F9FB] relative z-10 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
          className="mb-16 md:mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-display font-medium text-[#1C2230] leading-tight tracking-tight">
            Como funciona
          </h2>
          <p className="text-[#52525B] mt-4 text-xl max-w-[50ch] font-light">
            Um processo desenhado para ser simples, do cadastro ao seu primeiro pagamento.
          </p>
        </motion.div>

        <div className="space-y-16 md:space-y-32">
          
          {/* Step 1 */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group"
          >
            <div className="hidden md:block md:col-span-3 text-gray-200 font-bold text-7xl lg:text-9xl tracking-tighter leading-none -mt-6 select-none group-hover:text-gray-300 transition-colors">
              01
            </div>
            <div className="md:col-span-9 relative">
              <div className="md:hidden absolute -top-8 left-0 text-gray-200 opacity-50 font-bold text-7xl tracking-tighter leading-none -z-10 select-none">
                01
              </div>
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#3667AA] shrink-0 border border-gray-100">
                  <Camera className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-medium text-[#1C2230] tracking-tight">Cadastre seu carro</h3>
              </div>
              <div className="text-[#52525B] text-lg md:text-xl leading-relaxed max-w-[45ch] font-light">
                Fotos, preço e regras definidos por você em menos de 10 minutos. Nossa plataforma guia você em cada etapa para garantir o melhor anúncio possível.
              </div>
            </div>
          </motion.div>

          {/* Step 2 */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group"
          >
            <div className="hidden md:block md:col-span-3 text-gray-200 font-bold text-7xl lg:text-9xl tracking-tighter leading-none -mt-6 select-none group-hover:text-gray-300 transition-colors">
              02
            </div>
            <div className="md:col-span-9 relative">
              <div className="md:hidden absolute -top-8 left-0 text-gray-200 opacity-50 font-bold text-7xl tracking-tighter leading-none -z-10 select-none">
                02
              </div>
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#3667AA] shrink-0 border border-gray-100">
                  <Smartphone className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-medium text-[#1C2230] tracking-tight">Aceite reservas</h3>
              </div>
              <div className="text-[#52525B] text-lg md:text-xl leading-relaxed max-w-[45ch] font-light">
                Apenas motoristas verificados com identidade validada podem solicitar. Você analisa o perfil e aprova com um único toque no seu smartphone.
              </div>
            </div>
          </motion.div>

          {/* Step 3 */}
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start group"
          >
             <div className="hidden md:block md:col-span-3 text-gray-200 font-bold text-7xl lg:text-9xl tracking-tighter leading-none -mt-6 select-none group-hover:text-gray-300 transition-colors">
              03
            </div>
            <div className="md:col-span-9 relative">
              <div className="md:hidden absolute -top-8 left-0 text-gray-200 opacity-50 font-bold text-7xl tracking-tighter leading-none -z-10 select-none">
                03
              </div>
              <div className="flex items-center gap-4 mb-4 md:mb-6">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#3667AA] shrink-0 border border-gray-100">
                  <Banknote className="w-6 h-6" strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl md:text-3xl font-display font-medium text-[#1C2230] tracking-tight">Receba pagamento</h3>
              </div>
              <div className="text-[#52525B] text-lg md:text-xl leading-relaxed max-w-[45ch] font-light">
                O dinheiro cai de forma segura e automática na sua conta cadastrada após a viagem. Sem dores de cabeça e sem cobranças ocultas.
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};
