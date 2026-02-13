
import React, { useState, useEffect } from 'react';

interface OfferCountdownProps {
  units: number;
}

const OfferCountdown: React.FC<OfferCountdownProps> = ({ units }) => {
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos em segundos

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-[#ffcc00] py-2 md:py-3 px-3 border-b border-[#ccaa00]">
      <div className="max-w-xl mx-auto flex flex-row items-stretch justify-center gap-2 md:gap-4">
        
        {/* Caixa 1: Cronômetro */}
        <div className="bg-[#7a0019] text-white px-2 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl flex flex-col items-center justify-center flex-1 md:flex-initial md:min-w-[150px] shadow-md border border-white/10">
          <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-tight opacity-90 text-center whitespace-nowrap">Oferta garantida por:</span>
          <span className="text-lg md:text-2xl font-black tabular-nums leading-none mt-0.5">{formatTime(timeLeft)}</span>
        </div>

        {/* Caixa 2: Unidades */}
        <div className="bg-[#7a0019] text-white px-2 py-1.5 md:px-5 md:py-2.5 rounded-lg md:rounded-xl flex flex-col items-center justify-center flex-1 md:flex-initial md:min-w-[150px] shadow-md border border-white/10">
          <span className="text-[7px] md:text-[10px] font-bold uppercase tracking-tight opacity-90 text-center whitespace-nowrap">Restam apenas:</span>
          <span className="text-lg md:text-2xl font-black uppercase tracking-tighter leading-none mt-0.5">{units} unidades</span>
        </div>

      </div>
    </div>
  );
};

export default OfferCountdown;
