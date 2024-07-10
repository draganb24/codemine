import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { PriceService } from '../../services/price.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { tap, catchError, of, finalize } from 'rxjs';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent {
  @Input() productId: string;
  product: any = null;
  loading: boolean = true;

  constructor(
    public activeModal: NgbActiveModal,
    private productService: ProductService,
    private priceService: PriceService,
  ) { }

  ngOnInit(): void {
    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    this.loading = true;
    this.productService.getProductById(this.productId).pipe(
      tap((data) => {
        this.product = data;
      }),
      catchError((error) => {
        console.error('Error fetching product details:', error);
        return of(null);
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe();
  }

  formatPrice(price: number): string {
    return this.priceService.formatPrice(price);
  }
}
