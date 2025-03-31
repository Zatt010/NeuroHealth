import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-new-post',
  imports: [CommonModule, FormsModule],
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {
  postTitle: string = '';
  postContent: string = '';
  selectedCategory: string = 'Ansiedad';
}
