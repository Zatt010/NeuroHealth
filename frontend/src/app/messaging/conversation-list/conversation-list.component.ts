import { Component, Input } from '@angular/core';
import { Conversation } from '../../interfaces/message.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent {
  @Input() conversations: Conversation[] = [];

  isDoctor(conv: Conversation): boolean {
    return conv.participants[0].startsWith('doc');
  }

  getParticipantName(conv: Conversation): string {
    return this.isDoctor(conv) ? 'Dr. Ejemplo' : 'Paciente Ejemplo';
  }
}
