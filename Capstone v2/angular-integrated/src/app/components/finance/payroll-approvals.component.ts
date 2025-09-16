import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payroll-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="approvals-container">
      <div class="page-header">
        <h2>Payroll Approvals</h2>
        <div class="filters">
          <select [(ngModel)]="selectedFilter" class="filter-select">
            <option value="all">All Payrolls</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
      </div>

      <div class="approvals-list">
        <div *ngFor="let payroll of filteredPayrolls" class="approval-card">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ payroll.employeeName }}</h3>
              <p>{{ payroll.department }} • {{ payroll.period }}</p>
            </div>
            <div class="status-badge" [class]="payroll.status">
              {{ payroll.status | titlecase }}
            </div>
          </div>

          <div class="payroll-details">
            <div class="detail-row">
              <span class="label">Basic Salary:</span>
              <span class="value">${{ payroll.basicSalary | number:'1.2-2' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Allowances:</span>
              <span class="value">${{ payroll.allowances | number:'1.2-2' }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Deductions:</span>
              <span class="value negative">${{ payroll.deductions | number:'1.2-2' }}</span>
            </div>
            <div class="detail-row total">
              <span class="label">Net Pay:</span>
              <span class="value">${{ payroll.netPay | number:'1.2-2' }}</span>
            </div>
          </div>

          <div *ngIf="payroll.managerComments" class="manager-comments">
            <h4>Manager Comments:</h4>
            <p>{{ payroll.managerComments }}</p>
          </div>

          <div *ngIf="payroll.status === 'pending'" class="approval-actions">
            <div class="comments-section">
              <label>Finance Notes:</label>
              <textarea 
                [(ngModel)]="payroll.financeNotes" 
                placeholder="Add your notes here..."
                class="notes-input"
              ></textarea>
            </div>
            <div class="action-buttons">
              <button 
                class="btn btn-approve" 
                (click)="approvePayroll(payroll)"
              >
                <span class="material-icons">check</span>
                Approve
              </button>
              <button 
                class="btn btn-reject" 
                (click)="rejectPayroll(payroll)"
              >
                <span class="material-icons">close</span>
                Reject
              </button>
            </div>
          </div>

          <div *ngIf="payroll.status !== 'pending'" class="approval-history">
            <div class="history-item">
              <span class="material-icons">{{ payroll.status === 'approved' ? 'check_circle' : 'cancel' }}</span>
              <span>{{ payroll.status === 'approved' ? 'Approved' : 'Rejected' }} by Finance on {{ payroll.financeDate }}</span>
            </div>
            <div *ngIf="payroll.financeNotes" class="finance-notes">
              <strong>Finance Notes:</strong> {{ payroll.financeNotes }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .approvals-container {
      padding: var(--spacing-lg);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    .page-header h2 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
      margin: 0;
    }

    .filter-select {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--outline);
      border-radius: var(--radius-md);
      background: var(--surface);
      color: var(--on-surface);
    }

    .approvals-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .approval-card {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-2);
      border: 1px solid var(--outline);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-md);
    }

    .employee-info h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0 0 var(--spacing-xs) 0;
    }

    .employee-info p {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
      margin: 0;
    }

    .status-badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .status-badge.pending {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .status-badge.approved {
      background: var(--success-100);
      color: var(--success-700);
    }

    .status-badge.rejected {
      background: var(--error-100);
      color: var(--error-700);
    }

    .payroll-details {
      background: var(--surface-variant);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-xs) 0;
    }

    .detail-row.total {
      border-top: 1px solid var(--outline);
      margin-top: var(--spacing-sm);
      padding-top: var(--spacing-sm);
      font-weight: var(--font-weight-semibold);
    }

    .label {
      color: var(--on-surface-variant);
    }

    .value {
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }

    .value.negative {
      color: var(--error-600);
    }

    .manager-comments {
      background: var(--primary-50);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .manager-comments h4 {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--primary-700);
      margin: 0 0 var(--spacing-xs) 0;
    }

    .manager-comments p {
      font-size: var(--font-size-sm);
      color: var(--on-surface);
      margin: 0;
    }

    .approval-actions {
      border-top: 1px solid var(--outline);
      padding-top: var(--spacing-md);
    }

    .comments-section {
      margin-bottom: var(--spacing-md);
    }

    .comments-section label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
      margin-bottom: var(--spacing-xs);
    }

    .notes-input {
      width: 100%;
      min-height: 80px;
      padding: var(--spacing-sm);
      border: 1px solid var(--outline);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      resize: vertical;
    }

    .action-buttons {
      display: flex;
      gap: var(--spacing-md);
    }

    .btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-approve {
      background: var(--success-500);
      color: white;
    }

    .btn-approve:hover {
      background: var(--success-600);
    }

    .btn-reject {
      background: var(--error-500);
      color: white;
    }

    .btn-reject:hover {
      background: var(--error-600);
    }

    .approval-history {
      border-top: 1px solid var(--outline);
      padding-top: var(--spacing-md);
    }

    .history-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
      margin-bottom: var(--spacing-sm);
    }

    .finance-notes {
      font-size: var(--font-size-sm);
      color: var(--on-surface);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);
      }

      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class PayrollApprovalsComponent implements OnInit {
  selectedFilter = 'all';
  
  payrolls = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      period: 'December 2024',
      basicSalary: 5000,
      allowances: 1000,
      deductions: 500,
      netPay: 5500,
      status: 'pending',
      managerComments: 'Performance bonus included for Q4 achievements.',
      financeNotes: '',
      financeDate: null
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      department: 'Marketing',
      period: 'December 2024',
      basicSalary: 4500,
      allowances: 800,
      deductions: 450,
      netPay: 4850,
      status: 'approved',
      managerComments: 'Regular monthly payroll.',
      financeNotes: 'Approved - All documents verified.',
      financeDate: '2024-12-15'
    }
  ];

  get filteredPayrolls() {
    if (this.selectedFilter === 'all') {
      return this.payrolls;
    }
    return this.payrolls.filter(p => p.status === this.selectedFilter);
  }

  ngOnInit() {}

  approvePayroll(payroll: any) {
    if (!payroll.financeNotes.trim()) {
      alert('Please add finance notes before approving.');
      return;
    }
    
    payroll.status = 'approved';
    payroll.financeDate = new Date().toLocaleDateString();
    alert(`Payroll approved for ${payroll.employeeName}`);
  }

  rejectPayroll(payroll: any) {
    if (!payroll.financeNotes.trim()) {
      alert('Please add rejection reason in finance notes.');
      return;
    }
    
    payroll.status = 'rejected';
    payroll.financeDate = new Date().toLocaleDateString();
    alert(`Payroll rejected for ${payroll.employeeName}`);
  }
}