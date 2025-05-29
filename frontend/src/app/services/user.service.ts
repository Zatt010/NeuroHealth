// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';
import { User } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersCache = new Map<string, User>();

  constructor(private http: HttpClient) {}

  getUser(userId: string): Observable<User> {
    if (this.usersCache.has(userId)) {
      return of(this.usersCache.get(userId)!);
    }

    return this.http.get<User>(`/api/users/${userId}`).pipe(
      map(user => {
        this.usersCache.set(userId, user);
        return user;
      })
    );
  }

  getUserName(userId: string): Observable<string> {
    return this.getUser(userId).pipe(
      map(user => user.nombre || 'Usuario desconocido')
    );
  }
}
