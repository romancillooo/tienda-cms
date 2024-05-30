import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LatestProductsComponent } from './latest-products/latest-products.component';

@NgModule({
  declarations: [LatestProductsComponent],
  imports: [CommonModule],
  exports: [LatestProductsComponent]
})
export class ProductsModule { }
