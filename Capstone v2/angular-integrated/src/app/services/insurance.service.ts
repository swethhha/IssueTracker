import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  private readonly API_URL = 'https://localhost:7101/api/insurance';

  constructor(private http: HttpClient) {}

  // Employee methods
  getMyEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/my-enrollments`);
  }

  getAvailablePolicies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/policies`);
  }

  enrollInPolicy(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/enroll`, data);
  }

  // Manager methods
  getPendingManagerApprovals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pending-manager-approvals`);
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
  approveByFinance(id: number, comments?: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/approve-finance`, comments || '');
  }

  rejectByFinance(id: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reject-finance`, reason);
  }

  // Admin methods
  getTotalPolicies(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total-policies`);
  }

  getActivePoliciesCount(employeeId?: number): Observable<number> {
    const url = employeeId ? `${this.API_URL}/active-count?employeeId=${employeeId}` : `${this.API_URL}/active-count`;
    return this.http.get<number>(url);
  }

  getEnrollmentsByEmployee(employeeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/employee/${employeeId}/enrollments`);
  }
}