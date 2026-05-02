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
      picture:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fuglyfood.com.sg%2Fwp-content%2Fuploads%2F2025%2F05%2Ffettuccine-alfredo-recipe-1747726248.jpg&f=1&nofb=1&ipt=1e6e011663e58469f43fc54ddc40fb315d6366c2f3e458542a3d5ad4a2b41a84',
      description: 'Fettuccine noodles sautéed with chicken, broccoli, and a creamy garlic sauce.',
      price: 14.99,
      allergens: ['Gluten', 'Dairy'],
      note: '',
    },
    {
      name: 'Sirloin',
      picture:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.allrecipes.com%2Fthmb%2FOJ28fIFte6Pyg93ML8IM-APbu1Y%3D%2F1500x0%2Ffilters%3Ano_upscale()%3Amax_bytes(150000)%3Astrip_icc()%2FAR-14554-sirloin-steak-with-garlic-butter-hero-4x3-d12fa79836754fcf850388e4677bbf55.jpg&f=1&nofb=1&ipt=44d8976f8e7ae7ea0d3fa3c7278fccb31d13be3fbd5d50b32a38226ef2a55be9',
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
