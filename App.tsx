
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutAlbum from './components/AboutAlbum';
import Testimonials from './components/Testimonials';
import OfferCountdown from './components/OfferCountdown';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import { PRODUCTS } from './constants';
import { Product, CartItem } from './types';
import { Package, Book, Star } from 'lucide-react';

const App: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [unitsRemaining, setUnitsRemaining] = useState(118);

  // Lógica para diminuir as unidades a cada 3 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setUnitsRemaining(prev => (prev > 7 ? prev - 1 : prev));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const startCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const kits = PRODUCTS.filter(p => p.category === 'kit');
  const albums = PRODUCTS.filter(p => p.category === 'album');
  const packs = PRODUCTS.filter(p => p.category === 'packs');

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + (item.currentPrice * item.quantity), 0);

  return (
    <div className="min-h-screen flex flex-col bg-white selection:bg-[#ffcc00] selection:text-[#7a0019]">
      <Header cartCount={cartCount} onOpenCart={() => setIsCartOpen(true)} />
      <OfferCountdown units={unitsRemaining} />
      
      <main className="flex-grow">
        <Hero />

        <div className="max-w-7xl mx-auto md:px-4 py-8">
            
            {/* Título da Seção: Kits */}
            <div id="kits" className="px-4 py-4 bg-[#7a0019] text-[#ffcc00] flex items-center justify-between md:rounded-t-2xl">
               <div className="flex items-center gap-3">
                  <Star className="w-5 h-5 fill-current" />
                  <h2 className="text-sm md:text-lg font-black uppercase tracking-tighter">Kits em Destaque Panini 2026</h2>
               </div>
               <span className="text-[10px] font-bold underline">Ver todos</span>
            </div>
            
            <div className="flex flex-col border-x border-gray-100 shadow-sm">
              {kits.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                  isInCart={cart.some(item => item.id === product.id)}
                />
              ))}
            </div>

            {/* Seção: Álbuns */}
            <div id="album" className="mt-12 px-4 py-4 bg-[#ffcc00] text-[#7a0019] flex items-center justify-between md:rounded-t-2xl">
               <div className="flex items-center gap-3">
                  <Book className="w-5 h-5" />
                  <h2 className="text-sm md:text-lg font-black uppercase tracking-tighter">Álbuns Oficiais</h2>
               </div>
               <span className="text-[10px] font-bold underline">Troca Fácil</span>
            </div>
            <div className="flex flex-col border-x border-gray-100 shadow-sm">
              {albums.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                  isInCart={cart.some(item => item.id === product.id)}
                />
              ))}
            </div>

            {/* Seção: Pacotes */}
            <div id="packs" className="mt-12 px-4 py-4 bg-gray-900 text-white flex items-center justify-between md:rounded-t-2xl">
               <div className="flex items-center gap-3">
                  <Package className="w-5 h-5" />
                  <h2 className="text-sm md:text-lg font-black uppercase tracking-tighter">Pacotes Avulsos</h2>
               </div>
               <span className="text-[10px] font-bold underline">Lotes Limitados</span>
            </div>
            <div className="flex flex-col border-x border-gray-100 border-b shadow-sm md:rounded-b-2xl mb-20 overflow-hidden">
              {packs.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart}
                  isInCart={cart.some(item => item.id === product.id)}
                />
              ))}
            </div>

            {/* Seção Sobre o Álbum */}
            <AboutAlbum />
        </div>
        
        {/* Seção de Feedbacks */}
        <Testimonials />
      </main>

      <Footer />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQty={updateQuantity}
        onCheckout={startCheckout}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        subtotal={subtotal}
      />

      {/* Floating units remaining */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#7a0019] text-[#ffcc00] px-6 py-3 flex items-center justify-between shadow-[0_-10px_30px_rgba(0,0,0,0.3)] md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-[#ffcc00] flex items-center justify-center font-black text-xs animate-pulse">
            {unitsRemaining}
          </div>
          <span className="text-[10px] uppercase font-black leading-none">Unidades <br/> Restantes</span>
        </div>
        <button 
          onClick={() => {
            const el = document.getElementById('kits');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="bg-[#ffcc00] text-[#7a0019] px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-tighter shadow-xl"
        >
          GARANTIR MEU ÁLBUM
        </button>
      </div>
    </div>
  );
};

export default App;
