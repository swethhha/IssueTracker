import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MockPayrollService } from './mock-payroll.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReimbursementService {
  private readonly API_URL = 'https://localhost:7101/api/Reimbursements';
  private useMockData = true; // Enable mock data for demo

  constructor(private http: HttpClient, private mockService: MockPayrollService) {}

  // Employee methods
  getMyReimbursements(): Observable<any[]> {
    if (this.useMockData) {
      return this.mockService.getMyReimbursements();
    }
    return this.http.get<any[]>(`${this.API_URL}/my`).pipe(
      catchError(() => this.mockService.getMyReimbursements())
    );
  }

  requestReimbursement(data: any): Observable<any> {
    if (this.useMockData) {
      return this.mockService.requestReimbursement(data);
    }
    return this.http.post(`${this.API_URL}/request`, data).pipe(
      catchError(() => this.mockService.requestReimbursement(data))
    );
  }

  getMyPendingCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/my-pending-count`);
  }

  // Manager methods
  getPendingManagerApprovals(): Observable<any[]> {
    if (this.useMockData) {
      return this.mockService.getPendingReimbursementApprovals();
    }
    return this.http.get<any[]>(`${this.API_URL}/pending-approvals`).pipe(
      catchError(() => this.mockService.getPendingReimbursementApprovals())
    );
  }

  getPendingManagerCount(): Observable<number> {
    if (this.useMockData) {
      return this.mockService.getPendingReimbursementManagerCount();
    }
    return this.http.get<number>(`${this.API_URL}/pending-manager-count`).pipe(
      catchError(() => this.mockService.getPendingReimbursementManagerCount())
    );
  }

  approveByManager(id: number, comments?: string): Observable<any> {
    if (this.useMockData) {
      return this.mockService.approveReimbursementByManager(id, comments);
    }
    return this.http.post(`${this.API_URL}/${id}/approve-manager`, comments || '').pipe(
      catchError(() => this.mockService.approveReimbursementByManager(id, comments))
    );
  }

  rejectByManager(id: number, reason: string): Observable<any> {
    if (this.useMockData) {
      return this.mockService.rejectReimbursementByManager(id, reason);
    }
    return this.http.post(`${this.API_URL}/${id}/reject-manager`, reason).pipe(
      catchError(() => this.mockService.rejectReimbursementByManager(id, reason))
    );
  }

  // Finance methods
  getPendingFinanceCount(): Observable<number> {
    if (this.useMockData) {
      return this.mockService.getPendingReimbursementFinanceCount();
    }
    return this.http.get<number>(`${this.API_URL}/pending-finance-count`).pipe(
      catchError(() => this.mockService.getPendingReimbursementFinanceCount())
    );
  }

  approveByFinance(id: number, comments?: string): Observable<any> {
    if (this.useMockData) {
      return this.mockService.approveReimbursementByFinance(id, comments);
    }
    return this.http.post(`${this.API_URL}/${id}/approve-finance`, comments || '').pipe(
      catchError(() => this.mockService.approveReimbursementByFinance(id, comments))
    );
  }

  rejectByFinance(id: number, reason: string): Observable<any> {
    if (this.useMockData) {
      return this.mockService.rejectReimbursementByFinance(id, reason);
    }
    return this.http.post(`${this.API_URL}/${id}/reject-finance`, reason).pipe(
      catchError(() => this.mockService.rejectReimbursementByFinance(id, reason))
    );
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
    if (this.useMockData) {
      return this.mockService.getReimbursementsByEmployee(employeeId);
    }
    return this.http.get<any[]>(`${this.API_URL}/employee/${employeeId}`).pipe(
      catchError(() => this.mockService.getReimbursementsByEmployee(employeeId))
    );
  }
}