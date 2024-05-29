import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteModalComponent } from '../../confirm-delete-modal/confirm-delete-modal.component';
import { DeletedModalComponent } from '../../deleted-modal/deleted-modal.component';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { Product } from '../../models/product.model';
import { Brand } from '../../models/brand.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  brands: Brand[] = [];
  categories: Category[] = [];
  selectedBrand: string = '';
  selectedCategory: string = '';
  searchQuery: string = '';

  constructor(private dialog: MatDialog, private productService: ProductService, private brandService: BrandService, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadBrands();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
    });
  }

  loadBrands() {
    this.brandService.getBrands().subscribe(brands => {
      this.brands = brands;
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
    });
  }

  getProductImageUrl(image: string): string {
    return `http://localhost:3000/uploads/products-images/${image}`;
  }

  openConfirmDeleteDialog(product: Product): void {
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      width: '250px',
      data: { entityName: product.name, entityType: 'el producto' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(product.id!);
      }
    });
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
      this.openDeletedDialog();
    });
  }

  openDeletedDialog(): void {
    this.dialog.open(DeletedModalComponent, {
      width: '250px'
    });
  }

  filterProducts() {
    this.filteredProducts = this.products.filter(product => {
      return (!this.selectedBrand || product.brand_id === +this.selectedBrand) &&
             (!this.selectedCategory || product.category_id === +this.selectedCategory) &&
             (!this.searchQuery || product.name.toLowerCase().includes(this.searchQuery.toLowerCase()));
    });
  }

  searchProducts() {
    this.filterProducts();
  }
}
