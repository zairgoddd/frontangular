import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AmenazaDTO } from './amenaza.service';

export interface AtaqueDTO {
  id?: number;
  tipo: string;
  vector: string;
  sistemaAfectado: string;
  severidad: Severidad;
  fechaEvento?: string;
  amenazaId: number;
  amenaza?: AmenazaDTO;
}

export enum Severidad {
  BAJA = 'BAJA',
  MODERADA = 'MODERADA',
  ALTA = 'ALTA',
  CRITICA = 'CRITICA'
}

@Injectable({
  providedIn: 'root'
})
export class AtaqueService {
  private apiUrl = 'hhttps://backend-production-99347.up.railway.app/api/ataques';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<AtaqueDTO[]> {
    return this.http.get<AtaqueDTO[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<AtaqueDTO> {
    return this.http.get<AtaqueDTO>(`${this.apiUrl}/${id}`);
  }

  crear(ataque: AtaqueDTO): Observable<AtaqueDTO> {
    return this.http.post<AtaqueDTO>(this.apiUrl, ataque);
  }

  actualizar(id: number, ataque: AtaqueDTO): Observable<AtaqueDTO> {
    return this.http.put<AtaqueDTO>(`${this.apiUrl}/${id}`, ataque);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscarPorAmenaza(amenazaId: number): Observable<AtaqueDTO[]> {
    return this.http.get<AtaqueDTO[]>(`${this.apiUrl}/amenaza/${amenazaId}`);
  }

  buscarPorSeveridad(severidad: Severidad): Observable<AtaqueDTO[]> {
    return this.http.get<AtaqueDTO[]>(`${this.apiUrl}/severidad/${severidad}`);
  }

  obtenerTiposSeveridad(): Observable<Severidad[]> {
    return this.http.get<Severidad[]>(`${this.apiUrl}/tipos-severidad`);
  }
}