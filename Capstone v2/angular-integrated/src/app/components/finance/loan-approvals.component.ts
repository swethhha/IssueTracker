import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="approvals-container">
      <div class="page-header">
        <h2>Loan Approvals</h2>
        <div class="filters">
          <select [(ngModel)]="selectedFilter" class="filter-select">
            <option value="all">All Loans</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div class="approvals-list">
        <div *ngFor="let loan of filteredLoans" class="approval-card">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ loan.employeeName }}</h3>
              <p>{{ loan.department }} • Applied on {{ loan.applicationDate }}</p>
            </div>
            <div class="status-badge" [class]="loan.status">
              {{ loan.status | titlecase }}
            </div>
          </div>

          <div class="loan-details">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Loan Amount:</span>
                <span class="value amount">${{ loan.amount | number:'1.2-2' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Tenure:</span>
                <span class="value">{{ loan.tenure }} months</span>
              </div>
              <div class="detail-item">
                <span class="label">Purpose:</span>
                <span class="value">{{ loan.purpose }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Monthly EMI:</span>
                <span class="value">${{ loan.emi | number:'1.2-2' }}</span>
              </div>
            </div>
          </div>

          <div class="documents-section">
            <h4>Uploaded Documents:</h4>
            <div class="document-list">
              <div *ngFor="let doc of loan.documents" class="document-item">
                <span class="material-icons">{{ getDocumentIcon(doc.type) }}</span>
                <span class="doc-name">{{ doc.name }}</span>
                <button class="btn-view" (click)="viewDocument(doc)">
                  <span class="material-icons">visibility</span>
                  View
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="loan.managerComments" class="manager-comments">
            <h4>Manager Comments:</h4>
            <p>{{ loan.managerComments }}</p>
          </div>

          <div *ngIf="loan.status === 'pending'" class="approval-actions">
            <div class="eligibility-check">
              <h4>Eligibility Verification:</h4>
              <div class="check-items">
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="loan.salaryVerified">
                  <span>Salary verification completed</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="loan.documentsVerified">
                  <span>All documents verified</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="loan.creditCheck">
                  <span>Credit check passed</span>
                </label>
              </div>
            </div>

            <div class="comments-section">
              <label>Finance Notes:</label>
              <textarea 
                [(ngModel)]="loan.financeNotes" 
                placeholder="Add verification notes and comments..."
                class="notes-input"
              ></textarea>
            </div>

            <div *ngIf="loan.status === 'approved'" class="payout-section">
              <label>Payout Date:</label>
              <input 
                type="date" 
                [(ngModel)]="loan.payoutDate" 
                class="date-input"
              >
            </div>

            <div class="action-buttons">
              <button 
                class="btn btn-approve" 
                (click)="approveLoan(loan)"
                [disabled]="!canApprove(loan)"
              >
                <span class="material-icons">check</span>
                Approve
              </button>
              <button 
                class="btn btn-reject" 
                (click)="rejectLoan(loan)"
              >
                <span class="material-icons">close</span>
                Reject
              </button>
            </div>
          </div>

          <div *ngIf="loan.status !== 'pending'" class="approval-history">
            <div class="history-item">
              <span class="material-icons">{{ loan.status === 'approved' ? 'check_circle' : 'cancel' }}</span>
              <span>{{ loan.status === 'approved' ? 'Approved' : 'Rejected' }} by Finance on {{ loan.financeDate }}</span>
            </div>
            <div *ngIf="loan.payoutDate && loan.status === 'approved'" class="payout-info">
              <strong>Payout Date:</strong> {{ loan.payoutDate }}
            </div>
            <div *ngIf="loan.financeNotes" class="finance-notes">
              <strong>Finance Notes:</strong> {{ loan.financeNotes }}
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

    .approval-card {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-2);
      border: 1px solid var(--outline);
      margin-bottom: var(--spacing-lg);
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

    .loan-details {
      background: var(--surface-variant);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .label {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .value {
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }

    .value.amount {
      font-size: var(--font-size-lg);
      color: var(--primary-600);
    }

    .documents-section {
      margin-bottom: var(--spacing-md);
    }

    .documents-section h4 {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .document-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .document-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm);
      background: var(--surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--outline);
    }

    .doc-name {
      flex: 1;
      font-size: var(--font-size-sm);
      color: var(--on-surface);
    }

    .btn-view {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-sm);
      border: none;
      background: var(--primary-100);
      color: var(--primary-700);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      cursor: pointer;
    }

    .eligibility-check {
      margin-bottom: var(--spacing-md);
    }

    .eligibility-check h4 {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .check-items {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .check-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-sm);
      color: var(--on-surface);
      cursor: pointer;
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

    .payout-section {
      margin-bottom: var(--spacing-md);
    }

    .payout-section label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
      margin-bottom: var(--spacing-xs);
    }

    .date-input {
      padding: var(--spacing-sm);
      border: 1px solid var(--outline);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
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

    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-approve {
      background: var(--success-500);
      color: white;
    }

    .btn-approve:hover:not(:disabled) {
      background: var(--success-600);
    }

    .btn-reject {
      background: var(--error-500);
      color: white;
    }

    .btn-reject:hover {
      background: var(--error-600);
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

    .approval-actions {
      border-top: 1px solid var(--outline);
      padding-top: var(--spacing-md);
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

    @media (max-width: 768px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
    }
  `]
})
export class LoanApprovalsComponent implements OnInit {
  selectedFilter = 'all';
  
  loans = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      applicationDate: '2024-12-10',
      amount: 15000,
      tenure: 24,
      purpose: 'Home Renovation',
      emi: 687.50,
      status: 'pending',
      documents: [
        { type: 'salary', name: 'Salary_Slip_Nov2024.pdf' },
        { type: 'id', name: 'Aadhaar_Card.pdf' },
        { type: 'bank', name: 'Bank_Statement_6months.pdf' }
      ],
      managerComments: 'Employee has good track record. Recommend approval.',
      salaryVerified: false,
      documentsVerified: false,
      creditCheck: false,
      financeNotes: '',
      payoutDate: '',
      financeDate: null
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      department: 'Marketing',
      applicationDate: '2024-12-05',
      amount: 10000,
      tenure: 18,
      purpose: 'Personal',
      emi: 611.11,
      status: 'approved',
      documents: [
        { type: 'salary', name: 'Salary_Slip_Nov2024.pdf' },
        { type: 'id', name: 'PAN_Card.pdf' },
        { type: 'bank', name: 'Bank_Statement_6months.pdf' }
      ],
      managerComments: 'Approved by manager.',
      salaryVerified: true,
      documentsVerified: true,
      creditCheck: true,
      financeNotes: 'All verifications completed. Loan approved.',
      payoutDate: '2024-12-20',
      financeDate: '2024-12-12'
    }
  ];

  get filteredLoans() {
    if (this.selectedFilter === 'all') {
      return this.loans;
    }
    return this.loans.filter(l => l.status === this.selectedFilter);
  }

  ngOnInit() {}

  getDocumentIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'salary': 'receipt_long',
      'id': 'badge',
      'bank': 'account_balance'
    };
    return icons[type] || 'description';
  }

  viewDocument(doc: any) {
    alert(`Viewing document: ${doc.name}`);
  }

  canApprove(loan: any): boolean {
    return loan.salaryVerified && loan.documentsVerified && loan.creditCheck;
  }

  approveLoan(loan: any) {
    if (!this.canApprove(loan)) {
      alert('Please complete all eligibility checks before approving.');
      return;
    }
    
    if (!loan.financeNotes.trim()) {
      alert('Please add finance notes before approving.');
      return;
    }
    
    loan.status = 'approved';
    loan.financeDate = new Date().toLocaleDateString();
    alert(`Loan approved for ${loan.employeeName}`);
  }

  rejectLoan(loan: any) {
    if (!loan.financeNotes.trim()) {
      alert('Please add rejection reason in finance notes.');
      return;
    }
    
    loan.status = 'rejected';
    loan.financeDate = new Date().toLocaleDateString();
    alert(`Loan rejected for ${loan.employeeName}`);
  }
}