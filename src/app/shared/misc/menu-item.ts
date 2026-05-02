import { Allergen } from './allergen';

export interface MenuItem {
  //id: string;
  name: string;
  picture: string;
  description: string;
  price: number;
  allergens?: Allergen[];
  note?: string;
}
