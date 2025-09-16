import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../theme/shared/shared.module';
import { SpinnerComponent } from '../../theme/shared/components/spinner/spinner.component';
import { PayrollService } from '../../services/payroll.service';
import { AuthService } from '../../services/auth.service';
import { PayrollResponse } from '../../models/payroll.models';

@Component({
  selector: 'app-payroll-approvals',
  imports: [CommonModule, RouterModule, SharedModule, SpinnerComponent],
  templateUrl: './payroll-approvals.component.html',
  styleUrls: ['./payroll-approvals.component.scss']
})
export class PayrollApprovalsComponent implements OnInit {
  pendingPayrolls: PayrollResponse[] = [];
  loading = true;
  error: string | null = null;
  userRole: string = '';

  constructor(
    private payrollService: PayrollService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadPendingPayrolls();
  }

  loadPendingPayrolls() {
    this.loading = true;
    this.payrollService.getPendingApprovals().subscribe({
      next: (data) => {
        this.pendingPayrolls = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load pending payrolls';
        this.loading = false;
        console.error('Payroll approvals error:', error);
      }
    });
  }

  approvePayroll(id: number) {
    this.payrollService.approvePayroll(id).subscribe({
      next: () => {
        this.loadPendingPayrolls();
      },
      error: (error) => {
        console.error('Approval error:', error);
      }
    });
  }

  rejectPayroll(id: number) {
    this.payrollService.rejectPayroll(id).subscribe({
      next: () => {
        this.loadPendingPayrolls();
      },
      error: (error) => {
        console.error('Rejection error:', error);
      }
    });
  }

  canApprove(): boolean {
    return this.userRole === 'Manager' || this.userRole === 'FinanceAdmin' || this.userRole === 'Admin';
  }
}