import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { MockPayrollService } from './mock-payroll.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoanService {
  private readonly API_URL = 'https://localhost:7101/api/Loans';
  private useMockData = true; // Enable mock data for demo

  constructor(private http: HttpClient, private mockService: MockPayrollService) {}

  // Employee methods
  getMyLoans(): Observable<any[]> {
    if (this.useMockData) {
      return this.mockService.getMyLoans();
    }
    return this.http.get<any[]>(`${this.API_URL}/my`).pipe(
      catchError(() => this.mockService.getMyLoans())
    );
  }

  applyForLoan(loanData: any): Observable<any> {
    if (this.useMockData) {
      return this.mockService.applyForLoan(loanData);
    }
    return this.http.post(`${this.API_URL}/apply`, loanData).pipe(
      catchError(() => this.mockService.applyForLoan(loanData))
    );
  }

  getLoanById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`);
  }

  // Manager methods
  getPendingManagerApprovals(): Observable<any[]> {
    if (this.useMockData) {
      return this.mockService.getPendingManagerApprovals();
    }
    return this.http.get<any[]>(`${this.API_URL}/pending-manager-approvals`).pipe(
      catchError(() => this.mockService.getPendingManagerApprovals())
    );
  }

  getPendingManagerCount(): Observable<number> {
    if (this.useMockData) {
      return this.mockService.getPendingManagerCount();
    }
    return this.http.get<number>(`${this.API_URL}/pending-manager-count`).pipe(
      catchError(() => this.mockService.getPendingManagerCount())
    );
  }

  approveByManager(id: number, comments?: string): Observable<any> {
    if (this.useMockData) {
      return this.mockService.approveByManager(id, comments);
    }
    return this.http.put(`${this.API_URL}/${id}/manager-approve?comments=${comments || ''}`, {}).pipe(
      catchError(() => this.mockService.approveByManager(id, comments))
    );
  }

  rejectByManager(id: number, reason: string): Observable<any> {
    if (this.useMockData) {
      return this.mockService.rejectByManager(id, reason);
    }
    return this.http.put(`${this.API_URL}/${id}/manager-reject?reason=${reason}`, {}).pipe(
      catchError(() => this.mockService.rejectByManager(id, reason))
    );
  }

  // Finance methods
  approveByFinance(id: number, comments?: string): Observable<any> {
    if (this.useMockData) {
      return this.mockService.approveByFinance(id, comments);
    }
    return this.http.put(`${this.API_URL}/${id}/finance-approve?comments=${comments || ''}`, {}).pipe(
      catchError(() => this.mockService.approveByFinance(id, comments))
    );
  }

  rejectByFinance(id: number, reason: string): Observable<any> {
    if (this.useMockData) {
      return this.mockService.rejectByFinance(id, reason);
    }
    return this.http.put(`${this.API_URL}/${id}/finance-reject?reason=${reason}`, {}).pipe(
      catchError(() => this.mockService.rejectByFinance(id, reason))
    );
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
    if (this.useMockData) {
      return this.mockService.getPendingFinanceApprovals();
    }
    return this.http.get<any[]>(`${this.API_URL}/pending-finance-approvals`).pipe(
      catchError(() => this.mockService.getPendingFinanceApprovals())
    );
  }

  getPendingFinanceCount(): Observable<number> {
    if (this.useMockData) {
      return this.mockService.getPendingFinanceCount();
    }
    return this.http.get<number>(`${this.API_URL}/pending-finance-count`).pipe(
      catchError(() => this.mockService.getPendingFinanceCount())
    );
  }

  getLoansByEmployee(employeeId: number): Observable<any[]> {
    if (this.useMockData) {
      return this.mockService.getLoansByEmployee(employeeId);
    }
    return this.http.get<any[]>(`${this.API_URL}/employee/${employeeId}`).pipe(
      catchError(() => this.mockService.getLoansByEmployee(employeeId))
    );
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