import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoanResponse } from '../../models/loan.models';

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

        <!-- Loading State -->
        <div class="text-center py-4" *ngIf="loading">
          <div class="spinner-border text-primary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
          <p class="mt-2 text-muted">Loading pending approvals...</p>
        </div>

        <!-- Error State -->
        <div class="alert alert-danger" *ngIf="error && !loading">
          <span class="material-icons">error</span>
          {{ error }}
          <button class="btn btn-outline-danger btn-sm ml-2" (click)="refreshData()">
            <span class="material-icons">refresh</span>
            Retry
          </button>
        </div>

        <div class="approval-list" *ngIf="!loading && !error">
          <div class="approval-item" *ngFor="let approval of filteredApprovals">
            <div class="approval-icon loan">
              <span class="material-icons">account_balance_wallet</span>
            </div>
            <div class="approval-details">
              <div class="approval-title">{{ approval.loanType }} Application</div>
              <div class="approval-meta">
                <span class="employee">{{ approval.employeeName }}</span>
                <span class="amount">₹{{ approval.amount | number:'1.0-0' }}</span>
                <span class="date">{{ approval.appliedDate | date:'shortDate' }}</span>
              </div>
            </div>
            <div class="approval-actions" *ngIf="canApprove()">
              <button class="btn btn-success btn-sm" (click)="quickApprove(approval)">
                <span class="material-icons">check</span>
                Approve
              </button>
              <button class="btn btn-error btn-sm" (click)="quickReject(approval)">
                <span class="material-icons">close</span>
                Reject
              </button>
            </div>
            <div class="approval-actions" *ngIf="!canApprove()">
              <span class="text-muted">No permission to approve</span>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="!loading && !error && filteredApprovals.length === 0">
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

    /* Loading and Error States */
    .spinner-border {
      width: 2rem;
      height: 2rem;
      border: 0.25em solid currentColor;
      border-right-color: transparent;
      border-radius: 50%;
      animation: spinner-border 0.75s linear infinite;
    }

    @keyframes spinner-border {
      to {
        transform: rotate(360deg);
      }
    }

    .alert {
      padding: var(--spacing-md);
      border-radius: var(--radius-lg);
      border: 1px solid;
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .alert-danger {
      background-color: var(--error-50);
      border-color: var(--error-200);
      color: var(--error-700);
    }

    .btn-outline-danger {
      background: transparent;
      color: var(--error-500);
      border: 1px solid var(--error-500);
    }

    .btn-outline-danger:hover {
      background: var(--error-500);
      color: white;
    }

    .text-muted {
      color: var(--on-surface-variant) !important;
    }

    .text-primary {
      color: var(--primary-500) !important;
    }

    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
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
  totalApprovalsToday = 0;
  totalApprovalsWeek = 0;
  totalApprovalsMonth = 0;
  loading = false;
  error: string | null = null;
  userRole = '';

  categories = [
    { name: 'Payroll Approvals', type: 'payroll', icon: 'receipt_long', pendingCount: 3, route: '/finance/payroll-approvals' },
    { name: 'Loan Approvals', type: 'loan', icon: 'account_balance', pendingCount: 5, route: '/finance/loan-approvals' },
    { name: 'Reimbursement Approvals', type: 'reimbursement', icon: 'receipt', pendingCount: 7, route: '/finance/reimbursement-approvals' },
    { name: 'Insurance Approvals', type: 'insurance', icon: 'health_and_safety', pendingCount: 2, route: '/finance/insurance-approvals' },
    { name: 'Medical Claim Approvals', type: 'medical', icon: 'local_hospital', pendingCount: 4, route: '/finance/medical-approvals' }
  ];

  allApprovals: LoanResponse[] = [];
  filteredApprovals: LoanResponse[] = [];

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole() || '';
    this.loadMockData();
    this.loadApprovals();
    this.loadPendingCounts();
  }

  loadMockData() {
    // Add mock approval data
    this.totalApprovalsToday = 8;
    this.totalApprovalsWeek = 23;
    this.totalApprovalsMonth = 67;
    
    // Mock recent approvals - only show 5 to match loan count
    this.allApprovals = [
      {
        loanId: 1,
        employeeId: 101,
        employeeName: 'John Doe',
        loanType: 'Personal Loan',
        amount: 50000,
        tenureMonths: 24,
        purpose: 'Home renovation',
        appliedDate: new Date('2024-12-15'),
        status: 'Pending',
        monthlyInstallment: 2291
      },
      {
        loanId: 2,
        employeeId: 102,
        employeeName: 'Jane Smith',
        loanType: 'Education Loan',
        amount: 75000,
        tenureMonths: 36,
        purpose: 'MBA Course',
        appliedDate: new Date('2024-12-14'),
        status: 'Pending',
        monthlyInstallment: 2437
      },
      {
        loanId: 3,
        employeeId: 103,
        employeeName: 'Mike Johnson',
        loanType: 'Emergency Loan',
        amount: 25000,
        tenureMonths: 12,
        purpose: 'Medical emergency',
        appliedDate: new Date('2024-12-13'),
        status: 'Pending',
        monthlyInstallment: 2229
      },
      {
        loanId: 4,
        employeeId: 104,
        employeeName: 'Sarah Wilson',
        loanType: 'Vehicle Loan',
        amount: 80000,
        tenureMonths: 48,
        purpose: 'Car purchase',
        appliedDate: new Date('2024-12-12'),
        status: 'Pending',
        monthlyInstallment: 2083
      },
      {
        loanId: 5,
        employeeId: 105,
        employeeName: 'David Brown',
        loanType: 'Personal Loan',
        amount: 30000,
        tenureMonths: 18,
        purpose: 'Debt consolidation',
        appliedDate: new Date('2024-12-11'),
        status: 'Pending',
        monthlyInstallment: 1875
      }
    ];
    
    this.filterApprovals();
  }

  loadApprovals() {
    this.loading = true;
    this.error = null;
    
    this.loanService.getPendingManagerApprovals().subscribe({
      next: (loans: LoanResponse[]) => {
        this.allApprovals = loans;
        this.filterApprovals();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading approvals:', error);
        this.error = 'Failed to load pending approvals';
        this.loading = false;
      }
    });
  }

  loadPendingCounts() {
    this.loanService.getPendingManagerCount().subscribe({
      next: (count: number) => {
        const loanCategory = this.categories.find(c => c.type === 'loan');
        if (loanCategory) {
          loanCategory.pendingCount = count;
        }
      },
      error: (error) => {
        console.error('Error loading pending count:', error);
      }
    });
  }

  filterApprovals() {
    this.filteredApprovals = this.selectedCategory 
      ? this.allApprovals
      : this.allApprovals;
  }

  refreshData() {
    this.loadApprovals();
    this.loadPendingCounts();
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
    if (confirm(`Approve ${approval.loanType} for ${approval.employeeName}?`)) {
      const comments = prompt('Add comments (optional):');
      
      this.loanService.approveByManager(approval.loanId, comments || '').subscribe({
        next: () => {
          this.toastService.success('Loan Approved', `${approval.loanType} for ${approval.employeeName} approved successfully!`);
          this.loadApprovals();
          this.loadPendingCounts();
        },
        error: (error) => {
          console.error('Error approving loan:', error);
          this.toastService.error('Approval Failed', 'Failed to approve request. Please try again.');
        }
      });
    }
  }

  quickReject(approval: any) {
    const reason = prompt(`Reason for rejecting ${approval.loanType}:`);
    if (reason && reason.trim()) {
      this.loanService.rejectByManager(approval.loanId, reason).subscribe({
        next: () => {
          this.toastService.warning('Loan Rejected', `${approval.loanType} for ${approval.employeeName} rejected successfully!`);
          this.loadApprovals();
          this.loadPendingCounts();
        },
        error: (error) => {
          console.error('Error rejecting loan:', error);
          this.toastService.error('Rejection Failed', 'Failed to reject request. Please try again.');
        }
      });
    } else if (reason !== null) {
      this.toastService.warning('Rejection Cancelled', 'Please provide a reason for rejection.');
    }
  }

  canApprove(): boolean {
    return this.userRole === 'Manager' || this.userRole === 'Admin';
  }
}