import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-post-detail',
  imports: [CommonModule, FormsModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent {
  post = {
    title: 'Título de ejemplo',
    content: 'Contenido del post...',
    author: 'usuario_demo'
  };

  comments = [
    { text: '¡Muy interesante!', user: 'juan' },
    { text: 'Gracias por compartir.', user: 'ana' }
  ];

  newComment: string = '';

  addComment() {
    if (this.newComment.trim()) {
      this.comments.push({ text: this.newComment, user: 'anonimo' });
      this.newComment = '';
    }
  }
}
