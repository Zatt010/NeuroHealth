import { Component, NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-health-resources',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './health-resources.component.html',
  styleUrl: './health-resources.component.css'
})
export class HealthResourcesComponent {
  
}
