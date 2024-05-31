import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { environment } from '../../../environments/environment';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss']
})
export class BrandFormComponent implements OnInit {
  brandForm: UntypedFormGroup;
  brandId!: number;
  selectedFiles: { [key: string]: File | null } = { image: null, banner: null };
  imagePreviewUrl: any = null;
  bannerPreviewUrl: any = null;

  constructor(
    private fb: UntypedFormBuilder,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      image: [''],
      banner: [''],
      path: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.brandId = this.route.snapshot.params['id'];
    if (this.brandId) {
      this.brandService.getBrand(this.brandId).subscribe(data => {
        this.brandForm.patchValue(data);
        this.imagePreviewUrl = environment.apiHost + environment.assetsBasePath + '/brands-logos/' + data.image;
        this.bannerPreviewUrl = environment.apiHost + environment.assetsBasePath + '/brands-banners/' + data.banner;
      });
    }
  }

  onFileChange(event: any, field: string) {
    if (event.target.files && event.target.files.length) {
      this.selectedFiles[field] = event.target.files[0];

      // Vista previa
      const reader = new FileReader();
      reader.onload = (e: any) => {
        if (field === 'image') {
          this.imagePreviewUrl = e.target.result;
        } else if (field === 'banner') {
          this.bannerPreviewUrl = e.target.result;
        }
      };
      if (this.selectedFiles[field]) {
        reader.readAsDataURL(this.selectedFiles[field] as File);
      }
    }
  }

  onSubmit() {
    if (this.brandForm.valid) {
      const formData = new FormData();
      formData.append('name', this.brandForm.get('name')?.value);
      formData.append('path', this.brandForm.get('path')?.value);
      if (this.selectedFiles['image']) {
        formData.append('image', this.selectedFiles['image']);
      } else {
        formData.append('image', this.brandForm.get('image')?.value);
      }
      if (this.selectedFiles['banner']) {
        formData.append('banner', this.selectedFiles['banner']);
      } else {
        formData.append('banner', this.brandForm.get('banner')?.value);
      }

      if (this.brandId) {
        this.brandService.updateBrand(this.brandId, formData).subscribe(() => {
          this.router.navigate(['/brands']);
        });
      } else {
        this.brandService.createBrand(formData).subscribe(() => {
          this.router.navigate(['/brands']);
        });
      }
    }
  }
}
