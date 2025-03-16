import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/usuarios/login';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const params = new URLSearchParams();
    params.append('email', email);
    params.append('contrasena', password);
  
    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
  
    return this.http.post(this.apiUrl, params.toString(), { headers });
  }
  
}
