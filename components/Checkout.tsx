
import React, { useState, useEffect } from 'react';
import { X, MapPin, User, Truck, CreditCard, ChevronLeft, ChevronRight, ShieldCheck, AlertCircle, CheckCircle2, QrCode, Copy, Check, Info, Clock, Lock, Smartphone } from 'lucide-react';
import { CartItem } from '../types';
import { createPixCharge, extractPixData } from '../lib/fruitfy';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
}

interface ShippingOption {
  id: string;
  name: string;
  price: number;
  time: string;
}

const SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'free', name: 'Frete Grátis', price: 0, time: '5 a 7 dias úteis' },
  { id: 'pac', name: 'PAC', price: 18.72, time: '4 a 6 dias úteis' },
  { id: 'sedex', name: 'SEDEX', price: 26.91, time: '1 a 3 dias úteis' },
];

type CheckoutStage = 'filling' | 'processing' | 'pix_success' | 'card_error';

// --- Funções de máscara ---
const maskCpf = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const maskPhone = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits.replace(/(\d{0,2})/, '($1');
  if (digits.length <= 7) return digits.replace(/(\d{2})(\d{0,5})/, '($1) $2');
  return digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
};

const maskCep = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits.replace(/(\d{5})(\d{1,3})/, '$1-$2');
};

const maskCardNumber = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
};

const maskExpiry = (value: string): string => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.replace(/(\d{2})(\d{1,2})/, '$1/$2');
};

const maskCvv = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 4);
};

