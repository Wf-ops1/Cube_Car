import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const HostFAQ: React.FC = () => {
  const faqs = [
    {
      q: "E se o motorista bater o meu carro?",
      a: "Você está 100% coberto. Nossa apólice parceira cobre colisões, roubo, furto e danos a terceiros durante o período de locação, sem nenhum custo ou franquia para você."
    },
    {
      q: "Quem pode alugar meu carro?",
      a: "Apenas motoristas pré-aprovados pela Cube Car. Realizamos verificações rigorosas de identidade, CNH, antecedentes criminais e histórico de direção antes de liberar o cadastro na plataforma."
    },
    {
      q: "Como e quando eu recebo?",
      a: "Os pagamentos são processados e liberados automaticamente na sua carteira virtual 24 horas após o término bem-sucedido da reserva. Você pode transferir para sua conta bancária a qualquer momento."
    },
    {
      q: "Posso cancelar uma reserva?",
      a: "Sim, como host você tem a liberdade de aceitar ou recusar solicitações. Caso precise cancelar uma reserva já confirmada, é possível, mas pedimos que o faça com antecedência para não prejudicar a experiência do motorista."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="py-12 md:py-16 bg-white relative z-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1C2230] mb-4">Perguntas Frequentes</h2>
          <p className="text-[#52525B]">Tudo que você precisa saber antes de se tornar um host.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left bg-white hover:bg-[#F8F9FB] transition-colors"
              >
                <span className="font-bold text-[#1C2230] text-lg pr-4">{faq.q}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-[#3667AA] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#A1A1AA] shrink-0" />
                )}
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="p-6 pt-0 text-[#52525B] leading-relaxed border-t border-gray-100 mt-2 bg-[#F8F9FB]">
                      <div className="pt-4">{faq.a}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
