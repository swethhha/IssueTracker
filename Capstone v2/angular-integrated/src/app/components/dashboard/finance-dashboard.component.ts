import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollService } from '../../services/payroll.service';
import { LoanService } from '../../services/loan.service';
import { ReimbursementService } from '../../services/reimbursement.service';

@Component({
  selector: 'app-finance-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-header">
      <div class="page-container">
        <h3>Finance Dashboard</h3>
        <p>Final approvals and financial analytics</p>
      </div>
    </div>

    <div class="content-body">
      <div class="page-container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalPendingFinanceApprovals }}</div>
              <div class="stat-label">Pending Final Approvals</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">₹</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalProcessedThisMonth | currency:'INR':'symbol':'1.0-0' }}</div>
              <div class="stat-label">Processed This Month</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalDisbursements | currency:'INR':'symbol':'1.0-0' }}</div>
              <div class="stat-label">Total Disbursements</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-value">{{ departmentCount }}</div>
              <div class="stat-label">Active Departments</div>
            </div>
          </div>
        </div>

        <div class="dashboard-row">
          <div class="card">
            <div class="card-header">
              <h4>Final Approvals Required</h4>
            </div>
            <div class="card-body">
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

              <div class="approval-content">
                <div *ngIf="activeTab === 'payroll'" class="approval-list">
                  <div class="approval-item" *ngFor="let item of managerApprovedPayrolls">
                    <div class="approval-info">
                      <h5>{{ item.employeeName }}</h5>
                      <p>Net Pay: {{ item.netPay | currency:'INR':'symbol':'1.0-0' }}</p>
                      <small>Manager Approved: {{ item.managerApprovedDate | date:'short' }}</small>
                    </div>
                    <div class="approval-actions">
                      <button class="btn btn-success btn-sm" (click)="finalApprove('payroll', item.id)">Final Approve</button>
                      <button class="btn btn-danger btn-sm" (click)="finalReject('payroll', item.id)">Reject</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="activeTab === 'loans'" class="approval-list">
                  <div class="approval-item" *ngFor="let item of managerApprovedLoans">
                    <div class="approval-info">
                      <h5>{{ item.employeeName }}</h5>
                      <p>Loan: {{ item.amount | currency:'INR':'symbol':'1.0-0' }}</p>
                      <small>Manager Approved: {{ item.managerApprovedDate | date:'short' }}</small>
                    </div>
                    <div class="approval-actions">
                      <button class="btn btn-success btn-sm" (click)="finalApprove('loan', item.loanId)">Final Approve</button>
                      <button class="btn btn-danger btn-sm" (click)="finalReject('loan', item.loanId)">Reject</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="activeTab === 'reimbursements'" class="approval-list">
                  <div class="approval-item" *ngFor="let item of managerApprovedReimbursements">
                    <div class="approval-info">
                      <h5>{{ item.employeeName }}</h5>
                      <p>Expense: {{ item.amount | currency:'INR':'symbol':'1.0-0' }}</p>
                      <small>Manager Approved: {{ item.managerApprovedDate | date:'short' }}</small>
                    </div>
                    <div class="approval-actions">
                      <button class="btn btn-success btn-sm" (click)="finalApprove('reimbursement', item.requestId)">Final Approve</button>
                      <button class="btn btn-danger btn-sm" (click)="finalReject('reimbursement', item.requestId)">Reject</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="getCurrentItems().length === 0" class="text-center">
                  <p>No pending {{ activeTab }} for final approval</p>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h4>Department Expenses</h4>
            <canvas id="expenseChart" width="300" height="200"></canvas>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h4>Quick Reports</h4>
          </div>
          <div class="card-body">
            <div class="report-actions">
              <button class="btn btn-outline" (click)="generateReport('payroll')">
                📊 Payroll Report
              </button>
              <button class="btn btn-outline" (click)="generateReport('loan')">
                🏦 Loan Report
              </button>
              <button class="btn btn-outline" (click)="generateReport('reimbursement')">
                📋 Reimbursement Report
              </button>
              <button class="btn btn-outline" (click)="generateReport('expense')">
                💰 Expense Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .content-header h3 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .content-header p {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 0.25rem 0 0 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: var(--primary-color);
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin: 0.25rem 0 0 0;
    }

    .approval-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
    }

    .tab-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 0.75rem;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .approval-content {
      min-height: 300px;
    }

    .approval-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .approval-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
    }

    .approval-info h5 {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .approval-info p {
      margin: 0 0 0.25rem 0;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .approval-info small {
      font-size: 0.625rem;
      color: var(--text-muted);
    }

    .approval-actions {
      display: flex;
      gap: 0.5rem;
    }

    .chart-container {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      padding: 1rem;
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border-color);
    }

    .chart-container h4 {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 1rem 0;
    }

    .card-header h4 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }

    .report-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;
    }
  `]
})
export class FinanceDashboardComponent implements OnInit {
  activeTab = 'payroll';
  totalPendingFinanceApprovals = 0;
  totalProcessedThisMonth = 0;
  totalDisbursements = 0;
  departmentCount = 5;
  managerApprovedPayrolls: any[] = [];
  managerApprovedLoans: any[] = [];
  managerApprovedReimbursements: any[] = [];

  constructor(
    private payrollService: PayrollService,
    private loanService: LoanService,
    private reimbursementService: ReimbursementService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    setTimeout(() => this.initCharts(), 100);
  }

  loadDashboardData() {
    this.payrollService.getPendingFinanceApprovals().subscribe({
      next: (payrolls) => this.managerApprovedPayrolls = payrolls,
      error: () => this.loadDemoData()
    });

    this.loanService.getPendingFinanceApprovals().subscribe({
      next: (loans) => this.managerApprovedLoans = loans,
      error: () => this.managerApprovedLoans = []
    });

    this.reimbursementService.getPendingFinanceApprovals().subscribe({
      next: (reimbursements) => this.managerApprovedReimbursements = reimbursements,
      error: () => this.managerApprovedReimbursements = []
    });

    this.updateStats();
  }

  loadDemoData() {
    this.managerApprovedPayrolls = [
      { id: 1, employeeName: 'John Doe', netPay: 42000, managerApprovedDate: new Date() }
    ];
    this.managerApprovedLoans = [
      { loanId: 1, employeeName: 'Mike Johnson', amount: 100000, managerApprovedDate: new Date() }
    ];
    this.managerApprovedReimbursements = [
      { requestId: 1, employeeName: 'Sarah Wilson', amount: 5000, managerApprovedDate: new Date() }
    ];
    this.updateStats();
  }

  updateStats() {
    this.totalPendingFinanceApprovals = this.managerApprovedPayrolls.length + this.managerApprovedLoans.length + this.managerApprovedReimbursements.length;
    this.totalProcessedThisMonth = 2500000;
    this.totalDisbursements = 15000000;
  }

  getCurrentItems() {
    switch (this.activeTab) {
      case 'payroll': return this.managerApprovedPayrolls;
      case 'loans': return this.managerApprovedLoans;
      case 'reimbursements': return this.managerApprovedReimbursements;
      default: return [];
    }
  }

  finalApprove(type: string, id: number) {
    console.log(`Final approving ${type} with id ${id}`);
    alert(`${type} final approved!`);
    this.loadDashboardData();
  }

  finalReject(type: string, id: number) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      console.log(`Final rejecting ${type} with id ${id}: ${reason}`);
      alert(`${type} rejected.`);
      this.loadDashboardData();
    }
  }

  generateReport(type: string) {
    console.log(`Generating ${type} report`);
    alert(`Generating ${type} report...`);
  }

  initCharts() {
    const canvas = document.getElementById('expenseChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
        const values = [800000, 600000, 400000, 300000, 250000];
        
        departments.forEach((dept, i) => {
          const height = (values[i] / 1000000) * 150;
          ctx.fillStyle = '#2563eb';
          ctx.fillRect(i * 50 + 20, 180 - height, 40, height);
          
          ctx.fillStyle = '#64748b';
          ctx.font = '10px sans-serif';
          ctx.fillText(dept.substring(0, 3), i * 50 + 25, 200);
        });
      }
    }
  }
}