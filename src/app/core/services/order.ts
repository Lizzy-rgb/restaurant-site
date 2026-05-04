import { Injectable, signal } from '@angular/core';
import { OrderItem } from '../../shared/misc/order-item';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  items = signal<OrderItem[]>([]);
  editingIndex = signal<number | null>(null);

  addItem(item: OrderItem) {
    this.items.update(current => [...current, item]);
  }

  updateItem(index: number, item: OrderItem) {
    this.items.update(current => {
      const copy = [...current];
      copy[index] = item;
      return copy;
    });
  }

  startEditing(index: number) {
    this.editingIndex.set(index);
  }

  stopEditing() {
    this.editingIndex.set(null);
  }

  subtotal() {
    return this.items().reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );
  }

  itemToString(item: OrderItem): string {
    let str = `${item.quantity}x ${item.menuItem.name}`;
    if (item.modifiers.length > 0) str += ` (${item.modifiers.join(', ')})`;
    if (item.additionalRequests) str += ` — "${item.additionalRequests}"`;
    return str;
  }

  itemsToStrings(): string[] {
    return this.items().map(item => this.itemToString(item));
  }
}
