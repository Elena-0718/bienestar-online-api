export interface ProductSeedData {
  name: string;
  description: string;
  price: number;
  stock: number;
  images?: string[];
  categorySlug: string;
}
