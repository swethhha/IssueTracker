import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {
  private readonly API_URL = 'https://localhost:7101/api/Reimbursements';

  constructor(private http: HttpClient) {}

  // Employee methods
  getMyReimbursements(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/my`);
  }

  requestReimbursement(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/request`, data);
  }

  getMyPendingCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/my-pending-count`);
  }

  // Manager methods
  getPendingManagerApprovals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pending-approvals`);
  }

  getPendingManagerCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/pending-manager-count`);
  }

  approveByManager(id: number, comments?: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/approve-manager`, comments || '');
  }

  rejectByManager(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reject-manager`, reason);
  }

  // Finance methods
  getPendingFinanceCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/pending-finance-count`);
  }

  approveByFinance(id: number, comments?: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/approve-finance`, comments || '');
  }

  rejectByFinance(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reject-finance`, reason);
  }

  // Admin methods
  getTotalReimbursements(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total`);
  }

  approveReimbursement(id: number, managerId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/approve-manager`, { managerId });
  }

  rejectReimbursement(id: number, managerId: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reject-manager`, { managerId, reason });
  }

  getReimbursementsByEmployee(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/employee/${employeeId}`);
  }
}