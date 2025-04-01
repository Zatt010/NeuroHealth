import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private apiUrl = 'http://localhost:8080/foro'

  constructor(private http: HttpClient) {}

  getComments(): Observable<any[]> {

    const apiUrlComments = `${this.apiUrl}/publicaciones`;

    return this.http.get<any[]>(apiUrlComments);
  }
}
