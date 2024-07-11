import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  constructor() {}

  formatPrice(price: number): string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
  }
}
