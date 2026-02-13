
import React from 'react';
import { Star, CheckCircle2, User } from 'lucide-react';

interface TestimonialProps {
  name: string;
  location: string;
  title: string;
  text: string;
  time: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ name, location, title, text, time }) => (
  <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
        <User className="w-6 h-6 md:w-7 md:h-7" />
      </div>
      <div>
        <h4 className="font-bold text-gray-900 leading-tight">{name}</h4>
        <p className="text-xs text-gray-400 font-medium">{location}</p>
      </div>
    </div>
    
    <h5 className="font-bold text-gray-900 mb-1">{title}</h5>
    <div className="flex text-amber-400 gap-0.5 mb-4">
      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
    </div>
    
    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
      {text}
    </p>
    
    <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">
      <CheckCircle2 className="w-3.5 h-3.5" />
      <span>Compra verificada</span>
      <span className="text-gray-300 mx-1">•</span>
      <span className="text-gray-400 lowercase">{time}</span>
    </div>
  </div>
);

const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: "Carlos Silva",
      location: "São Paulo, SP",
      title: "Produto de qualidade!",
      text: "Comprei na pré-venda da Copa passada e foi incrível. Chegou antes do lançamento e comecei a coleção antes de todo mundo. Super recomendo!",
      time: "1 mês atrás"
    },
    {
      name: "Mariana Oliveira",
      location: "Rio de Janeiro, RJ",
      title: "Capa dura impecável",
      text: "A qualidade da capa dura da Panini é de outro nível. O brilho dos detalhes em dourado é lindo. Já garanti meu kit de 90 pacotes!",
      time: "2 semanas atrás"
    },
    {
      name: "Ricardo Mendes",
      location: "Belo Horizonte, MG",
      title: "Entrega muito rápida",
      text: "Fiquei surpreso com a agilidade. O site é seguro e o suporte me atendeu super bem quando tive dúvida sobre o rastreio.",
      time: "3 semanas atrás"
    },
    {
      name: "Ana Beatriz",
      location: "Curitiba, PR",
      title: "Melhor preço que achei",
      text: "Pesquisei bastante e os kits daqui estão com o melhor custo-benefício. Vale muito a pena pegar o álbum com os pacotes inclusos.",
      time: "1 mês atrás"
    },
    {
      name: "Pedro Henrique",
      location: "Brasília, DF",
      title: "Colecionador raiz",
      text: "Panini nunca decepciona. O álbum de 2026 está gigante, muitas figurinhas novas e seleções. Ansioso para começar a colar!",
      time: "5 dias atrás"
    }
  ];

  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-12 text-gray-900 leading-tight italic uppercase italic">
          O que nossos colecionadores dizem
        </h2>
        
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <TestimonialCard key={index} {...review} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-full shadow-sm text-sm font-bold text-gray-600">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>
            <span>Nota 4.9/5 baseada em 2.483 avaliações</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
