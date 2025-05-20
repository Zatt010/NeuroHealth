import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, of } from 'rxjs';
import { Conversation, Message } from '../../../interfaces/message.interface';

@Injectable({ providedIn: 'root' })
export class MessagingMockService {
  private conversations$ = new BehaviorSubject<Conversation[]>([
    {
      id: 'conv-1',
      participants: ['doc-123', 'patient-456'],
      lastMessage: {
        id: 'msg-1',
        senderId: 'patient-456',
        receiverId: 'doc-123',
        content: '¿Podría explicarme nuevamente las indicaciones?',
        timestamp: new Date().toISOString(),
        status: 'read',
        type: 'text'
      },
      unreadCount: 2
    }
  ]);

  private messages$ = new BehaviorSubject<Message[]>([]);

  getConversations() {
    return this.conversations$.asObservable().pipe(delay(500));
  }

  getMessages(conversationId: string) {
    return of(this.messages$.value).pipe(delay(300));
  }

  sendMessage(message: Omit<Message, 'id' | 'timestamp' | 'status'>) {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    this.messages$.next([...this.messages$.value, newMessage]);
    return of(newMessage).pipe(delay(200));
  }
}
