import { Component, OnInit } from '@angular/core';
import { MeditationsService, Meditation } from './meditations.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MeditationPlayerComponent } from './meditation-player/meditation-player.component';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-meditations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MeditationPlayerComponent // Añadir el componente hijo
  ],
  templateUrl: './meditations.component.html',
  styleUrls: ['./meditations.component.css']
})
export class MeditationsComponent implements OnInit {
  meditations: Meditation[] = [];
  selectedMeditation: Meditation | null = null;
  playerVisible = false;

  constructor(private meditationsService: MeditationsService) {}

  ngOnInit(): void {
    this.meditationsService.getMeditations().subscribe(data => {
      this.meditations = data;
    });
  }

  playMeditation(meditation: Meditation): void {
    this.selectedMeditation = meditation;
    this.playerVisible = true;
  }

  closePlayer(): void {
    this.playerVisible = false;
    this.selectedMeditation = null;
  }
}