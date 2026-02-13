
import React from 'react';
import { ShoppingCart, Menu, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onOpenCart }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#7a0019] border-b border-[#9b1b1b] shadow-xl h-16 md:h-20">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between relative">
        
        {/* Lado Esquerdo: Menu e Badge Opcional */}
        <div className="flex items-center gap-4 z-10">
          <button className="lg:hidden text-[#ffcc00] p-1 active:scale-90 transition-transform">
            <Menu className="w-7 h-7" />
          </button>
          <div className="hidden md:flex items-center gap-2 text-[10px] font-black text-[#ffcc00] border border-[#ffcc00]/30 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" />
            LOJA OFICIAL
          </div>
        </div>

        {/* Centro: Logo Panini (Ajustada para preencher harmoniosamente o header) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <a href="/" className="pointer-events-auto active:scale-95 transition-transform flex items-center h-full">
            <img 
              src="https://i.ibb.co/fdF8mTrB/panini-logo-01.png" 
              alt="Panini Logo" 
              className="h-[70%] md:h-[80%] w-auto object-contain py-1"
            />
          </a>
        </div>

        {/* Lado Direito: Carrinho e Nav */}
        <div className="flex items-center gap-3 md:gap-6 z-10">
          <nav className="hidden lg:flex items-center gap-8 text-[11px] font-black text-white uppercase tracking-[0.2em]">
            <a href="#kits" className="hover:text-[#ffcc00] transition-colors">KITS</a>
            <a href="#album" className="hover:text-[#ffcc00] transition-colors">ÁLBUNS</a>
          </nav>
          
          <button 
            onClick={onOpenCart}
            className="relative p-2 text-white hover:text-[#ffcc00] transition-all active:scale-90"
          >
            <ShoppingCart className="w-7 h-7 md:w-8 md:h-8" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#ffcc00] text-[#7a0019] text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#7a0019] shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
