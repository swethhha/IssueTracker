import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-payroll-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Payroll Approvals</h1>
          <p>Review and approve employee payroll records</p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-number">{{ pendingCount }}</span>
            <span class="stat-label">Pending</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ approvedCount }}</span>
            <span class="stat-label">Approved</span>
          </div>
        </div>
      </div>

      <div class="filters-section">
        <div class="filter-group">
          <label>Filter by Status:</label>
          <select [(ngModel)]="selectedFilter" class="filter-select">
            <option value="all">All Payrolls</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div class="approvals-grid" *ngIf="!isLoading">
        <div *ngFor="let payroll of filteredPayrolls" class="payroll-card">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ payroll.employeeName }}</h3>
              <p class="department">{{ payroll.department }}</p>
              <p class="period">{{ payroll.period }}</p>
            </div>
            <div class="status-badge" [ngClass]="payroll.status.toLowerCase()">
              {{ payroll.status }}
            </div>
          </div>

          <div class="payroll-breakdown">
            <div class="breakdown-item">
              <span class="label">Basic Salary</span>
              <span class="amount">₹{{ payroll.basicSalary | number:'1.0-0' }}</span>
            </div>
            <div class="breakdown-item">
              <span class="label">Allowances</span>
              <span class="amount positive">+₹{{ payroll.allowances | number:'1.0-0' }}</span>
            </div>
            <div class="breakdown-item">
              <span class="label">Deductions</span>
              <span class="amount negative">-₹{{ payroll.deductions | number:'1.0-0' }}</span>
            </div>
            <div class="breakdown-item total">
              <span class="label">Net Pay</span>
              <span class="amount">₹{{ payroll.netPay | number:'1.0-0' }}</span>
            </div>
          </div>

          <div class="card-actions" *ngIf="payroll.status === 'Pending'">
            <button class="btn btn-approve" (click)="approvePayroll(payroll)">
              <span class="material-icons">check_circle</span>
              Approve
            </button>
            <button class="btn btn-reject" (click)="rejectPayroll(payroll)">
              <span class="material-icons">cancel</span>
              Reject
            </button>
          </div>

          <div class="card-actions" *ngIf="payroll.status !== 'Pending'">
            <span class="status-text">{{ payroll.status }} on {{ payroll.payPeriodEnd | date:'MMM dd, yyyy' }}</span>
          </div>
        </div>
      </div>

      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading payroll data...</p>
      </div>

      <div class="empty-state" *ngIf="!isLoading && filteredPayrolls.length === 0">
        <span class="material-icons">assignment</span>
        <h3>No payrolls found</h3>
        <p>No payroll records match the selected filter.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: var(--spacing-lg);
      width: 100%;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--outline-variant);
    }

    .header-content h1 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
      margin: 0;
    }

    .header-content p {
      color: var(--on-surface-variant);
      margin: var(--spacing-xs) 0 0 0;
    }

    .header-stats {
      display: flex;
      gap: var(--spacing-md);
    }

    .stat-card {
      background: var(--surface-variant);
      padding: var(--spacing-md);
      border-radius: var(--radius-lg);
      text-align: center;
      min-width: 80px;
    }

    .stat-number {
      display: block;
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-500);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .filters-section {
      margin-bottom: var(--spacing-xl);
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .filter-group label {
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }

    .filter-select {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--outline);
      border-radius: var(--radius-md);
      background: var(--surface);
      color: var(--on-surface);
    }

    .approvals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--spacing-lg);
    }

    .payroll-card {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-1);
      transition: all 0.2s ease;
    }

    .payroll-card:hover {
      box-shadow: var(--shadow-2);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
    }

    .employee-info h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0;
    }

    .department {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
      margin: var(--spacing-xs) 0;
    }

    .period {
      color: var(--primary-500);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      margin: 0;
    }

    .status-badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.pending {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .status-badge.approved {
      background: var(--success-100);
      color: var(--success-700);
    }

    .status-badge.rejected {
      background: var(--error-100);
      color: var(--error-700);
    }

    .payroll-breakdown {
      margin-bottom: var(--spacing-lg);
    }

    .breakdown-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--outline-variant);
    }

    .breakdown-item.total {
      border-bottom: none;
      border-top: 2px solid var(--primary-500);
      padding-top: var(--spacing-md);
      font-weight: var(--font-weight-semibold);
    }

    .breakdown-item .label {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
    }

    .breakdown-item .amount {
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .breakdown-item .amount.positive {
      color: var(--success-600);
    }

    .breakdown-item .amount.negative {
      color: var(--error-600);
    }

    .card-actions {
      display: flex;
      gap: var(--spacing-sm);
      justify-content: flex-end;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-approve {
      background: var(--success-500);
      color: white;
    }

    .btn-approve:hover {
      background: var(--success-600);
    }

    .btn-reject {
      background: var(--error-500);
      color: white;
    }

    .btn-reject:hover {
      background: var(--error-600);
    }

    .status-text {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
      font-style: italic;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: var(--spacing-3xl);
      color: var(--on-surface-variant);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--outline-variant);
      border-top: 4px solid var(--primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto var(--spacing-md);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state .material-icons {
      font-size: 64px;
      color: var(--outline);
      margin-bottom: var(--spacing-md);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .approvals-grid {
        grid-template-columns: 1fr;
      }

      .card-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PayrollApprovalsComponent implements OnInit {
  selectedFilter = 'all';
  payrolls: any[] = [];
  isLoading = false;

  constructor(private payrollService: PayrollService) {}

  get filteredPayrolls() {
    if (this.selectedFilter === 'all') {
      return this.payrolls;
    }
    return this.payrolls.filter(p => p.status.toLowerCase() === this.selectedFilter);
  }

  get pendingCount() {
    return this.payrolls.filter(p => p.status === 'Pending').length;
  }

  get approvedCount() {
    return this.payrolls.filter(p => p.status === 'Approved').length;
  }

  ngOnInit() {
    this.loadPayrolls();
  }

  loadPayrolls() {
    this.isLoading = true;
    this.payrolls = [
      {
        id: 1,
        employeeName: 'John Doe',
        department: 'Engineering',
        period: 'December 2024',
        basicSalary: 75000,
        allowances: 15000,
        deductions: 8500,
        netPay: 81500,
        status: 'Pending',
        payPeriodStart: '2024-12-01',
        payPeriodEnd: '2024-12-31'
      },
      {
        id: 2,
        employeeName: 'Jane Smith',
        department: 'Marketing',
        period: 'December 2024',
        basicSalary: 65000,
        allowances: 12000,
        deductions: 7200,
        netPay: 69800,
        status: 'Pending',
        payPeriodStart: '2024-12-01',
        payPeriodEnd: '2024-12-31'
      },
      {
        id: 3,
        employeeName: 'Mike Johnson',
        department: 'Sales',
        period: 'December 2024',
        basicSalary: 58000,
        allowances: 10000,
        deductions: 6400,
        netPay: 61600,
        status: 'Approved',
        payPeriodStart: '2024-12-01',
        payPeriodEnd: '2024-12-31'
      },
      {
        id: 4,
        employeeName: 'Sarah Wilson',
        department: 'HR',
        period: 'December 2024',
        basicSalary: 62000,
        allowances: 11500,
        deductions: 6900,
        netPay: 66600,
        status: 'Pending',
        payPeriodStart: '2024-12-01',
        payPeriodEnd: '2024-12-31'
      },
      {
        id: 5,
        employeeName: 'David Brown',
        department: 'Finance',
        period: 'December 2024',
        basicSalary: 70000,
        allowances: 13000,
        deductions: 7800,
        netPay: 75200,
        status: 'Rejected',
        payPeriodStart: '2024-12-01',
        payPeriodEnd: '2024-12-31'
      }
    ];
    this.isLoading = false;
  }

  approvePayroll(payroll: any) {
    this.payrollService.approveByManager(payroll.id).subscribe({
      next: () => {
        payroll.status = 'Approved';
        alert(`Payroll approved for ${payroll.employeeName}`);
      },
      error: (error) => {
        console.error('Error approving payroll:', error);
        alert('Failed to approve payroll');
      }
    });
  }

  rejectPayroll(payroll: any) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.payrollService.rejectByManager(payroll.id, reason).subscribe({
        next: () => {
          payroll.status = 'Rejected';
          alert(`Payroll rejected for ${payroll.employeeName}`);
        },
        error: (error) => {
          console.error('Error rejecting payroll:', error);
          alert('Failed to reject payroll');
        }
      });
    }
  }
}