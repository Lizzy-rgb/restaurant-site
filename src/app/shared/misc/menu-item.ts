import { Allergen } from './allergen';

export type MenuCategory = 'Appetizer' | 'Entree' | 'Drink' | 'Dessert';

export interface MenuItem {
  //id: string;
  name: string;
  picture: string;
  description: string;
  price: number;
  category: MenuCategory;
  allergens?: Allergen[];
  note?: string;
}
