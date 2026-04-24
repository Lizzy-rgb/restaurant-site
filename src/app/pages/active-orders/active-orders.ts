import { Component } from '@angular/core';

@Component({
  selector: 'app-active-orders',
  standalone: true,
  imports: [],
  templateUrl: './active-orders.html',
  styleUrl: './active-orders.css'
})
export class ActiveOrders {
  orders = [
    { id: 1, name: 'Order 1', time: '12:00 PM', items: ['Burger', 'Fries'] },
    { id: 2, name: 'Order 2', time: '12:05 PM', items: ['Pizza'] },
    { id: 3, name: 'Order 3', time: '12:10 PM', items: ['Salad', 'Drink'] }
  ];
}