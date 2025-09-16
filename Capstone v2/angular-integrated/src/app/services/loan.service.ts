import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly API_URL = 'https://localhost:7101/api/Loans';

  constructor(private http: HttpClient) {}

  // Employee methods
  getMyLoans(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/my`);
  }

  applyForLoan(loanData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/apply`, loanData);
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

  // Convenience methods for approval components
  getPendingApprovals(): Observable<any[]> {
    return this.getPendingManagerApprovals();
  }

  approveLoan(id: number): Observable<any> {
    return this.approveByManager(id);
  }

  rejectLoan(id: number, reason?: string): Observable<any> {
    const rejectionReason = reason || 'No reason provided';
    return this.rejectByManager(id, rejectionReason);
  }

  // Finance pending approvals
  getPendingFinanceApprovals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pending-finance-approvals`);
  }

  getPendingFinanceCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/pending-finance-count`);
  }

  getLoansByEmployee(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/employee/${employeeId}`);
  }

  applyLoan(loanData: any, documents: File[]): Observable<any> {
    const formData = new FormData();
    Object.keys(loanData).forEach(key => {
      formData.append(key, loanData[key]);
    });
    documents.forEach(doc => {
      formData.append('documents', doc);
    });
    return this.http.post(`${this.API_URL}/apply`, formData);
  }
}