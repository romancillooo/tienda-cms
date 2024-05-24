import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { Brand } from '../../models/brand.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  productId!: number;
  brands: Brand[] = [];
  categories: Category[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      brand_id: ['', Validators.required],
      category_id: ['', Validators.required],
      price: [0, Validators.required],
      image: [''],
      available_sizes_string: [''], // Campo temporal para la cadena de tamaños disponibles
      liked: [false]
    });
  }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.params['id'];
    this.loadBrands();
    this.loadCategories();
    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe(data => {
        const availableSizesString = Array.isArray(data.available_sizes) ? data.available_sizes.join(', ') : '';
        const formData = {
          ...data,
          available_sizes_string: availableSizesString
        };
        this.productForm.patchValue(formData);
      });
    }
  }

  loadBrands() {
    this.brandService.getBrands().subscribe(data => {
      this.brands = data;
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formValue = this.productForm.value;
      const product: Product = {
        name: formValue.name,
        brand_id: formValue.brand_id,
        category_id: formValue.category_id,
        price: formValue.price,
        image: formValue.image,
        available_sizes: formValue.available_sizes_string.split(',').map((size: string) => size.trim()),
        liked: formValue.liked
      };

      if (this.productId) {
        product.id = this.productId;
        this.productService.updateProduct(product).subscribe(() => {
          this.router.navigate(['/products']);
        });
      } else {
        this.productService.createProduct(product).subscribe(() => {
          this.router.navigate(['/products']);
        });
      }
    }
  }
}
