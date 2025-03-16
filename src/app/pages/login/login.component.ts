import { Component } from '@angular/core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        // localStorage.setItem('token', response.token); 
        this.router.navigate(['/home']); // Redirige a otra página
      },
      error: (error) => {
        console.error('Error de login:', error);
      }
    });
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

