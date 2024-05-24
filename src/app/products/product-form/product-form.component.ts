import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { Brand } from '../../models/brand.model';
import { Category } from '../../models/category.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

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
  selectedFile: File | null = null;
  galleryFiles: File[] = [];
  previewUrl: any = null;
  galleryPreviews: any[] = [];

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
      available_sizes_string: [''],
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
        this.previewUrl = `http://localhost:3000/uploads/products-images/${data.image}`;
        // Cargar las imágenes de la galería
        if (data.galleryImages && Array.isArray(data.galleryImages)) {
          this.galleryPreviews = data.galleryImages.map((img: string) => `http://localhost:3000/uploads/product-gallery-images/${img}`);
        } else if (typeof data.galleryImages === 'string') {
          try {
            const parsedGalleryImages = JSON.parse(data.galleryImages);
            if (Array.isArray(parsedGalleryImages)) {
              this.galleryPreviews = parsedGalleryImages.map((img: string) => `http://localhost:3000/uploads/product-gallery-images/${img}`);
            }
          } catch (e) {
            console.error('Error parsing galleryImages:', e);
          }
        }
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

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      this.selectedFile = event.target.files[0];

      // Vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => this.previewUrl = e.target.result;
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  onGalleryFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      for (const file of event.target.files) {
        this.galleryFiles.push(file);

        // Vista previa
        const reader = new FileReader();
        reader.onload = (e: any) => this.galleryPreviews.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }

  onDrop(event: CdkDragDrop<string[]>): void {
    // Aquí puedes manejar el reordenamiento de las imágenes de la galería si es necesario
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('brand_id', this.productForm.get('brand_id')?.value);
      formData.append('category_id', this.productForm.get('category_id')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('available_sizes', this.productForm.get('available_sizes_string')?.value);
      formData.append('liked', this.productForm.get('liked')?.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      for (const file of this.galleryFiles) {
        formData.append('galleryImages', file);
      }

      if (this.productId) {
        this.productService.updateProduct(this.productId, formData).subscribe(() => {
          this.router.navigate(['/products']);
        });
      } else {
        this.productService.createProduct(formData).subscribe(() => {
          this.router.navigate(['/products']);
        });
      }
    }
  }

}
