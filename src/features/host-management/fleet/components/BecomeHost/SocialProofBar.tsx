import React from 'react';
import { Car, Star, Wallet, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const SocialProofBar: React.FC = () => {
  const stats = [
    { icon: Car, value: '500+', label: 'Carros cadastrados' },
    { icon: Star, value: '98%', label: 'Satisfação dos hosts' },
    { icon: Wallet, value: 'R$ 2M+', label: 'Ganhos gerados' },
    { icon: MapPin, value: '25+', label: 'Cidades atendidas' },
  ];

  return (
    <div className="w-full bg-[#FAFAFA] border-y border-gray-100 py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-full bg-[#F4F4F5] flex items-center justify-center text-[#52525B] mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-2xl font-bold text-[#1C2230] mb-1">{stat.value}</h4>
                <p className="text-sm text-[#71717A] font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
