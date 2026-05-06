import { Injectable } from '@angular/core';
import { MenuItem } from '../../shared/misc/menu-item';

@Injectable({
  providedIn: 'root',
})
export class RestaurantMenu {
  readonly img = '../../images';
  /* Template for menu, feel free to copy/paste
    {
      name: '',
      picture: `${this.img}/`,
      description: '',
      price: 0,
      allergens: [],
      note: '',
    },
  */
  menu: MenuItem[] = [
    {
      name: 'Fettuccine Alfredo',
      picture: 'images/fettuccine-alfredo.jpg',
      description: 'Fettuccine noodles sautéed with chicken, broccoli, and a creamy garlic sauce.',
      price: 14.99,
      allergens: ['Gluten', 'Dairy'],
      note: '',
    },
    {
      name: 'Sirloin',
      picture: 'images/sirloin.jpg',
      description: 'A well-seasoned 6 oz. sirloin cooked to order.',
      price: 16.99,
      allergens: [],
      note: '',
    },
  ];

  getFullMenu(): MenuItem[] {
    return this.menu;
  }
}
