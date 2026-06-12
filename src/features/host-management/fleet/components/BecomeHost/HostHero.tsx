import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface HostHeroProps {
  onListCar: () => void;
}

export const HostHero: React.FC<HostHeroProps> = ({ onListCar }) => {
  const [days, setDays] = useState(15);
  const PRICE_PER_DAY = 80;
  const totalEarnings = days * PRICE_PER_DAY;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-0 mb-16 md:mb-24 relative z-20">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20 min-h-[500px]">
        
        {/* Left Content: Text & Simulator */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium text-[#1C2230] leading-[1.1] mb-6 tracking-tight">
              Transforme seu carro em até <span className="text-[#3667AA]">R$ 1.200</span> por mês
            </h1>
            
            <p className="text-lg md:text-xl text-[#52525B] leading-relaxed mb-10 max-w-lg font-light">
              Ganhe renda extra com segurança. Seguro 100% incluso para todas as locações, e o melhor: você tem controle total sobre as regras e a disponibilidade.
            </p>

            {/* Elegant Simulator */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-10 max-w-md">
              <div className="flex justify-between items-end mb-8">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium mb-1">Se você alugar por</span>
                  <span className="text-2xl font-bold text-[#1C2230]">{days} dias</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-sm text-gray-500 font-medium mb-1">Ganhos potenciais</span>
                  <span className="text-3xl font-display font-medium text-emerald-500 tracking-tight">R$ {totalEarnings}</span>
                </div>
              </div>
              
              <div className="relative w-full h-2 bg-gray-100 rounded-full">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#3667AA] rounded-full transition-all duration-300"
                  style={{ width: `${(days / 30) * 100}%` }}
                />
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="1"
                  value={days}
                  onChange={(e) => setDays(parseInt(e.target.value))}
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                />
                {/* Custom slider thumb */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-2 border-[#3667AA] rounded-full shadow-md pointer-events-none transition-transform"
                  style={{ left: `calc(${(days / 30) * 100}% - 12px)` }}
                />
              </div>
            </div>

            <button
              onClick={onListCar}
              className="w-full sm:w-auto bg-[#1C2230] hover:bg-[#2A3347] text-white rounded-full px-10 py-4 font-medium text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              Quero anunciar meu carro
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        {/* Right Content: Framed Image */}
        <div className="w-full lg:w-1/2 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-300/50"
          >
            <img 
              src="/images/hero-keys.jpg" 
              alt="Entrega de chaves" 
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

      </div>
    </div>
  );
};
