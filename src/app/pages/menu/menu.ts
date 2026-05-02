import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from '../../shared/misc/menu-item';
import { RestaurantMenu } from '../../core/services/menu';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  menuService = inject(RestaurantMenu);

  menuItems: MenuItem[] = this.menuService.getFullMenu();
}
