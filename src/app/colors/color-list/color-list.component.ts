import { Component, OnInit } from '@angular/core';
import { ColorService } from '../../services/color.service';
import { Color } from '../../models/color.model';

@Component({
  selector: 'app-color-list',
  templateUrl: './color-list.component.html',
  styleUrls: ['./color-list.component.scss']
})
export class ColorListComponent implements OnInit {
  colors: Color[] = [];

  constructor(private colorService: ColorService) { }

  ngOnInit(): void {
    this.loadColors();
  }

  loadColors(): void {
    this.colorService.getColors().subscribe(data => {
      this.colors = data;
    });
  }

  deleteColor(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este color?')) {
      this.colorService.deleteColor(id).subscribe(() => {
        this.loadColors();
      });
    }
  }
}
