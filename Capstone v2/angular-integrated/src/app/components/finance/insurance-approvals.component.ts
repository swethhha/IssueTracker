import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-insurance-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="approvals-container">
      <div class="page-header">
        <h2>Insurance Approvals</h2>
        <div class="filters">
          <select [(ngModel)]="selectedFilter" class="filter-select">
            <option value="all">All Enrollments</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div class="approvals-list">
        <div *ngFor="let enrollment of filteredEnrollments" class="approval-card">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ enrollment.employeeName }}</h3>
              <p>{{ enrollment.department }} • {{ enrollment.policyType }}</p>
            </div>
            <div class="status-badge" [class]="enrollment.status">
              {{ enrollment.status | titlecase }}
            </div>
          </div>

          <div class="enrollment-details">
            <div class="policy-info">
              <div class="policy-card">
                <div class="policy-header">
                  <span class="material-icons">{{ getPolicyIcon(enrollment.policyType) }}</span>
                  <div>
                    <h4>{{ enrollment.policyName }}</h4>
                    <p>{{ enrollment.policyType }}</p>
                  </div>
                </div>
                <div class="policy-details">
                  <div class="detail-row">
                    <span>Coverage Amount:</span>
                    <span class="amount">${{ enrollment.coverageAmount | number:'1.0-0' }}</span>
                  </div>
                  <div class="detail-row">
                    <span>Premium (Monthly):</span>
                    <span class="premium">${{ enrollment.monthlyPremium | number:'1.2-2' }}</span>
                  </div>
                  <div class="detail-row">
                    <span>Enrollment Date:</span>
                    <span>{{ enrollment.enrollmentDate }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="enrollment.dependents?.length" class="dependents-section">
              <h4>Dependents:</h4>
              <div class="dependent-list">
                <div *ngFor="let dependent of enrollment.dependents" class="dependent-item">
                  <span class="dependent-name">{{ dependent.name }}</span>
                  <span class="dependent-relation">{{ dependent.relation }}</span>
                  <span class="dependent-age">Age: {{ dependent.age }}</span>
                </div>
              </div>
            </div>
          </div>

          <div *ngIf="enrollment.documents?.length" class="documents-section">
            <h4>Supporting Documents:</h4>
            <div class="document-list">
              <div *ngFor="let doc of enrollment.documents" class="document-item">
                <span class="material-icons">{{ getDocumentIcon(doc.type) }}</span>
                <span class="doc-name">{{ doc.name }}</span>
                <button class="btn-view" (click)="viewDocument(doc)">
                  <span class="material-icons">visibility</span>
                  View
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="enrollment.managerComments" class="manager-comments">
            <h4>Manager Comments:</h4>
            <p>{{ enrollment.managerComments }}</p>
          </div>

          <div *ngIf="enrollment.status === 'pending'" class="approval-actions">
            <div class="verification-check">
              <h4>Verification Checklist:</h4>
              <div class="check-items">
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="enrollment.eligibilityVerified">
                  <span>Employee eligibility verified</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="enrollment.documentsVerified">
                  <span>All required documents provided</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="enrollment.premiumCalculated">
                  <span>Premium calculation verified</span>
                </label>
                <label class="check-item" *ngIf="enrollment.dependents?.length">
                  <input type="checkbox" [(ngModel)]="enrollment.dependentsVerified">
                  <span>Dependent information verified</span>
                </label>
              </div>
            </div>

            <div class="comments-section">
              <label>Finance Notes:</label>
              <textarea 
                [(ngModel)]="enrollment.financeNotes" 
                placeholder="Add verification notes and comments..."
                class="notes-input"
              ></textarea>
            </div>

            <div class="effective-date-section">
              <label>Policy Effective Date:</label>
              <input 
                type="date" 
                [(ngModel)]="enrollment.effectiveDate" 
                class="date-input"
              >
            </div>

            <div class="action-buttons">
              <button 
                class="btn btn-approve" 
                (click)="approveEnrollment(enrollment)"
                [disabled]="!canApprove(enrollment)"
              >
                <span class="material-icons">check</span>
                Approve Enrollment
              </button>
              <button 
                class="btn btn-reject" 
                (click)="rejectEnrollment(enrollment)"
              >
                <span class="material-icons">close</span>
                Reject
              </button>
            </div>
          </div>

          <div *ngIf="enrollment.status !== 'pending'" class="approval-history">
            <div class="history-item">
              <span class="material-icons">{{ enrollment.status === 'approved' ? 'check_circle' : 'cancel' }}</span>
              <span>{{ enrollment.status === 'approved' ? 'Approved' : 'Rejected' }} by Finance on {{ enrollment.financeDate }}</span>
            </div>
            <div *ngIf="enrollment.effectiveDate && enrollment.status === 'approved'" class="effective-info">
              <strong>Policy Effective Date:</strong> {{ enrollment.effectiveDate }}
            </div>
            <div *ngIf="enrollment.financeNotes" class="finance-notes">
              <strong>Finance Notes:</strong> {{ enrollment.financeNotes }}
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

    .enrollment-details {
      margin-bottom: var(--spacing-md);
    }

    .policy-card {
      background: var(--surface-variant);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .policy-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .policy-header .material-icons {
      font-size: 32px;
      color: var(--primary-600);
    }

    .policy-header h4 {
      font-size: var(--font-size-md);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0;
    }

    .policy-header p {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
      margin: 0;
    }

    .policy-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: var(--font-size-sm);
    }

    .amount {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
    }

    .premium {
      font-weight: var(--font-weight-medium);
      color: var(--success-600);
    }

    .dependents-section {
      margin-bottom: var(--spacing-md);
    }

    .dependents-section h4 {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .dependent-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .dependent-item {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-sm);
      background: var(--surface);
      border-radius: var(--radius-sm);
      border: 1px solid var(--outline);
    }

    .dependent-name {
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }

    .dependent-relation {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
    }

    .dependent-age {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
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

    .verification-check {
      margin-bottom: var(--spacing-md);
    }

    .verification-check h4 {
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

    .effective-date-section {
      margin-bottom: var(--spacing-md);
    }

    .effective-date-section label {
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
      .action-buttons {
        flex-direction: column;
      }
      
      .dependent-item {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class InsuranceApprovalsComponent implements OnInit {
  selectedFilter = 'all';
  
  enrollments = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      policyType: 'Group Health Insurance',
      policyName: 'Comprehensive Health Plan',
      coverageAmount: 500000,
      monthlyPremium: 125.50,
      enrollmentDate: '2024-12-10',
      dependents: [
        { name: 'Jane Doe', relation: 'Spouse', age: 32 },
        { name: 'Jimmy Doe', relation: 'Child', age: 8 }
      ],
      documents: [
        { type: 'medical', name: 'Medical_History.pdf' },
        { type: 'id', name: 'Family_ID_Proofs.pdf' }
      ],
      status: 'pending',
      managerComments: 'Employee eligible for family coverage.',
      eligibilityVerified: false,
      documentsVerified: false,
      premiumCalculated: false,
      dependentsVerified: false,
      financeNotes: '',
      effectiveDate: '',
      financeDate: null
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      department: 'Marketing',
      policyType: 'Term Life Insurance',
      policyName: 'Basic Term Life Coverage',
      coverageAmount: 1000000,
      monthlyPremium: 45.00,
      enrollmentDate: '2024-12-05',
      dependents: [],
      documents: [
        { type: 'medical', name: 'Health_Declaration.pdf' }
      ],
      status: 'approved',
      managerComments: 'Standard enrollment approved.',
      eligibilityVerified: true,
      documentsVerified: true,
      premiumCalculated: true,
      dependentsVerified: true,
      financeNotes: 'All verifications completed. Policy activated.',
      effectiveDate: '2024-12-20',
      financeDate: '2024-12-12'
    }
  ];

  get filteredEnrollments() {
    if (this.selectedFilter === 'all') {
      return this.enrollments;
    }
    return this.enrollments.filter(e => e.status === this.selectedFilter);
  }

  ngOnInit() {}

  getPolicyIcon(policyType: string): string {
    const icons: { [key: string]: string } = {
      'Group Health Insurance': 'health_and_safety',
      'Term Life Insurance': 'favorite',
      'Critical Illness': 'local_hospital',
      'Accident & Disability': 'accessible'
    };
    return icons[policyType] || 'security';
  }

  getDocumentIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'medical': 'local_hospital',
      'id': 'badge',
      'financial': 'account_balance'
    };
    return icons[type] || 'description';
  }

  viewDocument(doc: any) {
    alert(`Viewing document: ${doc.name}`);
  }

  canApprove(enrollment: any): boolean {
    const basicChecks = enrollment.eligibilityVerified && enrollment.documentsVerified && enrollment.premiumCalculated;
    const dependentCheck = enrollment.dependents?.length ? enrollment.dependentsVerified : true;
    return basicChecks && dependentCheck;
  }

  approveEnrollment(enrollment: any) {
    if (!this.canApprove(enrollment)) {
      alert('Please complete all verification checks before approving.');
      return;
    }
    
    if (!enrollment.financeNotes.trim()) {
      alert('Please add finance notes before approving.');
      return;
    }
    
    enrollment.status = 'approved';
    enrollment.financeDate = new Date().toLocaleDateString();
    alert(`Insurance enrollment approved for ${enrollment.employeeName}`);
  }

  rejectEnrollment(enrollment: any) {
    if (!enrollment.financeNotes.trim()) {
      alert('Please add rejection reason in finance notes.');
      return;
    }
    
    enrollment.status = 'rejected';
    enrollment.financeDate = new Date().toLocaleDateString();
    alert(`Insurance enrollment rejected for ${enrollment.employeeName}`);
  }
}