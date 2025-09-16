import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private readonly API_URL = 'https://localhost:7101/api/Payroll';

  constructor(private http: HttpClient) {}

  // Employee methods
  getMyPayrolls(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/my-payrolls`);
  }

  getMyPayrollSummary(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/summary`);
  }

  // Manager methods
  getPendingManagerApprovals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pending-approvals`);
  }

  getPendingManagerCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/pending-manager-count`);
  }

  approveByManager(id: number, comments?: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/approve-manager?comments=${comments || ''}`, {});
  }

  rejectByManager(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reject-manager?reason=${reason}`, {});
  }

  // Finance methods
  getPendingFinanceApprovals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pending-finance`);
  }

  getPendingFinanceCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/pending-finance`);
  }

  approveByFinance(id: number, comments?: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/approve-finance?comments=${comments || ''}`, {});
  }

  rejectByFinance(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reject-finance?reason=${reason}`, {});
  }

  // Admin methods
  getTotalEmployees(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total-employees`);
  }

  getTotalPayrolls(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total-payrolls`);
  }

  getPayrollsByEmployee(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/employee/${employeeId}`);
  }

  getEmployeePayrolls(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/employee/${employeeId}`);
  }

  approvePayroll(id: number, managerId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/approve-manager`, { managerId });
  }

  rejectPayroll(id: number, managerId: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reject-manager`, { managerId, reason });
  }
}