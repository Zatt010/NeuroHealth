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
import { AuthService } from '../../auth.service'; // Asegúrate de que esta importación sea correcta

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
    type: 'audio'
  };
  isLoading: boolean = false;
  isadmin: boolean = false; // Propiedad para controlar la visibilidad del botón
  private authSubscription: Subscription | undefined;
  private meditationsSubscription: Subscription | undefined;

  constructor(
    private meditationsService: MeditationsService,
    private router: Router,
    private authService: AuthService // Inyecta AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.loadMeditations();

    // Suscribirse al estado de administrador desde AuthService
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

  // Nuevo método para navegar al panel de administración
  goToAdminDashboard(): void {
    this.router.navigate(['/admin']); // Asegúrate de que esta ruta sea correcta para tu panel de administración
  }

  openAddMeditationForm(): void {
    this.isEditing = false;
    this.currentMeditationForForm = { type: 'audio' };
    this.showAdminForm = true;
  }

  openEditMeditationForm(meditation: Meditation): void {
    this.isEditing = true;
    this.currentMeditationForForm = { ...meditation };
    this.showAdminForm = true;
  }

  closeAdminForm(): void {
    this.showAdminForm = false;
    this.isEditing = false;
    this.currentMeditationForForm = { type: 'audio' };
  }

  saveMeditation(): void {
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