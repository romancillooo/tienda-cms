import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesChartComponent } from './sales-chart/sales-chart.component';

@NgModule({
  declarations: [SalesChartComponent],
  imports: [CommonModule],
  exports: [SalesChartComponent]
})
export class ChartsModule { }
