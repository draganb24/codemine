import { Component, Input, Output, EventEmitter, OnInit, signal, effect, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartItem } from '../../../interfaces/cart-item.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent implements OnInit {
  @Input() item: CartItem;
  @Output() updateQuantityEvent = new EventEmitter<{ productId: number, quantity: number }>();
  @Output() removeFromCartEvent = new EventEmitter<number>();
  quantity: WritableSignal<number>;
  setQuantity: (value: number) => void;

  constructor() {
    this.quantity = signal(0);

    effect(() => {
      const currentQuantity = this.quantity();
      this.updateQuantityEvent.emit({ productId: this.item.product.id, quantity: currentQuantity });
    });
  }

  ngOnInit(): void {
    this.quantity.set(this.item.quantity);
  }

  updateQuantity(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newQuantity = Number(inputElement.value);
      this.quantity.set(newQuantity);
  }

  increaseQuantity(): void {
    const currentQuantity = this.quantity();
    const availableStock = this.item.product.stock;
    if (availableStock > 0) {
      this.quantity.set(currentQuantity + 1);
    } else {
      alert('Cannot add more than available stock');
    }
  }

  decreaseQuantity(): void {
    const currentQuantity = this.quantity();
    if (currentQuantity > 1) {
      this.quantity.set(currentQuantity - 1);
    }
  }

  removeFromCart(): void {
    this.removeFromCartEvent.emit(this.item.product.id);
  }
}
