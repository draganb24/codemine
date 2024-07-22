import { Component, Input, OnInit, signal } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { tap, catchError, of, finalize } from 'rxjs';
import { ProductWithDetails } from '../../interfaces/product-with-details.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css'
})
export class ProductDetailComponent implements OnInit {
  @Input() productId: string;
  product = signal<ProductWithDetails>(null);
  loading = signal<boolean>(true);

  constructor(
    public activeModal: NgbActiveModal,
    private productService: ProductService,
  ) { }

  ngOnInit(): void {
    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    this.loading.set(true);
    this.productService.getProductById(this.productId).pipe(
      tap((data) => {
        this.product.set(data);
      }),
      catchError((error) => {
        console.error('Error fetching product details:', error);
        return of(null);
      }),
      finalize(() => {
        this.loading.set(false);
      })
    ).subscribe();
  }
}
