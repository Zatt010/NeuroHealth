import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Especialista {
  id: string;
  name: string;
  speciality: string;
  hours: string[];
  occupiedHours: string[];
}

@Injectable({
  providedIn: 'root'
})
export class EspecialistaService {
  private apiUrl = 'http://localhost:8080/api/especialistas';

  constructor(private http: HttpClient) {}

  getAllEspecialistas(): Observable<Especialista[]> {
    return this.http.get<Especialista[]>(this.apiUrl);
  }

  getHorariosByEspecialistaId(id: string, fecha: string): Observable<{hours: string[], occupiedHours: string[]}> {
    return this.http.get<{hours: string[], occupiedHours: string[]}>(`${this.apiUrl}/${id}/horarios?fecha=${fecha}`);
  }
  
  ocuparHora(id: string, hour: string, fecha: string, userId: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/ocupar-hora`, { hour, fecha, userId });
  }
    
}