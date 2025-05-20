import { Component, Input } from '@angular/core';
import { Message } from '../../interfaces/message.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Añadir este import

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [CommonModule, FormsModule], // Agregar FormsModule aquí
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent {
  @Input() messages: Message[] = [];
  @Input() currentUserId: string = '';
  newMessage: string = '';

  sendMessage() {
    if (this.newMessage.trim()) {
      const newMsg: Message = {
        id: crypto.randomUUID(),
        senderId: this.currentUserId,
        receiverId: this.getReceiverId(),
        content: this.newMessage,
        timestamp: new Date().toISOString(),
        status: 'sent',
        type: 'text'
      };

      this.messages = [...this.messages, newMsg];
      this.newMessage = '';
    }
  }

  private getReceiverId(): string {
    return this.messages[0]?.senderId === this.currentUserId
      ? this.messages[0].receiverId
      : this.messages[0]?.senderId;
  }
}
