import { HttpClient } from '@angular/common/http';
import { Component, OnInit, WritableSignal, effect } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItemComponent } from '../shared/cart-item/cart-item.component';
import { CartItem } from '../../interfaces/cart-item.model';
import { tap } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, CartItemComponent],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: WritableSignal<CartItem[]>;

  constructor(
    private fb: FormBuilder,
    public cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {
    this.cartItems = this.cartService.cartItems;

    effect(() => {
      const items = this.cartItems();
      console.log('Cart items updated:', items);
    });
  }

  ngOnInit(): void {
    this.initializeCheckoutForm();
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
    if (this.checkoutForm.valid) {
      const formData = { ...this.checkoutForm.value, items: this.cartItems() };

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

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  submitForm() {
    this.router.navigate(['/success']);
  }
}
