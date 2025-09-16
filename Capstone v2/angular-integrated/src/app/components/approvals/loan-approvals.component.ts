import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../theme/shared/shared.module';
import { SpinnerComponent } from '../../theme/shared/components/spinner/spinner.component';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { LoanResponse } from '../../models/loan.models';

@Component({
  selector: 'app-loan-approvals',
  imports: [CommonModule, RouterModule, SharedModule, SpinnerComponent],
  templateUrl: './loan-approvals.component.html',
  styleUrls: ['./loan-approvals.component.scss']
})
export class LoanApprovalsComponent implements OnInit {
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
    this.loanService.getPendingApprovals().subscribe({
      next: (data: any) => {
        this.pendingLoans = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load pending loans';
        this.loading = false;
        console.error('Loan approvals error:', error);
      }
    });
  }

  approveLoan(id: number) {
    const loan = this.pendingLoans.find(l => l.loanId === id);
    if (confirm(`Approve loan application for ${loan?.employeeName}?`)) {
      const comments = prompt('Add comments (optional):');
      
      this.loanService.approveByManager(id, comments || '').subscribe({
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
      this.loanService.rejectByManager(id, reason).subscribe({
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
    return this.userRole === 'Manager' || this.userRole === 'FinanceAdmin' || this.userRole === 'Admin';
  }
}