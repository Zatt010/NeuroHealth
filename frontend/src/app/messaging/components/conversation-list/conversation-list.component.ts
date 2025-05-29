// src/app/messaging/components/conversation-list/conversation-list.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagingService } from '../../services/messaging.service';
import { Conversation } from '../../../interfaces/message.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnInit {
  conversations: Conversation[] = [];

  constructor(
    private messagingService: MessagingService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.messagingService.getConversations().subscribe({
      next: (conversations: Conversation[]) => this.conversations = conversations,
      error: (err: any) => console.error('Error loading conversations', err)
    });
  }

  openConversation(conversationId: string) {
    this.messagingService.markAsRead(conversationId).subscribe({
      next: () => this.router.navigate(['/messaging/chat', conversationId]),
      error: (err: any) => console.error('Error marking as read', err)
    });
  }

  getParticipantName(participantId: string): string {
    // Implementación temporal
    return participantId.startsWith('doc')
      ? `Dr. ${participantId.slice(4)}`
      : `Paciente ${participantId.slice(8)}`;
  }
}
