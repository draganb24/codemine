import { Component, OnInit, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartItemComponent } from '../shared/cart-item/cart-item.component';
import { Product } from '../../interfaces/product.model';
import { CartItem } from '../../interfaces/cart-item.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, CartItemComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{
  cartItems = signal<CartItem[]>([]);

  constructor(
    public activeModal: NgbActiveModal,
    public cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.subscribeToCartItems();
  }

  private subscribeToCartItems(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems.set(items);
    });
  }

  addToCart(product: Product, quantity: number = 1): void {
    this.cartService.addToCart(product, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: number): void {
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
}
