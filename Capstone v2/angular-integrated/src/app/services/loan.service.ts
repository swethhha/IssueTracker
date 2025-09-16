import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly API_URL = 'https://localhost:7101/api/loans';

  constructor(private http: HttpClient) {}

  // Employee methods
  getMyLoans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/my`);
  }

  applyForLoan(loanData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/request`, loanData);
  }

  getLoanById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  // Manager methods
  getPendingManagerApprovals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pending-manager-approvals`);
  }

  getPendingManagerCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/pending-manager-count`);
  }

  approveByManager(id: number, comments?: string): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/manager-approve?comments=${comments || ''}`, {});
  }

  rejectByManager(id: number, reason: string): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/manager-reject?reason=${reason}`, {});
  }

  // Finance methods
  approveByFinance(id: number, comments?: string): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/finance-approve?comments=${comments || ''}`, {});
  }

  rejectByFinance(id: number, reason: string): Observable<any> {
    return this.http.put(`${this.API_URL}/${id}/finance-reject?reason=${reason}`, {});
  }

  // Admin methods
  getAllLoans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}`);
  }

  // Document methods
  downloadDocument(documentId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/document/${documentId}`, { responseType: 'blob' });
  }

  approveLoan(id: number, managerId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/approve-manager`, { managerId });
  }

  rejectLoan(id: number, managerId: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reject-manager`, { managerId, reason });
  }
}