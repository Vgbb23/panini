
export interface Product {
  id: string;
  name: string;
  description: string;
  oldPrice: number;
  currentPrice: number;
  image: string;
  category: 'kit' | 'album' | 'packs';
  highlight?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}
