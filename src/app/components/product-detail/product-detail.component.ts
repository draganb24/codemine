import { Component, Input, OnInit, signal, effect } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { ProductWithDetails } from '../../interfaces/product-with-details.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, SpinnerComponent],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  @Input() productId: string;
  product = signal<ProductWithDetails | null>(null);
  loading = signal<boolean>(true);

  constructor(
    public activeModal: NgbActiveModal,
    private productService: ProductService,
  ) {
    effect(() => {
      const productDetails = this.productService.getProductDetails();
      if (productDetails() !== null) {
        this.product.set(productDetails());
        this.loading.set(false);
      }
    },
      {
        allowSignalWrites: true
      }
    );
  }

  ngOnInit(): void {
    this.fetchProductDetails();
  }

  fetchProductDetails(): void {
    this.loading.set(true);
    this.productService.getProductById(this.productId);
  }
}
