// src/app/interfaces/message.interface.ts
export interface Message {
  _id?: string; // Hacer opcional para nuevos mensajes
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: Date; // Hacer opcional
  status?: 'sent' | 'delivered' | 'read'; // Hacer opcional
  type: 'text' | 'file' | 'prescription';
}

export interface Conversation {
  _id: string; // Usar _id para MongoDB
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

// Añadir interfaz User si es necesaria
export interface User {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
}
