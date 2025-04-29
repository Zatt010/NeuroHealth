import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/usuarios';
  private usuario: any = null;

  constructor(private http: HttpClient) {}

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
    localStorage.setItem('usuario', JSON.stringify(usuario)); // Guardamos el usuario en localStorage
    this.usuario = usuario;
  }

  getUsuario() {
    if (!this.usuario) {
      const usuarioGuardado = localStorage.getItem('usuario');
      this.usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    }
    return this.usuario;
  }

  logout() {
    localStorage.removeItem('usuario'); // Elimina el usuario guardado
    this.usuario = null;
  }
}
