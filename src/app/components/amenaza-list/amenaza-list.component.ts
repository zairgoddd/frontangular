import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AmenazaService, AmenazaDTO, NivelRiesgo } from '../../services/amenaza.service';
import { AuthService, LoginResponse } from '../../services/auth.service';

@Component({
  selector: 'app-amenaza-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './amenaza-list.component.html',
  styleUrls: ['./amenaza-list.component.css']
})
export class AmenazaListComponent implements OnInit {
  amenazas: AmenazaDTO[] = [];
  amenazasFiltradas: AmenazaDTO[] = [];
  loading = false;
  error = '';
  currentUser: LoginResponse | null = null;

  constructor(
    private amenazaService: AmenazaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.cargarAmenazas();
  }

  cargarAmenazas(): void {
    this.loading = true;
    this.error = '';
    
    this.amenazaService.listarTodas().subscribe({
      next: (amenazas) => {
        this.amenazas = amenazas;
        this.amenazasFiltradas = amenazas;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar las amenazas: ' + (error.error?.message || error.message);
        this.loading = false;
      }
    });
  }

  filtrarPorNivel(event: any): void {
    const nivel = event.target.value;
    if (nivel) {
      this.amenazasFiltradas = this.amenazas.filter(a => a.nivelRiesgo === nivel);
    } else {
      this.amenazasFiltradas = [...this.amenazas];
    }
  }

  nuevaAmenaza(): void {
    this.router.navigate(['/amenazas/nueva']);
  }

  editarAmenaza(id: number): void {
    this.router.navigate(['/amenazas/editar', id]);
  }

  eliminarAmenaza(id: number, tipo: string): void {
    if (confirm(`¿Estás seguro de eliminar la amenaza "${tipo}"?`)) {
      this.amenazaService.eliminar(id).subscribe({
        next: () => {
          alert('Amenaza eliminada exitosamente');
          this.cargarAmenazas();
        },
        error: (error) => {
          alert('Error al eliminar la amenaza: ' + (error.error?.message || error.message));
        }
      });
    }
  }

verAtaques(amenazaId: number): void {
  this.router.navigate(['/ataques/amenaza', amenazaId]);
}

  volverDashboard(): void {
    const role = this.currentUser?.role?.toLowerCase();
    this.router.navigate([`/${role}`]);
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES');
  }

  puedeCrear(): boolean {
    const role = this.currentUser?.role;
    return role === 'ANALISTA' || role === 'ADMINISTRADOR';
  }

  puedeEditar(): boolean {
    const role = this.currentUser?.role;
    return role === 'ANALISTA' || role === 'ADMINISTRADOR';
  }

  puedeEliminar(): boolean {
    const role = this.currentUser?.role;
    return role === 'ADMINISTRADOR';
  }
}