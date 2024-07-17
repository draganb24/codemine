import { Component, OnInit } from '@angular/core';
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
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchText: string = '';
  page: number = 1;
  pageSize: number = 5;
  collectionSize: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    config: NgbPaginationConfig
  ) {
    config.pageSize = this.pageSize;
    config.maxSize = 10;
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.page = +params['skip'] || 1;
      this.pageSize = +params['limit'] || 5;
      this.fetchProducts();
    });
  }

  fetchProducts(): void {
    const skip = (this.page - 1) * this.pageSize;
    this.productService.getProducts(this.pageSize, skip).subscribe((data) => {
      this.products = data.products;
      this.collectionSize = data.total;
      this.filteredProducts = this.products;
    });
  }

  onSearchTextChange(searchText: string): void {
    this.searchText = searchText;
    this.filterProducts();
  }

  filterProducts(): void {
    if (this.searchText.trim()) {
      this.productService.searchProducts(this.searchText).subscribe((data) => {
        this.filteredProducts = data;
        this.collectionSize = data.length;
      });
    } else {
      this.filteredProducts = this.products;
      this.collectionSize = this.products.length;
    }
  }

  onPageChange(): void {
    this.fetchProducts();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.page = 1;
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
