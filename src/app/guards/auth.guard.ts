import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  try {
    if (authService.isAuthenticated()) {
      return true;
    } else {
      console.log('Usuario no autenticado, redirigiendo a login');
      router.navigate(['/login']);
      return false;
    }
  } catch (error) {
    console.error('Error en authGuard:', error);
    router.navigate(['/login']);
    return false;
  }
};