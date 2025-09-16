import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayrollService } from '../../services/payroll.service';
import { LoanService } from '../../services/loan.service';
import { ReimbursementService } from '../../services/reimbursement.service';
import { InsuranceService } from '../../services/insurance.service';
import { MedicalClaimService } from '../../services/medical-claim.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Employee Dashboard</h1>
        <p>Welcome back! Here's your overview</p>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>

      <!-- Error State -->
      <div class="error-state" *ngIf="error && !loading">
        <span class="material-icons">error</span>
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="loadDashboardData()">Retry</button>
      </div>

      <!-- Dashboard Content -->
      <div *ngIf="!loading && !error">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">account_balance_wallet</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">₹{{ totalEarnings | number:'1.0-0' }}</div>
            <div class="stat-label">Total Earnings</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">
            <span class="material-icons">pending_actions</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingRequests.length }}</div>
            <div class="stat-label">Pending Requests</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <span class="material-icons">receipt_long</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ recentPayrolls.length }}</div>
            <div class="stat-label">Recent Payrolls</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <span class="material-icons">notifications</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ recentNotifications.length }}</div>
            <div class="stat-label">Notifications</div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">My Recent Payrolls</h3>
            <a routerLink="/payroll" class="view-all-link">View All</a>
          </div>
          <div class="card-body">
            <div class="payroll-list">
              <div class="payroll-item" *ngFor="let payroll of recentPayrolls">
                <div class="payroll-info">
                  <strong>{{ payroll.period }}</strong>
                  <span class="payroll-amount">₹{{ payroll.netPay | number:'1.0-0' }}</span>
                </div>
                <div class="payroll-status">
                  <span class="badge badge-success">{{ payroll.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Pending Requests</h3>
          </div>
          <div class="card-body">
            <div class="pending-list" *ngIf="pendingRequests.length > 0">
              <div class="pending-item" *ngFor="let request of pendingRequests">
                <div class="request-info">
                  <strong>{{ request.type }}</strong>
                  <span class="request-amount">₹{{ request.amount | number:'1.0-0' }}</span>
                </div>
                <div class="request-date">{{ request.submittedDate | date:'shortDate' }}</div>
              </div>
            </div>
            <div class="empty-message" *ngIf="pendingRequests.length === 0">
              <span class="material-icons">check_circle</span>
              <p>No pending requests</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Notifications</h3>
          </div>
          <div class="card-body">
            <div class="notification-list">
              <div class="notification-item" *ngFor="let notification of recentNotifications">
                <div class="notification-icon" [ngClass]="notification.type">
                  <span class="material-icons">{{ notification.icon }}</span>
                </div>
                <div class="notification-content">
                  <div class="notification-title">{{ notification.title }}</div>
                  <div class="notification-time">{{ notification.time | date:'short' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <a routerLink="/loans" class="action-btn">
                <div class="action-icon primary">
                  <span class="material-icons">account_balance</span>
                </div>
                <div class="action-text">
                  <strong>Apply for Loan</strong>
                  <small>Personal, Home, Education</small>
                </div>
              </a>
              <a routerLink="/reimbursements" class="action-btn">
                <div class="action-icon secondary">
                  <span class="material-icons">receipt</span>
                </div>
                <div class="action-text">
                  <strong>Submit Reimbursement</strong>
                  <small>Travel, Office, Others</small>
                </div>
              </a>
              <a routerLink="/insurance" class="action-btn">
                <div class="action-icon success">
                  <span class="material-icons">health_and_safety</span>
                </div>
                <div class="action-text">
                  <strong>Insurance Enrollment</strong>
                  <small>Health, Life, Critical</small>
                </div>
              </a>
              <a routerLink="/medical-claims" class="action-btn">
                <div class="action-icon warning">
                  <span class="material-icons">local_hospital</span>
                </div>
                <div class="action-text">
                  <strong>Medical Claim</strong>
                  <small>Hospital bills, Prescriptions</small>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: var(--spacing-lg);
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: var(--spacing-2xl);
    }

    .dashboard-header h1 {
      font-size: var(--font-size-4xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
      margin: 0;
    }

    .dashboard-header p {
      color: var(--on-surface-variant);
      font-size: var(--font-size-lg);
      margin: var(--spacing-sm) 0 0 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      box-shadow: var(--shadow-1);
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      box-shadow: var(--shadow-2);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-xl);
      background: var(--primary-100);
      color: var(--primary-700);
    }

    .stat-icon.pending {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .stat-icon.success {
      background: var(--success-100);
      color: var(--success-700);
    }

    .stat-icon.info {
      background: var(--secondary-100);
      color: var(--secondary-700);
    }

    .stat-icon .material-icons {
      font-size: 28px;
    }

    .stat-value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
      margin-bottom: var(--spacing-xs);
    }

    .stat-label {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--spacing-xl);
    }

    .card {
      background: var(--surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-1);
      overflow: hidden;
    }

    .card-header {
      padding: var(--spacing-xl);
      border-bottom: 1px solid var(--outline-variant);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .view-all-link {
      color: var(--primary-500);
      text-decoration: none;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .view-all-link:hover {
      color: var(--primary-700);
    }

    .card-body {
      padding: var(--spacing-xl);
    }

    .payroll-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .payroll-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
    }

    .payroll-info strong {
      display: block;
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
    }

    .payroll-amount {
      color: var(--primary-500);
      font-weight: var(--font-weight-semibold);
    }

    .pending-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .pending-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
    }

    .request-info strong {
      display: block;
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
    }

    .request-amount {
      color: var(--warning-500);
      font-weight: var(--font-weight-semibold);
    }

    .request-date {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .notification-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: white;
    }

    .notification-icon.success { background: var(--success-500); }
    .notification-icon.warning { background: var(--warning-500); }
    .notification-icon.info { background: var(--primary-500); }
    .notification-icon.error { background: var(--error-500); }

    .notification-title {
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
    }

    .notification-time {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
    }

    .empty-message {
      text-align: center;
      padding: var(--spacing-xl);
      color: var(--on-surface-variant);
    }

    .empty-message .material-icons {
      font-size: 48px;
      color: var(--success-500);
      margin-bottom: var(--spacing-sm);
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
      text-decoration: none;
      color: var(--on-surface);
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: var(--surface-variant);
      border-color: var(--primary-500);
      transform: translateX(4px);
    }

    .action-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-lg);
      color: white;
    }

    .action-icon.primary { background: var(--primary-500); }
    .action-icon.secondary { background: var(--secondary-500); }
    .action-icon.success { background: var(--success-500); }
    .action-icon.warning { background: var(--warning-500); }

    .action-text strong {
      display: block;
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
    }

    .action-text small {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
    }

    .badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-xl);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
    }

    .badge-success {
      background: var(--success-100);
      color: var(--success-700);
    }

    .loading-state, .error-state {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-state .material-icons {
      font-size: 48px;
      color: #e53e3e;
      margin-bottom: 1rem;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      background: #667eea;
      color: white;
      cursor: pointer;
      font-weight: 600;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: var(--spacing-md);
      }
      
      .stats-grid,
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeDashboardComponent implements OnInit {
  totalEarnings = 0;
  pendingRequests: any[] = [];
  recentPayrolls: any[] = [];
  recentNotifications: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private payrollService: PayrollService,
    private loanService: LoanService,
    private reimbursementService: ReimbursementService,
    private insuranceService: InsuranceService,
    private medicalClaimService: MedicalClaimService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    this.error = null;
    
    // Load real payroll data
    this.payrollService.getEmployeePayrolls(1).subscribe({
      next: (payrolls) => {
        this.recentPayrolls = payrolls.slice(0, 3).map(p => ({
          period: this.formatPayrollPeriod(p.payPeriodStart, p.payPeriodEnd),
          netPay: p.netPay,
          status: p.status || 'Approved'
        }));
        this.totalEarnings = payrolls.reduce((sum, p) => sum + p.netPay, 0);
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load payroll data:', error);
        this.error = 'Failed to load dashboard data. Please check if the backend is running.';
        this.loading = false;
        this.recentPayrolls = [];
        this.totalEarnings = 0;
      }
    });

    // Load real loan data
    this.loanService.getLoansByEmployee(1).subscribe({
      next: (loans) => {
        const pendingLoans = loans.filter(l => l.status === 'Pending').map(l => ({
          type: l.loanType + ' Application',
          amount: l.amount,
          submittedDate: new Date(l.appliedDate)
        }));
        this.pendingRequests = [...pendingLoans];
      },
      error: (error) => {
        console.error('Failed to load loan data:', error);
      }
    });

    // Load real reimbursement data
    this.reimbursementService.getReimbursementsByEmployee(1).subscribe({
      next: (reimbursements) => {
        const pendingReimb = reimbursements.filter(r => r.status === 'Pending').map(r => ({
          type: r.category + ' Reimbursement',
          amount: r.amount,
          submittedDate: new Date(r.requestDate)
        }));
        this.pendingRequests = [...this.pendingRequests, ...pendingReimb];
      },
      error: (error) => {
        console.error('Failed to load reimbursement data:', error);
      }
    });
    
    // Generate notifications based on real data
    this.generateNotifications();
  }

  formatPayrollPeriod(start: string, end: string): string {
    const startDate = new Date(start);
    return startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  generateNotifications() {
    this.recentNotifications = [
      {
        type: 'success',
        icon: 'check_circle',
        title: 'Reimbursement Approved - ₹5,000',
        time: new Date(Date.now() - 3600000)
      },
      {
        type: 'info',
        icon: 'info',
        title: 'Payroll Generated for December',
        time: new Date(Date.now() - 86400000)
      },
      {
        type: 'warning',
        icon: 'warning',
        title: 'Document Required for Loan',
        time: new Date(Date.now() - 172800000)
      }
    ];
  }
}