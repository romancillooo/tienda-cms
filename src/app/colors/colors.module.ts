import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ColorsRoutingModule } from './colors-routing.module';
import { ColorListComponent } from './color-list/color-list.component';
import { ColorFormComponent } from './color-form/color-form.component';

@NgModule({
  declarations: [ColorListComponent, ColorFormComponent],
  imports: [CommonModule, ReactiveFormsModule, ColorsRoutingModule]
})
export class ColorsModule {}
