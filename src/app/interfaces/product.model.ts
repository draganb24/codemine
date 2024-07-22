export interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  thumbnail: string;
  addedToCheckout?: boolean;
}
