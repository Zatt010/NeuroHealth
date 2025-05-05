import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface PatientUpdate {
  type: 'emotion' | 'observation' | 'exam';
  date: Date;
  notes: string;
  tags: string[];
  notifyPatient: boolean;
  emotion?: string;
  intensity?: number;
  observationType?: string;
  relatedSymptoms?: string[];
  examName?: string;
  result?: string;
  description?: string;
}

@Component({
  selector: 'app-patient-update',
  templateUrl: './patient-update.component.html',
  styleUrls: ['./patient-update.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule]
})
export class PatientUpdateComponent {
  patients = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María García' }
  ];

  selectedPatientId: string = '';
  updateForm: PatientUpdate = this.createEmptyForm();

  availableEmotions = ['Feliz', 'Triste', 'Ansioso', 'Enojado', 'Relajado'];
  availableObservationTypes = ['Conductual', 'Física', 'Cognitiva', 'Emocional'];
  availableSymptoms = ['Insomnio', 'Fatiga', 'Irritabilidad', 'Dificultad para concentrarse'];
  availableExamTypes = ['Test de Memoria', 'EEG', 'Escala de Depresión', 'Test de Ansiedad'];
  availableTags = ['Socialización', 'Estrés', 'Insomnio', 'Progreso', 'Regresión'];

  createEmptyForm(): PatientUpdate {
    return {
      type: 'emotion',
      date: new Date(),
      notes: '',
      tags: [],
      notifyPatient: false,
      emotion: '',
      intensity: 3,
      observationType: '',
      relatedSymptoms: [],
      examName: '',
      result: '',
      description: ''
    };
  }

  // Cambiado de private a public para uso en template
  isFormValid(): boolean {
    if (!this.selectedPatientId || !this.updateForm.notes) return false;
    
    switch (this.updateForm.type) {
      case 'emotion':
        return !!this.updateForm.emotion;
      case 'observation':
        return !!this.updateForm.observationType;
      case 'exam':
        return !!this.updateForm.examName && !!this.updateForm.result;
      default:
        return true;
    }
  }

  // Método para etiquetas (corrección del error toggleTag)
  toggleTag(tag: string): void {
    const index = this.updateForm.tags.indexOf(tag);
    if (index >= 0) {
      this.updateForm.tags.splice(index, 1);
    } else {
      this.updateForm.tags.push(tag);
    }
  }

  // Método genérico para selección (usado para síntomas)
  toggleSelection(items: string[], item: string): void {
    const index = items.indexOf(item);
    if (index >= 0) {
      items.splice(index, 1);
    } else {
      items.push(item);
    }
  }

  submitUpdate(): void {
    if (!this.selectedPatientId || !this.isFormValid()) return;

    const newEntry = this.prepareEntry();
    console.log('Nuevo registro:', newEntry);
    
    if (this.updateForm.notifyPatient) {
      this.sendNotification();
    }

    this.resetForm();
  }

  private prepareEntry(): any {
    const baseEntry = {
      type: this.updateForm.type,
      date: new Date(),
      notes: this.updateForm.notes,
      tags: this.updateForm.tags
    };

    switch (this.updateForm.type) {
      case 'emotion':
        return {
          ...baseEntry,
          emotion: this.updateForm.emotion,
          intensity: this.updateForm.intensity
        };
      case 'observation':
        return {
          ...baseEntry,
          observationType: this.updateForm.observationType,
          relatedSymptoms: this.updateForm.relatedSymptoms || []
        };
      case 'exam':
        return {
          ...baseEntry,
          examName: this.updateForm.examName,
          result: this.updateForm.result,
          description: this.updateForm.description || ''
        };
    }
  }

  private sendNotification(): void {
    console.log(`Notificación enviada al paciente ${this.selectedPatientId}`);
  }

  resetForm(): void {
    this.updateForm = {
      ...this.createEmptyForm(),
      type: this.updateForm.type,
      notifyPatient: false
    };
  }

  onTypeChange(): void {
    this.updateForm.emotion = '';
    this.updateForm.observationType = '';
    this.updateForm.relatedSymptoms = [];
    this.updateForm.examName = '';
    this.updateForm.result = '';
    this.updateForm.description = '';
  }
}