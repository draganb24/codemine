import { Component, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { NgbModalModule, NgbPaginationConfig, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductDetailComponent } from '../product-detail/product-detail.component';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.model';
import { ControlsComponent } from '../controls/controls.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [FormsModule, NgbPaginationModule, CommonModule, NgbModalModule, ProductDetailComponent, ControlsComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  filteredProducts = signal<Product[]>([]);
  searchText = signal<string>('');
  page = signal<number>(1);
  pageSize = signal<number>(5);
  collectionSize = signal<number>(0);

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    config: NgbPaginationConfig
  ) {
    config.pageSize = this.pageSize();
    config.maxSize = 10;
  }

  ngOnInit(): void {
    this.initializePagination();
    this.initializeSearch();
  }

  initializePagination(): void {
    this.route.queryParams.subscribe(params => {
      this.page.set(+params['skip'] || 1);
      this.pageSize.set(+params['limit'] || 5);
      this.fetchProducts();
    });
  }

  initializeSearch(): void {
    this.productService.getSearchedProducts().subscribe(data => {
      this.filteredProducts.set(data);
      this.collectionSize.set(data.length);
    });

  }

  fetchProducts(): void {
    const skip = (this.page() - 1) * this.pageSize();
    this.productService.getProducts(this.pageSize(), skip).subscribe((data) => {
      this.products.set(data.products);
      this.collectionSize.set(data.total);
      this.filteredProducts.set(data.products);
    });
  }

  onSearchTextChange(searchText: string): void {
    this.searchText.set(searchText);
    this.productService.searchProducts(searchText);
  }

  filterProducts(): void {
    if (!this.searchText().trim()) {
      this.filteredProducts.set(this.products());
      this.collectionSize.set(this.products().length);
    }
  }

  onPageChange(): void {
    this.fetchProducts();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize.set(pageSize);
    this.page.set(1);
    this.fetchProducts();
  }

  addToCheckout(product: Product) {
    this.cartService.addToCart(product);
    product.stock -= 1;
  }

  removeFromCheckout(product: Product) {
    this.cartService.removeFromCart(product.id);
    product.stock += 1;
  }

  openProductWithDetailsModal(productId: number): void {
    const modalRef = this.modalService.open(ProductDetailComponent);
    modalRef.componentInstance.productId = productId;
  }
}
