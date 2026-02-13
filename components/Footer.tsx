
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-12 px-4 mb-20 md:mb-0">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Logos */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <img 
            src="https://i.ibb.co/fdF8mTrB/panini-logo-01.png" 
            alt="Panini Logo" 
            className="h-8 md:h-10 w-auto object-contain"
          />
        </div>

        {/* Copyright and Legal */}
        <div className="space-y-2 mb-6">
          <p className="text-sm md:text-base text-gray-500 font-medium">
            © 2026 Loja Panini Oficial. Todos os direitos reservados.
          </p>
          <p className="text-xs md:text-sm text-gray-400">
            FIFA World Cup 2026™ e uma marca registrada da FIFA.
          </p>
        </div>

        {/* Policy Links */}
        <div className="flex flex-wrap justify-center items-center gap-3 text-sm md:text-base text-gray-500 font-medium mb-6">
          <a href="#" className="hover:text-[#7a0019] transition-colors">Politica de Privacidade</a>
          <span className="text-gray-200 hidden md:inline">|</span>
          <a href="#" className="hover:text-[#7a0019] transition-colors">Termos de Uso</a>
          <span className="text-gray-200 hidden md:inline">|</span>
          <a href="#" className="hover:text-[#7a0019] transition-colors">Politica de Reembolso</a>
        </div>

        {/* Contact Email */}
        <div>
          <a 
            href="mailto:contato@paninibrasil.com" 
            className="text-sm md:text-base text-gray-400 hover:text-[#7a0019] transition-colors font-medium"
          >
            contato@paninibrasil.com
          </a>
        </div>
        
      </div>
    </footer>
  );
};

export default Footer;
