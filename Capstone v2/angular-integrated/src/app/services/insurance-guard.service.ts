import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class InsuranceGuardService implements CanActivate {
  
  constructor(private router: Router, private toastService: ToastService) {}

  canActivate(): Observable<boolean> {
    const enrolledPolicies = this.getEnrolledPolicies();
    const hasActiveInsurance = enrolledPolicies.some(policy => policy.status === 'Active');

    if (!hasActiveInsurance) {
      this.toastService.warning('Insurance Required', 'You must be enrolled in at least one insurance policy to access medical claims. Please enroll first.');
      this.router.navigate(['/employee/insurance']);
      return of(false);
    }

    return of(true);
  }

  private getEnrolledPolicies(): any[] {
    // Get from localStorage or service - for now using localStorage
    const policies = localStorage.getItem('enrolledPolicies');
    return policies ? JSON.parse(policies) : [];
  }

  static hasActiveInsurance(): boolean {
    const policies = localStorage.getItem('enrolledPolicies');
    const enrolledPolicies = policies ? JSON.parse(policies) : [];
    return enrolledPolicies.some((policy: any) => policy.status === 'Active');
  }
}