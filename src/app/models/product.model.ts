import { Color } from './color.model';

export interface Product {
  id: number;
  name: string;
  brand_id: number;
  category_id: number;
  price: number;
  available_sizes: string[];
  image: string;
  image2: string;
  colors: Color[];
  galleryImages?: string[];
  brand_name?: string;
  category_name?: string;
  imageUrl?: string;
}
