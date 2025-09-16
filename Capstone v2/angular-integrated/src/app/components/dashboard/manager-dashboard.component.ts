import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayrollService } from '../../services/payroll.service';
import { LoanService } from '../../services/loan.service';
import { ReimbursementService } from '../../services/reimbursement.service';
import { InsuranceService } from '../../services/insurance.service';
import { MedicalClaimService } from '../../services/medical-claim.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Manager Dashboard</h1>
        <p>Review and approve employee requests</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon payroll">
            <span class="material-icons">receipt_long</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingPayrolls }}</div>
            <div class="stat-label">Pending Payrolls</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon loan">
            <span class="material-icons">account_balance</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingLoans }}</div>
            <div class="stat-label">Pending Loans</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon reimbursement">
            <span class="material-icons">receipt</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingReimbursements }}</div>
            <div class="stat-label">Pending Reimbursements</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon insurance">
            <span class="material-icons">health_and_safety</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingInsurance }}</div>
            <div class="stat-label">Pending Insurance</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon medical">
            <span class="material-icons">local_hospital</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ pendingMedical }}</div>
            <div class="stat-label">Pending Medical Claims</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ totalApprovalsThisMonth }}</div>
            <div class="stat-label">Approvals This Month</div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Pending Approvals</h3>
            <a routerLink="/approvals" class="view-all-link">View All</a>
          </div>
          <div class="card-body">
            <div class="approval-list">
              <div class="approval-item" *ngFor="let approval of pendingApprovals">
                <div class="approval-info">
                  <strong>{{ approval.type }}</strong>
                  <span class="approval-employee">{{ approval.employeeName }}</span>
                  <span class="approval-amount">₹{{ approval.amount | number:'1.0-0' }}</span>
                </div>
                <div class="approval-date">{{ approval.submittedDate | date:'shortDate' }}</div>
              </div>
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
            <h3 class="card-title">Approvals by Category</h3>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <div class="chart-data">
                <div class="data-point" *ngFor="let data of approvalsByCategory">
                  <span class="category">{{ data.category }}</span>
                  <div class="bar-container">
                    <div class="bar" [style.width.%]="(data.count / maxApprovals) * 100"></div>
                    <span class="count">{{ data.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Approval Trend (Last 6 Months)</h3>
          </div>
          <div class="card-body">
            <div class="chart-container">
              <div class="chart-data">
                <div class="trend-point" *ngFor="let data of approvalTrend">
                  <span class="month">{{ data.month }}</span>
                  <span class="count">{{ data.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">My Services</h3>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <a routerLink="/manager/loans" class="action-btn">
                <div class="action-icon primary">
                  <span class="material-icons">account_balance</span>
                </div>
                <div class="action-text">
                  <strong>Apply for Loan</strong>
                  <small>Personal, Home, Education</small>
                </div>
              </a>
              <a routerLink="/manager/reimbursements" class="action-btn">
                <div class="action-icon secondary">
                  <span class="material-icons">receipt</span>
                </div>
                <div class="action-text">
                  <strong>Submit Reimbursement</strong>
                  <small>Travel, Office, Others</small>
                </div>
              </a>
              <a routerLink="/manager/insurance" class="action-btn">
                <div class="action-icon success">
                  <span class="material-icons">health_and_safety</span>
                </div>
                <div class="action-text">
                  <strong>Insurance Enrollment</strong>
                  <small>Health, Life, Critical</small>
                </div>
              </a>
              <a routerLink="/manager/medical-claims" class="action-btn">
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
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-xl);
      color: white;
    }

    .stat-icon.payroll { background: var(--primary-500); }
    .stat-icon.loan { background: var(--secondary-500); }
    .stat-icon.reimbursement { background: var(--success-500); }
    .stat-icon.insurance { background: var(--warning-500); }
    .stat-icon.medical { background: var(--error-500); }
    .stat-icon.success { background: var(--success-600); }

    .stat-icon .material-icons {
      font-size: 24px;
    }

    .stat-value {
      font-size: var(--font-size-2xl);
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

    .card-body {
      padding: var(--spacing-xl);
    }

    .approval-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .approval-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
    }

    .approval-info strong {
      display: block;
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
    }

    .approval-employee {
      display: block;
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
      margin-bottom: var(--spacing-xs);
    }

    .approval-amount {
      color: var(--primary-500);
      font-weight: var(--font-weight-semibold);
    }

    .approval-date {
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

    .notification-title {
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
    }

    .notification-time {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
    }

    .chart-container {
      width: 100%;
    }

    .chart-data {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .data-point {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .category {
      min-width: 120px;
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .bar-container {
      flex: 1;
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .bar {
      height: 20px;
      background: var(--primary-500);
      border-radius: var(--radius-sm);
      min-width: 4px;
    }

    .count {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .trend-point {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm);
      background: var(--surface-variant);
      border-radius: var(--radius-md);
    }

    .month {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
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
      width: 40px;
      height: 40px;
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
export class ManagerDashboardComponent implements OnInit {
  pendingPayrolls = 5;
  pendingLoans = 8;
  pendingReimbursements = 12;
  pendingInsurance = 3;
  pendingMedical = 6;
  totalApprovalsThisMonth = 45;
  maxApprovals = 15;

  pendingApprovals: any[] = [];
  recentNotifications: any[] = [];
  approvalsByCategory: any[] = [];
  approvalTrend: any[] = [];

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
    this.pendingApprovals = [
      { type: 'Loan Application', employeeName: 'John Doe', amount: 200000, submittedDate: new Date(2024, 11, 1) },
      { type: 'Reimbursement', employeeName: 'Jane Smith', amount: 5000, submittedDate: new Date(2024, 11, 2) },
      { type: 'Medical Claim', employeeName: 'Mike Johnson', amount: 15000, submittedDate: new Date(2024, 11, 3) },
      { type: 'Insurance Enrollment', employeeName: 'Sarah Wilson', amount: 25000, submittedDate: new Date(2024, 11, 4) }
    ];

    this.recentNotifications = [
      {
        type: 'success',
        icon: 'check_circle',
        title: 'Loan approved for John Doe - ₹2,00,000',
        time: new Date(Date.now() - 3600000)
      },
      {
        type: 'info',
        icon: 'info',
        title: 'New reimbursement request from Jane Smith',
        time: new Date(Date.now() - 7200000)
      },
      {
        type: 'warning',
        icon: 'warning',
        title: '6 pending approvals require attention',
        time: new Date(Date.now() - 10800000)
      }
    ];

    this.approvalsByCategory = [
      { category: 'Payroll', count: 15 },
      { category: 'Loans', count: 12 },
      { category: 'Reimbursements', count: 8 },
      { category: 'Insurance', count: 6 },
      { category: 'Medical', count: 4 }
    ];

    this.approvalTrend = [
      { month: 'Jul 2024', count: 38 },
      { month: 'Aug 2024', count: 42 },
      { month: 'Sep 2024', count: 35 },
      { month: 'Oct 2024', count: 48 },
      { month: 'Nov 2024', count: 52 },
      { month: 'Dec 2024', count: 45 }
    ];
  }
}