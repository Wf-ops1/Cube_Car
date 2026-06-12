import React from 'react';
import Logo from '@/shared/components/ui/Logo';

interface FooterProps {
  onHowItWorksClick?: () => void;
  onHelpCenterClick?: () => void; // New Prop
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ onHowItWorksClick, onHelpCenterClick, className = '' }) => {
  return (
    <footer className={`relative z-10 pt-12 pb-8 bg-footer-gradient border-t border-white/50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-display font-bold text-[#181824] mb-4">Plataforma</h4>
            <ul className="space-y-2 text-sm text-[#484848]">
              <li>
                <button onClick={onHowItWorksClick} className="hover:text-[#3667AA] transition-colors text-left">
                  Como funciona
                </button>
              </li>
              <li><a href="#" className="hover:text-[#3667AA] transition-colors">Preços</a></li>
              <li><a href="#" className="hover:text-[#3667AA] transition-colors">Confiança e Segurança</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-[#181824] mb-4">Empresa</h4>
            <ul className="space-y-2 text-sm text-[#484848]">
              <li><a href="#" className="hover:text-[#3667AA] transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-[#3667AA] transition-colors">Carreiras</a></li>
              <li><a href="#" className="hover:text-[#3667AA] transition-colors">Imprensa</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-[#181824] mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-[#484848]">
              <li>
                <button onClick={onHelpCenterClick} className="hover:text-[#3667AA] transition-colors text-left">
                  Central de Ajuda
                </button>
              </li>
              <li><a href="#" className="hover:text-[#3667AA] transition-colors">Opções de Cancelamento</a></li>
              <li><a href="#" className="hover:text-[#3667AA] transition-colors">Seguros</a></li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo className="h-8 w-auto text-[#3667AA]" />
              {/* Text removed */}
            </div>
            <p className="text-sm text-[#484848] mb-4 leading-relaxed">
              A maneira moderna de compartilhar carros, impulsionada por IA e comunidade.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-200/50 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-[#484848]">© 2024 Cube Car. Todos os direitos reservados.</p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-gray-400">
            <i className="fab fa-twitter cursor-pointer hover:text-[#3667AA] transition-colors"></i>
            <i className="fab fa-instagram cursor-pointer hover:text-[#3667AA] transition-colors"></i>
            <i className="fab fa-linkedin cursor-pointer hover:text-[#3667AA] transition-colors"></i>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;