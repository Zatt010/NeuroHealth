import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewChecked,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessagingService } from '../../services/messaging.service';
import { Message, Conversation } from '../../../interfaces/message.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: Message[] = [];
  conversation: Conversation | null = null;
  newMessage = '';
  currentUserId: string;
  conversationId: string | null = null;
  private messagesSubscription!: Subscription;
  isLoggedIn = false;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messagingService: MessagingService,
    private authService: AuthService
  ) {
    this.currentUserId = this.authService.getCurrentUserId() || '67d64c8fedc9ad56eedd10a9';
    this.isLoggedIn = !!this.authService.getUsuario();
  }

  ngOnInit() {
    this.conversationId = this.route.snapshot.paramMap.get('conversationId');
    if (this.conversationId) {
      this.loadConversation();
      this.loadMessages();
    } else {
      this.isLoading = false;
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch(err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  goBack() {
    this.router.navigate(['/messaging']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  loadConversation() {
    this.messagingService.getConversation(this.conversationId!).subscribe({
      next: (conversation: Conversation) => {
        this.conversation = conversation;
      },
      error: (err: any) => {
        console.error('Error loading conversation', err);
        this.isLoading = false;
      }
    });
  }

  loadMessages() {
    this.messagesSubscription = this.messagingService
      .getMessages(this.conversationId!)
      .subscribe({
        next: (messages: Message[]) => {
          this.messages = messages;
          this.isLoading = false;
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (err: any) => {
          console.error('Error loading messages', err);
          this.isLoading = false;
        }
      });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.conversationId && this.currentUserId) {
      const receiverId = this.getReceiverId();
      if (!receiverId) return;

      const messageToSend: Omit<Message, '_id' | 'timestamp' | 'status'> = {
        senderId: this.currentUserId,
        receiverId: receiverId,
        content: this.newMessage,
        type: 'text'
      };

      this.messagingService.sendMessage(messageToSend).subscribe({
        next: () => {
          this.newMessage = '';
          setTimeout(() => this.scrollToBottom(), 100);
        },
        error: (err: any) => {
          console.error('Error sending message', err);
          alert('Error al enviar el mensaje. Intente nuevamente.');
        }
      });
    }
  }

  private getReceiverId(): string | null {
    if (this.conversation) {
      return this.conversation.participants.find(
        (id: string) => id !== this.currentUserId
      ) || null;
    }
    return null;
  }

  getReceiverName(): string {
    if (!this.conversation) return 'Cargando...';

    const receiverId = this.getReceiverId();
    if (receiverId === 'doc-123') return 'Dr. Rodriguez';
    if (receiverId === 'patient-456') return 'Paciente García';

    return 'Usuario';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
}
