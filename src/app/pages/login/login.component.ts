import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  onSubmit() {
    // Lógica para manejar la submissión del formulario
    console.log('Formulario enviado');
  }

  onGoogleLogin() {
    // Lógica para manejar el login con Google
    console.log('Login con Google');
  }
  mailIcon: string = 'mail';
  changeIcon(isHovered: boolean) {
    this.mailIcon = isHovered ? 'mark_email_read' : 'mail';
  }
}