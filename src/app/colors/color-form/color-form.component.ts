import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ColorService } from '../../services/color.service';
import Pickr from '@simonwep/pickr';

@Component({
  selector: 'app-color-form',
  templateUrl: './color-form.component.html',
  styleUrls: ['./color-form.component.scss']
})
export class ColorFormComponent implements OnInit, AfterViewInit, OnDestroy {
  colorForm: UntypedFormGroup;
  colorId!: number;
  color: string = '#000000';  // Inicializa con un color por defecto
  pickr: any;

  constructor(
    private fb: UntypedFormBuilder,
    private colorService: ColorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.colorForm = this.fb.group({
      name: ['', Validators.required],
      hex_code: [this.color, Validators.required]
    });
  }

  ngOnInit(): void {
    this.colorId = +this.route.snapshot.params['id'];
    if (this.colorId) {
      this.colorService.getColor(this.colorId).subscribe(data => {
        this.color = data.hex_code;
        this.colorForm.patchValue(data);
        if (this.pickr) {
          this.pickr.setColor(this.color);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    this.pickr = Pickr.create({
      el: '.color-picker',
      theme: 'classic', // or 'monolith', or 'nano'
      default: this.color,
      showAlways: true,  // Mostrar siempre el color picker
      inline: true,  // Mostrar el color picker en línea
      components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
          hex: true,
          rgba: true,
          hsla: true,
          hsva: true,
          cmyk: true,
          input: true,
          clear: true,
          save: true
        }
      }
    });

    this.pickr.on('change', (color: any) => {
      this.color = color.toHEXA().toString();
      this.colorForm.patchValue({ hex_code: this.color });
    });
  }

  ngOnDestroy(): void {
    if (this.pickr) {
      this.pickr.destroy();
    }
  }

  onSubmit(): void {
    if (this.colorForm.valid) {
      if (this.colorId) {
        this.colorService.updateColor(this.colorId, this.colorForm.value).subscribe(() => {
          this.router.navigate(['/colors']);
        });
      } else {
        this.colorService.createColor(this.colorForm.value).subscribe(() => {
          this.router.navigate(['/colors']);
        });
      }
    }
  }
}
