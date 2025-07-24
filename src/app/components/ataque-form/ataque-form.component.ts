import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AtaqueService, AtaqueDTO, Severidad } from '../../services/ataque.service';
import { AmenazaService, AmenazaDTO } from '../../services/amenaza.service';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-ataque-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ataque-form.component.html',
  styleUrls: ['./ataque-form.component.css']
})
export class AtaqueFormComponent implements OnInit {
  ataqueForm: FormGroup;
  esEdicion = false;
  ataqueId: number | null = null;
  amenazas: AmenazaDTO[] = [];
  loading = false;
  error = '';
  currentUser: LoginResponse | null = null;
  amenazaIdPreseleccionada: number | null = null;

  constructor(
    private fb: FormBuilder,
    private ataqueService: AtaqueService,
    private amenazaService: AmenazaService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.ataqueForm = this.fb.group({
      tipo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      vector: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      sistemaAfectado: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(150)]],
      severidad: ['', [Validators.required]],
      fechaEvento: [''],
      amenazaId: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.cargarAmenazas();
    
    // Verificar si hay una amenaza preseleccionada desde query params
    this.route.queryParams.subscribe(params => {
      if (params['amenazaId']) {
        this.amenazaIdPreseleccionada = +params['amenazaId'];
      }
    });
    
    // Verificar si es edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.esEdicion = true;
        this.ataqueId = +params['id'];
        this.cargarAtaque();
      }
    });
  }

  cargarAmenazas(): void {
    this.amenazaService.listarTodas().subscribe({
      next: (amenazas) => {
        this.amenazas = amenazas;
        
        // Si hay una amenaza preseleccionada, establecerla en el formulario
        if (this.amenazaIdPreseleccionada && !this.esEdicion) {
          this.ataqueForm.patchValue({
            amenazaId: this.amenazaIdPreseleccionada
          });
        }
      },
      error: (error) => {
        this.error = 'Error al cargar las amenazas: ' + (error.error?.message || error.message);
      }
    });
  }

  cargarAtaque(): void {
    if (this.ataqueId) {
      this.loading = true;
      this.ataqueService.obtenerPorId(this.ataqueId).subscribe({
        next: (ataque) => {
          this.ataqueForm.patchValue({
            tipo: ataque.tipo,
            vector: ataque.vector,
            sistemaAfectado: ataque.sistemaAfectado,
            severidad: ataque.severidad,
            fechaEvento: ataque.fechaEvento,
            amenazaId: ataque.amenazaId
          });
          this.loading = false;
        },
        error: (error) => {
          this.error = 'Error al cargar el ataque: ' + (error.error?.message || error.message);
          this.loading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (this.ataqueForm.valid) {
      this.loading = true;
      this.error = '';
      
      const ataqueData: AtaqueDTO = {
        ...this.ataqueForm.value,
        fechaEvento: this.ataqueForm.value.fechaEvento || undefined
      };

      const operation = this.esEdicion 
        ? this.ataqueService.actualizar(this.ataqueId!, ataqueData)
        : this.ataqueService.crear(ataqueData);

      operation.subscribe({
        next: (response) => {
          alert(`Ataque ${this.esEdicion ? 'actualizado' : 'creado'} exitosamente`);
          this.volver();
        },
        error: (error) => {
          this.error = `Error al ${this.esEdicion ? 'actualizar' : 'crear'} el ataque: ` + 
                      (error.error?.message || error.message);
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  volver(): void {
    if (this.amenazaIdPreseleccionada) {
      this.router.navigate(['/ataques/amenaza', this.amenazaIdPreseleccionada]);
    } else {
      this.router.navigate(['/ataques']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.ataqueForm.controls).forEach(key => {
      const control = this.ataqueForm.get(key);
      control?.markAsTouched();
    });
  }

  hasError(field: string, error: string): boolean {
    const control = this.ataqueForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.ataqueForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  getSeveridadOptions() {
    return [
      { value: 'BAJA', label: '🟢 Baja' },
      { value: 'MODERADA', label: '🟡 Moderada' },
      { value: 'ALTA', label: '🟠 Alta' },
      { value: 'CRITICA', label: '🔴 Crítica' }
    ];
  }
}
