import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Loan Approvals</h1>
        <p>Review and approve pending loan applications</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon pending">
            <span class="material-icons">pending</span>
          </div>
          <div class="stat-content">
            <h3>{{ pendingCount }}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon approved">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="stat-content">
            <h3>{{ approvedCount }}</h3>
            <p>Approved Today</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon rejected">
            <span class="material-icons">cancel</span>
          </div>
          <div class="stat-content">
            <h3>{{ rejectedCount }}</h3>
            <p>Rejected Today</p>
          </div>
        </div>
      </div>

      <div class="loans-section">
        <div class="section-header">
          <h2>Pending Loan Applications</h2>
          <div class="filter-controls">
            <select [(ngModel)]="selectedFilter" (change)="filterLoans()" class="filter-select">
              <option value="">All Loans</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Education Loan">Education Loan</option>
              <option value="Vehicle Loan">Vehicle Loan</option>
              <option value="Emergency Loan">Emergency Loan</option>
            </select>
          </div>
        </div>

        <div class="loans-grid">
          <div class="loan-card" *ngFor="let loan of filteredLoans">
            <div class="loan-header">
              <div class="loan-type">
                <span class="material-icons">account_balance_wallet</span>
                {{ loan.loanType }}
              </div>
              <div class="loan-amount">₹{{ loan.amount | number:'1.0-0' }}</div>
            </div>
            
            <div class="loan-details">
              <div class="detail-row">
                <span class="label">Employee:</span>
                <span class="value">{{ loan.employeeName }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Purpose:</span>
                <span class="value">{{ loan.purpose }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Tenure:</span>
                <span class="value">{{ loan.tenureMonths }} months</span>
              </div>
              <div class="detail-row">
                <span class="label">EMI:</span>
                <span class="value">₹{{ loan.monthlyInstallment | number:'1.0-0' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Applied:</span>
                <span class="value">{{ loan.appliedDate | date:'shortDate' }}</span>
              </div>
            </div>

            <div class="loan-actions">
              <button class="btn btn-success" (click)="approveLoan(loan)">
                <span class="material-icons">check</span>
                Approve
              </button>
              <button class="btn btn-danger" (click)="rejectLoan(loan)">
                <span class="material-icons">close</span>
                Reject
              </button>
              <button class="btn btn-outline" (click)="viewDetails(loan)">
                <span class="material-icons">visibility</span>
                Details
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="filteredLoans.length === 0">
          <div class="empty-icon">
            <span class="material-icons">check_circle</span>
          </div>
          <h3>No Pending Loans</h3>
          <p>All loan applications have been reviewed.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .page-header p {
      color: #64748b;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.pending { background: #f59e0b; }
    .stat-icon.approved { background: #10b981; }
    .stat-icon.rejected { background: #ef4444; }

    .stat-content h3 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #1e293b;
    }

    .stat-content p {
      color: #64748b;
      margin: 0;
      font-size: 14px;
    }

    .loans-section {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      color: #1e293b;
    }

    .loans-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .loan-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.2s;
    }

    .loan-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .loan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f1f5f9;
    }

    .loan-type {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #1e293b;
    }

    .loan-amount {
      font-size: 20px;
      font-weight: 700;
      color: #059669;
    }

    .loan-details {
      margin-bottom: 20px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .detail-row .label {
      color: #64748b;
      font-size: 14px;
    }

    .detail-row .value {
      color: #1e293b;
      font-weight: 500;
      font-size: 14px;
    }

    .loan-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 12px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      flex: 1;
      justify-content: center;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .btn-outline {
      background: transparent;
      color: #4f46e5;
      border: 1px solid #4f46e5;
    }

    .btn-outline:hover {
      background: #4f46e5;
      color: white;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
    }

    .empty-icon .material-icons {
      font-size: 64px;
      color: #10b981;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      color: #64748b;
      margin: 0;
    }

    @media (max-width: 768px) {
      .loans-grid {
        grid-template-columns: 1fr;
      }
      
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .loan-actions {
        flex-direction: column;
      }
    }
  `]
})
export class LoanApprovalsComponent implements OnInit {
  pendingCount = 5;
  approvedCount = 12;
  rejectedCount = 3;
  selectedFilter = '';

  allLoans = [
    {
      loanId: 1,
      employeeName: 'John Doe',
      loanType: 'Personal Loan',
      amount: 50000,
      tenureMonths: 24,
      purpose: 'Home renovation',
      appliedDate: new Date('2024-12-15'),
      monthlyInstallment: 2291
    },
    {
      loanId: 2,
      employeeName: 'Jane Smith',
      loanType: 'Education Loan',
      amount: 75000,
      tenureMonths: 36,
      purpose: 'MBA Course',
      appliedDate: new Date('2024-12-14'),
      monthlyInstallment: 2437
    },
    {
      loanId: 3,
      employeeName: 'Mike Johnson',
      loanType: 'Emergency Loan',
      amount: 25000,
      tenureMonths: 12,
      purpose: 'Medical emergency',
      appliedDate: new Date('2024-12-13'),
      monthlyInstallment: 2229
    },
    {
      loanId: 4,
      employeeName: 'Sarah Wilson',
      loanType: 'Vehicle Loan',
      amount: 80000,
      tenureMonths: 48,
      purpose: 'Car purchase',
      appliedDate: new Date('2024-12-12'),
      monthlyInstallment: 2083
    },
    {
      loanId: 5,
      employeeName: 'David Brown',
      loanType: 'Personal Loan',
      amount: 30000,
      tenureMonths: 18,
      purpose: 'Debt consolidation',
      appliedDate: new Date('2024-12-11'),
      monthlyInstallment: 1875
    }
  ];

  filteredLoans = [...this.allLoans];

  ngOnInit() {
    this.filterLoans();
  }

  filterLoans() {
    this.filteredLoans = this.selectedFilter 
      ? this.allLoans.filter(loan => loan.loanType === this.selectedFilter)
      : this.allLoans;
  }

  approveLoan(loan: any) {
    if (confirm(`Approve ${loan.loanType} for ${loan.employeeName}?`)) {
      this.allLoans = this.allLoans.filter(l => l.loanId !== loan.loanId);
      this.filterLoans();
      this.pendingCount--;
      this.approvedCount++;
      alert('Loan approved successfully!');
    }
  }

  rejectLoan(loan: any) {
    const reason = prompt(`Reason for rejecting ${loan.loanType}:`);
    if (reason && reason.trim()) {
      this.allLoans = this.allLoans.filter(l => l.loanId !== loan.loanId);
      this.filterLoans();
      this.pendingCount--;
      this.rejectedCount++;
      alert('Loan rejected successfully!');
    }
  }

  viewDetails(loan: any) {
    alert(`Loan Details:\n\nEmployee: ${loan.employeeName}\nType: ${loan.loanType}\nAmount: ₹${loan.amount}\nPurpose: ${loan.purpose}\nTenure: ${loan.tenureMonths} months\nEMI: ₹${loan.monthlyInstallment}`);
  }
}