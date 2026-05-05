import { Component, inject } from '@angular/core';
import { OrderService } from '../../core/services/order';
import { OrderFromDb } from '../../shared/misc/order-from-db';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [],
  templateUrl: './active-orders.html',
  styleUrl: './active-orders.css',
})
export class ActiveOrders {
  orderService = inject(OrderService);

  orders = this.orderService.allOrders;

  async completeOrder(id: string) {
    await this.orderService.deleteOrder(id);
  }
}
