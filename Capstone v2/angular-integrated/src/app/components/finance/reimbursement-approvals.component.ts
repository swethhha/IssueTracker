import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reimbursement-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="approvals-container">
      <div class="page-header">
        <h2>Reimbursement Approvals</h2>
        <div class="filters">
          <select [(ngModel)]="selectedFilter" class="filter-select">
            <option value="all">All Reimbursements</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div class="approvals-list">
        <div *ngFor="let reimbursement of filteredReimbursements" class="approval-card">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ reimbursement.employeeName }}</h3>
              <p>{{ reimbursement.department }} • {{ reimbursement.category }}</p>
            </div>
            <div class="status-badge" [class]="reimbursement.status">
              {{ reimbursement.status | titlecase }}
            </div>
          </div>

          <div class="reimbursement-details">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="label">Amount:</span>
                <span class="value amount">${{ reimbursement.amount | number:'1.2-2' }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Expense Date:</span>
                <span class="value">{{ reimbursement.expenseDate }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Category:</span>
                <span class="value">{{ reimbursement.category }}</span>
              </div>
              <div class="detail-item">
                <span class="label">Submitted:</span>
                <span class="value">{{ reimbursement.submittedDate }}</span>
              </div>
            </div>
            <div class="description">
              <strong>Description:</strong> {{ reimbursement.description }}
            </div>
          </div>

          <div class="attachments-section">
            <h4>Receipts & Bills:</h4>
            <div class="attachment-list">
              <div *ngFor="let attachment of reimbursement.attachments" class="attachment-item">
                <span class="material-icons">{{ getAttachmentIcon(attachment.type) }}</span>
                <span class="attachment-name">{{ attachment.name }}</span>
                <button class="btn-view" (click)="viewAttachment(attachment)">
                  <span class="material-icons">visibility</span>
                  View
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="reimbursement.managerComments" class="manager-comments">
            <h4>Manager Comments:</h4>
            <p>{{ reimbursement.managerComments }}</p>
          </div>

          <div *ngIf="reimbursement.status === 'pending'" class="approval-actions">
            <div class="policy-check">
              <h4>Policy Compliance:</h4>
              <div class="check-items">
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="reimbursement.receiptsValid">
                  <span>Receipts are valid and complete</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="reimbursement.amountValid">
                  <span>Amount is within policy limits</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="reimbursement.categoryValid">
                  <span>Expense category is approved</span>
                </label>
              </div>
            </div>

            <div class="comments-section">
              <label>Finance Notes:</label>
              <textarea 
                [(ngModel)]="reimbursement.financeNotes" 
                placeholder="Add verification notes and comments..."
                class="notes-input"
              ></textarea>
            </div>

            <div class="payout-section">
              <label>Reimbursement Payout Date:</label>
              <input 
                type="date" 
                [(ngModel)]="reimbursement.payoutDate" 
                class="date-input"
              >
            </div>

            <div class="action-buttons">
              <button 
                class="btn btn-approve" 
                (click)="approveReimbursement(reimbursement)"
                [disabled]="!canApprove(reimbursement)"
              >
                <span class="material-icons">check</span>
                Approve
              </button>
              <button 
                class="btn btn-reject" 
                (click)="rejectReimbursement(reimbursement)"
              >
                <span class="material-icons">close</span>
                Reject
              </button>
            </div>
          </div>

          <div *ngIf="reimbursement.status !== 'pending'" class="approval-history">
            <div class="history-item">
              <span class="material-icons">{{ reimbursement.status === 'approved' ? 'check_circle' : 'cancel' }}</span>
              <span>{{ reimbursement.status === 'approved' ? 'Approved' : 'Rejected' }} by Finance on {{ reimbursement.financeDate }}</span>
            </div>
            <div *ngIf="reimbursement.payoutDate && reimbursement.status === 'approved'" class="payout-info">
              <strong>Payout Date:</strong> {{ reimbursement.payoutDate }}
            </div>
            <div *ngIf="reimbursement.financeNotes" class="finance-notes">
              <strong>Finance Notes:</strong> {{ reimbursement.financeNotes }}
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

    .reimbursement-details {
      background: var(--surface-variant);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
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
      color: var(--success-600);
    }

    .description {
      font-size: var(--font-size-sm);
      color: var(--on-surface);
      padding-top: var(--spacing-sm);
      border-top: 1px solid var(--outline);
    }

    .attachments-section {
      margin-bottom: var(--spacing-md);
    }

    .attachments-section h4 {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .attachment-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .attachment-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm);
      background: var(--surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--outline);
    }

    .attachment-name {
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

    .policy-check {
      margin-bottom: var(--spacing-md);
    }

    .policy-check h4 {
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
export class ReimbursementApprovalsComponent implements OnInit {
  selectedFilter = 'all';
  
  reimbursements = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      category: 'Travel',
      amount: 850,
      expenseDate: '2024-12-08',
      submittedDate: '2024-12-10',
      description: 'Business trip to client site for project implementation',
      attachments: [
        { type: 'receipt', name: 'Flight_Receipt.pdf' },
        { type: 'receipt', name: 'Hotel_Bill.pdf' },
        { type: 'receipt', name: 'Taxi_Receipt.pdf' }
      ],
      status: 'pending',
      managerComments: 'Valid business expense. All receipts provided.',
      receiptsValid: false,
      amountValid: false,
      categoryValid: false,
      financeNotes: '',
      payoutDate: '',
      financeDate: null
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      department: 'Marketing',
      category: 'Office Supplies',
      amount: 125,
      expenseDate: '2024-12-05',
      submittedDate: '2024-12-06',
      description: 'Office supplies for team workspace setup',
      attachments: [
        { type: 'receipt', name: 'Office_Supplies_Receipt.pdf' }
      ],
      status: 'approved',
      managerComments: 'Approved for office setup.',
      receiptsValid: true,
      amountValid: true,
      categoryValid: true,
      financeNotes: 'All policy checks passed. Reimbursement approved.',
      payoutDate: '2024-12-18',
      financeDate: '2024-12-12'
    }
  ];

  get filteredReimbursements() {
    if (this.selectedFilter === 'all') {
      return this.reimbursements;
    }
    return this.reimbursements.filter(r => r.status === this.selectedFilter);
  }

  ngOnInit() {}

  getAttachmentIcon(type: string): string {
    return type === 'receipt' ? 'receipt' : 'description';
  }

  viewAttachment(attachment: any) {
    alert(`Viewing attachment: ${attachment.name}`);
  }

  canApprove(reimbursement: any): boolean {
    return reimbursement.receiptsValid && reimbursement.amountValid && reimbursement.categoryValid;
  }

  approveReimbursement(reimbursement: any) {
    if (!this.canApprove(reimbursement)) {
      alert('Please complete all policy compliance checks before approving.');
      return;
    }
    
    if (!reimbursement.financeNotes.trim()) {
      alert('Please add finance notes before approving.');
      return;
    }
    
    reimbursement.status = 'approved';
    reimbursement.financeDate = new Date().toLocaleDateString();
    alert(`Reimbursement approved for ${reimbursement.employeeName}`);
  }

  rejectReimbursement(reimbursement: any) {
    if (!reimbursement.financeNotes.trim()) {
      alert('Please add rejection reason in finance notes.');
      return;
    }
    
    reimbursement.status = 'rejected';
    reimbursement.financeDate = new Date().toLocaleDateString();
    alert(`Reimbursement rejected for ${reimbursement.employeeName}`);
  }
}