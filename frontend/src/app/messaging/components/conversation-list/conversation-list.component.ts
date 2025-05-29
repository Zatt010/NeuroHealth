import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagingService } from '../../services/messaging.service';
import { Conversation } from '../../../interfaces/message.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe'; // Importar el pipe existente

@Component({
  selector: 'app-conversation-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, TruncatePipe], // Agregar TruncatePipe aquí
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnInit {
  conversations: Conversation[] = [];
  isLoggedIn = false;
  isLoading = true;
  currentUserId: string;
  activeConversationId: string | null = null;

  constructor(
    private messagingService: MessagingService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.isLoggedIn = !!this.authService.getUsuario();
    this.currentUserId = this.authService.getCurrentUserId() || '67d64c8fedc9ad56eedd10a9';
  }

  ngOnInit() {
    // Obtener ID de conversación activa de los parámetros de ruta
    this.route.paramMap.subscribe(params => {
      this.activeConversationId = params.get('conversationId');
    });

    this.loadConversations();
  }

  loadConversations() {
    this.messagingService.getConversations().subscribe({
      next: (conversations: Conversation[]) => {
        this.conversations = conversations;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error loading conversations', err);
        this.isLoading = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  openConversation(conversationId: string) {
    this.messagingService.markAsRead(conversationId).subscribe({
      next: () => {
        this.router.navigate(['/messaging/chat', conversationId]);
        this.activeConversationId = conversationId;
      },
      error: (err: any) => {
        console.error('Error marking as read', err);
        this.router.navigate(['/messaging/chat', conversationId]);
      }
    });
  }

  isActiveConversation(conversationId: string): boolean {
    return this.activeConversationId === conversationId;
  }

  getParticipantName(conversation: Conversation): string {
    // Encontrar el participante que no sea el usuario actual
    const otherParticipant = conversation.participants.find(
      p => p !== this.currentUserId
    );

    if (!otherParticipant) return 'Usuario desconocido';

    // Lógica para determinar el nombre basado en el ID
    if (otherParticipant.startsWith('doc')) {
      return `Dr. ${otherParticipant.slice(4)}`;
    } else if (otherParticipant.startsWith('patient')) {
      return `Paciente ${otherParticipant.slice(8)}`;
    }
    return 'Usuario';
  }

  getParticipantAvatar(conversation: Conversation): string {
    // Encontrar el participante que no sea el usuario actual
    const otherParticipant = conversation.participants.find(
      p => p !== this.currentUserId
    );

    if (!otherParticipant) return 'assets/user-icon.png';

    // Lógica para determinar el avatar basado en el tipo de usuario
    if (otherParticipant.startsWith('doc')) {
      return 'assets/doctor-icon.png';
    } else if (otherParticipant.startsWith('patient')) {
      return 'assets/patient-icon.png';
    }
    return 'assets/user-icon.png';
  }

  startNewConversation() {
    // Lógica para iniciar nueva conversación
    console.log('Iniciar nueva conversación');
    // this.router.navigate(['/messaging/new']);
  }
}
