import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  deliveryFeeBase,
  deliveryFeePerMile,
  maxDeliveryDistance,
  restaurantAddress,
  taxRate,
} from '../../app.config';
import { Auth } from '../../core/services/auth';
import { DistanceService } from '../../core/services/distance';
import { OrderService } from '../../core/services/order';
import { Address } from '../../shared/misc/address';
import { User } from '../../core/services/user';

@Component({
  selector: 'app-my-order',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './my-order.html',
  styleUrl: './my-order.css',
})
export class MyOrder {
  @ViewChild('checkoutModal') modalRef!: ElementRef;
  private bsModal: any;

  authService = inject(Auth);
  userService = inject(User);
  orderService = inject(OrderService);
  distanceService = inject(DistanceService);
  router = inject(Router);

  hasItems = computed(() => this.orderService.items().length > 0);

  readonly taxRate = taxRate;
  readonly deliveryFeeBase = deliveryFeeBase;
  readonly deliveryFeePerMile = deliveryFeePerMile;

  step = signal(1);
  deliveryType = signal<'pickup' | 'delivery'>('pickup');
  deliveryTime = '';

  deliveryStreet = '';
  deliveryCity = '';
  deliveryState = '';
  deliveryZip = 0;

  tipOption = signal<'8' | '15' | '20' | 'custom'>('15');
  customTipAmount = signal(0);

  deliveryFee = signal(0);
  deliveryMiles = signal<number | null>(null);
  addressError = signal('');
  showValidation = signal(false);
  calculatingDistance = signal(false);

  tax = computed(() => this.orderService.subtotal() * taxRate);

  tipAmount = computed(() => {
    const sub = this.orderService.subtotal();
    switch (this.tipOption()) {
      case '8':
        return sub * 0.08;
      case '15':
        return sub * 0.15;
      case '20':
        return sub * 0.2;
      case 'custom':
        return this.customTipAmount();
    }
  });

  total = computed(
    () => this.orderService.subtotal() + this.tax() + this.tipAmount() + this.deliveryFee(),
  );

  itemSubtotal(index: number) {
    const item = this.orderService.items()[index];
    return (item.menuItem.price * item.quantity).toFixed(2);
  }

  editItem(index: number) {
    const item = this.orderService.items()[index];
    this.orderService.startEditing(index);
    this.router.navigate(['/menu', item.menuItem.name]);
  }

  async openCheckout() {
    this.step.set(1);
    this.deliveryFee.set(0);
    this.deliveryMiles.set(null);
    this.addressError.set('');
    this.showValidation.set(false);
    this.deliveryStreet = '';
    this.deliveryCity = '';
    this.deliveryState = '';
    this.deliveryZip = 0;
    const uid = this.authService.currentUser()?.uid;
    if (uid) {
      const data = await this.userService.getUser(uid);
      if (data) {
        if (data.useSavedAddressByDefault !== undefined) {
          //console.log('preference is defined');
          if (data.useSavedAddressByDefault === true) {
            //console.log('Should skip in checkSkip? ', true);
            if (data.street && data.city && data.state && data.zip) {
              this.deliveryStreet = data.street;
              this.deliveryCity = data.city;
              this.deliveryState = data.state;
              this.deliveryZip = Number(data.zip);
            }
          }
        }
      }
    }
    this.bsModal = new (window as any).bootstrap.Modal(this.modalRef.nativeElement);

    this.bsModal.show();
  }

  async nextStep() {
    if (this.step() === 2 && this.deliveryType() === 'delivery') {
      await this.calculateDeliveryFee();
      if (this.addressError()) return;
    }
    if (this.step() === 2 && this.deliveryType() === 'pickup') {
      this.deliveryFee.set(0);
      this.deliveryMiles.set(null);
    }
    if (this.step() < 3) this.step.update((s) => s + 1);
  }

  prevStep() {
    this.showValidation.set(false);
    this.addressError.set('');
    if (this.step() > 1) this.step.update((s) => s - 1);
  }

  private buildDeliveryAddressAsString(): string {
    const parts = [this.deliveryStreet.trim(), this.deliveryCity.trim(), this.deliveryState.trim()];
    if (this.deliveryZip) parts.push(this.deliveryZip + '');
    return parts.join(', ');
  }

  private buildDeliveryAddress(): Address {
    // const parts = [this.deliveryStreet.trim(), this.deliveryCity.trim(), this.deliveryState.trim()];
    // if (this.deliveryZip.trim()) parts.push(this.deliveryZip.trim());
    // return parts.join(', ');

    return {
      street: this.deliveryStreet,
      city: this.deliveryCity,
      state: this.deliveryState,
      zip: this.deliveryZip,
    };
  }

  private requiredFieldsMissing(): boolean {
    return !this.deliveryStreet.trim() || !this.deliveryCity.trim() || !this.deliveryState.trim();
  }

  private async calculateDeliveryFee() {
    this.showValidation.set(true);
    if (this.requiredFieldsMissing()) {
      this.addressError.set('Please fill in all required address fields.');
      return;
    }
    this.calculatingDistance.set(true);
    this.addressError.set('');
    try {
      const miles = await this.distanceService.estimateDistanceMiles(
        restaurantAddress,
        this.buildDeliveryAddressAsString(),
      );
      if (miles === null) {
        this.addressError.set(
          "We couldn't find that address. Please double-check the street, city, and state.",
        );
      } else if (miles > maxDeliveryDistance) {
        this.addressError.set(
          `That address is ${miles.toFixed(1)} miles away. We only deliver within ${maxDeliveryDistance} miles of our location.`,
        );
      } else {
        this.deliveryMiles.set(miles);
        this.deliveryFee.set(deliveryFeeBase + miles * deliveryFeePerMile);
      }
    } catch {
      this.addressError.set('Something went wrong calculating the distance. Please try again.');
    } finally {
      this.calculatingDistance.set(false);
    }
  }

  placeOrder() {
    // const address = this.deliveryType() === 'delivery'
    //   ? [this.deliveryStreet, this.deliveryCity, this.deliveryState, this.deliveryZip]
    //       .filter(Boolean)
    //       .join(', ')
    //   : null;

    // const orderSummary = {
    //   deliveryMethod: this.deliveryType(),         // string, 'pickup' or 'delivery'
    //   address,                                     // string, nullable
    //   requestedTime: this.deliveryTime || null,    // string, nullable
    //   items: this.orderService.itemsToStrings().join(' | '),  // ends up being just one string
    //   subtotal: +this.orderService.subtotal().toFixed(2),     // should we leave this out of the firebase table?
    //   total: +this.total().toFixed(2),
    // };

    // console.log('Order submitted:', orderSummary);

    // this.bsModal?.hide();
    try {
      var deliveryAddress: Address | null = null;

      if (this.deliveryType() === 'delivery') {
        deliveryAddress = this.buildDeliveryAddress();
      }

      this.orderService.addOrder(
        this.orderService.itemsToStrings().join(' | '),
        this.deliveryTime,
        deliveryAddress,
      );

      this.orderService.items.set([]);

      this.bsModal?.hide();
    } catch (error) {
      console.error('Error processing order: ', error);
    }
  }
}
