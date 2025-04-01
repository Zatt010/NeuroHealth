import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { CommentService } from '../../services/comment.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule,TruncatePipe],
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  posts: any[] = [];

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.commentService.getComments().subscribe({
      next: (data) => {
        this.posts = data;
      },
      error: (error) => {
        console.error('Error al cargar los comentarios:', error);
      }
    });
  }
}