// ataque-list.component.ts - ACTUALIZADO
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AtaqueService, AtaqueDTO, Severidad } from '../../services/ataque.service';
import { AuthService, LoginResponse } from '../../services/auth.service';
import { SharedHeaderComponent } from '../shared-header/shared-header.component';

@Component({
  selector: 'app-ataque-list',
  standalone: true,
  imports: [CommonModule, SharedHeaderComponent],
  templateUrl: './ataque-list.component.html',
  styleUrls: ['./ataque-list.component.css']
})
export class AtaqueListComponent implements OnInit {
  ataques: AtaqueDTO[] = [];
  ataquesFiltrados: AtaqueDTO[] = [];
  loading = false;
  error = '';
  currentUser: LoginResponse | null = null;
  amenazaId: number | null = null;
  tituloSeccion = 'Gestión de Ataques';

  constructor(
    private ataqueService: AtaqueService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    
    // Verificar si estamos viendo ataques de una amenaza específica
    this.route.params.subscribe(params => {
      if (params['amenazaId']) {
        this.amenazaId = +params['amenazaId'];
        this.tituloSeccion = `Ataques de la Amenaza #${this.amenazaId}`;
        this.cargarAtaquesPorAmenaza();
      } else {
        this.cargarTodosLosAtaques();
      }
    });
  }

  cargarTodosLosAtaques(): void {
    this.loading = true;
    this.error = '';
    
    this.ataqueService.listarTodos().subscribe({
      next: (ataques) => {
        this.ataques = ataques;
        this.ataquesFiltrados = ataques;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los ataques: ' + (error.error?.message || error.message);
        this.loading = false;
      }
    });
  }

  cargarAtaquesPorAmenaza(): void {
    if (!this.amenazaId) return;
    
    this.loading = true;
    this.error = '';
    
    this.ataqueService.buscarPorAmenaza(this.amenazaId).subscribe({
      next: (ataques) => {
        this.ataques = ataques;
        this.ataquesFiltrados = ataques;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error al cargar los ataques: ' + (error.error?.message || error.message);
        this.loading = false;
      }
    });
  }

  filtrarPorSeveridad(event: any): void {
    const severidad = event.target.value;
    if (severidad) {
      this.ataquesFiltrados = this.ataques.filter(a => a.severidad === severidad);
    } else {
      this.ataquesFiltrados = [...this.ataques];
    }
  }

  nuevoAtaque(): void {
    if (this.amenazaId) {
      this.router.navigate(['/ataques/nuevo'], { queryParams: { amenazaId: this.amenazaId } });
    } else {
      this.router.navigate(['/ataques/nuevo']);
    }
  }

  editarAtaque(id: number): void {
    this.router.navigate(['/ataques/editar', id]);
  }

  eliminarAtaque(id: number, tipo: string): void {
    if (confirm(`¿Estás seguro de eliminar el ataque "${tipo}"?`)) {
      this.ataqueService.eliminar(id).subscribe({
        next: () => {
          alert('Ataque eliminado exitosamente');
          if (this.amenazaId) {
            this.cargarAtaquesPorAmenaza();
          } else {
            this.cargarTodosLosAtaques();
          }
        },
        error: (error) => {
          alert('Error al eliminar el ataque: ' + (error.error?.message || error.message));
        }
      });
    }
  }

  volver(): void {
    if (this.amenazaId) {
      this.router.navigate(['/amenazas']);
    } else {
      this.volverDashboard();
    }
  }

  volverDashboard(): void {
    const role = this.currentUser?.role?.toLowerCase();
    this.router.navigate([`/${role}`]);
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'No especificada';
    return new Date(date).toLocaleDateString('es-ES');
  }

  getSeveridadIcon(severidad: Severidad): string {
    switch (severidad) {
      case Severidad.BAJA: return '🟢';
      case Severidad.MODERADA: return '🟡';
      case Severidad.ALTA: return '🟠';
      case Severidad.CRITICA: return '🔴';
      default: return '⚪';
    }
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