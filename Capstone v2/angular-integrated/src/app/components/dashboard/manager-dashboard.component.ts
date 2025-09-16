import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollService } from '../../services/payroll.service';
import { LoanService } from '../../services/loan.service';
import { ReimbursementService } from '../../services/reimbursement.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="content-header">
      <div class="page-container">
        <h3>Manager Dashboard</h3>
        <p>Manage approvals and view team analytics</p>
      </div>
    </div>

    <div class="content-body">
      <div class="page-container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalPendingApprovals }}</div>
              <div class="stat-label">Pending Approvals</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✓</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalApprovalsThisMonth }}</div>
              <div class="stat-label">Approvals This Month</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-content">
              <div class="stat-value">{{ teamSize }}</div>
              <div class="stat-label">Team Members</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✗</div>
            <div class="stat-content">
              <div class="stat-value">{{ rejectedCount }}</div>
              <div class="stat-label">Rejected This Month</div>
            </div>
          </div>
        </div>

        <div class="dashboard-row">
          <div class="card">
            <div class="card-header">
              <h4>Pending Approvals</h4>
            </div>
            <div class="card-body">
              <div class="approval-tabs">
                <button class="tab-btn" [class.active]="activeTab === 'payroll'" (click)="activeTab = 'payroll'">
                  Payroll ({{ pendingPayrolls.length }})
                </button>
                <button class="tab-btn" [class.active]="activeTab === 'loans'" (click)="activeTab = 'loans'">
                  Loans ({{ pendingLoans.length }})
                </button>
                <button class="tab-btn" [class.active]="activeTab === 'reimbursements'" (click)="activeTab = 'reimbursements'">
                  Reimbursements ({{ pendingReimbursements.length }})
                </button>
              </div>

              <div class="approval-content">
                <div *ngIf="activeTab === 'payroll'" class="approval-list">
                  <div class="approval-item" *ngFor="let item of pendingPayrolls">
                    <div class="approval-info">
                      <h5>{{ item.employeeName }}</h5>
                      <p>Period: {{ item.payPeriodStart | date:'MMM yyyy' }} | Net: {{ item.netPay | currency:'INR':'symbol':'1.0-0' }}</p>
                    </div>
                    <div class="approval-actions">
                      <button class="btn btn-success btn-sm" (click)="approvePayroll(item.id)">Approve</button>
                      <button class="btn btn-danger btn-sm" (click)="rejectPayroll(item.id)">Reject</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="activeTab === 'loans'" class="approval-list">
                  <div class="approval-item" *ngFor="let item of pendingLoans">
                    <div class="approval-info">
                      <h5>{{ item.employeeName }}</h5>
                      <p>{{ item.loanType }} | Amount: {{ item.amount | currency:'INR':'symbol':'1.0-0' }}</p>
                    </div>
                    <div class="approval-actions">
                      <button class="btn btn-success btn-sm" (click)="approveLoan(item.loanId)">Approve</button>
                      <button class="btn btn-danger btn-sm" (click)="rejectLoan(item.loanId)">Reject</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="activeTab === 'reimbursements'" class="approval-list">
                  <div class="approval-item" *ngFor="let item of pendingReimbursements">
                    <div class="approval-info">
                      <h5>{{ item.employeeName }}</h5>
                      <p>{{ item.category }} | Amount: {{ item.amount | currency:'INR':'symbol':'1.0-0' }}</p>
                    </div>
                    <div class="approval-actions">
                      <button class="btn btn-success btn-sm" (click)="approveReimbursement(item.requestId)">Approve</button>
                      <button class="btn btn-danger btn-sm" (click)="rejectReimbursement(item.requestId)">Reject</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="getCurrentItems().length === 0" class="text-center">
                  <p>No pending {{ activeTab }} approvals</p>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h4>Approval Analytics</h4>
            <canvas id="approvalChart" width="300" height="200"></canvas>
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
      margin: 0;
      font-size: 0.75rem;
      color: var(--text-secondary);
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
  `]
})
export class ManagerDashboardComponent implements OnInit {
  activeTab = 'payroll';
  totalPendingApprovals = 0;
  totalApprovalsThisMonth = 0;
  teamSize = 0;
  rejectedCount = 0;
  pendingPayrolls: any[] = [];
  pendingLoans: any[] = [];
  pendingReimbursements: any[] = [];

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
    this.payrollService.getPendingManagerApprovals().subscribe({
      next: (payrolls) => this.pendingPayrolls = payrolls,
      error: () => this.loadDemoData()
    });

    this.loanService.getPendingManagerApprovals().subscribe({
      next: (loans) => this.pendingLoans = loans,
      error: () => this.pendingLoans = []
    });

    this.reimbursementService.getPendingManagerApprovals().subscribe({
      next: (reimbursements) => this.pendingReimbursements = reimbursements,
      error: () => this.pendingReimbursements = []
    });

    this.updateStats();
  }

  loadDemoData() {
    this.pendingPayrolls = [
      { id: 1, employeeName: 'John Doe', payPeriodStart: new Date(), netPay: 42000 },
      { id: 2, employeeName: 'Jane Smith', payPeriodStart: new Date(), netPay: 45000 }
    ];
    this.pendingLoans = [
      { loanId: 1, employeeName: 'Mike Johnson', loanType: 'Personal', amount: 100000 }
    ];
    this.pendingReimbursements = [
      { requestId: 1, employeeName: 'Sarah Wilson', category: 'Travel', amount: 5000 }
    ];
    this.updateStats();
  }

  updateStats() {
    this.totalPendingApprovals = this.pendingPayrolls.length + this.pendingLoans.length + this.pendingReimbursements.length;
    this.totalApprovalsThisMonth = 45;
    this.teamSize = 8;
    this.rejectedCount = 3;
  }

  getCurrentItems() {
    switch (this.activeTab) {
      case 'payroll': return this.pendingPayrolls;
      case 'loans': return this.pendingLoans;
      case 'reimbursements': return this.pendingReimbursements;
      default: return [];
    }
  }

  approvePayroll(id: number) {
    this.payrollService.approveByManager(id).subscribe({
      next: () => {
        this.pendingPayrolls = this.pendingPayrolls.filter(p => p.id !== id);
        this.updateStats();
      },
      error: () => alert('Error approving payroll')
    });
  }

  rejectPayroll(id: number) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.payrollService.rejectByManager(id, reason).subscribe({
        next: () => {
          this.pendingPayrolls = this.pendingPayrolls.filter(p => p.id !== id);
          this.updateStats();
        },
        error: () => alert('Error rejecting payroll')
      });
    }
  }

  approveLoan(id: number) {
    this.loanService.approveByManager(id).subscribe({
      next: () => {
        this.pendingLoans = this.pendingLoans.filter(l => l.loanId !== id);
        this.updateStats();
      },
      error: () => alert('Error approving loan')
    });
  }

  rejectLoan(id: number) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.loanService.rejectByManager(id, reason).subscribe({
        next: () => {
          this.pendingLoans = this.pendingLoans.filter(l => l.loanId !== id);
          this.updateStats();
        },
        error: () => alert('Error rejecting loan')
      });
    }
  }

  approveReimbursement(id: number) {
    this.reimbursementService.approveByManager(id).subscribe({
      next: () => {
        this.pendingReimbursements = this.pendingReimbursements.filter(r => r.requestId !== id);
        this.updateStats();
      },
      error: () => alert('Error approving reimbursement')
    });
  }

  rejectReimbursement(id: number) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.reimbursementService.rejectByManager(id, reason).subscribe({
        next: () => {
          this.pendingReimbursements = this.pendingReimbursements.filter(r => r.requestId !== id);
          this.updateStats();
        },
        error: () => alert('Error rejecting reimbursement')
      });
    }
  }

  initCharts() {
    const canvas = document.getElementById('approvalChart') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#10b981';
        ctx.fillRect(50, 150, 50, 40);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(120, 120, 50, 70);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(190, 170, 50, 20);
        
        ctx.fillStyle = '#64748b';
        ctx.font = '11px sans-serif';
        ctx.fillText('Approved', 45, 210);
        ctx.fillText('Pending', 120, 210);
        ctx.fillText('Rejected', 185, 210);
      }
    }
  }
}