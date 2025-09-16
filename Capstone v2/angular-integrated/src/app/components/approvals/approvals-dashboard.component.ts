import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { PayrollService } from '../../services/payroll.service';
import { LoanService } from '../../services/loan.service';
import { ReimbursementService } from '../../services/reimbursement.service';

@Component({
  selector: 'app-approvals-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './approvals-dashboard.component.html',
  styleUrls: ['./approvals-dashboard.component.scss']
})
export class ApprovalsDashboardComponent implements OnInit {
  activeTab = 'payroll';
  
  stats = {
    PendingPayroll: 0,
    PendingLoans: 0,
    PendingReimbursements: 0,
    PendingInsurance: 0,
    PendingMedicalClaims: 0
  };

  approvals = {
    Payroll: [],
    Loans: [],
    Reimbursements: [],
    Insurance: [],
    MedicalClaims: []
  };

  constructor(
    private dashboardService: DashboardService,
    private payrollService: PayrollService,
    private loanService: LoanService,
    private reimbursementService: ReimbursementService
  ) {}

  ngOnInit() {
    this.loadStats();
    this.loadApprovals();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  loadStats() {
    this.dashboardService.getManagerStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
      }
    });
  }

  loadApprovals() {
    this.dashboardService.getManagerApprovals().subscribe({
      next: (data) => {
        this.approvals = data;
      },
      error: (error) => {
        console.error('Error loading approvals:', error);
      }
    });
  }

  refreshData() {
    this.loadStats();
    this.loadApprovals();
  }

  approve(type: string, id: number) {
    switch(type) {
      case 'payroll':
        this.payrollService.approveByManager(id).subscribe({
          next: () => {
            this.refreshData();
          },
          error: (error) => {
            console.error('Error approving payroll:', error);
          }
        });
        break;
      case 'loans':
        this.loanService.approveByManager(id).subscribe({
          next: () => {
            this.refreshData();
          },
          error: (error) => {
            console.error('Error approving loan:', error);
          }
        });
        break;
      case 'reimbursements':
        this.reimbursementService.approveByManager(id).subscribe({
          next: () => {
            this.refreshData();
          },
          error: (error) => {
            console.error('Error approving reimbursement:', error);
          }
        });
        break;
    }
  }

  reject(type: string, id: number) {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    switch(type) {
      case 'payroll':
        this.payrollService.rejectByManager(id, reason).subscribe({
          next: () => {
            this.refreshData();
          },
          error: (error) => {
            console.error('Error rejecting payroll:', error);
          }
        });
        break;
      case 'loans':
        this.loanService.rejectByManager(id, reason).subscribe({
          next: () => {
            this.refreshData();
          },
          error: (error) => {
            console.error('Error rejecting loan:', error);
          }
        });
        break;
      case 'reimbursements':
        this.reimbursementService.rejectByManager(id, reason).subscribe({
          next: () => {
            this.refreshData();
          },
          error: (error) => {
            console.error('Error rejecting reimbursement:', error);
          }
        });
        break;
    }
  }
}