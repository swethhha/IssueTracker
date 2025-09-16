import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalClaimService {
  private readonly API_URL = 'https://localhost:7101/api/medicalclaims';

  constructor(private http: HttpClient) {}

  // Employee methods
  getMyClaims(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/my-claims`);
  }

  requestClaim(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/request`, data);
  }

  // Manager methods
  getPendingManagerApprovals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pending-manager-approvals`);
  }

  getPendingManagerCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/pending-manager-count`);
  }

  approveByManager(id: number, comments?: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/manager-approve`, comments || '');
  }

  rejectByManager(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/manager-reject`, reason);
  }

  // Finance methods
  getPendingFinanceApprovals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pending-finance-approvals`);
  }

  getPendingFinanceCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/pending-finance-approvals`);
  }

  approveByFinance(id: number, comments?: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/finance-approve`, comments || '');
  }

  rejectByFinance(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/finance-reject`, reason);
  }

  // Admin methods
  getTotalClaims(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total-claims`);
  }

  submitClaim(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/request`, data);
  }

  approveClaim(id: number, managerId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/approve-manager`, { managerId });
  }

  rejectClaim(id: number, managerId: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reject-manager`, { managerId, reason });
  }
}