import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayrollService } from '../../services/payroll.service';
import { LoanService } from '../../services/loan.service';
import { ReimbursementService } from '../../services/reimbursement.service';
import { InsuranceService } from '../../services/insurance.service';
import { MedicalClaimService } from '../../services/medical-claim.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>{{ getDashboardTitle() }}</h1>
        <p>{{ getDashboardSubtitle() }}</p>
        <!-- Hidden admin controls - Triple-click header to access -->
        <div class="admin-controls" (click)="onHeaderClick()" [class.visible]="showAdminControls">
          <button class="btn-admin-reset" (click)="resetDemoData()" *ngIf="showAdminControls" title="Admin: Reset Demo Data">
            ⚙️ Reset
          </button>
        </div>
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
            <div class="stat-value">{{ getStatValue(0) }}</div>
            <div class="stat-label">{{ getStatLabel(0) }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">
            <span class="material-icons">pending_actions</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getStatValue(1) }}</div>
            <div class="stat-label">{{ getStatLabel(1) }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <span class="material-icons">receipt_long</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getStatValue(2) }}</div>
            <div class="stat-label">{{ getStatLabel(2) }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <span class="material-icons">notifications</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getStatValue(3) }}</div>
            <div class="stat-label">{{ getStatLabel(3) }}</div>
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
              <!-- Employee Actions -->
              <ng-container *ngIf="userRole === 'Employee'">
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
              </ng-container>
              
              <!-- Manager Actions -->
              <ng-container *ngIf="userRole === 'Manager'">
                <a routerLink="/payroll" class="action-btn">
                  <div class="action-icon primary">
                    <span class="material-icons">approval</span>
                  </div>
                  <div class="action-text">
                    <strong>Approve Payrolls</strong>
                    <small>Team payroll approvals</small>
                  </div>
                </a>
                <a routerLink="/loans" class="action-btn">
                  <div class="action-icon secondary">
                    <span class="material-icons">account_balance</span>
                  </div>
                  <div class="action-text">
                    <strong>Review Loan Requests</strong>
                    <small>Team loan applications</small>
                  </div>
                </a>
                <a routerLink="/reimbursements" class="action-btn">
                  <div class="action-icon success">
                    <span class="material-icons">receipt_long</span>
                  </div>
                  <div class="action-text">
                    <strong>Process Reimbursements</strong>
                    <small>Team expense claims</small>
                  </div>
                </a>
                <a routerLink="/insurance" class="action-btn">
                  <div class="action-icon warning">
                    <span class="material-icons">health_and_safety</span>
                  </div>
                  <div class="action-text">
                    <strong>Insurance Approvals</strong>
                    <small>Team insurance requests</small>
                  </div>
                </a>
              </ng-container>
              
              <!-- Finance Actions -->
              <ng-container *ngIf="userRole === 'Finance'">
                <a routerLink="/payroll" class="action-btn">
                  <div class="action-icon primary">
                    <span class="material-icons">payments</span>
                  </div>
                  <div class="action-text">
                    <strong>Process Payroll</strong>
                    <small>Final payroll approvals</small>
                  </div>
                </a>
                <a routerLink="/loans" class="action-btn">
                  <div class="action-icon secondary">
                    <span class="material-icons">account_balance_wallet</span>
                  </div>
                  <div class="action-text">
                    <strong>Loan Disbursements</strong>
                    <small>Final loan approvals</small>
                  </div>
                </a>
                <a routerLink="/reimbursements" class="action-btn">
                  <div class="action-icon success">
                    <span class="material-icons">monetization_on</span>
                  </div>
                  <div class="action-text">
                    <strong>Expense Processing</strong>
                    <small>Final reimbursements</small>
                  </div>
                </a>
                <a routerLink="/medical-claims" class="action-btn">
                  <div class="action-icon warning">
                    <span class="material-icons">local_hospital</span>
                  </div>
                  <div class="action-text">
                    <strong>Medical Claims</strong>
                    <small>Healthcare reimbursements</small>
                  </div>
                </a>
              </ng-container>
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
      position: relative;
    }
    
    .admin-controls {
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
      cursor: pointer;
    }
    
    .admin-controls.visible {
      opacity: 1;
    }
    
    .btn-admin-reset {
      padding: 0.25rem 0.5rem;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 400;
      transition: all 0.2s ease;
    }
    
    .btn-admin-reset:hover {
      background: #4b5563;
    }

    .dashboard-header h1 {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--on-surface);
      margin: 0;
    }

    .dashboard-header p {
      color: var(--on-surface-variant);
      font-size: 0.875rem;
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
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--on-surface);
      margin-bottom: var(--spacing-xs);
    }

    .stat-label {
      color: var(--on-surface-variant);
      font-size: 0.75rem;
      font-weight: 500;
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
      font-size: 1rem;
      font-weight: 600;
      color: var(--on-surface);
    }

    .view-all-link {
      color: var(--primary-500);
      text-decoration: none;
      font-size: 0.75rem;
      font-weight: 500;
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
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: var(--spacing-xs);
    }

    .payroll-amount {
      color: var(--primary-500);
      font-weight: 600;
      font-size: 0.875rem;
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
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: var(--spacing-xs);
    }

    .request-amount {
      color: var(--warning-500);
      font-weight: 600;
      font-size: 0.875rem;
    }

    .request-date {
      font-size: 0.75rem;
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
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: var(--spacing-xs);
    }

    .notification-time {
      color: var(--on-surface-variant);
      font-size: 0.75rem;
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
    .action-icon.info { background: #06b6d4; }
    .action-icon.purple { background: #8b5cf6; }

    .action-text strong {
      display: block;
      font-weight: 600;
      font-size: 0.875rem;
      margin-bottom: var(--spacing-xs);
    }

    .action-text small {
      color: var(--on-surface-variant);
      font-size: 0.75rem;
    }

    .action-btn.disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .action-btn.disabled:hover {
      background: transparent;
      border-color: var(--outline-variant);
      transform: none;
    }

    .insurance-required {
      color: var(--warning-600) !important;
      font-weight: 500;
    }

    .badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-xl);
      font-size: 0.625rem;
      font-weight: 500;
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
  hasInsurance = false;
  userRole: string = 'Employee';
  showAdminControls = false;
  private clickCount = 0;
  private clickTimer: any;

  constructor(
    private payrollService: PayrollService,
    private loanService: LoanService,
    private reimbursementService: ReimbursementService,
    private insuranceService: InsuranceService,
    private medicalClaimService: MedicalClaimService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getUserRole() || 'Employee';
    this.authService.currentUser$.subscribe(user => {
      this.userRole = user?.role || 'Employee';
    });
    this.loadDashboardData();
    this.checkInsuranceStatus();
  }

  checkInsuranceStatus() {
    this.medicalClaimService.hasActiveInsurance().subscribe({
      next: (hasInsurance) => {
        this.hasInsurance = hasInsurance;
      },
      error: (error) => {
        console.error('Failed to check insurance status:', error);
        this.hasInsurance = false;
      }
    });
  }

  loadDashboardData() {
    this.loading = true;
    this.error = null;
    
    switch(this.userRole) {
      case 'Employee':
        this.recentPayrolls = [
          { period: 'December 2024', netPay: 125000, status: 'Approved' },
          { period: 'November 2024', netPay: 118000, status: 'Approved' },
          { period: 'October 2024', netPay: 122000, status: 'Approved' }
        ];
        this.totalEarnings = 365000;
        this.pendingRequests = [
          { type: 'Home Loan', amount: 2500000, submittedDate: new Date('2024-11-28') },
          { type: 'Conference Travel', amount: 15000, submittedDate: new Date('2024-12-01') }
        ];
        break;
      case 'Manager':
        this.recentPayrolls = [
          { period: 'Team Budget Dec', netPay: 485000, status: 'Allocated' },
          { period: 'Team Budget Nov', netPay: 462000, status: 'Allocated' },
          { period: 'Team Budget Oct', netPay: 478000, status: 'Allocated' }
        ];
        this.totalEarnings = 485000;
        this.pendingRequests = [
          { type: 'John Doe - Personal Loan', amount: 50000, submittedDate: new Date('2024-12-01') },
          { type: 'Alice Smith - Travel Reimb', amount: 3000, submittedDate: new Date('2024-12-02') }
        ];
        break;
      case 'Finance':
        this.recentPayrolls = [
          { period: 'Payroll Disbursement', netPay: 1250000, status: 'Completed' },
          { period: 'Loan Approvals', netPay: 850000, status: 'Processed' },
          { period: 'Reimbursements', netPay: 125000, status: 'Completed' }
        ];
        this.totalEarnings = 2500000;
        this.pendingRequests = [
          { type: 'Manager Approved - Home Loan', amount: 2500000, submittedDate: new Date('2024-11-28') },
          { type: 'Manager Approved - Conference', amount: 15000, submittedDate: new Date('2024-12-01') }
        ];
        break;
    }
    
    this.loading = false;
    this.generateNotifications();
  }

  formatPayrollPeriod(start: string, end: string): string {
    const startDate = new Date(start);
    return startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  generateNotifications() {
    switch(this.userRole) {
      case 'Employee':
        this.recentNotifications = [
          { type: 'success', icon: 'check_circle', title: 'Conference Travel Approved - ₹12,000', time: new Date(Date.now() - 3600000) },
          { type: 'info', icon: 'info', title: 'December 2024 Payroll Generated - ₹125,000', time: new Date(Date.now() - 86400000) },
          { type: 'warning', icon: 'pending', title: 'Home Loan Application Under Review', time: new Date(Date.now() - 172800000) },
          { type: 'info', icon: 'account_balance', title: 'Manager Bonus Scheme Available', time: new Date(Date.now() - 259200000) }
        ];
        break;
      case 'Manager':
        this.recentNotifications = [
          { type: 'warning', icon: 'pending_actions', title: '5 Requests Awaiting Your Approval', time: new Date(Date.now() - 1800000) },
          { type: 'success', icon: 'check_circle', title: 'Team Budget Approved - ₹485,000', time: new Date(Date.now() - 7200000) },
          { type: 'info', icon: 'group', title: 'New Team Member Added - Sarah Wilson', time: new Date(Date.now() - 86400000) },
          { type: 'info', icon: 'analytics', title: 'Monthly Team Report Available', time: new Date(Date.now() - 172800000) }
        ];
        break;
      case 'Finance':
        this.recentNotifications = [
          { type: 'warning', icon: 'account_balance', title: '12 Payments Pending Final Approval', time: new Date(Date.now() - 900000) },
          { type: 'success', icon: 'payments', title: 'Payroll Disbursement Completed - ₹1.25M', time: new Date(Date.now() - 3600000) },
          { type: 'info', icon: 'receipt_long', title: 'Monthly Financial Report Generated', time: new Date(Date.now() - 86400000) },
          { type: 'success', icon: 'trending_up', title: 'Budget Utilization: 68% - On Track', time: new Date(Date.now() - 172800000) }
        ];
        break;
    }
  }
  
  getDashboardTitle(): string {
    switch(this.userRole) {
      case 'Employee': return 'Employee Dashboard';
      case 'Manager': return 'Manager Dashboard';
      case 'Finance': return 'Finance Dashboard';
      default: return 'Employee Dashboard';
    }
  }
  
  getDashboardSubtitle(): string {
    switch(this.userRole) {
      case 'Employee': return 'Access your personal benefits and services';
      case 'Manager': return 'Manage team approvals and analytics';
      case 'Finance': return 'Financial operations and approvals';
      default: return 'Access your personal benefits and services';
    }
  }
  
  getStatValue(index: number): string {
    const stats = this.getStatsForRole();
    return stats[index]?.value || '0';
  }
  
  getStatLabel(index: number): string {
    const stats = this.getStatsForRole();
    return stats[index]?.label || '';
  }
  
  private getStatsForRole() {
    switch(this.userRole) {
      case 'Employee':
        return [
          { value: '₹365,000', label: 'Total Earnings' },
          { value: '2', label: 'Pending Requests' },
          { value: '3', label: 'Recent Payrolls' },
          { value: '4', label: 'Notifications' }
        ];
      case 'Manager':
        return [
          { value: '₹485,000', label: 'Team Budget' },
          { value: '5', label: 'Pending Approvals' },
          { value: '15', label: 'Approved This Month' },
          { value: '8', label: 'Team Members' }
        ];
      case 'Finance':
        return [
          { value: '₹2.5M', label: 'Total Disbursed' },
          { value: '12', label: 'Pending Payments' },
          { value: '45', label: 'Processed This Month' },
          { value: '₹850K', label: 'Monthly Budget' }
        ];
      default:
        return [
          { value: '₹365,000', label: 'Total Earnings' },
          { value: '2', label: 'Pending Requests' },
          { value: '3', label: 'Recent Payrolls' },
          { value: '4', label: 'Notifications' }
        ];
    }
  }
  
  onHeaderClick() {
    this.clickCount++;
    
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
    }
    
    if (this.clickCount === 3) {
      this.showAdminControls = true;
      this.clickCount = 0;
      // Hide after 10 seconds
      setTimeout(() => {
        this.showAdminControls = false;
      }, 10000);
    } else {
      this.clickTimer = setTimeout(() => {
        this.clickCount = 0;
      }, 1000);
    }
  }
  
  resetDemoData() {
    if (confirm('Reset all demo data? This will clear all applications and start fresh.')) {
      localStorage.clear();
      this.toastService.success('Demo Reset Complete', 'All demo data has been reset successfully! Page will refresh.');
      setTimeout(() => window.location.reload(), 2000);
    }
  }
}