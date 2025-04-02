import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-meditation-player',
  standalone: true,
  imports: [MatIconModule,CommonModule,],
  templateUrl: './meditation-player.component.html',
  styleUrls: ['./meditation-player.component.css']
})
export class MeditationPlayerComponent {
  @Input() meditation: any; // Añadir el decorador @Input
  @Output() close = new EventEmitter<void>();
  get mediaType(): string {
    return this.meditation.type === 'audio' ? 'audio/mpeg' : 'video/mp4';
  }
}