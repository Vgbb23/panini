
import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section className="relative bg-white pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Elementos decorativos sutis */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-[#7a0019] blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-64 h-64 rounded-full bg-[#ffcc00] blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
        
        {/* Badge de Status Oficial */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7a0019]" />
          Lote de Pré-Venda Confirmado
        </div>

        {/* Título Principal - Ajustado para caber em 2 linhas */}
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#1a1a1a] leading-tight tracking-tight max-w-3xl">
          Álbum Oficial <span className="text-[#7a0019]">Copa do Mundo 2026</span> Panini
        </h1>

        {/* Banner Image */}
        <div className="mt-8 mb-4 w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl shadow-[#7a0019]/10 border border-slate-100">
          <img 
            src="https://i.ibb.co/C5HbDtrp/gkpb-banner-album-copa-do-mundo-2026.webp" 
            alt="Banner Oficial Copa do Mundo 2026" 
            className="w-full h-auto object-cover transform hover:scale-[1.02] transition-transform duration-700"
          />
        </div>
        
        <p className="mt-6 text-base md:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed">
          O maior evento do futebol mundial está chegando. Garanta agora seu álbum de capa dura com kits exclusivos de figurinhas originais e complete sua coleção antes de todo mundo.
        </p>
      </div>
    </section>
  );
};

export default Hero;
