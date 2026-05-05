import { Injectable, signal, WritableSignal } from '@angular/core';
import { OrderItem } from '../../shared/misc/order-item';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from '../../firebase.config';
import { addDoc, collection, deleteDoc, doc, getDocs, query, onSnapshot } from 'firebase/firestore';
import { Address } from '../../shared/misc/address';
import { Order } from '../../shared/misc/order';
import { OrderFromDb } from '../../shared/misc/order-from-db';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orderCollection = collection(db, 'orders');

  items = signal<OrderItem[]>([]);
  editingIndex = signal<number | null>(null);
  currentUser = signal<User | null>(null);
  allOrders = signal<OrderFromDb[]>([]);
  curTime = new Date();

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUser.set(user);

      if (!user) {
        this.items.set([]);
      }
    });

    // Set up real-time listener for all orders
    onSnapshot(this.orderCollection, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        orderId: doc.id,
      })) as OrderFromDb[];
      this.allOrders.set(data);
    });
  }

  addItem(item: OrderItem) {
    this.items.update((current) => [...current, item]);
  }

  updateItem(index: number, item: OrderItem) {
    this.items.update((current) => {
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
    return this.items().reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  }

  itemToString(item: OrderItem): string {
    let str = `${item.quantity}x ${item.menuItem.name}`;
    if (item.modifiers.length > 0) str += ` (${item.modifiers.join(', ')})`;
    if (item.additionalRequests) str += ` — [${item.additionalRequests}]`;
    return str;
  }

  itemsToStrings(): string[] {
    return this.items().map((item) => this.itemToString(item));
  }

  itemsAsOrder(): WritableSignal<OrderItem[]> {
    return this.items;
  }

  async addOrder(orderStr: string, deliveryTime: string = '', address: Address | null = null) {
    try {
      if (orderStr.length === 0) {
        throw new Error('Cannot submit an empty order');
      }

      const user = this.currentUser();
      if (!user) {
        throw new Error('Must be signed in to submit order');
      }

      if (!deliveryTime || deliveryTime.length === 0) {
        var time = new Date();
        time.setTime(this.curTime.getTime() + 1200000); // 20 min offset
        deliveryTime = time.getHours() + ':' + time.getMinutes();
      }

      await addDoc(this.orderCollection, {
        items: orderStr,
        userId: user.uid,
        estimatedTime: deliveryTime,
        deliveryAddress: address,
        userName: user.displayName,
      });
    } catch (error) {
      console.error('Error occured while submitting order: ', error);
    }
  }

  async retrieveAllOrders() {
    var toReturn = signal<OrderFromDb[]>([]);
    const q = query(this.orderCollection);
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      orderId: doc.id,
    })) as OrderFromDb[];
    toReturn.set(data);
    return toReturn;
  }

  // async updateOrder

  async deleteOrder(id: string) {
    try {
      // Put kitchen auth verification + other intentional errors here

      const docRef = doc(this.orderCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error occured while clearing order: ', error, this.items.toString);
    }
  }

  interpretOrderItems(order: OrderFromDb) {
    var toReturn = [];
    var buildString = '';
    for (const char of order.items) {
      if (char === '|') {
        toReturn.push(buildString);
        buildString = '';
      } else {
        buildString.concat(char);
      }
    }
    if (buildString.length !== 0) {
      toReturn.push(buildString);
    }
    return toReturn;
  }
}
