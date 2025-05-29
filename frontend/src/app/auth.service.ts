import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/usuarios';
  private usuario: any = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  login(email: string, password: string): Observable<any> {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('contrasena', password);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    const apiLoginUrl = `${this.apiUrl}/login`;

    return this.http.post(apiLoginUrl, params.toString(), { headers });
  }

  signup(nombre: string, apellido: string, email: string, password: string): Observable<any> {
    const body = {
      nombre,
      apellido,
      email,
      contrasena: password,
      fechaRegistro: new Date(),
      rol: 'usuario'
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const apiSignupUrl = `${this.apiUrl}/registro`;

    return this.http.post(apiSignupUrl, body, { headers });
  }

  guardarUsuario(usuario: any) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('usuario', JSON.stringify(usuario));
    }
    this.usuario = usuario;
  }

  getUsuario() {
    if (!this.usuario && isPlatformBrowser(this.platformId)) {
      const usuarioGuardado = localStorage.getItem('usuario');
      this.usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    }
    return this.usuario;
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuario');
    }
    this.usuario = null;
  }

  // Método adicional para verificar estado de autenticación
  isLoggedIn(): boolean {
    return !!this.getUsuario();
  }

  // Método para obtener ID del usuario actual
  getCurrentUserId(): string | null {
    const usuario = this.getUsuario();
    return usuario ? usuario._id : null;
  }
}
