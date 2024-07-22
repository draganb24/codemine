import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product.model';
import { CartItem } from '../interfaces/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() { }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSubject.value;
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.updateCartItems(currentItems);
  }

  private updateCartItems(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(item => item.product.id !== productId);
    this.updateCartItems(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItemsSubject.value;
    const item = currentItems.find(item => item.product.id === productId);
      item.product.stock -= (quantity - item.quantity);
      item.quantity = quantity;
      this.updateCartItems(currentItems);
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  clearCart(): void {
    this.updateCartItems([]);
  }
}
