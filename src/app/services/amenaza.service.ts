import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AmenazaDTO {
  id?: number;
  tipo: string;
  descripcion: string;
  nivelRiesgo: NivelRiesgo;
  fechaDeteccion?: string;
}

export enum NivelRiesgo {
  BAJO = 'BAJO',
  MEDIO = 'MEDIO',
  ALTO = 'ALTO',
  CRITICO = 'CRITICO'
}

@Injectable({
  providedIn: 'root'
})
export class AmenazaService {
  private apiUrl = 'https://backend-production-99347.up.railway.app/api/amenazas';

  constructor(private http: HttpClient) {}

  listarTodas(): Observable<AmenazaDTO[]> {
    return this.http.get<AmenazaDTO[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<AmenazaDTO> {
    return this.http.get<AmenazaDTO>(`${this.apiUrl}/${id}`);
  }

  crear(amenaza: AmenazaDTO): Observable<AmenazaDTO> {
    return this.http.post<AmenazaDTO>(this.apiUrl, amenaza);
  }

  actualizar(id: number, amenaza: AmenazaDTO): Observable<AmenazaDTO> {
    return this.http.put<AmenazaDTO>(`${this.apiUrl}/${id}`, amenaza);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtenerTiposNivelRiesgo(): Observable<NivelRiesgo[]> {
    return this.http.get<NivelRiesgo[]>(`${this.apiUrl}/tipos`);
  }

  buscarPorNivel(nivel: NivelRiesgo): Observable<AmenazaDTO[]> {
    return this.http.get<AmenazaDTO[]>(`${this.apiUrl}/nivel-riesgo/${nivel}`);
  }
}