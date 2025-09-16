import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1 class="mb-4">Dashboard</h1>
      
      <div class="grid grid-4">
        <div class="card">
          <h3>Payroll</h3>
          <p>View your payroll information</p>
          <button class="btn btn-primary" (click)="navigate('/payroll')">View Payrolls</button>
        </div>
        
        <div class="card">
          <h3>Loans</h3>
          <p>Apply for loans</p>
          <button class="btn btn-primary" (click)="navigate('/loans/apply')">Apply for Loan</button>
        </div>
        
        <div class="card">
          <h3>Reimbursements</h3>
          <p>Submit expense claims</p>
          <button class="btn btn-primary" (click)="navigate('/reimbursements/submit')">Submit Claim</button>
        </div>
        
        <div class="card">
          <h3>Insurance</h3>
          <p>Manage insurance policies</p>
          <button class="btn btn-primary" (click)="navigate('/insurance/policies')">View Policies</button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  constructor(private router: Router) {}
  
  navigate(path: string) {
    this.router.navigate([path]);
  }
}