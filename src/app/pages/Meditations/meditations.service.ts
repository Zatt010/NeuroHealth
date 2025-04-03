import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Meditation {
  id: number;
  title: string;
  description: string;
  duration: string;
  type: 'audio' | 'video';
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class MeditationsService {
  constructor(private http: HttpClient) {}

  getMeditations(): Observable<Meditation[]> {
    return this.http.get<Meditation[]>('meditations-assets/meditations.json');
  }
}
