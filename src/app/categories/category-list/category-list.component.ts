import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteModalComponent } from '../../confirm-delete-modal/confirm-delete-modal.component';
import { DeletedModalComponent } from '../../deleted-modal/deleted-modal.component';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];

  constructor(private dialog: MatDialog, private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  openConfirmDeleteDialog(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      width: '250px',
      data: { entityName: category.name, entityType: 'la categoría' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCategory(category.id);
      }
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe(() => {
      this.loadCategories();
      this.openDeletedDialog();
    });
  }

  openDeletedDialog(): void {
    this.dialog.open(DeletedModalComponent, {
      width: '250px'
    });
  }
}
