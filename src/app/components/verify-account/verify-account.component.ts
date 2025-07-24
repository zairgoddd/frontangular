import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.css']
})
export class VerifyAccountComponent implements OnInit {
  verifyForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.verifyForm = this.fb.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    // Obtener email de los query parameters
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      if (!this.email) {
        // Si no hay email, redirigir al login
        this.router.navigate(['/login']);
      }
    });
  }

  onSubmit(): void {
    if (this.verifyForm.valid && this.email) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const verifyData = {
        email: this.email,
        codigo: this.verifyForm.value.codigo
      };
      
      console.log('Verificando cuenta:', verifyData);
      
      this.authService.verifyAccount(verifyData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message;
          console.log('Verificación exitosa:', response);
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/login'], {
              queryParams: { verified: 'true', email: this.email }
            });
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en verificación:', error);
          
          if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Código de verificación inválido';
          } else if (error.status === 500) {
            this.errorMessage = 'Error interno del servidor. Intenta nuevamente.';
          } else if (error.status === 0) {
            this.errorMessage = 'No se puede conectar al servidor';
          } else {
            this.errorMessage = error.error?.message || 'Ha ocurrido un error inesperado';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.verifyForm.controls).forEach(key => {
      const control = this.verifyForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos helper para mostrar errores
  hasError(field: string, error: string): boolean {
    const control = this.verifyForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.verifyForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Función para reenviar código (opcional)
  resendCode(): void {
    // Aquí puedes implementar la lógica para reenviar el código
    console.log('Reenviando código a:', this.email);
    // Por ahora solo mostramos un mensaje
    alert('Funcionalidad de reenvío pendiente de implementar');
  }
}