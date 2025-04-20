import { Component, OnInit, LOCALE_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [
    DatePipe,
    { provide: LOCALE_ID, useValue: 'es' } 
  ],
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  selectedDate: Date = new Date();
  availableSlots: { time: string, isAvailable: boolean }[] = [];
  doctors = [
    { 
      id: 1, 
      name: 'Dra. María Gómez - Psiquiatría',
      specialty: 'Trastornos de ansiedad' 
    },
    { 
      id: 2, 
      name: 'Dr. Carlos Ruiz - Psicología Clínica',
      specialty: 'Terapia cognitivo-conductual' 
    },
    { 
      id: 3, 
      name: 'Dra. Laura Pérez - Terapia Cognitiva',
      specialty: 'Mindfulness y relajación' 
    }
  ];
  selectedDoctor: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const dateParam = params['date'];
      
      if (dateParam) {
        const parsedDate = new Date(dateParam);
        if (!isNaN(parsedDate.getTime())) {
          this.selectedDate = parsedDate;
        }
      }
      
      this.loadAvailability();
    });
  }

  private loadAvailability(): void {
    if (!this.selectedDoctor) return;
    
    const baseSlots = ['8:30 AM', '10:30 AM', '2:30 PM', '4:00 PM'];
    this.availableSlots = baseSlots.map(slot => ({
      time: slot,
      isAvailable: slot !== '8:30 AM'
    }));
  }
  onDoctorChange(): void {
    this.loadAvailability();
  }
  getFormattedDate(): string {
    return this.datePipe.transform(
      this.selectedDate, 
      'fullDate', 
      '', 
      'es' 
    ) || '';
  }

  confirmAppointment(time: string): void {
    if (this.selectedDoctor) {
      console.log('Cita confirmada:', {
        fecha: this.getFormattedDate(),
        hora: time,
        doctor: this.doctors.find(d => d.id === this.selectedDoctor)?.name
      });
    }
  }
}