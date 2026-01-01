import { UUID } from "crypto";

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  id: UUID;
  productid: UUID;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  product?: {
    id: UUID;
    name: string;
    images: string[];
  };
}

export interface Order {
  id: UUID;
  orderNumber: string;
  customerid: UUID;
  customer?: {
    id: UUID;
    name: string;
    email: string;
  };
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  billingAddress?: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  items: Array<{
    productid: UUID;
    quantity: number;
  }>;
  shippingAddress: string;
  paymentMethod: string;
  notes?: string;
}