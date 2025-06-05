export interface Product {
  id?: string;
  sku?: string;
  name?: string;
  description?: string;
  stock?: number;
  category?: string;
  brand?: string;
  price?: number;
  totalPrice?: number;
  discount?: number;
  discountPrice?: number;
  priceAtTime?: number;
  warranty?: number;
  mainImageUrl?: string;
  quantity?: number;
  quantitySold?: number;
  color?: string;
  colors?: string[];
  images?: string[];
  deletedAt?: Date;
  orderDetailId?: string;
  star?: number;
}
