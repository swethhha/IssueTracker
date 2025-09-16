import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../theme/shared/shared.module';
import { SpinnerComponent } from '../../theme/shared/components/spinner/spinner.component';
import { ReimbursementService } from '../../services/reimbursement.service';
import { AuthService } from '../../services/auth.service';
import { ReimbursementResponse } from '../../models/reimbursement.models';

@Component({
  selector: 'app-reimbursement-approvals',
  imports: [CommonModule, RouterModule, SharedModule, SpinnerComponent],
  templateUrl: './reimbursement-approvals.component.html',
  styleUrls: ['./reimbursement-approvals.component.scss']
})
export class ReimbursementApprovalsComponent implements OnInit {
  pendingReimbursements: ReimbursementResponse[] = [];
  loading = true;
  error: string | null = null;
  userRole: string = '';

  constructor(
    private reimbursementService: ReimbursementService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadPendingReimbursements();
  }

  loadPendingReimbursements() {
    this.loading = true;
    this.reimbursementService.getPendingApprovals().subscribe({
      next: (data: any) => {
        this.pendingReimbursements = data;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load pending reimbursements';
        this.loading = false;
        console.error('Reimbursement approvals error:', error);
      }
    });
  }

  approveReimbursement(id: number) {
    this.reimbursementService.approveReimbursement(id).subscribe({
      next: () => {
        this.loadPendingReimbursements();
      },
      error: (error: any) => {
        console.error('Approval error:', error);
      }
    });
  }

  rejectReimbursement(id: number) {
    this.reimbursementService.rejectReimbursement(id).subscribe({
      next: () => {
        this.loadPendingReimbursements();
      },
      error: (error: any) => {
        console.error('Rejection error:', error);
      }
    });
  }

  canApprove(): boolean {
    return this.userRole === 'Manager' || this.userRole === 'FinanceAdmin' || this.userRole === 'Admin';
  }
}