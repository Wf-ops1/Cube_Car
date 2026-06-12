import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface FinalCTAProps {
  onListCar: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onListCar }) => {
  return (
    <div className="pt-16 pb-32 md:pt-24 md:pb-24 bg-[#F8F9FB] relative z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-gradient rounded-3xl px-6 py-8 md:px-12 md:py-10 text-center relative overflow-hidden shadow-2xl">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#005A70]/40 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight"
            >
              Pronto para fazer seu carro trabalhar por você?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white/90 text-base md:text-lg mb-0 md:mb-8 max-w-2xl mx-auto"
            >
              O cadastro leva menos de 10 minutos. Junte-se à comunidade de hosts que mais cresce no Brasil.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={onListCar}
                className="hidden md:flex bg-white text-[#3667AA] hover:bg-gray-50 rounded-full px-10 py-5 font-bold text-lg transition-all shadow-glow hover:shadow-xl active:scale-[0.98] items-center justify-center gap-2 mx-auto group"
              >
                Começar agora
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="hidden md:block text-white/70 text-sm mt-4">Cadastro 100% gratuito. Sem compromisso.</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
