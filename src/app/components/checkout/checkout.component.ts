import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PriceService } from '../../services/price.service';
import { CartItemComponent } from '../shared/cart-item/cart-item.component';
import { Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, CartItemComponent],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  totalItems: number = 0;
  private subscription: Subscription;
  checkoutForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private http: HttpClient,
    private priceService: PriceService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeCartSubscription();
    this.initializeCheckoutForm();
  }

  private initializeCartSubscription(): void {
    this.subscription = this.cartService.cartItems$.subscribe(cartItems => {
      this.totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    });
  }

  private initializeCheckoutForm(): void {
    this.checkoutForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
      address: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[+0-9]+$')]]
    });
  }

  onSubmit(): void {
    if (this.checkoutForm?.valid) {
      const formData = { ...this.checkoutForm?.value, items: this.cartService.cartItems$ };

      this.http.post('https://dummyjson.com/http/200', formData).pipe(
        tap({
          next: (response) => {
            console.log('Order submitted successfully', response);
          },
          error: (error) => {
            console.error('Error submitting order', error);
          }
        })
      ).subscribe();
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  formatPrice(price: number): string {
    return this.priceService.formatPrice(price);
  }

  submitForm() {
    this.router.navigate(['/success']);
  }
}
