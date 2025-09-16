import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../theme/shared/shared.module';
import { SpinnerComponent } from '../../theme/shared/components/spinner/spinner.component';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { LoanResponse } from '../../models/loan.models';

@Component({
  selector: 'app-finance-loan-approvals',
  imports: [CommonModule, RouterModule, SharedModule, SpinnerComponent],
  template: `
    <div class="row">
      <div class="col-md-12">
        <app-card cardTitle="Finance Loan Approvals" [options]="false">
          <!-- Loading State -->
          <div class="text-center" *ngIf="loading">
            <app-spinner></app-spinner>
            <p>Loading pending finance approvals...</p>
          </div>

          <!-- Error State -->
          <div class="alert alert-danger" *ngIf="error">
            <i class="feather icon-alert-circle"></i>
            {{ error }}
            <button class="btn btn-sm btn-outline-danger ml-2" (click)="loadPendingLoans()">
              Retry
            </button>
          </div>

          <!-- Pending Loans Table -->
          <div class="table-responsive" *ngIf="!loading && !error">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Purpose</th>
                  <th>Applied Date</th>
                  <th>Monthly EMI</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let loan of pendingLoans">
                  <td>
                    <div class="d-inline-block align-middle">
                      <div class="d-inline-block">
                        <h6 class="m-b-0">{{ loan.employeeName }}</h6>
                        <p class="m-b-0 text-muted">ID: {{ loan.employeeId }}</p>
                      </div>
                    </div>
                  </td>
                  <td>{{ loan.loanType }}</td>
                  <td>{{ loan.amount | currency:'INR':'symbol':'1.2-2' }}</td>
                  <td>{{ loan.tenureMonths }} months</td>
                  <td>{{ loan.purpose }}</td>
                  <td>{{ loan.appliedDate | date:'MMM dd, yyyy' }}</td>
                  <td>{{ loan.monthlyInstallment | currency:'INR':'symbol':'1.2-2' }}</td>
                  <td>
                    <div class="btn-group" *ngIf="canApprove()">
                      <button 
                        class="btn btn-sm btn-success"
                        (click)="approveLoan(loan.loanId)"
                        title="Approve">
                        <i class="feather icon-check"></i> Approve
                      </button>
                      <button 
                        class="btn btn-sm btn-danger"
                        (click)="rejectLoan(loan.loanId)"
                        title="Reject">
                        <i class="feather icon-x"></i> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div class="text-center py-4" *ngIf="pendingLoans.length === 0">
              <i class="feather icon-check-circle" style="font-size: 48px; color: #28a745;"></i>
              <h5 class="mt-3">No pending finance approvals</h5>
              <p class="text-muted">All manager-approved loans have been processed.</p>
            </div>
          </div>
        </app-card>
      </div>
    </div>
  `,
  styles: [`
    .alert {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class FinanceLoanApprovalsComponent implements OnInit {
  pendingLoans: LoanResponse[] = [];
  loading = true;
  error: string | null = null;
  userRole: string = '';

  constructor(
    private loanService: LoanService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadPendingLoans();
  }

  loadPendingLoans() {
    this.loading = true;
    this.loanService.getPendingFinanceApprovals().subscribe({
      next: (data: LoanResponse[]) => {
        this.pendingLoans = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load pending finance approvals';
        this.loading = false;
        console.error('Finance approvals error:', error);
      }
    });
  }

  approveLoan(id: number) {
    const loan = this.pendingLoans.find(l => l.loanId === id);
    if (confirm(`Approve loan application for ${loan?.employeeName}?`)) {
      const comments = prompt('Add comments (optional):');
      
      this.loanService.approveByFinance(id, comments || '').subscribe({
        next: () => {
          alert('Loan approved successfully!');
          this.loadPendingLoans();
        },
        error: (error: any) => {
          console.error('Approval error:', error);
          alert('Failed to approve loan. Please try again.');
        }
      });
    }
  }

  rejectLoan(id: number) {
    const loan = this.pendingLoans.find(l => l.loanId === id);
    const reason = prompt(`Reason for rejecting ${loan?.employeeName}'s loan application:`);
    
    if (reason && reason.trim()) {
      this.loanService.rejectByFinance(id, reason).subscribe({
        next: () => {
          alert('Loan rejected successfully!');
          this.loadPendingLoans();
        },
        error: (error: any) => {
          console.error('Rejection error:', error);
          alert('Failed to reject loan. Please try again.');
        }
      });
    } else if (reason !== null) {
      alert('Please provide a reason for rejection.');
    }
  }

  canApprove(): boolean {
    return this.userRole === 'FinanceAdmin' || this.userRole === 'Admin';
  }
}