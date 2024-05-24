import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteModalComponent } from '../../confirm-delete-modal/confirm-delete-modal.component';
import { BrandService } from '../../services/brand.service';
import { Brand } from '../../models/brand.model';
import { environment } from '../../../environments/environment';
import { DeletedModalComponent } from '../../deleted-modal/deleted-modal.component';

@Component({
  selector: 'app-brand-list',
  templateUrl: './brand-list.component.html',
  styleUrls: ['./brand-list.component.scss']
})
export class BrandListComponent implements OnInit {
  brands: Brand[] = [];
  apiHost: string = environment.apiHost;
  assetsBasePath: string = environment.assetsBasePath;

  constructor(private dialog: MatDialog, private brandService: BrandService) { }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.getBrands().subscribe(data => {
      this.brands = data;
    });
  }

  openConfirmDeleteDialog(brand: Brand): void {
    const dialogRef = this.dialog.open(ConfirmDeleteModalComponent, {
      width: '250px',
      data: { entityName: brand.name, entityType: 'la marca' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteBrand(brand.id);
      }
    });
  }

  deleteBrand(id: number) {
    this.brandService.deleteBrand(id).subscribe(() => {
      this.loadBrands();
      this.openDeletedDialog();
    });
  }

  openDeletedDialog(): void {
    this.dialog.open(DeletedModalComponent, {
      width: '250px'
    });
  }
}
