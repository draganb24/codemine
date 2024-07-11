import { Product } from "./product.model";

export interface ProductWithDetails extends Product {
  description: string;
  category: string;
  brand: string;
  sku: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  weight: number;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
}
