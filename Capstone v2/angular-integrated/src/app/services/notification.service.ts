import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'https://localhost:7101/api';

  constructor(private http: HttpClient) {}

  getMyNotifications(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/notifications/my-notifications`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/notifications/${id}/read`, {});
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/notifications/unread-count`);
  }
}