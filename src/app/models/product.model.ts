export interface Product {
  id?: number; // `id` puede ser opcional
  brand_id: number;
  category_id: number;
  name: string;
  price: number;
  image: string;
  available_sizes: string[]; // Define como un array de cadenas
  liked: boolean;
  brand?: string; // Opcional
  category?: string; // Opcional
}
