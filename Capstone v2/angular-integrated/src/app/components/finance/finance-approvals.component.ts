import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-finance-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Finance Approvals</h1>
        <p>Final approval for manager-approved requests</p>
      </div>

      <div class="approval-tabs">
        <button class="tab-btn" [class.active]="activeTab === 'payroll'" (click)="activeTab = 'payroll'">
          Payroll ({{ managerApprovedPayrolls.length }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'loans'" (click)="activeTab = 'loans'">
          Loans ({{ managerApprovedLoans.length }})
        </button>
        <button class="tab-btn" [class.active]="activeTab === 'reimbursements'" (click)="activeTab = 'reimbursements'">
          Reimbursements ({{ managerApprovedReimbursements.length }})
        </button>
      </div>

      <div class="card">
        <div class="card-body">
          <div class="approval-item" *ngFor="let item of getCurrentItems()">
            <div class="approval-info">
              <h4>{{ item.employeeName }}</h4>
              <div class="approval-details">
                <span *ngIf="activeTab === 'payroll'">Net Pay: {{ item.netPay | currency }}</span>
                <span *ngIf="activeTab === 'loans'">Loan: {{ item.amount | currency }}</span>
                <span *ngIf="activeTab === 'reimbursements'">Expense: {{ item.amount | currency }}</span>
                <span>Manager: {{ item.managerName }}</span>
                <span>Approved: {{ item.managerApprovedDate | date:'short' }}</span>
              </div>
              <div class="manager-comments" *ngIf="item.managerComments">
                <strong>Manager Comments:</strong> {{ item.managerComments }}
              </div>
            </div>
            <div class="approval-actions">
              <textarea [(ngModel)]="item.financeComments" placeholder="Finance comments (optional)" class="form-control mb-2"></textarea>
              <button class="btn btn-success btn-sm" (click)="finalApprove(item)">Final Approve</button>
              <button class="btn btn-danger btn-sm" (click)="finalReject(item)">Reject</button>
            </div>
          </div>

          <div *ngIf="getCurrentItems().length === 0" class="text-center">
            <p>No pending {{ activeTab }} for final approval</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; }
    .approval-tabs { display: flex; gap: 0.5rem; margin-bottom: 2rem; }
    .tab-btn { padding: 0.75rem 1.5rem; border: 1px solid var(--border-color); background: var(--bg-primary); border-radius: var(--radius-md); cursor: pointer; }
    .tab-btn.active { background: var(--primary-color); color: white; }
    .approval-item { display: flex; justify-content: space-between; padding: 1.5rem; border-bottom: 1px solid var(--border-color); }
    .approval-info h4 { margin: 0 0 0.5rem 0; }
    .approval-details { display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.875rem; color: var(--text-secondary); }
    .manager-comments { margin-top: 0.5rem; padding: 0.5rem; background: var(--bg-secondary); border-radius: var(--radius-sm); font-size: 0.875rem; }
    .approval-actions { min-width: 300px; }
  `]
})
export class FinanceApprovalsComponent implements OnInit {
  activeTab = 'payroll';
  managerApprovedPayrolls: any[] = [];
  managerApprovedLoans: any[] = [];
  managerApprovedReimbursements: any[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.loadManagerApprovedItems();
  }

  loadManagerApprovedItems() {
    // Demo data - items approved by manager, pending finance approval
    this.managerApprovedPayrolls = [
      { id: 1, employeeName: 'John Doe', netPay: 42000, managerName: 'Jane Manager', managerApprovedDate: new Date(), managerComments: 'Approved for processing', financeComments: '' }
    ];
    this.managerApprovedLoans = [
      { id: 1, employeeName: 'Mike Johnson', amount: 100000, managerName: 'Jane Manager', managerApprovedDate: new Date(), managerComments: 'Employee has good track record', financeComments: '' }
    ];
    this.managerApprovedReimbursements = [
      { id: 1, employeeName: 'Sarah Wilson', amount: 5000, managerName: 'Jane Manager', managerApprovedDate: new Date(), managerComments: 'Valid business expense', financeComments: '' }
    ];
  }

  getCurrentItems() {
    switch (this.activeTab) {
      case 'payroll': return this.managerApprovedPayrolls;
      case 'loans': return this.managerApprovedLoans;
      case 'reimbursements': return this.managerApprovedReimbursements;
      default: return [];
    }
  }

  finalApprove(item: any) {
    console.log(`Final approving ${this.activeTab} for ${item.employeeName}`);
    this.toastService.success('Final Approval Complete', `${this.activeTab} final approved for ${item.employeeName}!`);
    this.loadManagerApprovedItems();
  }

  finalReject(item: any) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      console.log(`Final rejecting ${this.activeTab} for ${item.employeeName}: ${reason}`);
      this.toastService.warning('Request Rejected', `${this.activeTab} rejected for ${item.employeeName}.`);
      this.loadManagerApprovedItems();
    }
  }
}