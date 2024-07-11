import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../interfaces/product.model';
import { ProductWithDetails } from '../interfaces/product-with-details.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://dummyjson.com/products';

  constructor(private http: HttpClient) { }

  getProducts(limit: number = 0, skip: number = 0): Observable<{ products: Product[], total: number }> {
    return this.http.get<any>(`${this.apiUrl}/?limit=${limit}&skip=${skip}`).pipe(
      map(response => ({
        products: response.products.map((product: any) => this.transformToProductModel(product)),
        total: response.total
      }))
    );
  }

  searchProducts(query: string): Observable<Product[]> {
    return this.http.get<any>(`${this.apiUrl}/search?q=${query}`).pipe(
      map(response => response.products.map((product: any) => this.transformToProductModel(product)))
    );
  }

  getProductById(id: string): Observable<ProductWithDetails> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(product => this.transformToProductWithDetailsModel(product))
    );
  }

  private transformToProductModel(product: any): Product {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      stock: product.stock,
      thumbnail: product.thumbnail
    };
  }

  private transformToProductWithDetailsModel(product: any): ProductWithDetails {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      stock: product.stock,
      thumbnail: product.thumbnail,
      description: product.description,
      category: product.category,
      brand: product.brand,
      sku: product.sku,
      dimensions: {
        width: product.dimensions.width,
        height: product.dimensions.height,
        depth: product.dimensions.depth
      },
      weight: product.weight,
      warrantyInformation: product.warrantyInformation,
      shippingInformation: product.shippingInformation,
      availabilityStatus: product.availabilityStatus,
      returnPolicy: product.returnPolicy
    };
  }
}
