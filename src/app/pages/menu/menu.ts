import { Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem } from '../../shared/misc/menu-item';
import { RestaurantMenu } from '../../core/services/menu';
import { Auth } from '../../core/services/auth';
import { User } from '../../core/services/user';
import { OrderService } from '../../core/services/order';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  menuService = inject(RestaurantMenu);
  authService = inject(Auth);
  userService = inject(User);
  orderService = inject(OrderService);
  router = inject(Router);

  menuItems: MenuItem[] = this.menuService.getFullMenu();
  uid = this.authService.currentUser()?.uid;
  skipMod = false;
  loading = signal(false);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loading.set(true);
        this.checkSkip().finally(() => this.loading.set(false));
      } else {
        this.loading.set(false);
      }
    });
  }

  async checkSkip() {
    if (this.uid) {
      //console.log('uid exists');
      const data = await this.userService.getUser(this.uid);
      if (data) {
        //console.log('data retrieved');
        if (data.skipModifyOrderPageByDefault !== undefined) {
          //console.log('preference is defined');
          if (data.skipModifyOrderPageByDefault === true) {
            //console.log('Should skip in checkSkip? ', true);
            this.skipMod = true;
          }
        }
      }
    } //else console.log('Viewing menu as guest');
  }

  addToOrder(menuItem: MenuItem) {
    const orderItem = {
      menuItem: menuItem,
      quantity: 1,
      modifiers: [],
      additionalRequests: '',
    };

    const editIndex = this.orderService.editingIndex();
    if (editIndex !== null) {
      this.orderService.updateItem(editIndex, orderItem);
      this.orderService.stopEditing();
    } else {
      this.orderService.addItem(orderItem);
    }

    this.router.navigate(['/my-order']);
  }

  async decide(menuItem: MenuItem) {
    console.log('Is loading in decide? ', this.loading());
    await this.checkSkip();
    console.log('Should skip in decide?', this.skipMod);
    if (this.skipMod) this.addToOrder(menuItem);
    else this.router.navigate(['/menu', menuItem.name]);
  }
}
