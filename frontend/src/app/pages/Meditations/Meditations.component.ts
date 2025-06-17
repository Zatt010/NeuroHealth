// src/app/pages/Meditations/Meditations.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MeditationsService, Meditation } from './meditations.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MeditationPlayerComponent } from './meditation-player/meditation-player.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-meditations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MeditationPlayerComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './meditations.component.html',
  styleUrls: ['./meditations.component.css']
})
export class MeditationsComponent implements OnInit, OnDestroy {
  meditations: Meditation[] = [];
  selectedMeditation: Meditation | null = null;
  showAdminForm: boolean = false;
  isEditing: boolean = false;
  currentMeditationForForm: Partial<Meditation> = {
    type: 'audio' // Default type
  };
  isLoading: boolean = false;
  isadmin: boolean = false; // To check if the logged-in user is an admin
  private authSubscription: Subscription | undefined;
  private meditationsSubscription: Subscription | undefined;

  constructor(
    private meditationsService: MeditationsService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadMeditations();

    this.authSubscription = this.authService.isAdmin$.subscribe(isAdmin => {
      this.isadmin = isAdmin;
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.meditationsSubscription?.unsubscribe();
  }

  loadMeditations(): void {
    this.meditationsSubscription = this.meditationsService.getMeditations().subscribe({
      next: (data) => {
        this.meditations = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar meditaciones:', err);
        this.isLoading = false;
      }
    });
  }

  playMeditation(meditation: Meditation): void {
    this.selectedMeditation = meditation;
  }

  closePlayer(): void {
    this.selectedMeditation = null;
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  openAddMeditationForm(): void {
    this.isEditing = false;
    this.currentMeditationForForm = { type: 'audio' }; // Reset form for new meditation
    this.showAdminForm = true;
  }

  openEditMeditationForm(meditation: Meditation): void {
    this.isEditing = true;
    this.currentMeditationForForm = { ...meditation }; // Create a copy for editing
    this.showAdminForm = true;
  }

  closeAdminForm(): void {
    this.showAdminForm = false;
    this.isEditing = false;
    this.currentMeditationForForm = { type: 'audio' }; // Reset form
  }

  saveMeditation(): void {
    // Perform basic validation before saving
    if (!this.currentMeditationForForm.title || !this.currentMeditationForForm.url || !this.currentMeditationForForm.type) {
      alert('Por favor, completa todos los campos requeridos (Título, URL, Tipo).');
      return;
    }

    const meditationData = this.currentMeditationForForm as Meditation;
    this.isLoading = true;

    if (this.isEditing && meditationData.id) {
      this.meditationsService.updateMeditation(meditationData).subscribe({
        next: () => {
          this.closeAdminForm();
          this.loadMeditations();
        },
        error: (err) => {
          console.error('Error al actualizar meditación:', err);
          this.isLoading = false;
        }
      });
    } else {
      this.meditationsService.addMeditation(meditationData).subscribe({
        next: () => {
          this.closeAdminForm();
          this.loadMeditations();
        },
        error: (err) => {
          console.error('Error al agregar meditación:', err);
          this.isLoading = false;
        }
      });
    }
  }

  deleteMeditation(id: number | undefined): void {
    if (id === undefined) {
        console.error('ID de meditación no definido para eliminar');
        return;
    }
    if (confirm('¿Estás seguro de que quieres eliminar esta meditación?')) {
      this.isLoading = true;
      this.meditationsService.deleteMeditation(id).subscribe({
        next: () => {
          if (this.selectedMeditation?.id === id) {
            this.closePlayer();
          }
          this.loadMeditations();
        },
        error: (err) => {
          console.error('Error al eliminar meditación:', err);
          this.isLoading = false;
        }
      });
    }
  }
}