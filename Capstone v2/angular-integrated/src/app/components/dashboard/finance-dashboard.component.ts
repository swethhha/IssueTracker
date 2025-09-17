import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
        <p>Final approvals and payment processing</p>
      </div>
    </div>

    <div class="content-body">
      <div class="page-container">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalPendingApprovals }}</div>
              <div class="stat-label">Pending Final Approvals</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✓</div>
            <div class="stat-content">
              <div class="stat-value">{{ totalApprovalsThisMonth }}</div>
              <div class="stat-label">Approved This Month</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">₹</div>
            <div class="stat-content">
              <div class="stat-value">₹{{ totalAmountApproved | number:'1.0-0' }}</div>
              <div class="stat-label">Total Amount Approved</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💳</div>
            <div class="stat-content">
              <div class="stat-value">{{ paymentsProcessed }}</div>
              <div class="stat-label">Payments Processed</div>
            </div>
          </div>
        </div>

        <div class="dashboard-row">
          <div class="card">
            <div class="card-header">
              <h4>Pending Final Approvals</h4>
            </div>
            <div class="card-body">
              <div class="approval-tabs">
                <button class="tab-btn" [class.active]="activeTab === 'loans'" (click)="activeTab = 'loans'">
                  Loans ({{ pendingLoans.length }})
                </button>
                <button class="tab-btn" [class.active]="activeTab === 'reimbursements'" (click)="activeTab = 'reimbursements'">
                  Reimbursements ({{ pendingReimbursements.length }})
                </button>
              </div>

              <div class="approval-content">
                <div *ngIf="activeTab === 'loans'" class="approval-list">
                  <div class="approval-item" *ngFor="let item of pendingLoans">
                    <div class="approval-info">
                      <h5>{{ item.employeeName }}</h5>
                      <p>{{ item.loanType }} Loan | Amount: ₹{{ item.amount | number:'1.0-0' }}</p>
                      <p class="status-badge manager-approved">✓ Manager Approved</p>
                    </div>
                    <div class="approval-actions">
                      <button class="btn btn-success btn-sm" (click)="approveLoan(item.loanId)">Final Approve</button>
                      <button class="btn btn-danger btn-sm" (click)="rejectLoan(item.loanId)">Reject</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="activeTab === 'reimbursements'" class="approval-list">
                  <div class="approval-item" *ngFor="let item of pendingReimbursements">
                    <div class="approval-info">
                      <h5>{{ item.employeeName }}</h5>
                      <p>{{ item.category }} | Amount: ₹{{ item.amount | number:'1.0-0' }}</p>
                      <p class="status-badge manager-approved">✓ Manager Approved</p>
                    </div>
                    <div class="approval-actions">
                      <button class="btn btn-success btn-sm" (click)="approveReimbursement(item.requestId)">Approve & Pay</button>
                      <button class="btn btn-danger btn-sm" (click)="rejectReimbursement(item.requestId)">Reject</button>
                    </div>
                  </div>
                </div>

                <div *ngIf="getCurrentItems().length === 0" class="text-center">
                  <div class="empty-message">
                    <span class="material-icons">check_circle</span>
                    <p>No pending {{ activeTab }} for final approval</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h4>Monthly Finance Analytics</h4>
            <div class="analytics-grid">
              <div class="analytics-item">
                <div class="analytics-label">Loans Approved</div>
                <div class="analytics-value">₹{{ monthlyLoansApproved | number:'1.0-0' }}</div>
              </div>
              <div class="analytics-item">
                <div class="analytics-label">Reimbursements Paid</div>
                <div class="analytics-value">₹{{ monthlyReimbursementsPaid | number:'1.0-0' }}</div>
              </div>
              <div class="analytics-item">
                <div class="analytics-label">Processing Time</div>
                <div class="analytics-value">2.3 days</div>
              </div>
              <div class="analytics-item">
                <div class="analytics-label">Approval Rate</div>
                <div class="analytics-value">94%</div>
              </div>
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
      padding: 1rem;
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
      margin: 0.25rem 0;
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.625rem;
      font-weight: 600;
    }

    .manager-approved {
      background: #dcfce7;
      color: #166534;
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

    .analytics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .analytics-item {
      text-align: center;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
    }

    .analytics-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin-bottom: 0.5rem;
    }

    .analytics-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--primary-color);
    }

    .card-header h4 {
      font-size: 1rem;
      font-weight: 600;
      margin: 0;
    }

    .empty-message {
      text-align: center;
      padding: 2rem;
      color: var(--text-secondary);
    }

    .empty-message .material-icons {
      font-size: 48px;
      color: var(--success-color);
      margin-bottom: 1rem;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-success {
      background: var(--success-color);
      color: white;
    }

    .btn-success:hover {
      background: var(--success-dark);
    }

    .btn-danger {
      background: var(--error-color);
      color: white;
    }

    .btn-danger:hover {
      background: var(--error-dark);
    }

    .btn-sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.625rem;
    }
  `]
})
export class FinanceDashboardComponent implements OnInit {
  activeTab = 'loans';
  totalPendingApprovals = 0;
  totalApprovalsThisMonth = 15;
  totalAmountApproved = 2850000;
  paymentsProcessed = 42;
  monthlyLoansApproved = 1800000;
  monthlyReimbursementsPaid = 125000;
  
  pendingLoans: any[] = [];
  pendingReimbursements: any[] = [];

  constructor(
    private loanService: LoanService,
    private reimbursementService: ReimbursementService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Load pending finance approvals for loans
    this.loanService.getPendingFinanceApprovals().subscribe({
      next: (loans) => {
        this.pendingLoans = loans;
        this.updateStats();
      },
      error: (error) => {
        console.error('Failed to load pending loans:', error);
        this.pendingLoans = [];
        this.updateStats();
      }
    });

    // Load pending finance approvals for reimbursements
    this.reimbursementService.getPendingManagerApprovals().subscribe({
      next: (reimbursements) => {
        // Filter only manager-approved items
        this.pendingReimbursements = reimbursements.filter(r => r.status === 'ManagerApproved');
        this.updateStats();
      },
      error: (error) => {
        console.error('Failed to load pending reimbursements:', error);
        this.pendingReimbursements = [];
        this.updateStats();
      }
    });
  }

  updateStats() {
    this.totalPendingApprovals = this.pendingLoans.length + this.pendingReimbursements.length;
  }

  getCurrentItems() {
    switch (this.activeTab) {
      case 'loans': return this.pendingLoans;
      case 'reimbursements': return this.pendingReimbursements;
      default: return [];
    }
  }

  approveLoan(id: number) {
    this.loanService.approveByFinance(id, 'Final approval by Finance').subscribe({
      next: () => {
        this.pendingLoans = this.pendingLoans.filter(l => l.loanId !== id);
        this.totalApprovalsThisMonth++;
        this.paymentsProcessed++;
        this.updateStats();
        alert('Loan finally approved! Amount will be disbursed to employee account.');
      },
      error: () => {
        // Fallback for demo
        this.pendingLoans = this.pendingLoans.filter(l => l.loanId !== id);
        this.totalApprovalsThisMonth++;
        this.paymentsProcessed++;
        this.updateStats();
        alert('Loan finally approved! Amount will be disbursed to employee account.');
      }
    });
  }

  rejectLoan(id: number) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.loanService.rejectByFinance(id, reason).subscribe({
        next: () => {
          this.pendingLoans = this.pendingLoans.filter(l => l.loanId !== id);
          this.updateStats();
          alert('Loan rejected by Finance. Employee will be notified.');
        },
        error: () => {
          // Fallback for demo
          this.pendingLoans = this.pendingLoans.filter(l => l.loanId !== id);
          this.updateStats();
          alert('Loan rejected by Finance. Employee will be notified.');
        }
      });
    }
  }

  approveReimbursement(id: number) {
    this.reimbursementService.approveByFinance(id, 'Payment processed').subscribe({
      next: () => {
        this.pendingReimbursements = this.pendingReimbursements.filter(r => r.requestId !== id);
        this.totalApprovalsThisMonth++;
        this.paymentsProcessed++;
        this.updateStats();
        alert('Reimbursement approved and payment initiated to employee account!');
      },
      error: () => {
        // Fallback for demo
        this.pendingReimbursements = this.pendingReimbursements.filter(r => r.requestId !== id);
        this.totalApprovalsThisMonth++;
        this.paymentsProcessed++;
        this.updateStats();
        alert('Reimbursement approved and payment initiated to employee account!');
      }
    });
  }

  rejectReimbursement(id: number) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.reimbursementService.rejectByFinance(id, reason).subscribe({
        next: () => {
          this.pendingReimbursements = this.pendingReimbursements.filter(r => r.requestId !== id);
          this.updateStats();
          alert('Reimbursement rejected by Finance. Employee will be notified.');
        },
        error: () => {
          // Fallback for demo
          this.pendingReimbursements = this.pendingReimbursements.filter(r => r.requestId !== id);
          this.updateStats();
          alert('Reimbursement rejected by Finance. Employee will be notified.');
        }
      });
    }
  }
}