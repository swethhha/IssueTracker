import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MockPayrollService } from './mock-payroll.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MedicalClaimService {
  private readonly API_URL = 'https://localhost:7101/api/medicalclaims';
  private useMockData = true; // Enable mock data for demo

  constructor(private http: HttpClient, private mockService: MockPayrollService) {}

  // Employee methods
  submitClaim(data: any): Observable<any> {
    // First check if user has insurance before allowing submission
    return new Observable(observer => {
      this.hasActiveInsurance().subscribe({
        next: (hasInsurance) => {
          if (!hasInsurance) {
            observer.error({ message: 'Insurance enrollment required' });
            return;
          }
          
          if (this.useMockData) {
            this.mockService.submitMedicalClaim(data).subscribe({
              next: (result) => observer.next(result),
              error: (error) => observer.error(error)
            });
          } else {
            this.http.post(`${this.API_URL}/request`, data).pipe(
              catchError(() => this.mockService.submitMedicalClaim(data))
            ).subscribe({
              next: (result) => observer.next(result),
              error: (error) => observer.error(error)
            });
          }
        },
        error: (error) => observer.error(error)
      });
    });
  }

  getMyClaims(): Observable<any[]> {
    if (this.useMockData) {
      return this.mockService.getMyMedicalClaims();
    }
    return this.http.get<any[]>(`${this.API_URL}/my`).pipe(
      catchError(() => this.mockService.getMyMedicalClaims())
    );
  }

  // Insurance methods
  hasActiveInsurance(): Observable<boolean> {
    if (this.useMockData) {
      return this.mockService.hasActiveInsurance();
    }
    return this.http.get<boolean>(`${this.API_URL}/has-insurance`).pipe(
      catchError(() => this.mockService.hasActiveInsurance())
    );
  }

  getMyInsurances(): Observable<any[]> {
    if (this.useMockData) {
      return this.mockService.getMyInsurances();
    }
    return this.http.get<any[]>(`${this.API_URL}/my-insurances`).pipe(
      catchError(() => this.mockService.getMyInsurances())
    );
  }

  getMyPendingCount(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/my-pending-count`);
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
  getTotalClaims(): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/total`);
  }

  getAllClaims(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}`);
  }

  approveClaim(id: number, managerId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/approve-manager`, { managerId });
  }

  rejectClaim(id: number, managerId: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${id}/reject-manager`, { managerId, reason });
  }
}