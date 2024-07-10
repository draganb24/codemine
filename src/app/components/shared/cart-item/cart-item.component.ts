import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PriceService } from '../../../services/price.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  standalone: true,
  imports: [FormsModule],
  styleUrls: ['./cart-item.component.css']
})
export class CartItemComponent {
  @Input() item: any;
  @Output() updateQuantityEvent = new EventEmitter<{ productId: string, quantity: number }>();
  @Output() removeFromCartEvent = new EventEmitter<number>();

  constructor(private priceService: PriceService) {}

  updateQuantity(productId: string, quantity: number): void {
    this.updateQuantityEvent.emit({ productId, quantity });
  }

  removeFromCart(productId: number): void {
    this.removeFromCartEvent.emit(productId);
  }

  formatPrice(price: number): string {
    return this.priceService.formatPrice(price);
  }
}
