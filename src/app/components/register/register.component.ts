import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      const registerData = this.registerForm.value;
      console.log('Registrando usuario:', registerData);
      
      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.successMessage = response.message;
          console.log('Registro exitoso:', response);
          
          // Redirigir a verificación después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/verify-account'], { 
              queryParams: { email: registerData.email } 
            });
          }, 2000);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en registro:', error);
          
          if (error.status === 400) {
            this.errorMessage = error.error?.message || 'Error en los datos proporcionados';
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
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos helper para mostrar errores
  hasError(field: string, error: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!(control?.invalid && control?.touched);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}