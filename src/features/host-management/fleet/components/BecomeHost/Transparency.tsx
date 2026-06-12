import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Transparency: React.FC = () => {
  const points = [
    "Cadastro 100% gratuito, sem taxas mensais",
    "Você fica com 75% a 85% do valor da diária",
    "Taxa de serviço cobrada apenas quando você aluga",
    "Sem exclusividade: saia da plataforma quando quiser"
  ];

  return (
    <div className="py-16 bg-[#FAFAFA] border-y border-gray-100 relative z-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-panel p-8 md:p-10 rounded-[2rem] border border-gray-200 shadow-sm"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#1C2230] mb-2">Transparência total</h3>
            <p className="text-[#52525B]">Nós só ganhamos quando você ganha. Simples assim.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {points.map((point, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-[#1C2230] font-medium">{point}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
