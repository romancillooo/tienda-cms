import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteModalComponent } from '../../confirm-delete-modal/confirm-delete-modal.component';
import { DeletedModalComponent } from '../../deleted-modal/deleted-modal.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];

  constructor(private dialog: MatDialog, private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
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
}
