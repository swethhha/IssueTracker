import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollService } from '../../services/payroll.service';
import { LoanService } from '../../services/loan.service';
import { ReimbursementService } from '../../services/reimbursement.service';
import { InsuranceService } from '../../services/insurance.service';
import { MedicalClaimService } from '../../services/medical-claim.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Finance Dashboard</h1>
        <p>Financial oversight and final approvals</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalProcessedRequests }}</div>
          <div class="stat-label">Processed This Month</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ pendingFinanceApprovals }}</div>
          <div class="stat-label">Pending Finance Approvals</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalExpenses | currency }}</div>
          <div class="stat-label">Total Expenses</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ departmentCount }}</div>
          <div class="stat-label">Departments</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Finance Approvals</h3>
          </div>
          <div class="card-body">
            <div class="approval-section" *ngFor="let section of financeApprovalSections">
              <div class="approval-header">
                <h4>{{ section.title }} ({{ section.count }})</h4>
              </div>
              <div class="approval-list">
                <div class="approval-item" *ngFor="let item of section.items">
                  <div class="approval-info">
                    <strong>{{ item.employeeName }}</strong>
                    <span class="approval-amount">{{ item.amount | currency }}</span>
                    <small>{{ item.date | date:'short' }}</small>
                    <div class="approval-status">
                      <span class="badge badge-warning">Manager Approved</span>
                    </div>
                  </div>
                  <div class="approval-actions">
                    <button class="btn btn-success btn-sm" (click)="approve(section.type, item.id)">
                      Final Approve
                    </button>
                    <button class="btn btn-danger btn-sm" (click)="reject(section.type, item.id)">
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-container">
          <h3 class="chart-title">Department-wise Expenses</h3>
          <div class="chart-placeholder">
            <canvas #departmentChart></canvas>
          </div>
        </div>

        <div class="chart-container">
          <h3 class="chart-title">Expense Categories</h3>
          <div class="chart-placeholder">
            <canvas #categoryChart></canvas>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Recent Reports</h3>
        </div>
        <div class="card-body">
          <div class="reports-grid">
            <div class="report-item" *ngFor="let report of recentReports">
              <div class="report-icon">
                <i class="icon-file"></i>
              </div>
              <div class="report-info">
                <h4>{{ report.name }}</h4>
                <p>{{ report.description }}</p>
                <small>Generated: {{ report.generatedDate | date:'short' }}</small>
              </div>
              <div class="report-actions">
                <button class="btn btn-outline btn-sm" (click)="downloadReport(report.id)">
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 2rem;
    }

    .dashboard-header {
      margin-bottom: 2rem;
    }

    .dashboard-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    .dashboard-header p {
      color: var(--text-secondary);
      margin: 0.5rem 0 0 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      text-align: center;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }

    .stat-label {
      color: var(--text-secondary);
      font-size: 0.875rem;
      font-weight: 500;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .approval-section {
      margin-bottom: 1.5rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .approval-header {
      background: var(--bg-tertiary);
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .approval-header h4 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .approval-list {
      max-height: 300px;
      overflow-y: auto;
    }

    .approval-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .approval-item:last-child {
      border-bottom: none;
    }

    .approval-info strong {
      display: block;
      font-weight: 600;
    }

    .approval-amount {
      color: var(--primary-color);
      font-weight: 500;
    }

    .approval-status {
      margin-top: 0.25rem;
    }

    .approval-actions {
      display: flex;
      gap: 0.5rem;
    }

    .chart-container {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
    }

    .chart-title {
      margin: 0 0 1rem 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    .chart-placeholder {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .reports-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1rem;
    }

    .report-item {
      display: flex;
      align-items: center;
      padding: 1rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: var(--bg-secondary);
    }

    .report-icon {
      margin-right: 1rem;
      font-size: 1.5rem;
      color: var(--primary-color);
    }

    .report-info {
      flex: 1;
    }

    .report-info h4 {
      margin: 0 0 0.25rem 0;
      font-size: 1rem;
      font-weight: 600;
    }

    .report-info p {
      margin: 0 0 0.25rem 0;
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .report-info small {
      color: var(--text-muted);
      font-size: 0.75rem;
    }

    .report-actions {
      margin-left: 1rem;
    }

    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class FinanceDashboardComponent implements OnInit {
  totalProcessedRequests = 0;
  pendingFinanceApprovals = 0;
  totalExpenses = 0;
  departmentCount = 0;
  financeApprovalSections: any[] = [];
  recentReports: any[] = [];

  constructor(
    private payrollService: PayrollService,
    private loanService: LoanService,
    private reimbursementService: ReimbursementService,
    private insuranceService: InsuranceService,
    private medicalClaimService: MedicalClaimService,
    private dashboardService: DashboardService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Demo data - replace with actual API calls
    this.totalProcessedRequests = 127;
    this.pendingFinanceApprovals = 8;
    this.totalExpenses = 2500000;
    this.departmentCount = 12;

    this.financeApprovalSections = [
      {
        title: 'Payroll Approvals',
        type: 'payroll',
        count: 3,
        items: [
          { id: 1, employeeName: 'John Doe', amount: 50000, date: new Date() },
          { id: 2, employeeName: 'Jane Smith', amount: 55000, date: new Date() }
        ]
      },
      {
        title: 'Loan Approvals',
        type: 'loan',
        count: 2,
        items: [
          { id: 1, employeeName: 'Mike Johnson', amount: 100000, date: new Date() }
        ]
      },
      {
        title: 'Reimbursement Approvals',
        type: 'reimbursement',
        count: 2,
        items: [
          { id: 1, employeeName: 'Sarah Wilson', amount: 5000, date: new Date() }
        ]
      },
      {
        title: 'Medical Claim Approvals',
        type: 'medical',
        count: 1,
        items: [
          { id: 1, employeeName: 'David Brown', amount: 15000, date: new Date() }
        ]
      }
    ];

    this.recentReports = [
      {
        id: 1,
        name: 'Monthly Payroll Report',
        description: 'Complete payroll disbursement for December 2024',
        generatedDate: new Date()
      },
      {
        id: 2,
        name: 'Loan Disbursal Report',
        description: 'All approved loans and disbursements',
        generatedDate: new Date(Date.now() - 86400000)
      },
      {
        id: 3,
        name: 'Expense Reimbursement Report',
        description: 'Employee expense reimbursements summary',
        generatedDate: new Date(Date.now() - 172800000)
      }
    ];
  }

  approve(type: string, id: number) {
    const financeId = '1'; // Get from auth service
    switch (type) {
      case 'payroll':
        this.payrollService.approveByFinance(id, financeId).subscribe(() => this.loadDashboardData());
        break;
      case 'loan':
        this.loanService.approveByFinance(id, financeId).subscribe(() => this.loadDashboardData());
        break;
      case 'reimbursement':
        this.reimbursementService.approveByFinance(id, financeId).subscribe(() => this.loadDashboardData());
        break;
      case 'medical':
        this.medicalClaimService.approveByFinance(id, financeId).subscribe(() => this.loadDashboardData());
        break;
    }
  }

  reject(type: string, id: number) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      const financeId = '1'; // Get from auth service
      switch (type) {
        case 'payroll':
          this.payrollService.rejectByFinance(id, reason).subscribe(() => this.loadDashboardData());
          break;
        case 'loan':
          this.loanService.rejectByFinance(id, reason).subscribe(() => this.loadDashboardData());
          break;
        case 'reimbursement':
          this.reimbursementService.rejectByFinance(id, reason).subscribe(() => this.loadDashboardData());
          break;
        case 'medical':
          this.medicalClaimService.rejectByFinance(id, reason).subscribe(() => this.loadDashboardData());
          break;
      }
    }
  }

  downloadReport(reportId: number) {
    // Implement report download
    console.log('Downloading report:', reportId);
  }
}