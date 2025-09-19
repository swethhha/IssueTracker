import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Finance Dashboard</h1>
        <p>Manage approvals and financial operations</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">account_balance_wallet</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">₹28.5L</div>
            <div class="stat-label">Monthly Payroll</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">
            <span class="material-icons">pending_actions</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">12</div>
            <div class="stat-label">Pending Approvals</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">85.2%</div>
            <div class="stat-label">Approval Rate</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <span class="material-icons">schedule</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">2.3</div>
            <div class="stat-label">Avg Processing Days</div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <a routerLink="/approval-center" class="action-btn">
                <div class="action-icon primary">
                  <span class="material-icons">approval</span>
                </div>
                <div class="action-text">
                  <strong>Approval Center</strong>
                  <small>Review pending requests</small>
                </div>
              </a>
              <a routerLink="/finance/loan-approvals" class="action-btn">
                <div class="action-icon secondary">
                  <span class="material-icons">account_balance</span>
                </div>
                <div class="action-text">
                  <strong>Loan Approvals</strong>
                  <small>5 pending loan requests</small>
                </div>
              </a>
              <a routerLink="/finance/reimbursement-approvals" class="action-btn">
                <div class="action-icon success">
                  <span class="material-icons">receipt_long</span>
                </div>
                <div class="action-text">
                  <strong>Reimbursement Approvals</strong>
                  <small>7 pending reimbursements</small>
                </div>
              </a>
              <a routerLink="/finance/payroll-approvals" class="action-btn">
                <div class="action-icon warning">
                  <span class="material-icons">payments</span>
                </div>
                <div class="action-text">
                  <strong>Payroll Approvals</strong>
                  <small>Review monthly payroll</small>
                </div>
              </a>
              <a routerLink="/finance/insurance-approvals" class="action-btn">
                <div class="action-icon info">
                  <span class="material-icons">security</span>
                </div>
                <div class="action-text">
                  <strong>Insurance Approvals</strong>
                  <small>3 pending enrollments</small>
                </div>
              </a>
              <a routerLink="/analytics" class="action-btn">
                <div class="action-icon purple">
                  <span class="material-icons">analytics</span>
                </div>
                <div class="action-text">
                  <strong>Analytics Dashboard</strong>
                  <small>View financial insights</small>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Approvals</h3>
          </div>
          <div class="card-body">
            <div class="approval-list">
              <div class="approval-item">
                <div class="approval-info">
                  <strong>Personal Loan - John Doe</strong>
                  <span class="approval-amount">₹500,000</span>
                </div>
                <div class="approval-status approved">Approved</div>
              </div>
              <div class="approval-item">
                <div class="approval-info">
                  <strong>Travel Reimbursement - Jane Smith</strong>
                  <span class="approval-amount">₹2,500</span>
                </div>
                <div class="approval-status approved">Approved</div>
              </div>
              <div class="approval-item">
                <div class="approval-info">
                  <strong>Insurance Enrollment - Mike Johnson</strong>
                  <span class="approval-amount">₹25,000</span>
                </div>
                <div class="approval-status rejected">Rejected</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Financial Summary</h3>
          </div>
          <div class="card-body">
            <div class="summary-list">
              <div class="summary-item">
                <span class="summary-label">Total Disbursed</span>
                <span class="summary-value">₹15.2L</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Pending Amount</span>
                <span class="summary-value">₹3.8L</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Monthly Budget</span>
                <span class="summary-value">₹50L</span>
              </div>
              <div class="summary-item">
                <span class="summary-label">Budget Utilized</span>
                <span class="summary-value">38%</span>
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

    .stat-icon.pending { background: var(--warning-100); color: var(--warning-700); }
    .stat-icon.success { background: var(--success-100); color: var(--success-700); }
    .stat-icon.info { background: var(--secondary-100); color: var(--secondary-700); }

    .stat-value {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
    }

    .stat-label {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
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
    }

    .card-title {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .card-body {
      padding: var(--spacing-xl);
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
    .action-icon.info { background: var(--info-500); }
    .action-icon.purple { background: #8b5cf6; }

    .action-text strong {
      display: block;
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-xs);
    }

    .action-text small {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
    }

    .approval-list, .summary-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .approval-item, .summary-item {
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

    .approval-amount {
      color: var(--primary-500);
      font-weight: var(--font-weight-semibold);
    }

    .approval-status {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
    }

    .approval-status.approved {
      background: var(--success-100);
      color: var(--success-700);
    }

    .approval-status.rejected {
      background: var(--error-100);
      color: var(--error-700);
    }

    .summary-label {
      color: var(--on-surface-variant);
    }

    .summary-value {
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
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
export class FinanceDashboardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}