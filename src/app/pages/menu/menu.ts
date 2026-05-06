import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MenuItem, MenuCategory } from '../../shared/misc/menu-item';
import { Allergen } from '../../shared/misc/allergen';
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

  uid = this.authService.currentUser()?.uid;
  skipMod = false;
  loading = signal(false);

  // Filter state
  searchQuery = signal('');
  excludedAllergens = signal<Set<Allergen>>(new Set());
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  showFilterDropdown = signal(false);

  readonly allAllergens: Allergen[] = ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Fish'];

  activeFilterCount = computed(() => {
    let count = this.excludedAllergens().size;
    if (this.minPrice() !== null) count++;
    if (this.maxPrice() !== null) count++;
    return count;
  });

  readonly categoryOrder: MenuCategory[] = ['Appetizer', 'Entree', 'Drink', 'Dessert'];
  readonly categoryLabels: Record<MenuCategory, string> = {
    Appetizer: 'Appetizers',
    Entree:    'Entrees',
    Drink:     'Drinks',
    Dessert:   'Desserts',
  };

  filteredItems = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const excluded = this.excludedAllergens();
    const min = this.minPrice();
    const max = this.maxPrice();

    return this.menuService.getFullMenu().filter(item => {
      if (query && !item.name.toLowerCase().includes(query) && !item.description.toLowerCase().includes(query))
        return false;
      if (excluded.size > 0 && item.allergens?.some(a => excluded.has(a)))
        return false;
      if (min !== null && item.price < min) return false;
      if (max !== null && item.price > max) return false;
      return true;
    });
  });

  groupedItems = computed(() => {
    const items = this.filteredItems();
    return this.categoryOrder
      .map(category => ({ category, items: items.filter(i => i.category === category) }))
      .filter(group => group.items.length > 0);
  });

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

  toggleAllergen(allergen: Allergen) {
    this.excludedAllergens.update(set => {
      const next = new Set(set);
      next.has(allergen) ? next.delete(allergen) : next.add(allergen);
      return next;
    });
  }

  clearFilters() {
    this.searchQuery.set('');
    this.excludedAllergens.set(new Set());
    this.minPrice.set(null);
    this.maxPrice.set(null);
  }

  async checkSkip() {
    if (this.uid) {
      const data = await this.userService.getUser(this.uid);
      if (data?.skipModifyOrderPageByDefault === true) this.skipMod = true;
    }
  }

  addToOrder(menuItem: MenuItem) {
    const orderItem = { menuItem, quantity: 1, modifiers: [], additionalRequests: '' };
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
    await this.checkSkip();
    if (this.skipMod) this.addToOrder(menuItem);
    else this.router.navigate(['/menu', menuItem.name]);
  }
}
