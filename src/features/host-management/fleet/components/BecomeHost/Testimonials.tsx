import React from 'react';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

export const Testimonials: React.FC = () => {
  const testimonials = [
    {
      name: "Ricardo S.",
      car: "Jeep Compass 2023",
      text: "Comprei o carro financiado e as locações pagam 100% da parcela. O processo é super seguro e a equipe sempre tira minhas dúvidas na hora.",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    {
      name: "Mariana L.",
      car: "Porsche Macan 2022",
      text: "Tinha muito receio de colocar meu carro de luxo, mas a checagem rigorosa de perfil me deu tranquilidade. Hoje tiro uma ótima renda extra.",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704c"
    }
  ];

  return (
    <div className="py-12 md:py-16 bg-white relative z-10 border-t border-gray-100 overflow-hidden">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#3667AA]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10 md:mb-12 max-w-2xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#1C2230] mb-4 tracking-tight"
          >
            Histórias de sucesso
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#52525B]"
          >
            Junte-se a centenas de proprietários que já transformaram seus veículos em ativos lucrativos.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-[#FAFAFA] rounded-2xl p-8 border border-gray-100 relative"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-[#E4E4E7] opacity-50" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              
              <p className="text-[#1C2230] text-lg font-medium leading-relaxed mb-8 relative z-10">
                "{testimonial.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-[#1C2230]">{testimonial.name}</h4>
                  <p className="text-sm text-[#71717A]">Host — {testimonial.car}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
