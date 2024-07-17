import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() item: any;
  @Output() updateQuantityEvent = new EventEmitter<{ productId: string, quantity: number }>();
  @Output() removeFromCartEvent = new EventEmitter<number>();

  constructor() {}

  updateQuantity(productId: string, quantity: number): void {
    this.updateQuantityEvent.emit({ productId, quantity });
  }

  removeFromCart(productId: number): void {
    this.removeFromCartEvent.emit(productId);
  }
}
