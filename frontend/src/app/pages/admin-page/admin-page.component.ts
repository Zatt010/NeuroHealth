import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { LoadingContainerComponent } from '../../shared/components/loading-container/loading-container.component';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, LoadingContainerComponent],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.css'],
  providers: [AdminService, DatePipe]
})
export class AdminPageComponent implements OnInit {
  usuarios: any[] = [];
  citas: any[] = [];
  actividadLog: any[] = [];
  currentView: 'users' | 'appointments' | 'logs' = 'users';
  isLoading: boolean = true;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    
    forkJoin([
      this.adminService.getUsers(),
      this.adminService.getAppointments(),
      this.adminService.getActivityLog()
    ]).subscribe({
      next: ([users, appointments, logs]) => {
        this.usuarios = users;
        this.citas = appointments;
        this.actividadLog = logs;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading data', error);
        this.isLoading = false;
      }
    });
  }

  toggleUserStatus(user: any) {
    const newStatus = !user.activo;
    this.adminService.updateUserStatus(user.id, newStatus).subscribe(() => {
      user.activo = newStatus;
      this.logAction(`Usuario ${user.email} ${newStatus ? 'activado' : 'bloqueado'}`);
    });
  }

  deleteUser(userId: string) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
      this.adminService.deleteUser(userId).subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.id !== userId);
        this.logAction(`Usuario eliminado: ID ${userId}`);
      });
    }
  }

  cancelAppointment(appointmentId: string) {
    if (confirm('¿Está seguro de cancelar esta cita?')) {
      this.adminService.cancelAppointment(appointmentId).subscribe(() => {
        this.citas = this.citas.filter(c => c.id !== appointmentId);
        this.logAction(`Cita cancelada: ID ${appointmentId}`);
      });
    }
  }

  private logAction(action: string) {
    const user = this.authService.getUsuario();
    this.actividadLog.unshift({
      timestamp: new Date(),
      action: action,
      admin: `${user.nombre} ${user.apellido}`
    });
  }

  formatDate(date: Date | string, format: string): string {
    return this.datePipe.transform(date, format) || '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}