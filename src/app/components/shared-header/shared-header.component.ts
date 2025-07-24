import { Component, Input, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-header.component.html',
  styleUrls: ['./shared-header.component.css']
})
export class SharedHeaderComponent implements OnInit {
  @Input() activeRoute: string = '';
  currentUser: LoginResponse | null = null;

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
  }

  // Navegación

// Método corregido en SharedHeaderComponent
irADashboard(): void {
  const role = this.currentUser?.role;
  
  // Mapear los roles a las rutas correctas (igual que en el login)
  switch(role) {
    case 'ADMINISTRADOR':
      this.router.navigate(['/admin']);
      break;
    case 'ANALISTA':
      this.router.navigate(['/analista']);
      break;
    case 'CLIENTE':
      this.router.navigate(['/cliente']);
      break;
    default:
      this.router.navigate(['/dashboard']);
      break;
  }
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
}