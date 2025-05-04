import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface HistorialEntry {
  type: 'emotion' | 'exam';
  date: Date;
}

interface EmotionEntry extends HistorialEntry {
  emotion: string;
  notes: string;
  tags: string[];
}

interface ExamEntry extends HistorialEntry {
  examName: string;
  description: string;
  result: string;
}

interface Patient {
  id: string;
  name: string;
  entries: (EmotionEntry | ExamEntry)[];
}

@Component({
  selector: 'app-patients-historial',
  templateUrl: './pacientsHistorial.component.html',
  styleUrls: ['./pacientsHistorial.component.css'],
  imports: [CommonModule, FormsModule]
})
export class PatientsHistorialComponent {
  patients: Patient[] = [];
  selectedPatientId: string = '';
  filteredEntries: (EmotionEntry | ExamEntry)[] = [];
  
  months = [
    { value: 0, name: 'Enero' },
    { value: 1, name: 'Febrero' },
    { value: 2, name: 'Marzo' },
    { value: 3, name: 'Abril' },
    { value: 4, name: 'Mayo' },
    { value: 5, name: 'Junio' },
    { value: 6, name: 'Julio' },
    { value: 7, name: 'Agosto' },
    { value: 8, name: 'Septiembre' },
    { value: 9, name: 'Octubre' },
    { value: 10, name: 'Noviembre' },
    { value: 11, name: 'Diciembre' }
  ];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    this.patients = [
      {
        id: '1',
        name: 'Juan Pérez',
        entries: [
          {
            type: 'emotion',
            date: new Date(2024, 2, 15),
            emotion: 'Ansiedad',
            notes: 'Situaciones laborales',
            tags: ['Estrés', 'Insomnio']
          },
          {
            type: 'exam',
            date: new Date(2024, 1, 10),
            examName: 'Test de Memoria',
            result: '85/100 - Normal',
            description: 'Evaluación de memoria a corto y largo plazo'
          }
        ]
      },
      {
        id: '2',
        name: 'María García',
        entries: [
          {
            type: 'emotion',
            date: new Date(2024, 2, 18),
            emotion: 'Felicidad',
            notes: 'Progreso en terapia',
            tags: ['Socialización']
          },
          {
            type: 'exam',
            date: new Date(2024, 2, 5),
            examName: 'EEG',
            description: 'Electroencefalograma de rutina',
            result: 'Actividad cerebral normal'
          }
        ]
      }
    ];
  }

  onPatientSelect(patientId: string) {
    this.selectedPatientId = patientId;
    this.applyFilters('all', 'all');
  }

  get selectedPatient(): Patient | undefined {
    return this.patients.find(p => p.id === this.selectedPatientId);
  }

  isEmotion(entry: HistorialEntry): entry is EmotionEntry {
    return entry.type === 'emotion';
  }

  isExam(entry: HistorialEntry): entry is ExamEntry {
    return entry.type === 'exam';
  }

  filterByType(event: Event) {
    const type = (event.target as HTMLSelectElement).value;
    this.applyFilters(type, null);
  }

  filterByMonth(event: Event) {
    const month = (event.target as HTMLSelectElement).value;
    this.applyFilters(null, month);
  }

  private applyFilters(typeFilter: string | null, monthFilter: string | null) {
    if (!this.selectedPatient) {
      this.filteredEntries = [];
      return;
    }

    this.filteredEntries = this.selectedPatient.entries.filter(entry => {
      const typeMatch = !typeFilter || typeFilter === 'all' || entry.type === typeFilter;
      const monthMatch = !monthFilter || monthFilter === 'all' || 
                        entry.date.getMonth() === parseInt(monthFilter);
      return typeMatch && monthMatch;
    });
  }

  clearFilters() {
    this.filteredEntries = this.selectedPatient ? [...this.selectedPatient.entries] : [];
    const selects = document.querySelectorAll<HTMLSelectElement>('.filter-select');
    selects.forEach(select => select.value = 'all');
  }
}