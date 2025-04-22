import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialistaService } from '../../services/especialista.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  providers: [DatePipe],
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  selectedDate: Date = new Date();
  availableSlots: { time: string, isAvailable: boolean }[] = [];
  especialistas: any[] = [];
  selectedEspecialista: string | null = null;
  horarios: {hours: string[], occupiedHours: string[]} = {hours: [], occupiedHours: []};
  selectedTime: string | null = null;
  usuarioId: string | null = null;


  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private especialistaService: EspecialistaService,
    private authService: AuthService
  ) {
    // const usuario = this.authService.getUsuario();
    // this.usuarioId = usuario ? usuario.id : null;
  }

  ngOnInit(): void {
    this.loadEspecialistas();
    
    this.route.queryParams.subscribe(params => {
      const dateParam = params['date'];
      
      if (dateParam) {
        const parsedDate = new Date(dateParam);
        if (!isNaN(parsedDate.getTime())) {
          this.selectedDate = parsedDate;
        }
      }
    });
  }

  private loadEspecialistas(): void {
    this.especialistaService.getAllEspecialistas().subscribe(data => {
      this.especialistas = data.map(esp => ({
        id: esp.id,
        name: `Dr./Dra. ${esp.name} - ${esp.speciality}`,
        specialty: esp.speciality
      }));
    });
  }

  onEspecialistaChange(): void {
    if (this.selectedEspecialista) {
      this.especialistaService.getHorariosByEspecialistaId(this.selectedEspecialista)
        .subscribe(horarios => {
          this.horarios = horarios;
          this.updateAvailableSlots();
        });
    }
  }

  private updateAvailableSlots(): void {
    this.availableSlots = this.horarios.hours.map(slot => ({
      time: slot,
      isAvailable: !this.horarios.occupiedHours.includes(slot)
    }));
  }

  getFormattedDate(): string {
    return this.datePipe.transform(this.selectedDate, 'fullDate', '', 'es') || '';
  }

  selectedHour(time: string): void {
    this.selectedTime = time;
  
    if (this.selectedEspecialista) {
      const selectedEspecialista = this.especialistas.find(e => e.id === this.selectedEspecialista);
      console.log('Horario Escogido:', {
        fecha: this.getFormattedDate(),
        hora: time,
        especialista: selectedEspecialista?.name
      });
    }
  }

  get selectedEspecialistaName(): string {
    const especialista = this.especialistas.find(e => e.id === this.selectedEspecialista);
    return especialista ? especialista.name : '';
  }

  confirmarCita(): void {
    if (this.selectedEspecialista && this.selectedTime) {
      this.especialistaService.ocuparHora(this.selectedEspecialista, this.selectedTime)
        .subscribe({
          next: () => {
            alert('Cita confirmada correctamente');
            this.onEspecialistaChange(); // refrescar horarios
          },
          error: (err) => {
            console.error('Error al confirmar la cita', err);
            alert('Ocurrió un error al confirmar la cita');
          }
        });
    }
  }
  
  
  
}