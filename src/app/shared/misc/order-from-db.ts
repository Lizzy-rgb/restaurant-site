import { Address } from './address';

export interface OrderFromDb {
  orderId: string;
  deliveryAddress: Address | null;
  estimatedTime: string;
  items: string;
  userId: string;
}
