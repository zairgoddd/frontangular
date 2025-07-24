import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const credentials = this.loginForm.value;
      console.log('Intentando login con:', credentials.username);
      
      this.authService.login(credentials).subscribe({
        next: (response) => {
          this.isLoading = false;
          console.log('Login exitoso:', response);
          
          // Pequeña pausa para asegurar que el token esté guardado
          setTimeout(() => {
            // Redirigir según el rol
            switch(response.role) {
              case 'ADMINISTRADOR':
                console.log('Redirigiendo a /admin');
                this.router.navigate(['/admin']);
                break;
              case 'ANALISTA':
                console.log('Redirigiendo a /analista');
                this.router.navigate(['/analista']);
                break;
              case 'CLIENTE':
                console.log('Redirigiendo a /cliente');
                this.router.navigate(['/cliente']);
                break;
              default:
                console.log('Redirigiendo a /dashboard');
                this.router.navigate(['/dashboard']);
                break;
            }
          }, 100);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error completo en login:', error);
          
          // Manejo más específico de errores
          if (error.status === 401) {
            this.errorMessage = 'Credenciales inválidas';
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
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  // Métodos helper para mostrar errores
  hasError(field: string, error: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}