import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-approval-center',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Approval Center</h1>
        <p>Manage all pending employee requests</p>
      </div>

      <div class="filter-section">
        <div class="filter-controls">
          <select [(ngModel)]="selectedCategory" (change)="filterApprovals()" class="filter-select">
            <option value="">All Categories</option>
            <option value="payroll">Payroll</option>
            <option value="loan">Loans</option>
            <option value="reimbursement">Reimbursements</option>
            <option value="insurance">Insurance</option>
            <option value="medical">Medical Claims</option>
          </select>
          <button class="btn btn-primary" (click)="refreshData()">
            <span class="material-icons">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div class="approval-categories">
        <div class="category-card" *ngFor="let category of categories">
          <div class="category-header">
            <div class="category-icon" [ngClass]="category.type">
              <span class="material-icons">{{ category.icon }}</span>
            </div>
            <div class="category-info">
              <h3>{{ category.name }}</h3>
              <span class="pending-count">{{ category.pendingCount }} pending</span>
            </div>
          </div>
          <div class="category-actions">
            <a [routerLink]="category.route" class="btn btn-outline">
              View All
              <span class="material-icons">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>

      <div class="recent-approvals">
        <div class="section-header">
          <h2>Recent Approvals</h2>
          <div class="approval-stats">
            <span class="stat">
              <span class="stat-value">{{ totalApprovalsToday }}</span>
              <span class="stat-label">Today</span>
            </span>
            <span class="stat">
              <span class="stat-value">{{ totalApprovalsWeek }}</span>
              <span class="stat-label">This Week</span>
            </span>
            <span class="stat">
              <span class="stat-value">{{ totalApprovalsMonth }}</span>
              <span class="stat-label">This Month</span>
            </span>
          </div>
        </div>

        <div class="approval-list">
          <div class="approval-item" *ngFor="let approval of filteredApprovals">
            <div class="approval-icon" [ngClass]="approval.category">
              <span class="material-icons">{{ getCategoryIcon(approval.category) }}</span>
            </div>
            <div class="approval-details">
              <div class="approval-title">{{ approval.title }}</div>
              <div class="approval-meta">
                <span class="employee">{{ approval.employeeName }}</span>
                <span class="amount">₹{{ approval.amount | number:'1.0-0' }}</span>
                <span class="date">{{ approval.submittedDate | date:'shortDate' }}</span>
              </div>
            </div>
            <div class="approval-actions">
              <button class="btn btn-success btn-sm" (click)="quickApprove(approval)">
                <span class="material-icons">check</span>
                Approve
              </button>
              <button class="btn btn-error btn-sm" (click)="quickReject(approval)">
                <span class="material-icons">close</span>
                Reject
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="filteredApprovals.length === 0">
          <div class="empty-icon">
            <span class="material-icons">check_circle</span>
          </div>
          <h3>No Pending Approvals</h3>
          <p>All requests have been reviewed.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: var(--spacing-lg);
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--spacing-2xl);
    }

    .page-header h1 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
      margin: 0;
    }

    .page-header p {
      color: var(--on-surface-variant);
      font-size: var(--font-size-lg);
      margin: var(--spacing-sm) 0 0 0;
    }

    .filter-section {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
      box-shadow: var(--shadow-1);
    }

    .filter-controls {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .filter-select {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--outline);
      border-radius: var(--radius-lg);
      background: var(--surface);
      color: var(--on-surface);
    }

    .approval-categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .category-card {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .category-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .category-icon.payroll { background: var(--primary-500); }
    .category-icon.loan { background: var(--secondary-500); }
    .category-icon.reimbursement { background: var(--success-500); }
    .category-icon.insurance { background: var(--warning-500); }
    .category-icon.medical { background: var(--error-500); }

    .category-info h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .pending-count {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .recent-approvals {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      box-shadow: var(--shadow-1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    .section-header h2 {
      margin: 0;
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .approval-stats {
      display: flex;
      gap: var(--spacing-lg);
    }

    .stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .stat-value {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-500);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--on-surface-variant);
    }

    .approval-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .approval-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
      transition: all 0.2s ease;
    }

    .approval-item:hover {
      background: var(--surface-variant);
    }

    .approval-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .approval-icon.payroll { background: var(--primary-500); }
    .approval-icon.loan { background: var(--secondary-500); }
    .approval-icon.reimbursement { background: var(--success-500); }
    .approval-icon.insurance { background: var(--warning-500); }
    .approval-icon.medical { background: var(--error-500); }

    .approval-details {
      flex: 1;
    }

    .approval-title {
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin-bottom: var(--spacing-xs);
    }

    .approval-meta {
      display: flex;
      gap: var(--spacing-md);
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .amount {
      color: var(--primary-500);
      font-weight: var(--font-weight-semibold);
    }

    .approval-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
      text-decoration: none;
    }

    .btn-primary {
      background: var(--primary-500);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-600);
    }

    .btn-success {
      background: var(--success-500);
      color: white;
    }

    .btn-success:hover {
      background: var(--success-600);
    }

    .btn-error {
      background: var(--error-500);
      color: white;
    }

    .btn-error:hover {
      background: var(--error-600);
    }

    .btn-outline {
      background: transparent;
      color: var(--primary-500);
      border: 1px solid var(--primary-500);
    }

    .btn-outline:hover {
      background: var(--primary-50);
    }

    .btn-sm {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-3xl);
    }

    .empty-icon .material-icons {
      font-size: 64px;
      color: var(--success-500);
      margin-bottom: var(--spacing-lg);
    }

    .empty-state h3 {
      margin: 0 0 var(--spacing-sm) 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .empty-state p {
      color: var(--on-surface-variant);
      margin: 0;
    }

    @media (max-width: 768px) {
      .approval-categories {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);
      }

      .approval-stats {
        align-self: stretch;
        justify-content: space-around;
      }

      .approval-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-sm);
      }

      .approval-actions {
        align-self: stretch;
        justify-content: flex-end;
      }
    }
  `]
})
export class ApprovalCenterComponent implements OnInit {
  selectedCategory = '';
  totalApprovalsToday = 8;
  totalApprovalsWeek = 32;
  totalApprovalsMonth = 145;

  categories = [
    { name: 'Payroll Approvals', type: 'payroll', icon: 'receipt_long', pendingCount: 5, route: '/payroll-approvals' },
    { name: 'Loan Approvals', type: 'loan', icon: 'account_balance', pendingCount: 8, route: '/loan-approvals' },
    { name: 'Reimbursement Approvals', type: 'reimbursement', icon: 'receipt', pendingCount: 12, route: '/reimbursement-approvals' },
    { name: 'Insurance Approvals', type: 'insurance', icon: 'health_and_safety', pendingCount: 3, route: '/insurance-approvals' },
    { name: 'Medical Claim Approvals', type: 'medical', icon: 'local_hospital', pendingCount: 6, route: '/medical-approvals' }
  ];

  allApprovals: any[] = [];
  filteredApprovals: any[] = [];

  ngOnInit() {
    this.loadApprovals();
  }

  loadApprovals() {
    this.allApprovals = [
      {
        id: 1,
        category: 'loan',
        title: 'Personal Loan Application',
        employeeName: 'John Doe',
        amount: 200000,
        submittedDate: new Date(2024, 11, 1)
      },
      {
        id: 2,
        category: 'reimbursement',
        title: 'Travel Reimbursement',
        employeeName: 'Jane Smith',
        amount: 5000,
        submittedDate: new Date(2024, 11, 2)
      },
      {
        id: 3,
        category: 'medical',
        title: 'Medical Claim - Surgery',
        employeeName: 'Mike Johnson',
        amount: 15000,
        submittedDate: new Date(2024, 11, 3)
      },
      {
        id: 4,
        category: 'insurance',
        title: 'Health Insurance Enrollment',
        employeeName: 'Sarah Wilson',
        amount: 25000,
        submittedDate: new Date(2024, 11, 4)
      }
    ];
    this.filterApprovals();
  }

  filterApprovals() {
    this.filteredApprovals = this.selectedCategory 
      ? this.allApprovals.filter(approval => approval.category === this.selectedCategory)
      : this.allApprovals;
  }

  refreshData() {
    this.loadApprovals();
  }

  getCategoryIcon(category: string): string {
    const icons = {
      payroll: 'receipt_long',
      loan: 'account_balance',
      reimbursement: 'receipt',
      insurance: 'health_and_safety',
      medical: 'local_hospital'
    };
    return icons[category as keyof typeof icons] || 'description';
  }

  quickApprove(approval: any) {
    if (confirm(`Approve ${approval.title} for ${approval.employeeName}?`)) {
      alert('Request approved successfully!');
      this.removeApproval(approval.id);
    }
  }

  quickReject(approval: any) {
    const reason = prompt(`Reason for rejecting ${approval.title}:`);
    if (reason) {
      alert('Request rejected successfully!');
      this.removeApproval(approval.id);
    }
  }

  private removeApproval(id: number) {
    this.allApprovals = this.allApprovals.filter(approval => approval.id !== id);
    this.filterApprovals();
  }
}