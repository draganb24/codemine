import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PriceService } from '../../services/price.service';
import { Subscription } from 'rxjs';
import { CartItemComponent } from '../shared/cart-item/cart-item.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  totalItems: number = 0;
  private subscription: Subscription;

  constructor(
    public activeModal: NgbActiveModal,
    public cartService: CartService,
    private priceService: PriceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscription = this.cartService.cartItems$.subscribe(cartItems => {
      this.totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  addToCart(product: any, quantity: number = 1): void {
    this.cartService.addToCart(product, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.activeModal.close();
    this.router.navigate(['/checkout']);
  }

  formatPrice(price: number): string {
    return this.priceService.formatPrice(price);
  }
}
