// src/app/services/admin.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/usuarios';
  private apiAppointmentsUrl = 'http://localhost:8080/citas';
  // Datos mockeados
  private mockUsers = [
    { id: '1', nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', rol: 'usuario', activo: true },
    { id: '2', nombre: 'María', apellido: 'Gómez', email: 'maria@example.com', rol: 'especialista', activo: true },
    { id: '3', nombre: 'Carlos', apellido: 'López', email: 'carlos@example.com', rol: 'usuario', activo: false },
    { id: '4', nombre: 'Ana', apellido: 'Martínez', email: 'ana@example.com', rol: 'especialista', activo: true },
  ];

  private mockAppointments = [
    { id: '101', pacienteNombre: 'Juan Pérez', especialistaNombre: 'Dra. Gómez', fecha: '2023-10-15', hora: '10:00', estado: 'Confirmada' },
    { id: '102', pacienteNombre: 'Luisa Fernández', especialistaNombre: 'Dr. Smith', fecha: '2023-10-16', hora: '11:30', estado: 'Pendiente' },
    { id: '103', pacienteNombre: 'Pedro García', especialistaNombre: 'Dra. Gómez', fecha: '2023-10-17', hora: '09:00', estado: 'Cancelada' },
  ];

  private mockActivityLog = [
    { timestamp: new Date('2023-10-10T10:00:00'), action: 'Usuario juan@example.com activado', admin: 'Admin Principal' },
    { timestamp: new Date('2023-10-09T14:30:00'), action: 'Cita 100 cancelada', admin: 'Admin Principal' },
    { timestamp: new Date('2023-10-08T11:15:00'), action: 'Usuario nuevo registrado: ana@example.com', admin: 'Admin Principal' },
  ];

  constructor(private http: HttpClient) { }

  getUsers(): Observable<any[]> { // Change Object to any[]
    // return of(this.mockUsers).pipe(delay(500)); 
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getAppointments(): Observable<any[]> { // Change Object to any[]
    return this.http.get<any[]>(`${this.apiAppointmentsUrl}`, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }

  getActivityLog(): Observable<any[]> {
    return of(this.mockActivityLog).pipe(delay(500));
  }

  updateUserStatus(userId: string, active: boolean): Observable<any> {
    const user = this.mockUsers.find(u => u.id === userId);
    if (user) {
      user.activo = active;
    }
    return of({ success: true }).pipe(delay(300));
  }

  deleteUser(userId: string): Observable<any> {
    this.mockUsers = this.mockUsers.filter(u => u.id !== userId);
    return of({ success: true }).pipe(delay(300));
  }

  cancelAppointment(appointmentId: string): Observable<any> {
    const appointment = this.mockAppointments.find(a => a.id === appointmentId);
    if (appointment) {
      appointment.estado = 'Cancelada';
    }
    return of({ success: true }).pipe(delay(300));
  }
}