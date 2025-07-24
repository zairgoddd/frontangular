//dashboard.component.ts
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
    if (isPlatformBrowser(this.platformId)) {
      this.currentUser = this.authService.getCurrentUser();
      
      if (!this.currentUser) {
        this.router.navigate(['/login']);
        return;
      }
    }
    
    this.isLoading = false;
  }

  // Navegación
  irADashboard(): void {
    // Ya estamos en dashboard, no hacer nada
  }

  irAAmenazas(): void {
    this.router.navigate(['/amenazas']);
  }

  irAAtaques(): void {
    this.router.navigate(['/ataques']);
  }

  irAUsuarios(): void {
    if (this.esAdmin()) {
      alert('Módulo de usuarios próximamente...');
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Validaciones de permisos
  esAdmin(): boolean {
    return this.currentUser?.role === 'ADMINISTRADOR';
  }

  puedeCrearAmenazas(): boolean {
    const role = this.currentUser?.role;
    return role === 'ANALISTA' || role === 'ADMINISTRADOR';
  }

  puedeEditarAmenazas(): boolean {
    const role = this.currentUser?.role;
    return role === 'ANALISTA' || role === 'ADMINISTRADOR';
  }

  puedeEliminarAmenazas(): boolean {
    return this.currentUser?.role === 'ADMINISTRADOR';
  }

  puedeCrearAtaques(): boolean {
    const role = this.currentUser?.role;
    return role === 'ANALISTA' || role === 'ADMINISTRADOR';
  }

  puedeEditarAtaques(): boolean {
    const role = this.currentUser?.role;
    return role === 'ANALISTA' || role === 'ADMINISTRADOR';
  }

  puedeEliminarAtaques(): boolean {
    return this.currentUser?.role === 'ADMINISTRADOR';
  }
}