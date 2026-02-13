
import React from 'react';
import { Book, Box, Layers, Users, Star } from 'lucide-react';

const AboutAlbum: React.FC = () => {
  return (
    <section className="max-w-3xl mx-auto px-6 py-12 md:py-20 text-gray-800">
      <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 leading-tight">
        Sobre o Álbum Oficial da Copa do Mundo 2026 Panini
      </h2>
      
      <div className="space-y-6 text-base text-gray-600 leading-relaxed text-left md:text-justify mb-12">
        <p>
          O álbum de figurinhas da Copa do Mundo 2026 é a edição oficial da Panini para o maior evento do futebol mundial, que será realizado nos Estados Unidos, México e Canadá. Esta é a edição mais completa já produzida pela Panini, com mais de 700 figurinhas colecionáveis que incluem todos os times classificados, estádios das cidades-sede e a categoria especial "Eternos 22" com os maiores jogadores da história das Copas.
        </p>
        <p>
          A edição de luxo em capa dura traz acabamento premium com detalhes em relevo e dourado, tornando-se não apenas um álbum de figurinhas, mas uma peça de colecionador que registra a história do futebol mundial.
        </p>
        <p>
          Cada pacote contém 5 figurinhas oficiais, incluindo variantes raras nas versões Ouro, Bordô e Bronze que se tornaram os itens mais procurados entre colecionadores de todo o Brasil.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-12">
        {/* Card 1 */}
        <div className="flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center shrink-0">
            <Book className="w-7 h-7 text-red-500" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 leading-tight text-lg">112 Páginas</h4>
            <p className="text-gray-500 text-sm">O maior álbum já produzido</p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
            <Box className="w-7 h-7 text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 leading-tight text-lg">980 Figurinhas</h4>
            <p className="text-gray-500 text-sm">Coleção completa mais extensa</p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
            <Layers className="w-7 h-7 text-emerald-500" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 leading-tight text-lg">7 Figurinhas por Pacote</h4>
            <p className="text-gray-500 text-sm">Maior chance de figurinhas cromadas</p>
          </div>
        </div>

        {/* Card 4 */}
        <div className="flex items-center gap-5 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-cyan-50 rounded-xl flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-cyan-500" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 leading-tight text-lg">48 Seleções</h4>
            <p className="text-gray-500 text-sm">Todas as equipes classificadas</p>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-gray-200 rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
          <h4 className="text-xl font-extrabold text-gray-900 italic uppercase italic">Edição Histórica</h4>
        </div>
        <ul className="space-y-4">
          <li className="flex items-start gap-3 text-gray-600 font-medium">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mt-1 shrink-0" />
            <span>Primeira Copa do Mundo com 48 seleções</span>
          </li>
          <li className="flex items-start gap-3 text-gray-600 font-medium">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mt-1 shrink-0" />
            <span>Álbum com 112 páginas - recorde histórico</span>
          </li>
          <li className="flex items-start gap-3 text-gray-600 font-medium">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500 mt-1 shrink-0" />
            <span>Três países-sede: EUA, Canadá e México</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default AboutAlbum;
