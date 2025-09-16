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
  enrollInsurance(data: any): Observable<any> {
    return this.http.post(`${this.API_URL}/enroll`, data);
  }

  getMyPolicies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/my-policies`);
  }

  getPolicyDetails(policyId: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/policy/${policyId}`);
  }

  downloadECard(policyId: number): Observable<Blob> {
    return this.http.get(`${this.API_URL}/ecard/${policyId}`, { responseType: 'blob' });
  }

  // Manager methods
  getPendingEnrollments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/pending-enrollments`);
  }

  approveEnrollment(enrollmentId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/approve-enrollment/${enrollmentId}`, {});
  }

  rejectEnrollment(enrollmentId: number, reason: string): Observable<any> {
    return this.http.post(`${this.API_URL}/reject-enrollment/${enrollmentId}`, { reason });
  }

  // Admin methods
  getAllPolicies(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/all-policies`);
  }

  updatePolicyDetails(policyId: number, data: any): Observable<any> {
    return this.http.put(`${this.API_URL}/policy/${policyId}`, data);
  }

  generatePolicyReport(): Observable<Blob> {
    return this.http.get(`${this.API_URL}/policy-report`, { responseType: 'blob' });
  }

  // Utility methods
  calculatePremium(enrollmentData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/calculate-premium`, enrollmentData);
  }

  getNetworkHospitals(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/network-hospitals`);
  }

  getPolicyBenefits(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/policy-benefits`);
  }
}