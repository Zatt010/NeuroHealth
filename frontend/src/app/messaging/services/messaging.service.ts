// src/app/messaging/services/messaging.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Conversation, Message } from '../../interfaces/message.interface';

export abstract class MessagingService {
  abstract getConversations(): Observable<Conversation[]>;
  abstract getMessages(conversationId: string): Observable<Message[]>;
  abstract sendMessage(message: Omit<Message, '_id' | 'timestamp' | 'status'>): Observable<Message>;
  abstract markAsRead(conversationId: string): Observable<void>;
  abstract getConversation(conversationId: string): Observable<Conversation>;
}
