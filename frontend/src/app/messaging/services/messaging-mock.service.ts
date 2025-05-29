// src/app/messaging/services/messaging-mock.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, delay, Observable } from 'rxjs';
import { MessagingService } from './messaging.service';
import { Conversation, Message } from '../../interfaces/message.interface';
import { throwError } from 'rxjs'; // Añadir este import

@Injectable()
export class MessagingMockService extends MessagingService {
  private conversations$ = new BehaviorSubject<Conversation[]>([]);
  private messagesMap: { [key: string]: Message[] } = {};
  private currentUserId = '67d64c8fedc9ad56eedd10a9'; // Agregado

  constructor() {
    super();
    this.initializeMockData();
  }

  private initializeMockData() {
    const mockConversation: Conversation = {
      _id: 'conv-1',
      participants: ['doc-123', 'patient-456'],
      lastMessage: {
        _id: 'msg-1',
        senderId: 'patient-456',
        receiverId: 'doc-123',
        content: '¿Podría explicarme nuevamente las indicaciones?',
        timestamp: new Date(),
        status: 'read',
        type: 'text'
      },
      unreadCount: 2
    };

    this.conversations$.next([mockConversation]);

    this.messagesMap['conv-1'] = [
      {
        _id: 'msg-1',
        senderId: 'doc-123',
        receiverId: 'patient-456',
        content: 'Recuerde tomar su medicamento después del desayuno',
        timestamp: new Date(Date.now() - 3600000),
        status: 'read',
        type: 'text'
      },
      {
        _id: 'msg-2',
        senderId: 'patient-456',
        receiverId: 'doc-123',
        content: '¿Podría explicarme nuevamente las indicaciones?',
        timestamp: new Date(),
        status: 'read',
        type: 'text'
      }
    ];
  }

  getConversations() {
    return this.conversations$.asObservable().pipe(delay(500));
  }

  getMessages(conversationId: string) {
    return of(this.messagesMap[conversationId] || []).pipe(delay(300));
  }

  getConversation(conversationId: string): Observable<Conversation> {
    const conversation = this.conversations$.value.find(c => c._id === conversationId);
    if (conversation) {
      return of(conversation).pipe(delay(100));
    } else {
      return throwError(() => new Error('Conversation not found')); // Usar throwError
    }
  }

  sendMessage(message: Omit<Message, '_id' | 'timestamp' | 'status'>) {
    const newMessage: Message = {
      ...message,
      _id: `msg-${Date.now()}`,
      timestamp: new Date(),
      status: 'sent'
    };

    const conversationId = this.getConversationId(message.senderId, message.receiverId);

    if (!this.messagesMap[conversationId]) {
      this.messagesMap[conversationId] = [];
    }

    this.messagesMap[conversationId].push(newMessage);
    this.updateConversation(newMessage, conversationId);

    return of(newMessage).pipe(delay(200));
  }

  private getConversationId(user1: string, user2: string): string {
    const participants = [user1, user2].sort();
      const id = `conv-${participants.join('-')}`;
      if (!this.messagesMap[id]) {
        this.messagesMap[id] = [];
      }
      return id;
  }

  private updateConversation(message: Message, conversationId: string) {
    const conversations = this.conversations$.value;
    const index = conversations.findIndex(c => c._id === conversationId);

    const conversation: Conversation = {
      _id: conversationId,
      participants: [message.senderId, message.receiverId],
      lastMessage: message,
      unreadCount: message.senderId !== this.currentUserId ? 1 : 0
    };

    if (index >= 0) {
      conversations[index] = conversation;
    } else {
      conversations.push(conversation);
    }

    this.conversations$.next(conversations);
  }

  markAsRead(conversationId: string) {
    const conversations = this.conversations$.value.map(conv => {
      if (conv._id === conversationId) {
        return { ...conv, unreadCount: 0 };
      }
      return conv;
    });

    this.conversations$.next(conversations);
    return of(undefined).pipe(delay(200));
  }
}
