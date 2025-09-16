import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Loan Approvals</h1>
        <p>Review and approve employee loan applications</p>
      </div>

      <div class="approvals-container">
        <div class="approval-card" *ngFor="let loan of pendingLoans">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ loan.employeeName }}</h3>
              <span class="employee-id">ID: {{ loan.employeeId }}</span>
            </div>
            <div class="loan-amount">
              <span class="amount">₹{{ loan.amount | number:'1.0-0' }}</span>
              <span class="emi">EMI: ₹{{ loan.monthlyInstallment | number:'1.0-0' }}</span>
            </div>
          </div>

          <div class="card-body">
            <div class="loan-details">
              <div class="detail-row">
                <span class="label">Loan Type:</span>
                <span class="value">{{ loan.loanType }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Tenure:</span>
                <span class="value">{{ loan.tenureMonths }} months</span>
              </div>
              <div class="detail-row">
                <span class="label">Purpose:</span>
                <span class="value">{{ loan.purpose }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Applied Date:</span>
                <span class="value">{{ loan.appliedDate | date:'mediumDate' }}</span>
              </div>
            </div>

            <div class="documents-section">
              <h4>Required Documents</h4>
              <div class="document-list">
                <div class="document-item">
                  <span class="material-icons">description</span>
                  <span>Salary Slip</span>
                  <button class="btn btn-outline btn-sm" (click)="viewDocument('salary', loan.loanId)">
                    <span class="material-icons">visibility</span>
                    View
                  </button>
                </div>
                <div class="document-item">
                  <span class="material-icons">badge</span>
                  <span>ID Proof</span>
                  <button class="btn btn-outline btn-sm" (click)="viewDocument('id', loan.loanId)">
                    <span class="material-icons">visibility</span>
                    View
                  </button>
                </div>
                <div class="document-item">
                  <span class="material-icons">account_balance</span>
                  <span>Bank Statement</span>
                  <button class="btn btn-outline btn-sm" (click)="viewDocument('bank', loan.loanId)">
                    <span class="material-icons">visibility</span>
                    View
                  </button>
                </div>
              </div>
            </div>

            <div class="comments-section" *ngIf="loan.showComments">
              <label for="comments-{{ loan.loanId }}">Comments/Reason</label>
              <textarea 
                id="comments-{{ loan.loanId }}"
                class="form-control" 
                [(ngModel)]="loan.comments" 
                rows="3"
                placeholder="Enter your comments or reason for rejection"
              ></textarea>
            </div>
          </div>

          <div class="card-actions">
            <button 
              class="btn btn-success" 
              (click)="approveLoan(loan)"
              [disabled]="loan.processing"
            >
              <span class="material-icons">check</span>
              Approve
            </button>
            <button 
              class="btn btn-error" 
              (click)="toggleComments(loan)"
              [disabled]="loan.processing"
            >
              <span class="material-icons">close</span>
              {{ loan.showComments ? 'Reject' : 'Reject' }}
            </button>
            <button 
              class="btn btn-error" 
              *ngIf="loan.showComments"
              (click)="rejectLoan(loan)"
              [disabled]="loan.processing || !loan.comments"
            >
              <span class="material-icons">send</span>
              Submit Rejection
            </button>
          </div>
        </div>

        <div class="empty-state" *ngIf="pendingLoans.length === 0">
          <div class="empty-icon">
            <span class="material-icons">check_circle</span>
          </div>
          <h3>No Pending Loan Approvals</h3>
          <p>All loan applications have been reviewed.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: var(--spacing-lg);
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--spacing-2xl);
    }

    .page-header h1 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
      margin: 0;
    }

    .page-header p {
      color: var(--on-surface-variant);
      font-size: var(--font-size-lg);
      margin: var(--spacing-sm) 0 0 0;
    }

    .approvals-container {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .approval-card {
      background: var(--surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-1);
      overflow: hidden;
      border: 1px solid var(--outline-variant);
    }

    .card-header {
      padding: var(--spacing-xl);
      background: var(--surface-variant);
      border-bottom: 1px solid var(--outline-variant);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .employee-info h3 {
      margin: 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .employee-id {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .loan-amount {
      text-align: right;
    }

    .amount {
      display: block;
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-500);
    }

    .emi {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .card-body {
      padding: var(--spacing-xl);
    }

    .loan-details {
      margin-bottom: var(--spacing-xl);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--outline-variant);
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: var(--font-weight-medium);
      color: var(--on-surface-variant);
    }

    .value {
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .documents-section {
      margin-bottom: var(--spacing-xl);
    }

    .documents-section h4 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .document-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .document-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: var(--surface-variant);
      border-radius: var(--radius-lg);
    }

    .document-item .material-icons {
      color: var(--primary-500);
    }

    .document-item span:nth-child(2) {
      flex: 1;
      font-weight: var(--font-weight-medium);
    }

    .comments-section {
      margin-bottom: var(--spacing-xl);
    }

    .comments-section label {
      display: block;
      margin-bottom: var(--spacing-sm);
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }

    .form-control {
      width: 100%;
      padding: var(--spacing-md);
      border: 1px solid var(--outline);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      resize: vertical;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }

    .card-actions {
      padding: var(--spacing-xl);
      background: var(--surface-variant);
      border-top: 1px solid var(--outline-variant);
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-success {
      background: var(--success-500);
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: var(--success-600);
    }

    .btn-error {
      background: var(--error-500);
      color: white;
    }

    .btn-error:hover:not(:disabled) {
      background: var(--error-600);
    }

    .btn-outline {
      background: transparent;
      color: var(--primary-500);
      border: 1px solid var(--primary-500);
    }

    .btn-outline:hover:not(:disabled) {
      background: var(--primary-50);
    }

    .btn-sm {
      padding: var(--spacing-xs) var(--spacing-sm);
      font-size: var(--font-size-xs);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-3xl);
      background: var(--surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-1);
    }

    .empty-icon .material-icons {
      font-size: 64px;
      color: var(--success-500);
      margin-bottom: var(--spacing-lg);
    }

    .empty-state h3 {
      margin: 0 0 var(--spacing-sm) 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .empty-state p {
      color: var(--on-surface-variant);
      margin: 0;
    }

    @media (max-width: 768px) {
      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);
      }

      .loan-amount {
        text-align: left;
      }

      .card-actions {
        flex-direction: column;
      }
    }
  `]
})
export class LoanApprovalsComponent implements OnInit {
  pendingLoans: any[] = [];

  constructor(private loanService: LoanService) {}

  ngOnInit() {
    this.loadPendingLoans();
  }

  loadPendingLoans() {
    this.pendingLoans = [
      {
        loanId: 1,
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        loanType: 'Personal Loan',
        amount: 200000,
        tenureMonths: 24,
        purpose: 'Home renovation',
        appliedDate: new Date(2024, 11, 1),
        monthlyInstallment: 9567,
        showComments: false,
        comments: '',
        processing: false
      },
      {
        loanId: 2,
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        loanType: 'Education Loan',
        amount: 500000,
        tenureMonths: 60,
        purpose: 'MBA program',
        appliedDate: new Date(2024, 11, 2),
        monthlyInstallment: 11122,
        showComments: false,
        comments: '',
        processing: false
      }
    ];
  }

  toggleComments(loan: any) {
    loan.showComments = !loan.showComments;
    if (!loan.showComments) {
      loan.comments = '';
    }
  }

  approveLoan(loan: any) {
    if (confirm(`Approve loan application for ${loan.employeeName}?`)) {
      loan.processing = true;
      
      this.loanService.approveByManager(loan.loanId, loan.comments || '').subscribe({
        next: () => {
          alert('Loan approved successfully!');
          this.removeLoanFromList(loan.loanId);
        },
        error: () => {
          loan.processing = false;
          alert('Failed to approve loan. Please try again.');
        }
      });
    }
  }

  rejectLoan(loan: any) {
    if (!loan.comments.trim()) {
      alert('Please provide a reason for rejection.');
      return;
    }

    if (confirm(`Reject loan application for ${loan.employeeName}?`)) {
      loan.processing = true;
      
      this.loanService.rejectByManager(loan.loanId, loan.comments).subscribe({
        next: () => {
          alert('Loan rejected successfully!');
          this.removeLoanFromList(loan.loanId);
        },
        error: () => {
          loan.processing = false;
          alert('Failed to reject loan. Please try again.');
        }
      });
    }
  }

  viewDocument(type: string, loanId: number) {
    alert(`Viewing ${type} document for loan ${loanId}`);
  }

  private removeLoanFromList(loanId: number) {
    this.pendingLoans = this.pendingLoans.filter(loan => loan.loanId !== loanId);
  }
}