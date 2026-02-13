
import React from 'react';
import { X, ShoppingBag, Trash2, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onUpdateQty,
  onCheckout 
}) => {
  const subtotal = items.reduce((acc, item) => acc + (item.currentPrice * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-[#7a0019]/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col animate-[slideIn_0.4s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="px-6 py-6 md:py-8 border-b border-gray-100 flex items-center justify-between bg-[#7a0019] text-white">
          <div className="flex items-center gap-4">
            <div className="bg-[#ffcc00] p-2 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-[#7a0019]" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight italic">Meu Carrinho</h2>
              <p className="text-[10px] text-[#ffcc00] font-bold uppercase tracking-widest leading-none">Panini Store 2026</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <X className="w-7 h-7" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-8">
              <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center mb-6 rotate-12">
                <ShoppingBag className="w-12 h-12 text-gray-200" />
              </div>
              <p className="text-gray-900 font-black text-xl italic uppercase">Seu carrinho está vazio</p>
              <p className="text-gray-400 text-sm mt-2">Adicione álbuns e figurinhas para começar sua coleção da Copa!</p>
              <button 
                onClick={onClose}
                className="mt-8 bg-[#7a0019] text-[#ffcc00] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-red-900/10 active:scale-95 transition-transform"
              >
                VER PRODUTOS
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-5 group items-start">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-50 rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col h-full justify-center">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-black text-[#7a0019] italic leading-tight text-lg">{item.name}</h3>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-gray-300 hover:text-red-600 transition-colors p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{item.category}</p>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <div className="flex items-center bg-gray-50 rounded-xl overflow-hidden h-9 border border-gray-200">
                      <button 
                        onClick={() => onUpdateQty(item.id, -1)}
                        className="px-3 h-full hover:bg-white text-[#7a0019] font-black transition-colors"
                      >
                        -
                      </button>
                      <span className="w-10 flex items-center justify-center text-xs font-black text-gray-700">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, 1)}
                        className="px-3 h-full hover:bg-white text-[#7a0019] font-black transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right">
                       <span className="block text-[#7a0019] font-black text-lg italic">R$ {(item.currentPrice * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-8 bg-slate-50 border-t border-gray-100 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
            <div className="space-y-3 mb-6 px-2">
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Subtotal</span>
                <span className="font-black text-[#7a0019]">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Frete Especial 2026</span>
                <span className="text-green-600 font-black uppercase text-xs tracking-tighter bg-green-50 px-2 py-0.5 rounded border border-green-100 italic">GRÁTIS HOJE</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-8 pt-6 border-t border-gray-200">
              <span className="text-xl font-black text-[#7a0019] italic uppercase">Total</span>
              <div className="text-right">
                <span className="text-3xl font-black text-[#7a0019] italic leading-none">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Até 12x de R$ {(subtotal / 12).toFixed(2).replace('.', ',')}</p>
              </div>
            </div>

            <button 
              onClick={onCheckout}
              className="group w-full bg-[#7a0019] hover:bg-[#9b1b1b] text-[#ffcc00] py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-red-900/30 transition-all active:scale-[0.98] italic"
            >
              FINALIZAR PEDIDO <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 text-[9px] text-gray-400 font-black uppercase tracking-widest leading-tight">
                <div className="bg-green-100 p-2 rounded-lg"><ShieldCheck className="w-5 h-5 text-green-600" /></div> 
                Compra 100% Segura
              </div>
              <div className="flex items-center gap-3 text-[9px] text-gray-400 font-black uppercase tracking-widest leading-tight">
                <div className="bg-blue-100 p-2 rounded-lg"><CreditCard className="w-5 h-5 text-blue-600" /></div>
                Parcelado no Cartão
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default CartDrawer;
