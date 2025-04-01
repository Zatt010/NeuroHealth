import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent {
  selectedCategory: string | null = null;
  categories: string[] = ['Todos los temas', 'Ansiedad', 'Depresión', 'Estrés', 'Meditación'];
  posts = [
    {
      id: 1,
      title: 'Mi experiencia con la meditación diaria',
      content: 'Hace tres meses comencé a meditar 10 minutos cada mañana y ha cambiado completamente mi manera de enfrentar el estrés laboral...',
      category: 'Meditación',
      date: new Date('2023-05-15'),
      author: 'maria_g'
    },
    {
      id: 2,
      title: 'Cómo manejar la ansiedad en reuniones sociales',
      content: 'Quería compartir algunas técnicas que me han ayudado a controlar la ansiedad cuando debo asistir a eventos con mucha gente...',
      category: 'Ansiedad',
      date: new Date('2023-06-02'),
      author: 'carlos_23'
    }
  ];

  // Filtra los posts 
  private normalizeCategory(category: string): string {
    return category
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  get filteredPosts() {
    if (!this.selectedCategory) return this.posts;
    
    return this.posts.filter(post => 
      this.normalizeCategory(post.category) === this.normalizeCategory(this.selectedCategory!)
    );
  }

  setFilter(category: string) {
    this.selectedCategory = category === 'Todos los temas' ? null : category;
  }

  trackByPostId(index: number, post: any): number {
    return post.id;
  }
}