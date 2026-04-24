import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu {
  menuItems = [
    { id: '1', name: 'Burger', description: 'Classic burger with toppings', price: 10.99 },
    { id: '2', name: 'Pizza', description: 'Cheesy pizza with sauce', price: 13.99 },
    { id: '3', name: 'Salad', description: 'Fresh salad with dressing', price: 8.99 }
  ];
}
