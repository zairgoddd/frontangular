import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AmenazaService, AmenazaDTO, NivelRiesgo } from '../../services/amenaza.service';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-amenaza-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './amenaza-form.component.html',
  styleUrls: ['./amenaza-form.component.css']
})
export class AmenazaFormComponent implements OnInit {
  amenazaForm: FormGroup;
  esEdicion = false;
  amenazaId: number | null = null;
  loading = false;
  error = '';
  currentUser: LoginResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private amenazaService: AmenazaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.amenazaForm = this.fb.group({
      tipo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      nivelRiesgo: ['', [Validators.required]],
      fechaDeteccion: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Verificar si es edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.esEdicion = true;
        this.amenazaId = +params['id'];
        this.cargarAmenaza();
      }
    });
  }

  cargarAmenaza(): void {
    if (this.amenazaId) {
      this.loading = true;
      this.amenazaService.obtenerPorId(this.amenazaId).subscribe({
        next: (amenaza) => {
          this.amenazaForm.patchValue({
            tipo: amenaza.tipo,
            descripcion: amenaza.descripcion,
            nivelRiesgo: amenaza.nivelRiesgo,
            fechaDeteccion: amenaza.fechaDeteccion
          });
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar la amenaza: ' + (error.error?.message || error.message);
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.amenazaForm.valid) {
      this.loading = true;
      this.error = '';

      const amenazaData: AmenazaDTO = {
        ...this.amenazaForm.value,
        fechaDeteccion: this.amenazaForm.value.fechaDeteccion || undefined
      };

      const operation = this.esEdicion 
        ? this.amenazaService.actualizar(this.amenazaId!, amenazaData)
        : this.amenazaService.crear(amenazaData);

      operation.subscribe({
        next: (response) => {
          alert(`Amenaza ${this.esEdicion ? 'actualizada' : 'creada'} exitosamente`);
          this.volver();
        },
        error: (error) => {
          this.error = `Error al ${this.esEdicion ? 'actualizar' : 'crear'} la amenaza: ` + 
                      (error.error?.message || error.message);
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  volver(): void {
    this.router.navigate(['/amenazas']);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.amenazaForm.controls).forEach(key => {
      const control = this.amenazaForm.get(key);
      control?.markAsTouched();
    });
  }

  hasError(field: string, error: string): boolean {
    const control = this.amenazaForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.amenazaForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}