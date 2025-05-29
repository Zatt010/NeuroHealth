import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-loading-container',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  template: `
    <div class="loading-container-wrapper">
      <ng-content *ngIf="!isLoading"></ng-content>
      <app-loader *ngIf="isLoading"></app-loader>
    </div>
  `,
  styles: [`
    .loading-container-wrapper {
      position: relative;
      min-height: 300px;
    }
  `]
})
export class LoadingContainerComponent {
  @Input() isLoading: boolean = false;
}