import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WritableSignal, signal, effect } from '@angular/core';
import { Product } from '../interfaces/product.model';
import { ProductWithDetails } from '../interfaces/product-with-details.model';
import { catchError, map, of, Subject, debounceTime, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';
  private productDetails: WritableSignal<ProductWithDetails | null> = signal(null);

  private searchSubject = new Subject<string>();
  private searchedProducts = signal<Product[]>([]);
  private products = signal<Product[]>([]);
  private collectionSize = signal(0);

  constructor(private http: HttpClient) {
    effect(() => {
      const query = this.searchSubject.asObservable();
      query.pipe(
        debounceTime(500),
        switchMap(searchQuery => this.fetchSearchedProducts(searchQuery))
      ).subscribe(products => this.searchedProducts.set(products));
    },
      {
        allowSignalWrites: true
      });
  }

  getProducts(limit: number = 0, skip: number = 0) {
    return this.http.get<any>(`${this.apiUrl}/?limit=${limit}&skip=${skip}`).pipe(
      map(response => {
        const products = response.products.map((product: any) => this.transformToProductModel(product));
        this.products.set(products);
        this.collectionSize.set(response.total);
        return { products, total: response.total };
      })
    );
  }

  getProductById(id: string): void {
    this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(product => this.transformToProductWithDetailsModel(product)),
      catchError(error => {
        console.error('Error fetching product details', error);
        return of(null);
      })
    ).subscribe({
      next: (productWithDetails) => this.productDetails.set(productWithDetails),
      error: (error) => console.error('Error fetching product details', error)
    });
  }

  getProductDetails() {
    return this.productDetails.asReadonly();
  }

  searchProducts(query: string): void {
    this.searchSubject.next(query);
  }

  getSearchedProducts() {
    return this.searchedProducts;
  }

  private fetchSearchedProducts(query: string) {
    if (query) {
      return this.http.get<any>(`${this.apiUrl}/search?q=${query}`).pipe(
        map(response => response.products.map((product: any) => this.transformToProductModel(product)))
      );
    } else {
      return of([]);
    }
  }

  private transformToProductWithDetailsModel(product: any): ProductWithDetails {
    const productModel = this.transformToProductModel(product);
    return {
      ...productModel,
      description: product.description,
      category: product.category,
      brand: product.brand,
      sku: product.sku,
      dimensions: {
        width: product.dimensions.width,
        height: product.dimensions.height,
        depth: product.dimensions.depth,
      },
      weight: product.weight,
      warrantyInformation: product.warrantyInformation,
      shippingInformation: product.shippingInformation,
      availabilityStatus: product.availabilityStatus,
      returnPolicy: product.returnPolicy,
    };
  }

  private transformToProductModel(product: any): Product {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      stock: product.stock,
      thumbnail: product.thumbnail,
    };
  }
}
