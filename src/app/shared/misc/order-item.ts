import { MenuItem } from './menu-item';

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
  modifiers: string[];
  additionalRequests: string;
}
