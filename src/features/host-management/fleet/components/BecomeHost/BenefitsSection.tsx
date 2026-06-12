import React from 'react';
import { Settings, CalendarCheck, TrendingUp, Handshake } from 'lucide-react';
import { motion } from 'framer-motion';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: Settings,
      title: "Você no Controle",
      desc: "Defina o preço da diária, limite de quilometragem e regras de uso (ex: não fumar, sem pets). O carro é seu, as regras também."
    },
    {
      icon: CalendarCheck,
      title: "Flexibilidade Total",
      desc: "Bloqueie datas que você vai usar o carro. Alugue apenas nos dias em que ele ficaria parado na garagem."
    },
    {
      icon: TrendingUp,
      title: "Rentabilidade",
      desc: "Cubra custos como IPVA, seguro e manutenção. Muitos hosts pagam a própria parcela do financiamento alugando."
    },
    {
      icon: Handshake,
      title: "Suporte 24/7",
      desc: "Nossa equipe está sempre disponível para ajudar você e os locatários antes, durante e após a viagem."
    }
  ];

  return (
    <div className="py-24 bg-[#F8F9FB] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#1C2230] mb-4 tracking-tight"
          >
            Por que compartilhar na Cube Car?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#52525B]"
          >
            Construímos a plataforma pensando no seu conforto financeiro e tranquilidade.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 shadow-premium light-border-top hover:shadow-glow-hover transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F4F4F5] flex items-center justify-center text-[#3667AA] mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1C2230] mb-3">{benefit.title}</h3>
                <p className="text-[#52525B] leading-relaxed">
                  {benefit.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
