// src/app/pages/Meditations/meditation-player/meditation-player.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Meditation } from '../meditations.service'; // Import Meditation interface

@Component({
  selector: 'app-meditation-player',
  standalone: true,
  imports: [MatIconModule, CommonModule],
  templateUrl: './meditation-player.component.html',
  styleUrls: ['./meditation-player.component.css']
})
export class MeditationPlayerComponent {
  @Input() meditation!: Meditation;
  @Output() close = new EventEmitter<void>();

  constructor(private sanitizer: DomSanitizer) {}

  get mediaType(): string {
    return this.meditation.type === 'audio' ? 'audio/mpeg' : 'video/mp4';
  }

  getSafeYoutubeUrl(url: string): SafeResourceUrl {
    const videoId = this.extractYoutubeId(url);
    // Correct YouTube embed URL format
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${videoId}?autoplay=1` // Corrected URL
    );
  }

  private extractYoutubeId(url: string): string {
    // Corrected regular expression
    const regExp = /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : ''; // Changed match[2] to match[1] to get the video ID
  }
}