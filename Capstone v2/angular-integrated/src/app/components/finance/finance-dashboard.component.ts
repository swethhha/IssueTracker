import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="finance-dashboard">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="card">
          <div class="card-icon payroll">
            <span class="material-icons">payments</span>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.pendingPayroll }}</h3>
            <p>Pending Payroll Approvals</p>
          </div>
        </div>
        
        <div class="card">
          <div class="card-icon loans">
            <span class="material-icons">account_balance</span>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.pendingLoans }}</h3>
            <p>Pending Loan Approvals</p>
          </div>
        </div>
        
        <div class="card">
          <div class="card-icon reimbursements">
            <span class="material-icons">receipt</span>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.pendingReimbursements }}</h3>
            <p>Pending Reimbursements</p>
          </div>
        </div>
        
        <div class="card">
          <div class="card-icon insurance">
            <span class="material-icons">health_and_safety</span>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.pendingInsurance }}</h3>
            <p>Pending Insurance Approvals</p>
          </div>
        </div>
        
        <div class="card">
          <div class="card-icon medical">
            <span class="material-icons">local_hospital</span>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.pendingMedical }}</h3>
            <p>Pending Medical Claims</p>
          </div>
        </div>
        
        <div class="card total">
          <div class="card-icon">
            <span class="material-icons">trending_up</span>
          </div>
          <div class="card-content">
            <h3>{{ summaryData.totalApprovals }}</h3>
            <p>Total Approvals This Month</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-container">
          <div class="chart-header">
            <h3>Monthly Approvals</h3>
          </div>
          <div class="chart-placeholder">
            <canvas id="monthlyChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="chart-header">
            <h3>Reimbursement Categories</h3>
          </div>
          <div class="chart-placeholder">
            <canvas id="categoryChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="chart-header">
            <h3>Payout Trends</h3>
          </div>
          <div class="chart-placeholder">
            <canvas id="trendChart"></canvas>
          </div>
        </div>
        
        <div class="chart-container">
          <div class="chart-header">
            <h3>Manager vs Finance Approvals</h3>
          </div>
          <div class="chart-placeholder">
            <canvas id="comparisonChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Notifications Panel -->
      <div class="notifications-panel">
        <div class="panel-header">
          <h3>Recent Activity</h3>
          <button class="btn-secondary">View All</button>
        </div>
        
        <div class="notification-tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'pending'"
            (click)="activeTab = 'pending'"
          >
            Pending Actions
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'escalated'"
            (click)="activeTab = 'escalated'"
          >
            Escalated
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'recent'"
            (click)="activeTab = 'recent'"
          >
            Recent Approvals
          </button>
        </div>
        
        <div class="notification-content">
          <div *ngIf="activeTab === 'pending'" class="notification-list">
            <div *ngFor="let item of pendingActions" class="notification-item">
              <div class="notification-icon">
                <span class="material-icons">{{ item.icon }}</span>
              </div>
              <div class="notification-details">
                <p class="notification-title">{{ item.title }}</p>
                <p class="notification-subtitle">{{ item.subtitle }}</p>
              </div>
              <div class="notification-actions">
                <button class="btn-approve">Approve</button>
                <button class="btn-reject">Reject</button>
              </div>
            </div>
          </div>
          
          <div *ngIf="activeTab === 'escalated'" class="notification-list">
            <div *ngFor="let item of escalatedItems" class="notification-item">
              <div class="notification-icon warning">
                <span class="material-icons">warning</span>
              </div>
              <div class="notification-details">
                <p class="notification-title">{{ item.title }}</p>
                <p class="notification-subtitle">{{ item.reason }}</p>
              </div>
              <div class="notification-actions">
                <button class="btn-review">Review</button>
              </div>
            </div>
          </div>
          
          <div *ngIf="activeTab === 'recent'" class="notification-list">
            <div *ngFor="let item of recentApprovals" class="notification-item">
              <div class="notification-icon success">
                <span class="material-icons">check_circle</span>
              </div>
              <div class="notification-details">
                <p class="notification-title">{{ item.title }}</p>
                <p class="notification-subtitle">{{ item.date }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .finance-dashboard {
      padding: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: var(--spacing-lg);
    }

    .card {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-2);
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      transition: transform 0.2s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-3);
    }

    .card-icon {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .card-icon.payroll { background: var(--primary-100); color: var(--primary-600); }
    .card-icon.loans { background: var(--secondary-100); color: var(--secondary-600); }
    .card-icon.reimbursements { background: var(--success-100); color: var(--success-600); }
    .card-icon.insurance { background: var(--warning-100); color: var(--warning-600); }
    .card-icon.medical { background: var(--error-100); color: var(--error-600); }
    .card.total .card-icon { background: var(--info-100); color: var(--info-600); }

    .card-content h3 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--spacing-xs) 0;
      color: var(--on-surface);
    }

    .card-content p {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
      margin: 0;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: var(--spacing-lg);
    }

    .chart-container {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-2);
    }

    .chart-header {
      margin-bottom: var(--spacing-md);
    }

    .chart-header h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0;
    }

    .chart-placeholder {
      height: 300px;
      background: var(--surface-variant);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--on-surface-variant);
    }

    .notifications-panel {
      background: var(--surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-2);
      overflow: hidden;
    }

    .panel-header {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--outline);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-header h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0;
    }

    .notification-tabs {
      display: flex;
      border-bottom: 1px solid var(--outline);
    }

    .tab-btn {
      flex: 1;
      padding: var(--spacing-md);
      border: none;
      background: transparent;
      color: var(--on-surface-variant);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      color: var(--primary-600);
      border-bottom: 2px solid var(--primary-600);
      background: var(--primary-50);
    }

    .notification-content {
      max-height: 400px;
      overflow-y: auto;
    }

    .notification-list {
      padding: var(--spacing-md);
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-sm);
      transition: background-color 0.2s ease;
    }

    .notification-item:hover {
      background: var(--surface-variant);
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-100);
      color: var(--primary-600);
    }

    .notification-icon.warning {
      background: var(--warning-100);
      color: var(--warning-600);
    }

    .notification-icon.success {
      background: var(--success-100);
      color: var(--success-600);
    }

    .notification-details {
      flex: 1;
    }

    .notification-title {
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
      margin: 0 0 var(--spacing-xs) 0;
    }

    .notification-subtitle {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
      margin: 0;
    }

    .notification-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .btn-approve, .btn-reject, .btn-review, .btn-secondary {
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-approve {
      background: var(--success-500);
      color: white;
    }

    .btn-reject {
      background: var(--error-500);
      color: white;
    }

    .btn-review {
      background: var(--warning-500);
      color: white;
    }

    .btn-secondary {
      background: var(--surface-variant);
      color: var(--on-surface-variant);
    }

    @media (max-width: 768px) {
      .summary-cards {
        grid-template-columns: 1fr;
      }
      
      .charts-section {
        grid-template-columns: 1fr;
      }
      
      .notification-actions {
        flex-direction: column;
      }
    }
  `]
})
export class FinanceDashboardComponent implements OnInit {
  activeTab = 'pending';
  
  summaryData = {
    pendingPayroll: 12,
    pendingLoans: 8,
    pendingReimbursements: 15,
    pendingInsurance: 5,
    pendingMedical: 7,
    totalApprovals: 47
  };

  pendingActions = [
    {
      icon: 'payments',
      title: 'Payroll Approval - John Doe',
      subtitle: 'December 2024 - $5,500'
    },
    {
      icon: 'account_balance',
      title: 'Loan Application - Jane Smith',
      subtitle: 'Personal Loan - $15,000'
    },
    {
      icon: 'receipt',
      title: 'Reimbursement - Mike Johnson',
      subtitle: 'Travel Expenses - $850'
    }
  ];

  escalatedItems = [
    {
      title: 'Loan Application - Sarah Wilson',
      reason: 'Rejected by Manager - Documentation incomplete'
    },
    {
      title: 'Medical Claim - Robert Brown',
      reason: 'Rejected by Manager - Policy coverage unclear'
    }
  ];

  recentApprovals = [
    {
      title: 'Payroll Approved - Alice Cooper',
      date: '2 hours ago'
    },
    {
      title: 'Reimbursement Approved - Tom Wilson',
      date: '4 hours ago'
    },
    {
      title: 'Insurance Enrollment - Lisa Davis',
      date: '1 day ago'
    }
  ];

  ngOnInit() {
    // Initialize charts here
    this.initializeCharts();
  }

  private initializeCharts() {
    // Chart initialization will be implemented with Chart.js
    console.log('Charts initialized');
  }
}