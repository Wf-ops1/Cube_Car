import React from 'react';
import { ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const ProtectionSection: React.FC = () => {
  return (
    <div className="py-12 md:py-16 bg-white relative z-10 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 bg-[#F4F4F5] text-[#3667AA] px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Segurança em 1º Lugar</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1C2230] mb-6 tracking-tight leading-tight">
              Seu carro protegido de para-choque a para-choque.
            </h2>
            <p className="text-lg text-[#52525B] mb-8">
              A objeção número um dos novos hosts é o medo. Nós resolvemos isso assumindo a responsabilidade durante toda a locação.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1C2230] text-lg">Seguro Completo Incluso</h4>
                  <p className="text-[#52525B]">Roubo, furto, colisão e terceiros. Você não precisa acionar o seu seguro pessoal.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#3667AA] shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-[#1C2230] text-lg">Motoristas Rigorosamente Verificados</h4>
                  <p className="text-[#52525B]">Checagem de antecedentes, CNH válida e score de crédito antes de qualquer reserva.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:w-1/2 w-full"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1000&q=80" 
                alt="Proteção Cube Car" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="glass-panel p-6 rounded-2xl border-white/20">
                  <div className="flex items-center gap-4 mb-2">
                    <ShieldCheck className="w-8 h-8 text-emerald-400" />
                    <span className="text-white font-bold text-xl">Apólice Automática</span>
                  </div>
                  <p className="text-slate-200">
                    Sua cobertura inicia no exato minuto do check-in e encerra no check-out. Sem apólices extras.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
