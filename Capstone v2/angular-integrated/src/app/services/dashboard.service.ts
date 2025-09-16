import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiBaseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getManagerStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/manager-stats`);
  }

  getManagerApprovals(): Observable<any> {
    return this.http.get(`${this.apiUrl}/manager-approvals`);
  }

  getDashboardMetrics(): Observable<any> {
    return this.http.get(`${this.apiUrl}/manager-stats`);
  }
}