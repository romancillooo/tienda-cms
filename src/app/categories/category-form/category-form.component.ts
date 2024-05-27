import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: UntypedFormGroup;
  categoryId!: number;

  constructor(
    private fb: UntypedFormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      path: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryId = +this.route.snapshot.params['id']; // Convertir a número
    if (this.categoryId) {
      this.categoryService.getCategory(this.categoryId).subscribe(data => {
        this.categoryForm.patchValue(data);
      });
    }
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      const category: Category = this.categoryForm.value;
      if (this.categoryId) {
        category.id = this.categoryId;
        this.categoryService.updateCategory(category).subscribe(() => {
          this.router.navigate(['/categories']);
        });
      } else {
        this.categoryService.createCategory(category).subscribe(() => {
          this.router.navigate(['/categories']);
        });
      }
    }
  }
}
