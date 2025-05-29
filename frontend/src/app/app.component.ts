// src/app/app.component.ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalLoaderComponent } from './shared/components/global-loader/global-loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, GlobalLoaderComponent],
  template: `
    <router-outlet></router-outlet>
    <app-global-loader></app-global-loader>
  `
})
export class AppComponent {
  title = 'neuro-health';
}