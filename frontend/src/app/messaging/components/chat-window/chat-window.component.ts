// src/app/messaging/components/chat-window/chat-window.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagingService } from '../../services/messaging.service'; // Ruta CORREGIDA
import { Message, Conversation } from '../../../interfaces/message.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  conversation: Conversation | null = null;
  newMessage = '';
  currentUserId = '67d64c8fedc9ad56eedd10a9'; // Ejemplo de ID
  conversationId: string | null = null;
  private messagesSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private messagingService: MessagingService
  ) {}

 ngOnInit() {
   this.conversationId = this.route.snapshot.paramMap.get('conversationId');
   if (this.conversationId) {
     this.loadConversation(); // Nuevo método para cargar la conversación
     this.loadMessages();
   }
 }
  loadConversation() {
    this.messagingService.getConversation(this.conversationId!).subscribe({
      next: (conversation: Conversation) => this.conversation = conversation, // Agregar tipo
      error: (err: any) => console.error('Error loading conversation', err) // Agregar tipo
    });
  }
  loadMessages() {
    this.messagesSubscription = this.messagingService
      .getMessages(this.conversationId!)
      .subscribe({
        next: (messages: Message[]) => this.messages = messages,
        error: (err: any) => console.error('Error loading messages', err)
      });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.conversationId && this.currentUserId) {
      const receiverId = this.getReceiverId();
      if (!receiverId) return;

      // Crear el objeto sin las propiedades omitidas
      const messageToSend: Omit<Message, '_id' | 'timestamp' | 'status'> = {
        senderId: this.currentUserId,
        receiverId: receiverId,
        content: this.newMessage,
        type: 'text'
      };

      this.messagingService.sendMessage(messageToSend).subscribe({
        next: () => this.newMessage = '',
        error: (err: any) => console.error('Error sending message', err)
      });
    }
  }

  private getReceiverId(): string | null {
    if (this.conversation) {
      // Agregar tipo explícito
      return this.conversation.participants.find((id: string) => id !== this.currentUserId) || null;
    }
    return null;
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
  }
}
