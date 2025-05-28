import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Appointment {
  id: string;
  fecha: string; 
  hora: string;
  pacienteId?: string;
  pacienteNombre?: string;
  especialistaId: string;
  estado: 'confirmada' | 'pendiente_confirmacion_paciente' | 'pendiente_confirmacion_especialista' | 'cancelada_paciente' | 'cancelada_especialista' | 'reagendada';
}

interface CalendarDay {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  hasAppointments: boolean;
  isToday: boolean;
}

const MOCK_SPECIALIST_ID = 'especialista_123';

const MOCK_APPOINTMENTS: Appointment[] = [
  { 
    id: 'app1', 
    fecha: new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')!,
    hora: '09:00 AM', 
    pacienteNombre: 'Ana Pérez', 
    especialistaId: MOCK_SPECIALIST_ID, 
    estado: 'confirmada' 
  },
  { 
    id: 'app2', 
    fecha: new DatePipe('en-US').transform(new Date(), 'yyyy-MM-dd')!,
    hora: '11:00 AM', 
    pacienteNombre: 'Luis García', 
    especialistaId: MOCK_SPECIALIST_ID, 
    estado: 'pendiente_confirmacion_paciente' 
  },
  { 
    id: 'app3', 
    fecha: new DatePipe('en-US').transform(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd')!,
    hora: '10:00 AM', 
    pacienteNombre: 'Carlos Ruiz', 
    especialistaId: MOCK_SPECIALIST_ID, 
    estado: 'confirmada' 
  },
  { 
    id: 'app4', 
    fecha: new DatePipe('en-US').transform(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd')!,
    hora: '02:00 PM', 
    pacienteNombre: 'Maria López', 
    especialistaId: 'another_specialist_id',
    estado: 'confirmada' 
  },
  { 
    id: 'app5', 
    fecha: new DatePipe('en-US').transform(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd')!,
    hora: '03:00 PM', 
    pacienteNombre: 'Juan Torres', 
    especialistaId: MOCK_SPECIALIST_ID, 
    estado: 'cancelada_paciente' 
  },
  {
    id: 'app6',
    fecha: new DatePipe('en-US').transform(new Date(new Date().getFullYear(), new Date().getMonth(), 15), 'yyyy-MM-dd')!,
    hora: '04:00 PM',
    pacienteNombre: 'Laura Vidal',
    especialistaId: MOCK_SPECIALIST_ID,
    estado: 'confirmada'
  },
];

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './doctor-appointments.component.html',
  styleUrls: ['./doctor-appointments.component.css'],
  providers: [DatePipe]
})
export class DoctorAppointmentsComponent implements OnInit {
  currentSpecialistId: string | null = MOCK_SPECIALIST_ID;
  
  currentDate = new Date();
  calendarDays: (CalendarDay | null)[][] = [];
  
  selectedDate: Date | null = null;
  appointmentsForSelectedDate: Appointment[] = [];
  
  private allFetchedAppointments: Map<string, Appointment[]> = new Map();

  isLoadingAppointments = false; 

  constructor(
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    if (this.currentSpecialistId) {
      this.loadAppointmentsForMonthRange(this.currentDate);
    } else {
      console.warn("No specialist ID configured. Appointment management disabled.");
    }
  }

  loadAppointmentsForMonthRange(dateForMonth: Date): void {
    if (!this.currentSpecialistId) return;
    
    this.isLoadingAppointments = true;
    this.allFetchedAppointments.clear(); 

    setTimeout(() => {
      MOCK_APPOINTMENTS.forEach(app => {
        if (app.especialistaId === this.currentSpecialistId) {
          const dateKey = app.fecha; 
          
          if (!this.allFetchedAppointments.has(dateKey)) {
            this.allFetchedAppointments.set(dateKey, []);
          }
          this.allFetchedAppointments.get(dateKey)?.push(app);
        }
      });

      this.generateCalendar(this.currentDate); 
      if (this.selectedDate) { 
        this.fetchAppointmentsForSelectedDate(this.selectedDate);
      }
      this.isLoadingAppointments = false;
    }, 300); 
  }

  generateCalendar(date: Date): void {
    this.calendarDays = [];
    const year = date.getFullYear();
    const month = date.getMonth();
    const today = new Date();
    today.setHours(0,0,0,0);

    const firstDayOfMonth = new Date(year, month, 1);
    
    let startDayOfWeek = firstDayOfMonth.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1; 

    let currentCalDate = new Date(firstDayOfMonth);
    currentCalDate.setDate(currentCalDate.getDate() - startDayOfWeek);

    const weeksToDisplay = 6; 

    for (let i = 0; i < weeksToDisplay; i++) {
      const week: (CalendarDay | null)[] = [];
      for (let j = 0; j < 7; j++) {
        const dayDate = new Date(currentCalDate);
        dayDate.setHours(0,0,0,0);
        const dateKey = this.datePipe.transform(dayDate, 'yyyy-MM-dd')!;
        
        week.push({
          date: dayDate,
          dayNumber: dayDate.getDate(),
          isCurrentMonth: dayDate.getMonth() === month,
          hasAppointments: this.allFetchedAppointments.has(dateKey) && (this.allFetchedAppointments.get(dateKey)?.length || 0) > 0,
          isToday: dayDate.getTime() === today.getTime()
        });
        currentCalDate.setDate(currentCalDate.getDate() + 1);
      }
      this.calendarDays.push(week);
    }
  }
  
  isToday(date: Date | undefined | null): boolean {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  selectDate(date: Date | null | undefined): void {
    if (!date) {
      this.selectedDate = null;
      this.appointmentsForSelectedDate = [];
      return;
    }
    
    const newSelectedDate = new Date(date);
    newSelectedDate.setHours(0,0,0,0);

    if (newSelectedDate.getMonth() !== this.currentDate.getMonth() || newSelectedDate.getFullYear() !== this.currentDate.getFullYear()) {
        this.currentDate = new Date(newSelectedDate.getFullYear(), newSelectedDate.getMonth(), 1);
        this.generateCalendar(this.currentDate); 
    }

    this.selectedDate = newSelectedDate;
    this.fetchAppointmentsForSelectedDate(this.selectedDate);
  }

  fetchAppointmentsForSelectedDate(date: Date): void {
    const dateKey = this.datePipe.transform(date, 'yyyy-MM-dd')!;
    this.appointmentsForSelectedDate = (this.allFetchedAppointments.get(dateKey) || []).sort((a,b) => {
        return a.hora.localeCompare(b.hora);
    });
  }

  isSelected(date: Date | undefined | null): boolean {
    if (!date || !this.selectedDate) return false;
    return date.getTime() === this.selectedDate.getTime();
  }

  prevMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.generateCalendar(this.currentDate);
  }

  nextMonth(): void {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.generateCalendar(this.currentDate);
  }

  cancelAppointment(appointmentId: string): void {
    if (!this.currentSpecialistId) return;
    if (confirm('¿Está seguro de que desea cancelar esta cita? Esta acción no se puede deshacer.')) {
      const appIndex = MOCK_APPOINTMENTS.findIndex(app => app.id === appointmentId && app.especialistaId === this.currentSpecialistId);
      if (appIndex > -1) {
        MOCK_APPOINTMENTS[appIndex].estado = 'cancelada_especialista';
        
        const dateKey = MOCK_APPOINTMENTS[appIndex].fecha;
        const appointmentsOnDate = this.allFetchedAppointments.get(dateKey);
        if (appointmentsOnDate) {
          const appInMapIndex = appointmentsOnDate.findIndex(a => a.id === appointmentId);
          if (appInMapIndex > -1) {
            appointmentsOnDate[appInMapIndex].estado = 'cancelada_especialista';
          }
        }
        alert('Cita cancelada exitosamente (simulado).');
        
        if (this.selectedDate && this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd') === dateKey) {
          this.fetchAppointmentsForSelectedDate(this.selectedDate);
        }
        this.generateCalendar(this.currentDate);
      } else {
        alert('Error: Cita no encontrada o no pertenece a este especialista (simulado).');
      }
    }
  }
  
  getEstadoText(estado: Appointment['estado']): string {
    switch (estado) {
      case 'confirmada': return 'Confirmada';
      case 'pendiente_confirmacion_paciente': return 'Pendiente (Paciente)';
      case 'pendiente_confirmacion_especialista': return 'Pendiente (Especialista)';
      case 'cancelada_paciente': return 'Cancelada por Paciente';
      case 'cancelada_especialista': return 'Cancelada por Especialista';
      case 'reagendada': return 'Reagendada';
      default: return estado;
    }
  }
}