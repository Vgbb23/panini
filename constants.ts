
import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'kit-amador',
    name: 'Kit Amador',
    description: '1 Álbum Capa Dura + 30 Pacotes de Figurinhas',
    oldPrice: 147.90,
    currentPrice: 78.32, // 97.90 * 0.8
    image: 'https://i.ibb.co/XrYpY6wQ/1alb3box.webp',
    category: 'kit',
    highlight: true
  },
  {
    id: 'kit-campeao',
    name: 'Kit Campeão',
    description: '1 Álbum Capa Dura + 60 Pacotes de Figurinhas',
    oldPrice: 227.90,
    currentPrice: 118.32, // 147.90 * 0.8
    image: 'https://i.ibb.co/tMH4WmTj/1alb2box.webp',
    category: 'kit',
    highlight: true
  },
  {
    id: 'kit-colecionador',
    name: 'Kit Colecionador',
    description: '1 Álbum Capa Dura + 90 Pacotes de Figurinhas',
    oldPrice: 327.90,
    currentPrice: 159.92, // 199.90 * 0.8
    image: 'https://i.ibb.co/qMkYSgyP/1alb1box.webp',
    category: 'kit',
    highlight: true
  },
  {
    id: 'album-capa-dura',
    name: 'Álbum Capa Dura',
    description: 'Edição Especial de Luxo Oficial 2026',
    oldPrice: 127.90,
    currentPrice: 57.90, // 67.90 - 10
    image: 'https://i.ibb.co/cKGPnNNK/D-798749-MLB106673534321-022026-C.jpg',
    category: 'album'
  },
  {
    id: '30-packs',
    name: '30 Pacotes',
    description: '150 Figurinhas Oficiais Panini',
    oldPrice: 59.90,
    currentPrice: 35.91, // 39.90 * 0.9
    image: 'https://i.ibb.co/FLmxpVRf/Gemini-Generated-Image-rocsqgrocsqgrocs.png',
    category: 'packs'
  },
  {
    id: '60-packs',
    name: '60 Pacotes',
    description: '300 Figurinhas Oficiais Panini',
    oldPrice: 89.90,
    currentPrice: 53.01, // 58.90 * 0.9
    image: 'https://i.ibb.co/FvZFxB5/1.png',
    category: 'packs'
  },
  {
    id: '90-packs',
    name: '90 Pacotes',
    description: '450 Figurinhas Oficiais Panini',
    oldPrice: 109.90,
    currentPrice: 69.21, // 76.90 * 0.9
    image: 'https://i.ibb.co/7dx669hp/2.png',
    category: 'packs'
  },
  {
    id: '120-packs',
    name: '120 Pacotes',
    description: '600 Figurinhas Oficiais Panini',
    oldPrice: 149.90,
    currentPrice: 85.41, // 94.90 * 0.9
    image: 'https://i.ibb.co/FLm8dv95/3.png',
    category: 'packs'
  },
  {
    id: '150-packs',
    name: '150 Pacotes',
    description: '750 Figurinhas Oficiais Panini',
    oldPrice: 179.90,
    currentPrice: 115.11, // 127.90 * 0.9
    image: 'https://i.ibb.co/G4DM1M2K/4.png',
    category: 'packs'
  }
];
