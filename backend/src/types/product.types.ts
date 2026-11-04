/**
 * types/product.types.ts
 * Khai báo các Interface liên quan đến Món ăn và Thực đơn
 */

export interface IToppingOption {
  name: string;
  price: number;
}

export interface ISizeOption {
  name: string;
  price: number;
}

export interface IProduct {
  id: string;
  name: string;
  price: number;
  image?: string;
  badge?: string;
  description?: string;
  toppingOptions?: IToppingOption[];
  sizeOptions?: ISizeOption[];
  sugarOptions?: string[];
  iceOptions?: string[];
}

export interface ICategory {
  name: string;
  products: Record<string, IProduct>;
}
