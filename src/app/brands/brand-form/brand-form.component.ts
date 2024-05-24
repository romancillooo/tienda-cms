import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/brand.model';

@Component({
  selector: 'app-brand-form',
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.scss']
})
export class BrandFormComponent implements OnInit {
  brandForm: FormGroup;
  brandId!: number;
  selectedFile: File | null = null;
  previewUrl: any = null;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.brandForm = this.fb.group({
      name: ['', Validators.required],
      image: [''],
      path: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.brandId = this.route.snapshot.params['id'];
    if (this.brandId) {
      this.brandService.getBrand(this.brandId).subscribe(data => {
        this.brandForm.patchValue(data);
        this.previewUrl = `http://localhost:3000/uploads/brands-logos/${data.image}`;
      });
    }
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

  onSubmit() {
    if (this.brandForm.valid) {
      const formData = new FormData();
      formData.append('name', this.brandForm.get('name')?.value);
      formData.append('path', this.brandForm.get('path')?.value);
      if (this.selectedFile) {
        formData.append('image', this.selectedFile); // No es necesario cambiar nada aquí
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
