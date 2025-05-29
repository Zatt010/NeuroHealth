# Integración del Módulo de Mensajería

## Interfaces de Datos
```typescript
src/app/interfaces/message.interface.ts
export interface Message {
  _id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp?: Date;
  status?: 'sent' | 'delivered' | 'read';
  type: 'text' | 'file' | 'prescription';
}

export interface Conversation {
  _id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
}

export interface User {
  _id: string;
  nombre: string;
  email: string;
  rol: string;
}
```
## Endpoints Requeridos
1. Obtener conversaciones del usuario
   - Método: GET
   - Ruta: /api/conversations
   - Respuesta:

```json
[
  {
    "_id": "conv1",
    "participants": ["user1_id", "user2_id"],
    "lastMessage": {
      "_id": "msg1",
      "senderId": "user1_id",
      "receiverId": "user2_id",
      "content": "Hola",
      "timestamp": "2023-10-25T12:00:00Z",
      "status": "delivered",
      "type": "text"
    },
    "unreadCount": 1
  }
]
```
2. Obtener mensajes de una conversación
   - Método: GET
   - Ruta: /api/conversations/:conversationId/messages
   - Respuesta:

```json
[
  {
    "_id": "msg1",
    "senderId": "user1_id",
    "receiverId": "user2_id",
    "content": "Hola",
    "timestamp": "2023-10-25T12:00:00Z",
    "status": "read",
    "type": "text"
  }
]
```
3. Enviar mensaje
   - Método: POST
   - Ruta: /api/messages
   - Body:
``` json
{
  "senderId": "user1_id",
  "receiverId": "user2_id",
  "content": "Nuevo mensaje",
  "type": "text"
}
```
Respuesta:

```json
{
  "_id": "msg2",
  "senderId": "user1_id",
  "receiverId": "user2_id",
  "content": "Nuevo mensaje",
  "timestamp": "2023-10-25T12:05:00Z",
  "status": "sent",
  "type": "text"
}
```
4. Marcar conversación como leída
   - Método: PATCH
   - Ruta: /api/conversations/:conversationId/read
   - Respuesta: 204 No Content

## Implementación de Servicios
### Servicio de Mensajería (API real)
``` typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Conversation, Message } from '../../interfaces/message.interface';

@Injectable({ providedIn: 'root' })
export class ApiMessagingService extends MessagingService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {
    super();
  }

  getConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`);
  }

  getMessages(conversationId: string): Observable<Message[]> {
    return this.http.get<Message[]>(`${this.apiUrl}/conversations/${conversationId}/messages`);
  }

  sendMessage(message: Omit<Message, '_id' | 'timestamp' | 'status'>): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/messages`, message);
  }

  markAsRead(conversationId: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/conversations/${conversationId}/read`, {});
  }
}
```
### Interceptor de Autenticación
``` typescript
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();
    if (token) {
      const cloned = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
```
### Manejo de Errores
``` typescript
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// ...

private handleError(error: HttpErrorResponse) {
  if (error.status === 401) {
    // Redirigir a login
    this.router.navigate(['/login']);
  }
  return throwError(() => error);
}

// Uso en un método:
getConversations(): Observable<Conversation[]> {
  return this.http.get<Conversation[]>(`${this.apiUrl}/conversations`).pipe(
    catchError(this.handleError)
  );
}
```
### WebSockets (Opcional para tiempo real)
``` typescript
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Message } from '../interfaces/message.interface';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private socket$: WebSocketSubject<Message>;

  constructor() {
    this.socket$ = webSocket<Message>(`${environment.wsUrl}/messages`);
  }

  public get messages$(): Observable<Message> {
    return this.socket$.asObservable();
  }

  public sendMessage(message: Message): void {
    this.socket$.next(message);
  }
}
```
### Configuración de Entorno
``` typescript
// environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  wsUrl: 'ws://localhost:3000' // Para WebSockets
};
```
### Configuración en app.config.ts
``` typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
    provideAnimations(),
    // ... otros providers
  ]
};
```
### Flujo de Trabajo Recomendado
  - Configurar variables de entorno con las URLs del backend
  - Implementar interceptor de autenticación para incluir token en headers
  - Reemplazar MessagingMockService con ApiMessagingService
  - Agregar manejo de errores en todos los métodos HTTP
  - Opcional: Implementar WebSockets para mensajes en tiempo real
  - Probar todos los endpoints con diferentes casos (éxito/error)

### Notas Importantes
  - Autenticación WebSocket: El backend debe validar el token en la conexión WS
  - Formato de fechas: Usar ISO 8601 (YYYY-MM-DDTHH:mm:ssZ) para timestamps
  - Paginación: Considerar implementar paginación para listas grandes
  - Optimización: Usar WebSockets solo para mensajes nuevos, no para historial
  - Seguridad: Validar en backend que usuario tenga permiso para cada conversación
