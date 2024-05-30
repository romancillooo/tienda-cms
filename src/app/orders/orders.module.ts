import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LatestOrdersComponent } from './latest-orders/latest-orders.component';

@NgModule({
  declarations: [LatestOrdersComponent],
  imports: [CommonModule],
  exports: [LatestOrdersComponent]
})
export class OrdersModule { }
