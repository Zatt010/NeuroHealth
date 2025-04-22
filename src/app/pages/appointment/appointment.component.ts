import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EspecialistaService } from '../../services/especialista.service';
import { HttpClientModule } from '@angular/common/http';

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

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private especialistaService: EspecialistaService
  ) {}

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

  confirmAppointment(time: string): void {
    if (this.selectedEspecialista) {
      const selectedEspecialista = this.especialistas.find(e => e.id === this.selectedEspecialista);
      console.log('Cita confirmada:', {
        fecha: this.getFormattedDate(),
        hora: time,
        especialista: selectedEspecialista?.name
      });
    }
  }
}