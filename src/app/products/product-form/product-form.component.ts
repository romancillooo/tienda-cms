import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
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
  selectedFile: File | null = null;
  galleryFiles: File[] = [];
  previewUrl: any = null;
  galleryPreviews: any[] = [];
  deletedGalleryImages: string[] = [];
  originalGalleryImages: string[] = [];

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
        let availableSizesString = '';
        if (Array.isArray(data.available_sizes)) {
          availableSizesString = data.available_sizes.join(', ');
        } else if (typeof data.available_sizes === 'string') {
          availableSizesString = (data.available_sizes as string).replace(/[\[\]\"]/g, '');
        }

        const formData = {
          ...data,
          available_sizes_string: availableSizesString
        };
        this.productForm.patchValue(formData);
        this.previewUrl = `http://localhost:3000/uploads/products-images/${data.image}`;
        if (data.galleryImages && Array.isArray(data.galleryImages)) {
          this.galleryPreviews = data.galleryImages.map((img: string) => `http://localhost:3000/uploads/product-gallery-images/${img}`);
          this.originalGalleryImages = [...data.galleryImages];
        } else if (typeof data.galleryImages === 'string') {
          try {
            const parsedGalleryImages = JSON.parse(data.galleryImages);
            if (Array.isArray(parsedGalleryImages)) {
              this.galleryPreviews = parsedGalleryImages.map((img: string) => `http://localhost:3000/uploads/product-gallery-images/${img}`);
              this.originalGalleryImages = [...parsedGalleryImages];
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
        const reader = new FileReader();
        reader.onload = (e: any) => this.galleryPreviews.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer && event.dataTransfer.files.length) {
      for (const file of Array.from(event.dataTransfer.files)) {
        this.galleryFiles.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => this.galleryPreviews.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  openFileBrowser(): void {
    const fileInput = document.getElementById('galleryInput') as HTMLInputElement;
    fileInput.click();
  }

  removeImage(preview: any, event: Event) {
    event.stopPropagation();
    const index = this.galleryPreviews.indexOf(preview);
    if (index > -1) {
      this.galleryPreviews.splice(index, 1);
      const removedFile = this.galleryFiles[index];
      if (removedFile) {
        this.galleryFiles.splice(index, 1);
      } else {
        const removedImage = this.originalGalleryImages.splice(index, 1)[0];
        this.deletedGalleryImages.push(removedImage);
      }
    }
  }


  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('brand_id', this.productForm.get('brand_id')?.value);
      formData.append('category_id', this.productForm.get('category_id')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('available_sizes', JSON.stringify(this.productForm.get('available_sizes_string')?.value.split(',').map((size: string) => size.trim())));
      formData.append('liked', this.productForm.get('liked')?.value);

      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      } else {
        formData.append('image', this.productForm.get('image')?.value);
      }

      for (const file of this.galleryFiles) {
        formData.append('galleryImages', file);
      }

      formData.append('deletedGalleryImages', JSON.stringify(this.deletedGalleryImages));

      if (this.galleryFiles.length === 0) {
        formData.append('galleryImages', JSON.stringify(this.originalGalleryImages));
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
