
import React from 'react';
import { Product } from '../types';
import { ShoppingCart, Check, Star, Zap, Truck } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  isInCart: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, isInCart }) => {
  const discount = Math.round(((product.oldPrice - product.currentPrice) / product.oldPrice) * 100);

  return (
    <div className={`group relative bg-white border-b border-gray-100 p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-8 hover:bg-slate-50 transition-colors ${product.highlight ? 'bg-yellow-50/20' : ''}`}>
      
      {/* Imagem do Produto */}
      <div className="relative w-full md:w-48 aspect-square md:aspect-square shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.highlight && (
          <div className="absolute top-2 left-2 bg-[#7a0019] text-[#ffcc00] text-[10px] font-black px-2 py-1 uppercase tracking-tighter rounded shadow-sm">
            MAIS VENDIDO
          </div>
        )}
        <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-md">
          -{discount}%
        </div>
      </div>

      {/* Detalhes do Produto */}
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row md:justify-between items-start gap-1">
          <div>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{product.category}</span>
             <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight group-hover:text-[#7a0019] transition-colors">{product.name}</h3>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 md:mt-0">
            <div className="flex text-[#ffcc00]">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>
            <span className="text-[11px] font-bold text-blue-600">(4.8/5)</span>
          </div>
        </div>

        <p className="mt-2 text-sm text-gray-600 font-medium leading-relaxed">{product.description}</p>

        {/* Badges de Promoção */}
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="bg-[#7a0019] text-white text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
             <Zap className="w-3 h-3 fill-[#ffcc00]" /> Menor preço em 30 dias
          </div>
          <div className="bg-[#ffcc00] text-[#7a0019] text-[10px] font-black px-2 py-1 rounded-md">
             PRÉ-VENDA 2026
          </div>
        </div>

        {/* Área de Preço */}
        <div className="mt-5 flex flex-col">
          <div className="flex items-baseline gap-2">
            <div className="flex items-start text-[#7a0019]">
              <span className="text-sm font-bold mt-1">R$</span>
              <span className="text-3xl md:text-4xl font-black tracking-tighter leading-none italic">
                {product.currentPrice.toFixed(2).split('.')[0]}
                <sup className="text-lg ml-0.5">{product.currentPrice.toFixed(2).split('.')[1]}</sup>
              </span>
            </div>
            <span className="text-sm text-gray-400 line-through font-medium">De: R$ {product.oldPrice.toFixed(2).replace('.', ',')}</span>
          </div>
          <p className="text-xs text-gray-500 font-semibold mt-1">
            em até 12x de <span className="text-gray-900">R$ {(product.currentPrice / 12).toFixed(2).replace('.', ',')}</span> sem juros
          </p>
        </div>

        {/* Entrega e Botão */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-600 font-bold">
            <Truck className="w-4 h-4 text-green-600" />
            <span>Entrega GRÁTIS Panini: <span className="text-gray-900 font-black">de 5 a 7 dias.</span></span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            disabled={isInCart}
            className={`w-full md:w-auto min-w-[220px] flex items-center justify-center gap-3 py-4 md:py-3 px-8 rounded-full font-black text-xs uppercase tracking-[0.1em] transition-all duration-300 shadow-md active:scale-95 ${
              isInCart 
                ? 'bg-green-100 text-green-700 cursor-default border-2 border-green-200' 
                : 'bg-[#ffcc00] text-[#7a0019] hover:bg-[#e6b800] border-b-4 border-[#ccaa00] active:border-b-0 active:translate-y-[2px]'
            }`}
          >
            {isInCart ? (
              <>
                <Check className="w-5 h-5" /> NO CARRINHO
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" /> Adicionar ao carrinho
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
