import { Component, computed, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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

@Component({
  selector: 'app-my-order',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './my-order.html',
  styleUrl: './my-order.css',
})
export class MyOrder {
  @ViewChild('checkoutModal') modalRef!: ElementRef;
  private bsModal: any;

  authService = inject(Auth);
  orderService = inject(OrderService);
  distanceService = inject(DistanceService);
  router = inject(Router);

  hasItems = computed(() => this.orderService.items().length > 0);

  // Expose config constants to the template
  readonly taxRate = taxRate;
  readonly deliveryFeeBase = deliveryFeeBase;
  readonly deliveryFeePerMile = deliveryFeePerMile;

  // Checkout flow state
  step = signal(1);
  deliveryType = signal<'pickup' | 'delivery'>('pickup');
  deliveryTime = '';

  // Address fields
  deliveryStreet = '';
  deliveryCity = '';
  deliveryState = '';
  deliveryZip = '';

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
      case '8':      return sub * 0.08;
      case '15':     return sub * 0.15;
      case '20':     return sub * 0.20;
      case 'custom': return this.customTipAmount();
    }
  });

  total = computed(() =>
    this.orderService.subtotal() + this.tax() + this.tipAmount() + this.deliveryFee()
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

  openCheckout() {
    this.step.set(1);
    this.deliveryFee.set(0);
    this.deliveryMiles.set(null);
    this.addressError.set('');
    this.showValidation.set(false);
    this.deliveryStreet = '';
    this.deliveryCity = '';
    this.deliveryState = '';
    this.deliveryZip = '';
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
    if (this.step() < 3) this.step.update(s => s + 1);
  }

  prevStep() {
    this.showValidation.set(false);
    this.addressError.set('');
    if (this.step() > 1) this.step.update(s => s - 1);
  }

  private buildDeliveryAddress(): string {
    const parts = [this.deliveryStreet.trim(), this.deliveryCity.trim(), this.deliveryState.trim()];
    if (this.deliveryZip.trim()) parts.push(this.deliveryZip.trim());
    return parts.join(', ');
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
        this.buildDeliveryAddress()
      );
      if (miles === null) {
        this.addressError.set(
          "We couldn't find that address. Please double-check the street, city, and state."
        );
      } else if (miles > maxDeliveryDistance) {
        this.addressError.set(
          `That address is ${miles.toFixed(1)} miles away. We only deliver within ${maxDeliveryDistance} miles of our location.`
        );
      } else {
        this.deliveryMiles.set(miles);
        this.deliveryFee.set(deliveryFeeBase + miles * deliveryFeePerMile);
      }
    } catch {
      this.addressError.set(
        'Something went wrong calculating the distance. Please try again.'
      );
    } finally {
      this.calculatingDistance.set(false);
    }
  }

  placeOrder() {
    // Sample site — no real submission
    this.bsModal?.hide();
  }
}
