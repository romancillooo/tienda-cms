import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-latest-products',
  templateUrl: './latest-products.component.html',
  styleUrls: ['./latest-products.component.scss']
})
export class LatestProductsComponent implements OnInit {
  latestProducts: Product[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadLatestProducts();
  }

  loadLatestProducts() {
    this.productService.getLatestProducts().subscribe((data: Product[]) => {
      this.latestProducts = data.map(product => {
        return {
          ...product,
          imageUrl: `http://localhost:3000/uploads/products-images/${product.image}`
        };
      });
    });
  }
}
