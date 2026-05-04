import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../core/services/auth';
import { RestaurantMenu } from '../../core/services/menu';
import { OrderService } from '../../core/services/order';
import { MenuItem } from '../../shared/misc/menu-item';

interface ModifierOption {
  label: string;
  selected: boolean;
}

@Component({
  selector: 'app-menu-item-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './menu-item-detail.html',
  styleUrl: './menu-item-detail.css',
})
export class MenuItemDetail implements OnInit {
  authService = inject(Auth);
  menuService = inject(RestaurantMenu);
  orderService = inject(OrderService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  menuItem: MenuItem | null = null;
  quantity = 1;
  modifiers: ModifierOption[] = [
    { label: 'Modifier 1', selected: false },
    { label: 'Modifier 2', selected: false },
    { label: 'Modifier 3', selected: false },
  ];
  additionalRequests = '';

  ngOnInit() {
    const name = this.route.snapshot.paramMap.get('name');
    this.menuItem = this.menuService.getFullMenu().find(i => i.name === name) ?? null;

    if (!this.menuItem) {
      this.router.navigate(['/menu']);
      return;
    }

    const editIndex = this.orderService.editingIndex();
    if (editIndex !== null) {
      const existing = this.orderService.items()[editIndex];
      if (existing) {
        this.quantity = existing.quantity;
        this.additionalRequests = existing.additionalRequests;
        this.modifiers = this.modifiers.map(m => ({
          ...m,
          selected: existing.modifiers.includes(m.label),
        }));
      }
    }
  }

  increment() {
    this.quantity++;
  }

  decrement() {
    if (this.quantity > 1) this.quantity--;
  }

  addToOrder() {
    if (!this.menuItem) return;

    const orderItem = {
      menuItem: this.menuItem,
      quantity: this.quantity,
      modifiers: this.modifiers.filter(m => m.selected).map(m => m.label),
      additionalRequests: this.additionalRequests,
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
}
