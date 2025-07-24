import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: LoginResponse | null = null;
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    console.log('Dashboard iniciando...');
    
    // Solo obtener usuario si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.authService.getCurrentUser();
      console.log('Usuario actual:', this.currentUser);
      
      // Si no hay usuario, redirigir a login
      if (!this.currentUser) {
        console.log('No hay usuario, redirigiendo a login');
        this.router.navigate(['/login']);
        return;
      }
    }
    
    this.isLoading = false;
  }

  logout(): void {
    console.log('Cerrando sesión...');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}