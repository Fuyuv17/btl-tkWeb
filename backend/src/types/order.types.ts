/**
 * types/order.types.ts
 * Khai báo các Interface liên quan đến Đơn hàng
 */

import { IToppingOption } from './product.types';

export type PaymentMethod = 'cash' | 'transfer';
export type OrderStatus = 'pending' | 'confirmed' | 'delivering' | 'completed' | 'cancelled';

export interface IOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  sugar?: string;
  ice?: string;
  toppings?: IToppingOption[];
  note?: string;
  image?: string;
}

export interface IOrderInput {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  paymentMethod?: PaymentMethod;
  items: IOrderItem[];
  note?: string;
}

export interface IOrder extends IOrderInput {
  id: string;
  userId: string | null;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}
