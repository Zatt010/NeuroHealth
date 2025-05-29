// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  getUsuario(): any {
    return this.currentUser || JSON.parse(localStorage.getItem('currentUser') || 'null');
  }

  setUsuario(user: any): void {
    this.currentUser = user;
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
  }

  getCurrentUserId(): string | null {
    const user = this.getUsuario();
    return user ? user._id : null;
  }
}
