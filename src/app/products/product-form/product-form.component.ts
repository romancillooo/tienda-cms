import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { BrandService } from '../../services/brand.service';
import { CategoryService } from '../../services/category.service';
import { ColorService } from '../../services/color.service';
import { Brand } from '../../models/brand.model';
import { Category } from '../../models/category.model';
import { Color } from '../../models/color.model';
import { Product } from '../../models/product.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: UntypedFormGroup;
  productId!: number;
  brands: Brand[] = [];
  categories: Category[] = [];
  colors: Color[] = [];
  selectedColors: Color[] = [];
  selectedFile: File | null = null;
  selectedFile2: File | null = null;
  galleryFiles: { [key: number]: File[] } = {};
  galleryPreviews: { [key: number]: any[] } = {};
  deletedGalleryImages: string[] = [];
  originalGalleryImages: string[] = [];
  currentFileInputColorId: number | null = null;
  previewUrl: string | null = null;
  previewUrl2: string | null = null;

  constructor(
    private fb: UntypedFormBuilder,
    private productService: ProductService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private colorService: ColorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      brand_id: ['', Validators.required],
      category_id: ['', Validators.required],
      price: [0, Validators.required],
      available_sizes_string: [''],
      colors: this.fb.array([]),
      gallery: this.fb.array([]),
      image: [null, Validators.required],
      image2: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.productId = +this.route.snapshot.params['id'];
    this.loadBrands();
    this.loadCategories();
    this.loadColors();

    if (this.productId) {
      this.productService.getProduct(this.productId).subscribe((product: Product) => {
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          brand_id: product.brand_id,
          category_id: product.category_id,
          price: product.price,
          available_sizes_string: (product.available_sizes || []).join(', '),
          image: product.image,
          image2: product.image2
        });
        this.previewUrl = `${environment.apiHost}${environment.assetsBasePath}/products-images/${product.image}`;
        this.previewUrl2 = `${environment.apiHost}${environment.assetsBasePath}/products-images/${product.image2}`;
        this.selectedColors = product.colors
          .map((color: any) => {
            const existingColor = this.colors.find(c => c.id === color.color_id);
            if (existingColor) {
              existingColor.galleryImages = color.galleryImages;
              existingColor.product_color_id = color.product_color_id;
              this.initializeGallery(existingColor.id, color.galleryImages);
              this.addColorSizeInput(existingColor.id, (color.sizes || []).join(', '));
            }
            return existingColor;
          })
          .filter((color): color is Color => color !== undefined);
        this.originalGalleryImages = product.colors.reduce((acc: any[], color: any) => acc.concat(color.galleryImages), []);
      });
    }
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

  loadColors() {
    this.colorService.getColors().subscribe(colors => {
      this.colors = colors;
    });
  }

  toggleColorSelection(color: Color) {
    const index = this.selectedColors.findIndex(c => c.id === color.id);
    if (index !== -1) {
      this.selectedColors.splice(index, 1);
      delete this.galleryPreviews[color.id];
      delete this.galleryFiles[color.id];
      this.removeColorSizeInput(color.id);
    } else {
      this.selectedColors.push(color);
      this.initializeGallery(color.id, []);
      this.addColorSizeInput(color.id, '');
    }
  }

  isColorSelected(color: Color): boolean {
    return this.selectedColors.some(c => c.id === color.id);
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (field === 'image') {
          this.previewUrl = e.target.result;
        } else if (field === 'image2') {
          this.previewUrl2 = e.target.result;
        }
      };
      reader.readAsDataURL(file);
      if (field === 'image') {
        this.selectedFile = file;
        this.productForm.patchValue({ image: file });
      } else if (field === 'image2') {
        this.selectedFile2 = file;
        this.productForm.patchValue({ image2: file });
      }
    }
  }

  openFileBrowser(color: Color) {
    this.currentFileInputColorId = color.id;
    const fileInput = document.getElementById('galleryInput') as HTMLInputElement;
    fileInput.click();
  }

  onGalleryFileChange(event: any) {
    const files = Array.from(event.target.files) as File[];
    if (this.currentFileInputColorId !== null) {
      this.initializeGallery(this.currentFileInputColorId);
      files.forEach(file => {
        this.galleryFiles[this.currentFileInputColorId!].push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.galleryPreviews[this.currentFileInputColorId!].push({ src: e.target.result, file });
        };
        reader.readAsDataURL(file);
      });
    } else {
      console.error("No color is selected for the gallery input.");
    }
  }

  removeImage(preview: any, color: Color, event: Event) {
    event.stopPropagation();
    const previews = this.galleryPreviews[color.id];
    const files = this.galleryFiles[color.id];
    if (previews && files) {
      const index = previews.indexOf(preview);
      if (index !== -1) {
        previews.splice(index, 1);
        files.splice(index, 1);
        if (preview.src.startsWith(`${environment.apiHost}${environment.assetsBasePath}/product-gallery-images/`)) {
          const imageName = preview.src.split('/').pop();
          this.deletedGalleryImages.push(imageName!);
        }
      }
    } else {
      console.error(`No previews or files found for color id ${color.id}`);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, color: Color) {
    event.preventDefault();
    const files = Array.from(event.dataTransfer!.files);
    this.initializeGallery(color.id);
    files.forEach(file => {
      this.galleryFiles[color.id].push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.galleryPreviews[color.id].push({ src: e.target.result, file });
      };
      reader.readAsDataURL(file);
    });
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')!.value);
    formData.append('description', this.productForm.get('description')!.value);
    formData.append('brand_id', this.productForm.get('brand_id')!.value);
    formData.append('category_id', this.productForm.get('category_id')!.value);
    formData.append('price', this.productForm.get('price')!.value);
    formData.append('available_sizes', this.productForm.get('available_sizes_string')!.value);
    formData.append('colors', JSON.stringify(this.selectedColors.map(color => ({
      id: color.id,
      product_color_id: color['product_color_id'],
      sizes: this.productForm.get(`sizes_${color.id}`)!.value.split(',').map((size: string) => size.trim())
    }))));

    const currentImageValue = this.productForm.get('image')!.value;
    const currentImageValue2 = this.productForm.get('image2')!.value;

    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name);
    } else if (typeof currentImageValue === 'string') {
      formData.append('image', currentImageValue);
    } else {
      console.error("No se ha seleccionado una imagen principal.");
      return;
    }

    if (this.selectedFile2) {
      formData.append('image2', this.selectedFile2, this.selectedFile2.name);
    } else if (typeof currentImageValue2 === 'string') {
      formData.append('image2', currentImageValue2);
    } else {
      console.error("No se ha seleccionado la segunda imagen principal.");
      return;
    }

    this.selectedColors.forEach(color => {
      this.galleryFiles[color.id].forEach(file => {
        formData.append(`galleryImages_${color.id}`, file);
      });
    });

    formData.append('deletedGalleryImages', JSON.stringify(this.deletedGalleryImages));

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

  private getColorIdFromImage(image: string): number {
    const segments = image.split('_');
    return parseInt(segments[segments.length - 1], 10);
  }

  private initializeGallery(colorId: number, galleryImages: string[] = []): void {
    if (!this.galleryFiles[colorId]) {
      this.galleryFiles[colorId] = [];
    }
    if (!this.galleryPreviews[colorId]) {
      this.galleryPreviews[colorId] = galleryImages.map(img => ({ src: `${environment.apiHost}${environment.assetsBasePath}/product-gallery-images/${img}` }));
    }
  }

  private addColorSizeInput(colorId: number, sizes: string) {
    this.productForm.addControl(`sizes_${colorId}`, new FormControl(sizes, Validators.required));
  }

  private removeColorSizeInput(colorId: number) {
    this.productForm.removeControl(`sizes_${colorId}`);
  }
}