const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, items, subtotal }) => {
  const [stage, setStage] = useState<CheckoutStage>('filling');
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState({
    logradouro: '',
    bairro: '',
    localidade: '',
    uf: '',
    numero: '',
    complemento: ''
  });
  const [shippingId, setShippingId] = useState('free');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card'>('pix');
  const [isCepLoading, setIsCepLoading] = useState(false);
  const [isShippingVisible, setIsShippingVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [processMessage, setProcessMessage] = useState('Verificando estoque...');

  // Dados pessoais do formulário
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formCpf, setFormCpf] = useState('');
  const [formPhone, setFormPhone] = useState('');

  // Campos do cartão
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Dados do PIX retornados pela API Fruitfy
  const [pixData, setPixData] = useState<{
    qrCodeUrl: string | null;
    pixCode: string | null;
    chargeId: string | null;
    expiresAt: string | null;
  } | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const selectedShipping = SHIPPING_OPTIONS.find(s => s.id === shippingId)!;
  const total = subtotal + (isShippingVisible ? selectedShipping.price : 0);

  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsCepLoading(true);
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setAddress(prev => ({
              ...prev,
              logradouro: data.logradouro,
              bairro: data.bairro,
              localidade: data.localidade,
              uf: data.uf
            }));
            setIsShippingVisible(true);
          } else {
            setIsShippingVisible(false);
          }
          setIsCepLoading(false)
        })
        .catch(() => {
          setIsCepLoading(false);
          setIsShippingVisible(false);
        });
    } else {
      setIsShippingVisible(false);
    }
  }, [cep]);

  const handleFinalize = async (forcePixMethod?: boolean) => {
    const method = forcePixMethod ? 'pix' : paymentMethod;

    // Fluxo de cartão (simulado - erro proposital para redirecionar ao PIX)
    if (method === 'card') {
      setApiError(null);
      setStage('processing');
      setProcessMessage('Verificando estoque disponível...');
      setTimeout(() => setProcessMessage('Processando pagamento...'), 1000);
      setTimeout(() => setProcessMessage('Consultando operadora...'), 2000);
      setTimeout(() => setStage('card_error'), 3500);
      return;
    }

    // Validação dos campos obrigatórios (apenas para PIX, que chama a API real)
    const cleanCpf = formCpf.replace(/\D/g, '');
    const cleanPhone = formPhone.replace(/\D/g, '');

    if (!formName.trim()) {
      setApiError('Preencha o nome completo.');
      return;
    }
    if (!formEmail.trim() || !formEmail.includes('@')) {
      setApiError('Preencha um e-mail válido.');
      return;
    }
    if (cleanCpf.length !== 11) {
      setApiError('CPF deve conter 11 dígitos.');
      return;
    }
    if (cleanPhone.length < 10) {
      setApiError('Telefone inválido. Inclua DDD + número.');
      return;
    }

    setApiError(null);
    setStage('processing');
    setProcessMessage('Verificando estoque disponível...');

    // Fluxo PIX - Integração real com Fruitfy
    setTimeout(() => setProcessMessage('Gerando seu PIX exclusivo...'), 1000);
    setTimeout(() => setProcessMessage('Preparando QR Code...'), 2000);

    try {
      const amountInCents = Math.round(total * 100);
      const productId = process.env.FRUITFY_PRODUCT_ID || '';

      const response = await createPixCharge({
        name: formName.trim(),
        email: formEmail.trim(),
        phone: cleanPhone,
        cpf: cleanCpf,
        amount: amountInCents,
        productId,
      });

      if (response.success && response.data) {
        const extracted = extractPixData(response.data);
        setPixData(extracted);
        setStage('pix_success');
      } else {
        // Exibir erros de validação da API
        let errorMsg = response.message || 'Erro ao gerar o PIX. Tente novamente.';
        if (response.errors) {
          const errorDetails = Object.entries(response.errors)
            .map(([field, msgs]) => `${field}: ${(msgs as string[]).join(', ')}`)
            .join('; ');
          errorMsg += ` (${errorDetails})`;
        }
        setApiError(errorMsg);
        setStage('filling');
      }
    } catch (error) {
      console.error('[Fruitfy] Erro na requisição:', error);
      setApiError('Erro de conexão com o servidor de pagamento. Verifique sua internet e tente novamente.');
      setStage('filling');
    }
  };

  const handleCopyPix = () => {
    const code = pixData?.pixCode || '';
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  // --- TELAS DE RESULTADO ---

  if (stage === 'processing') {
    return (
      <div className="fixed inset-0 z-[150] bg-[#7a0019] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="relative mb-8">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-[#ffcc00]/20 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-16 h-16 md:w-20 md:h-20 border-4 border-[#ffcc00] border-t-transparent rounded-full animate-spin"></div>
        </div>
        <img src="https://i.ibb.co/fdF8mTrB/panini-logo-01.png" alt="Panini" className="h-8 md:h-12 mb-6 opacity-40 grayscale" />
        <h2 className="text-xl md:text-3xl font-black text-[#ffcc00] italic uppercase tracking-widest leading-tight">{processMessage}</h2>
        <p className="text-white/50 text-[10px] md:text-sm mt-6 font-bold uppercase tracking-widest flex items-center gap-2">
          <Lock className="w-3.5 h-3.5" /> Conexão Segura Ativa
        </p>
      </div>
    );
  }

  if (stage === 'pix_success') {
    // Determinar URL do QR Code: se a API retornou uma URL, usar. Senão, gerar a partir do código PIX.
    const qrImageUrl = pixData?.qrCodeUrl
      ? pixData.qrCodeUrl
      : pixData?.pixCode
        ? `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixData.pixCode)}`
        : null;

    return (
      <div className="fixed inset-0 z-[110] bg-white overflow-y-auto antialiased pb-20 animate-in slide-in-from-bottom duration-500">
        <div className="bg-[#7a0019] text-white pt-10 pb-12 px-6 text-center shadow-xl">
          <div className="w-16 h-16 md:w-20 md:h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-900/40">
            <Check className="w-8 h-8 md:w-12 md:h-12 text-white" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black italic uppercase mb-1">Quase lá!</h2>
          <p className="text-[#ffcc00] font-bold uppercase tracking-widest text-[10px] md:text-xs">Sua reserva expira em 15:00 minutos</p>
        </div>

        <div className="max-w-xl mx-auto px-4 -mt-6">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-10 text-center shadow-2xl">
            <p className="text-gray-900 font-black uppercase text-[10px] md:text-xs mb-6 tracking-widest italic">Aproxime a câmera do QR Code:</p>
            
            <div className="bg-gray-50 p-4 inline-block rounded-3xl border border-gray-100 mb-8">
              {qrImageUrl ? (
                <img 
                  src={qrImageUrl}
                  alt="QR Code PIX" 
                  className="w-48 h-48 md:w-64 md:h-64 mix-blend-multiply"
                />
              ) : (
                <div className="w-48 h-48 md:w-64 md:h-64 flex items-center justify-center bg-gray-100 rounded-2xl">
                  <QrCode className="w-20 h-20 text-gray-300" />
                </div>
              )}
            </div>

            {pixData?.pixCode && (
              <div className="space-y-4">
                <p className="text-gray-400 font-bold text-[9px] md:text-[10px] uppercase tracking-widest">Código Copia e Cola:</p>
                <div className="relative">
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-3.5 rounded-2xl text-[9px] md:text-[11px] font-mono break-all text-gray-500 text-left pr-12 leading-relaxed">
                    {pixData.pixCode}
                  </div>
                  <button 
                    onClick={handleCopyPix}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#7a0019] text-[#ffcc00] p-2.5 rounded-xl active:scale-90 transition-all shadow-lg"
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copied && <p className="text-emerald-600 font-black text-[10px] uppercase">Copiado com sucesso!</p>}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-[#7a0019] font-black text-lg md:text-xl italic">
                R$ {total.toFixed(2).replace('.', ',')}
              </p>
              <p className="text-gray-400 text-[9px] uppercase font-bold tracking-widest mt-1">Valor do PIX</p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
             <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex gap-4">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black shadow-lg shadow-blue-200">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-blue-900 font-black text-xs md:text-sm uppercase italic">Como pagar via Copia e Cola?</p>
                  <ol className="mt-3 space-y-3 text-[11px] md:text-[13px] text-blue-800 font-semibold list-decimal list-inside leading-snug">
                    <li>Clique no botão <span className="font-black">copiar</span> acima</li>
                    <li>Abra o aplicativo do seu <span className="font-black underline">banco preferido</span></li>
                    <li>Escolha a opção <span className="font-black">PIX</span> e depois <span className="font-black underline">PIX Copia e Cola</span></li>
                    <li>Cole o código, confira o valor e <span className="font-black">confirme o pagamento</span></li>
                  </ol>
                </div>
             </div>

             <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <p className="text-[10px] md:text-[12px] text-emerald-800 font-black italic uppercase leading-none">Aprovação instantânea • Prioridade no Envio</p>
             </div>

             <button 
               onClick={() => { setStage('filling'); setPixData(null); onClose(); }}
               className="text-[10px] md:text-xs text-gray-400 font-black uppercase tracking-widest hover:text-gray-600 transition-colors w-full text-center"
             >
               Fechar e acompanhar por e-mail
             </button>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'card_error') {
    return (
      <div className="fixed inset-0 z-[110] bg-white overflow-y-auto antialiased pb-20 animate-in slide-in-from-bottom duration-500">
        <div className="bg-red-700 text-white pt-12 pb-14 px-6 text-center shadow-xl">
          <div className="w-16 h-16 md:w-24 md:h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-md">
            <AlertCircle className="w-10 h-10 md:w-14 md:h-14 text-white" />
          </div>
          <h2 className="text-2xl md:text-5xl font-black italic uppercase mb-2 leading-tight">Pagamento Recusado 🚩</h2>
          <p className="text-white/70 font-bold uppercase tracking-widest text-[10px] md:text-sm">Transação bloqueada pelo banco</p>
        </div>

        <div className="max-w-2xl mx-auto px-4 -mt-8">
          <div className="bg-white border border-gray-100 rounded-[2.5rem] p-6 md:p-12 text-center shadow-2xl">
            <div className="mb-10 text-left">
              <h3 className="text-gray-900 font-black uppercase text-sm md:text-base mb-4 tracking-widest italic border-b pb-2">O QUE ACONTECEU?</h3>
              <p className="text-[11px] md:text-sm text-gray-500 leading-relaxed font-medium mb-4">
                O sistema de segurança do seu banco recusou a transação por precaução. Devido à altíssima demanda por este <span className="font-bold text-[#7a0019]">Kit de Pré-Venda Exclusivo</span>, o banco pode considerar a transação como "atípica".
              </p>
              <div className="flex items-center gap-2 text-red-600 font-black text-[10px] md:text-xs uppercase italic mb-4">
                <Clock className="w-4 h-4" /> ATENÇÃO: Sua reserva do Álbum Capa Dura expira em instantes.
              </div>
            </div>

            <div className="bg-red-50 rounded-3xl p-6 mb-10 border border-red-100">
              <p className="text-red-900 font-black text-[10px] md:text-xs uppercase italic mb-4">RESOLVA AGORA E GARANTA SEU LOTE:</p>
              <button 
                onClick={() => { setPaymentMethod('pix'); handleFinalize(true); }}
                className="w-full bg-[#7a0019] text-[#ffcc00] py-5 rounded-2xl font-black text-xs md:text-sm uppercase tracking-[0.1em] flex items-center justify-center gap-3 shadow-2xl shadow-red-900/20 hover:scale-[1.02] transition-all italic"
              >
                PAGAR COM PIX <ChevronRight className="w-5 h-5" />
              </button>
              <p className="text-red-700 text-[9px] md:text-[10px] font-bold mt-4 uppercase">
                O PIX garante sua unidade no <span className="underline">LOTE 01 DE PRIORIDADE</span>.
              </p>
            </div>

            <button 
              onClick={() => setStage('filling')}
              className="text-[9px] md:text-[11px] text-gray-400 font-black uppercase tracking-widest hover:text-gray-600 transition-colors underline underline-offset-4"
            >
              Tentar outro cartão ou corrigir dados
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- TELA DE PREENCHIMENTO ---

  const SummaryItems = () => (
    <div className="bg-slate-50/50 rounded-3xl p-5 md:p-6 border border-gray-100">
      <h3 className="text-[10px] md:text-xs font-black text-[#7a0019] uppercase tracking-widest mb-4 flex items-center gap-2 italic">
        <ShieldCheck className="w-4 h-4" /> Itens no Pedido
      </h3>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex gap-4 items-center">
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white border border-gray-200 overflow-hidden shrink-0 shadow-sm">
              <img src={item.image} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-[11px] md:text-sm text-gray-900 leading-tight truncate">{item.name}</p>
              <p className="text-[9px] md:text-[10px] text-gray-400 mt-0.5 italic line-clamp-1">{item.description}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[9px] font-bold text-gray-500 uppercase">{item.quantity}x</span>
                <span className="font-black text-[#7a0019] text-[10px] md:text-xs">R$ {(item.currentPrice * item.quantity).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PriceSummaryBlock = () => (
    <div className="bg-white rounded-[2rem] md:rounded-3xl p-6 md:p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
      <div className="space-y-3 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-medium text-[11px] md:text-sm">Subtotal</span>
          <span className="font-bold text-gray-900 text-[11px] md:text-sm">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-medium text-[11px] md:text-sm">Frete</span>
          {isShippingVisible ? (
            <span className={`font-black text-[11px] md:text-sm ${selectedShipping.price === 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {selectedShipping.price === 0 ? 'Grátis' : `R$ ${selectedShipping.price.toFixed(2).replace('.', ',')}`}
            </span>
          ) : (
            <span className="text-[10px] md:text-xs text-gray-400 italic">Insira o CEP</span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-end mb-8 pt-4 border-t border-gray-100">
        <span className="text-lg md:text-xl font-black text-[#7a0019] italic uppercase">TOTAL</span>
        <div className="text-right">
          <span className="text-2xl md:text-3xl font-black text-[#7a0019] italic leading-none">R$ {total.toFixed(2).replace('.', ',')}</span>
          <p className="text-[8px] md:text-[9px] text-gray-400 font-black uppercase tracking-widest mt-1">PRÉ-VENDA EXCLUSIVA</p>
        </div>
      </div>

      <button 
        onClick={() => handleFinalize()}
        className="w-full bg-[#7a0019] hover:bg-[#9b1b1b] text-[#ffcc00] py-4 rounded-full font-black text-[10px] md:text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-red-900/20 transition-all active:scale-[0.98] italic"
      >
        FINALIZAR COMPRA <ChevronRight className="w-5 h-5" />
      </button>

      <div className="mt-8 flex justify-center gap-6 md:gap-8 border-t border-gray-50 pt-6">
        <div className="flex items-center gap-2 text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-widest">
           <ShieldCheck className="w-3.5 h-3.5 text-green-500" /> SITE SEGURO
        </div>
        <div className="flex items-center gap-2 text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-widest">
           <Truck className="w-3.5 h-3.5 text-[#7a0019]" /> ENVIO PANINI
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[110] bg-white overflow-y-auto antialiased pb-10">
      {/* Header Fixo */}
      <div className="sticky top-0 z-30 bg-[#7a0019] border-b border-[#9b1b1b] px-4 py-3 md:py-4 shadow-xl">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={onClose} className="flex items-center gap-1 text-white font-black text-[9px] md:text-xs uppercase tracking-widest hover:text-[#ffcc00] transition-colors">
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" /> Voltar
          </button>
          <div className="flex items-center">
            <img src="https://i.ibb.co/fdF8mTrB/panini-logo-01.png" alt="Panini Logo" className="h-6 md:h-10 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#ffcc00] hidden xs:block" />
            <span className="text-[8px] md:text-[10px] font-black text-white/80 uppercase tracking-[0.2em]">Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-7 space-y-10">
          
          <SummaryItems />

          <div className="space-y-10">
            {/* Alerta de erro da API */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-800 font-bold text-xs">{apiError}</p>
                  <button onClick={() => setApiError(null)} className="text-red-500 text-[10px] font-bold uppercase mt-1 hover:underline">Fechar</button>
                </div>
              </div>
            )}

            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#7a0019] rounded-2xl flex items-center justify-center text-[#ffcc00] shrink-0"><User className="w-4 h-4 md:w-5 md:h-5" /></div>
                <h2 className="text-base md:text-lg font-black text-gray-900 italic uppercase tracking-tight">1. Dados Pessoais</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nome Completo" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm focus:ring-2 focus:ring-[#7a0019] outline-none" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input type="text" value={formCpf} onChange={(e) => setFormCpf(maskCpf(e.target.value))} placeholder="000.000.000-00" maxLength={14} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm focus:ring-2 focus:ring-[#7a0019] outline-none" />
                  <input type="tel" value={formPhone} onChange={(e) => setFormPhone(maskPhone(e.target.value))} placeholder="(00) 00000-0000" maxLength={15} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm focus:ring-2 focus:ring-[#7a0019] outline-none" />
                </div>
                <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="E-mail para receber o rastreio" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm focus:ring-2 focus:ring-[#7a0019] outline-none" />
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#7a0019] rounded-2xl flex items-center justify-center text-[#ffcc00] shrink-0"><MapPin className="w-4 h-4 md:w-5 md:h-5" /></div>
                <h2 className="text-base md:text-lg font-black text-gray-900 italic uppercase tracking-tight">2. Endereço de Entrega</h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="relative">
                  <input type="text" value={cep} onChange={(e) => setCep(maskCep(e.target.value))} placeholder="00000-000" maxLength={9} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm" />
                  {isCepLoading && <div className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin rounded-full h-3 w-3 border-2 border-[#7a0019] border-t-transparent" />}
                </div>
                <input type="text" readOnly value={address.logradouro} placeholder="Rua / Avenida" className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-[11px] md:text-sm text-gray-500" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Número" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm" />
                  <input type="text" placeholder="Complemento (Opcional)" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm" />
                </div>
                <input type="text" placeholder="Bairro" value={address.bairro} readOnly className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-[11px] md:text-sm text-gray-500" />
                <div className="grid grid-cols-3 gap-3">
                  <input type="text" placeholder="Cidade" value={address.localidade} readOnly className="col-span-2 w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-[11px] md:text-sm text-gray-500" />
                  <input type="text" placeholder="UF" value={address.uf} readOnly className="w-full px-5 py-3.5 bg-gray-100 border border-gray-200 rounded-2xl text-[11px] md:text-sm text-gray-500" />
                </div>
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#7a0019] rounded-2xl flex items-center justify-center text-[#ffcc00] shrink-0"><Truck className="w-4 h-4 md:w-5 md:h-5" /></div>
                <h2 className="text-base md:text-lg font-black text-gray-900 italic uppercase tracking-tight">3. Envio</h2>
              </div>
              {!isShippingVisible ? (
                <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50 text-center">
                  <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-tight italic">Insira um CEP válido para calcular...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {SHIPPING_OPTIONS.map(option => (
                    <label key={option.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${shippingId === option.id ? 'border-[#7a0019] bg-[#7a0019]/5' : 'border-gray-100 bg-gray-50'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" checked={shippingId === option.id} onChange={() => setShippingId(option.id)} className="w-4 h-4 accent-[#7a0019]" />
                        <div>
                          <p className="font-bold text-gray-900 text-xs md:text-sm">{option.name}</p>
                          <p className="text-[9px] md:text-[10px] text-gray-500">{option.time}</p>
                        </div>
                      </div>
                      <span className="font-black text-[#7a0019] text-[11px] md:text-sm">{option.price === 0 ? 'Grátis' : `R$ ${option.price.toFixed(2).replace('.', ',')}`}</span>
                    </label>
                  ))}
                </div>
              )}
            </section>

            <section>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 md:w-9 md:h-9 bg-[#7a0019] rounded-2xl flex items-center justify-center text-[#ffcc00] shrink-0"><CreditCard className="w-4 h-4 md:w-5 md:h-5" /></div>
                <h2 className="text-base md:text-lg font-black text-gray-900 italic uppercase tracking-tight">4. Pagamento</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button onClick={() => setPaymentMethod('pix')} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'pix' ? 'border-[#7a0019] bg-[#7a0019]/5' : 'border-gray-100'}`}>
                  <QrCode className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="font-black text-[9px] md:text-[10px] uppercase">PIX</span>
                </button>
                <button onClick={() => setPaymentMethod('card')} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-[#7a0019] bg-[#7a0019]/5' : 'border-gray-100'}`}>
                  <CreditCard className="w-5 h-5 md:w-6 md:h-6" />
                  <span className="font-black text-[9px] md:text-[10px] uppercase">Cartão</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-4">
                  <input type="text" value={cardNumber} onChange={(e) => setCardNumber(maskCardNumber(e.target.value))} placeholder="0000 0000 0000 0000" maxLength={19} className="col-span-2 w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm focus:ring-2 focus:ring-[#7a0019] outline-none" />
                  <input type="text" value={cardName} onChange={(e) => setCardName(e.target.value.toUpperCase())} placeholder="Nome Impresso no Cartão" className="col-span-2 w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm focus:ring-2 focus:ring-[#7a0019] outline-none" />
                  <input type="text" value={cardExpiry} onChange={(e) => setCardExpiry(maskExpiry(e.target.value))} placeholder="MM/AA" maxLength={5} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm focus:ring-2 focus:ring-[#7a0019] outline-none" />
                  <input type="text" value={cardCvv} onChange={(e) => setCardCvv(maskCvv(e.target.value))} placeholder="CVV" maxLength={4} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm focus:ring-2 focus:ring-[#7a0019] outline-none" />
                  <div className="col-span-2">
                    <select className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] md:text-sm focus:ring-2 focus:ring-[#7a0019] outline-none appearance-none cursor-pointer">
                      <option value="1">1x de R$ {total.toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="2">2x de R$ {(total / 2).toFixed(2).replace('.', ',')} sem juros</option>
                      <option value="3">3x de R$ {(total / 3).toFixed(2).replace('.', ',')} sem juros</option>
                    </select>
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="bg-[#f8fbff] border border-[#e5efff] rounded-3xl p-5 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 items-center animate-in fade-in slide-in-from-top-4 duration-500 shadow-sm overflow-hidden relative">
                  {/* Decorative Background Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                  
                  {/* QR Preview Side */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="relative w-32 h-32 md:w-40 md:h-40 border-2 border-dashed border-[#d1e3ff] rounded-3xl flex items-center justify-center bg-white shadow-inner">
                      <div className="opacity-10 grayscale">
                          <QrCode className="w-20 h-20" />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-full shadow-2xl border border-[#f0f0f0] animate-pulse">
                              <Clock className="w-10 h-10 text-[#7a0019]" />
                          </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#d5a5b1] mt-3">PREVIEW DO QR CODE</span>
                  </div>

                  {/* Text Side */}
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 bg-[#7a0019] text-white px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-red-900/10">
                      <Info className="w-3.5 h-3.5" /> INFORMAÇÃO IMPORTANTE
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight uppercase tracking-tight italic">
                      SEU QR CODE EXCLUSIVO SERÁ <br className="hidden md:block"/>
                      <span className="text-[#d84a7e]">GERADO AGORA</span>
                    </h3>

                    <div className="mt-5 space-y-3">
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="w-6 h-6 bg-[#e8f5e9] rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-[10px] md:text-xs font-black text-slate-600 uppercase italic">APROVAÇÃO IMEDIATA VIA PIX</span>
                      </div>
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                        <div className="w-6 h-6 bg-[#e8f5e9] rounded-full flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <span className="text-[10px] md:text-xs font-black text-slate-600 uppercase italic">PRIORIDADE NO DESPACHO DO PEDIDO</span>
                      </div>
                    </div>

                    <p className="mt-6 text-[10px] md:text-[11px] text-slate-400 font-bold uppercase leading-relaxed max-w-sm">
                      AO CONFIRMAR, VOCÊ RECEBERÁ O CÓDIGO PARA PAGAR NO SEU BANCO. SEU TRATAMENTO SERÁ PREPARADO COM <span className="text-[#d84a7e] font-black underline">MÁXIMA URGÊNCIA</span>.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          <div className="lg:hidden mt-10">
            <PriceSummaryBlock />
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-5 relative">
          <div className="sticky top-28">
             <PriceSummaryBlock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
