import { Injectable } from '@angular/core';
import { signal, Signal, WritableSignal } from '@angular/core';
import { Product } from '../interfaces/product.model';
import { CartItem } from '../interfaces/cart-item.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  public cartItems: WritableSignal<CartItem[]>;

  constructor() {
    this.cartItems = signal([]);
  }

  get cartItems$(): Signal<CartItem[]> {
    return this.cartItems.asReadonly();
  }

  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(item => item.product.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.updateCartItems(currentItems);
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems().filter(item => item.product.id !== productId);
    this.updateCartItems(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentItems = this.cartItems();
    const item = currentItems.find(item => item.product.id === productId);

    if (item) {
      const newStock = item.product.stock - (quantity - item.quantity);
      if (newStock >= 0) {
        item.product.stock = newStock;
        item.quantity = quantity;
        this.updateCartItems(currentItems);
      } else {
        console.error('Not enough stock available');
      }
    }
  }

  clearCart(): void {
    this.updateCartItems([]);
  }

  private updateCartItems(items: CartItem[]): void {
    this.cartItems.set(items);
  }

  getTotalPrice(): number {
    return this.cartItems().reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
}
