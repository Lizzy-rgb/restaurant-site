import { Component } from '@angular/core';

@Component({
  selector: 'app-my-order',
  standalone: true,
  imports: [],
  templateUrl: './my-order.html',
  styleUrl: './my-order.css'
})
export class MyOrder {
  isSignedIn = true;
  hasItems = true;

  orderItems = [
    { name: 'Burger', description: 'Classic burger with toppings' },
    { name: 'Pizza', description: 'Cheesy pizza with sauce' }
  ];
}