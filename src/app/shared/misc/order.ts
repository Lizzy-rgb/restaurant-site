import { OrderItem } from './order-item';

export interface Order {
  userId: string;
  items: OrderItem[];
  subtotal: number;
  finalPrice: number;
  completeByTime: string | null;
  completeByDay: string | null;
  deliveryAddress: string | null;
}
