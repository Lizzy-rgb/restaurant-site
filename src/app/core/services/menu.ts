import { Injectable } from '@angular/core';
import { MenuItem } from '../../shared/misc/menu-item';

@Injectable({
  providedIn: 'root',
})
export class RestaurantMenu {
  readonly img = '../../images';
  menu: MenuItem[] = [
    {
      name: 'Fettuccine Alfredo',
      picture: 'images/fettuccine-alfredo.jpg',
      description: 'Fettuccine noodles sautéed with chicken, broccoli, and a creamy garlic sauce.',
      price: 14.99,
      category: 'Entree',
      allergens: ['Gluten', 'Dairy'],
      note: '',
    },
    {
      name: 'Sirloin',
      picture: 'images/sirloin.jpg',
      description: 'A well-seasoned 6 oz. sirloin cooked to order.',
      price: 16.99,
      category: 'Entree',
      allergens: [],
      note: '',
    },
    {
      name: 'Caesar Salad',
      picture: 'images/caesar-salad.jpg',
      description: 'Crisp romaine lettuce tossed with Caesar dressing, croutons, and Parmesan cheese.',
      price: 9.99,
      category: 'Appetizer',
      allergens: ['Dairy', 'Gluten'],
      note: '',
    },
    {
      name: 'Breadsticks',
      picture: 'images/breadsticks.jpg',
      description: 'Soft, buttery breadsticks served with marinara sauce for dipping.',
      price: 5.99,
      category: 'Appetizer',
      allergens: ['Gluten', 'Dairy'],
      note: '',
    },
    {
      name: 'Cheesy Ravioli',
      picture: 'images/cheesy-ravioli.jpg',
      description: 'Soft ravioli stuffed with a blend of cheeses, served with marinara sauce.',
      price: 12.99,
      category: 'Entree',
      allergens: ['Dairy', 'Gluten'],
      note: '',
    },
    {
      name: 'Tiramisu',
      picture: 'images/tiramisu.jpg',
      description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream.',
      price: 7.99,
      category: 'Dessert',
      allergens: ['Dairy', 'Gluten', 'Eggs'],
      note: '',
    },
    {
      name: 'Chocolate Cake',
      picture: 'images/chocolate-cake.jpg',
      description: 'Rich and moist chocolate cake topped with a creamy chocolate ganache.',
      price: 6.99,
      category: 'Dessert',
      allergens: ['Dairy', 'Gluten', 'Eggs'],
      note: '',
    },
    {
      name: 'Gelato',
      picture: 'images/gelato.jpg',
      description: 'Creamy Italian-style ice cream available in various flavors.',
      price: 4.99,
      category: 'Dessert',
      allergens: ['Dairy'],
      note: '',
    },
    {
      name: 'Lasagna',
      picture: 'images/lasagne.jpg',
      description: 'Layers of pasta, meat sauce, ricotta, and mozzarella cheese baked to perfection.',
      price: 13.99,
      category: 'Entree',
      allergens: ['Dairy', 'Gluten'],
      note: '',
    },
    {
      name: 'Margherita Pizza',
      picture: 'images/margherita-pizza.jpg',
      description: 'Classic pizza with tomato sauce, fresh mozzarella, basil, and a drizzle of olive oil.',
      price: 11.99,
      category: 'Entree',
      allergens: ['Dairy', 'Gluten'],
      note: '',
    },
    {
      name: 'Seasoned Waffle Fries',
      picture: 'images/seasoned-waffle-fries.jpg',
      description: 'Crispy waffle-cut fries seasoned with a blend of herbs and spices.',
      price: 4.99,
      category: 'Appetizer',
      allergens: [],
      note: '',
    },
    {
      name: 'Spaghetti',
      picture: 'images/spaghetti.jpg',
      description: 'Classic spaghetti noodles served with your choice of marinara or meat sauce.',
      price: 11.99,
      category: 'Entree',
      allergens: ['Gluten'],
      note: '',
    },
    {
      name: 'Tortellini Soup',
      picture: 'images/tortellini-soup.jpg',
      description: 'Hearty soup with cheese-filled tortellini, vegetables, and a savory broth.',
      price: 10.99,
      category: 'Appetizer',
      allergens: ['Dairy', 'Gluten'],
      note: '',
    }
  ];

  getFullMenu(): MenuItem[] {
    return this.menu;
  }
}
