import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-medical-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="approvals-container">
      <div class="page-header">
        <h2>Medical Claim Approvals</h2>
        <div class="filters">
          <select [(ngModel)]="selectedFilter" class="filter-select">
            <option value="all">All Claims</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div class="approvals-list">
        <div *ngFor="let claim of filteredClaims" class="approval-card">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ claim.employeeName }}</h3>
              <p>{{ claim.department }} • {{ claim.claimType }}</p>
            </div>
            <div class="status-badge" [class]="claim.status">
              {{ claim.status | titlecase }}
            </div>
          </div>

          <div class="claim-details">
            <div class="claim-summary">
              <div class="summary-grid">
                <div class="detail-item">
                  <span class="label">Claim Amount:</span>
                  <span class="value amount">${{ claim.claimAmount | number:'1.2-2' }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Treatment Date:</span>
                  <span class="value">{{ claim.treatmentDate }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Hospital/Clinic:</span>
                  <span class="value">{{ claim.hospitalName }}</span>
                </div>
                <div class="detail-item">
                  <span class="label">Policy Coverage:</span>
                  <span class="value">${{ claim.policyCoverage | number:'1.0-0' }}</span>
                </div>
              </div>
              <div class="diagnosis">
                <strong>Diagnosis:</strong> {{ claim.diagnosis }}
              </div>
              <div class="treatment-details">
                <strong>Treatment Details:</strong> {{ claim.treatmentDetails }}
              </div>
            </div>

            <div *ngIf="claim.patient !== claim.employeeName" class="patient-info">
              <h4>Patient Information:</h4>
              <div class="patient-details">
                <span><strong>Name:</strong> {{ claim.patient }}</span>
                <span><strong>Relation:</strong> {{ claim.relation }}</span>
                <span><strong>Age:</strong> {{ claim.patientAge }}</span>
              </div>
            </div>
          </div>

          <div class="documents-section">
            <h4>Medical Documents:</h4>
            <div class="document-list">
              <div *ngFor="let doc of claim.documents" class="document-item">
                <span class="material-icons">{{ getDocumentIcon(doc.type) }}</span>
                <span class="doc-name">{{ doc.name }}</span>
                <span class="doc-type">{{ doc.type | titlecase }}</span>
                <button class="btn-view" (click)="viewDocument(doc)">
                  <span class="material-icons">visibility</span>
                  View
                </button>
              </div>
            </div>
          </div>

          <div *ngIf="claim.managerComments" class="manager-comments">
            <h4>Manager Comments:</h4>
            <p>{{ claim.managerComments }}</p>
          </div>

          <div *ngIf="claim.status === 'pending'" class="approval-actions">
            <div class="coverage-verification">
              <h4>Policy Coverage Verification:</h4>
              <div class="coverage-details">
                <div class="coverage-item">
                  <span>Policy Type:</span>
                  <span class="policy-type">{{ claim.policyType }}</span>
                </div>
                <div class="coverage-item">
                  <span>Coverage Limit:</span>
                  <span class="coverage-limit">${{ claim.policyCoverage | number:'1.0-0' }}</span>
                </div>
                <div class="coverage-item">
                  <span>Deductible:</span>
                  <span class="deductible">${{ claim.deductible | number:'1.2-2' }}</span>
                </div>
                <div class="coverage-item">
                  <span>Co-pay %:</span>
                  <span class="copay">{{ claim.copayPercentage }}%</span>
                </div>
              </div>
            </div>

            <div class="settlement-calculation">
              <h4>Settlement Calculation:</h4>
              <div class="calculation-grid">
                <div class="calc-row">
                  <span>Total Claim Amount:</span>
                  <span class="calc-value">${{ claim.claimAmount | number:'1.2-2' }}</span>
                </div>
                <div class="calc-row">
                  <span>Less: Deductible:</span>
                  <span class="calc-value negative">-${{ claim.deductible | number:'1.2-2' }}</span>
                </div>
                <div class="calc-row">
                  <span>Eligible Amount:</span>
                  <span class="calc-value">${{ getEligibleAmount(claim) | number:'1.2-2' }}</span>
                </div>
                <div class="calc-row">
                  <span>Co-pay ({{ claim.copayPercentage }}%):</span>
                  <span class="calc-value negative">-${{ getCopayAmount(claim) | number:'1.2-2' }}</span>
                </div>
                <div class="calc-row total">
                  <span>Settlement Amount:</span>
                  <span class="calc-value settlement">${{ getSettlementAmount(claim) | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>

            <div class="verification-check">
              <h4>Verification Checklist:</h4>
              <div class="check-items">
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="claim.documentsVerified">
                  <span>All medical documents verified</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="claim.policyActive">
                  <span>Policy is active and valid</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="claim.treatmentCovered">
                  <span>Treatment is covered under policy</span>
                </label>
                <label class="check-item">
                  <input type="checkbox" [(ngModel)]="claim.amountVerified">
                  <span>Claim amount verified with bills</span>
                </label>
              </div>
            </div>

            <div class="comments-section">
              <label>Finance Notes:</label>
              <textarea 
                [(ngModel)]="claim.financeNotes" 
                placeholder="Add verification notes and settlement details..."
                class="notes-input"
              ></textarea>
            </div>

            <div class="settlement-section">
              <label>Settlement Amount:</label>
              <input 
                type="number" 
                [(ngModel)]="claim.settlementAmount" 
                [value]="getSettlementAmount(claim)"
                class="amount-input"
                step="0.01"
              >
            </div>

            <div class="payout-section">
              <label>Settlement Date:</label>
              <input 
                type="date" 
                [(ngModel)]="claim.settlementDate" 
                class="date-input"
              >
            </div>

            <div class="action-buttons">
              <button 
                class="btn btn-approve" 
                (click)="approveClaim(claim)"
                [disabled]="!canApprove(claim)"
              >
                <span class="material-icons">check</span>
                Approve & Settle
              </button>
              <button 
                class="btn btn-reject" 
                (click)="rejectClaim(claim)"
              >
                <span class="material-icons">close</span>
                Reject Claim
              </button>
            </div>
          </div>

          <div *ngIf="claim.status !== 'pending'" class="approval-history">
            <div class="history-item">
              <span class="material-icons">{{ claim.status === 'approved' ? 'check_circle' : 'cancel' }}</span>
              <span>{{ claim.status === 'approved' ? 'Approved' : 'Rejected' }} by Finance on {{ claim.financeDate }}</span>
            </div>
            <div *ngIf="claim.settlementAmount && claim.status === 'approved'" class="settlement-info">
              <strong>Settlement Amount:</strong> ${{ claim.settlementAmount | number:'1.2-2' }}
              <span *ngIf="claim.settlementDate"> • Settlement Date: {{ claim.settlementDate }}</span>
            </div>
            <div *ngIf="claim.financeNotes" class="finance-notes">
              <strong>Finance Notes:</strong> {{ claim.financeNotes }}
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

    .claim-details {
      margin-bottom: var(--spacing-md);
    }

    .claim-summary {
      background: var(--surface-variant);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .summary-grid {
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
      color: var(--error-600);
    }

    .diagnosis, .treatment-details {
      font-size: var(--font-size-sm);
      color: var(--on-surface);
      margin-bottom: var(--spacing-sm);
      padding-top: var(--spacing-sm);
      border-top: 1px solid var(--outline);
    }

    .patient-info {
      background: var(--info-50);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .patient-info h4 {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--info-700);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .patient-details {
      display: flex;
      gap: var(--spacing-lg);
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

    .doc-type {
      font-size: var(--font-size-xs);
      color: var(--on-surface-variant);
      background: var(--surface-variant);
      padding: 2px 6px;
      border-radius: var(--radius-sm);
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

    .coverage-verification {
      background: var(--info-50);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .coverage-verification h4 {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--info-700);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .coverage-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: var(--spacing-sm);
    }

    .coverage-item {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-sm);
    }

    .policy-type {
      font-weight: var(--font-weight-medium);
      color: var(--info-700);
    }

    .settlement-calculation {
      background: var(--success-50);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .settlement-calculation h4 {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--success-700);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .calculation-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .calc-row {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-sm);
      padding: var(--spacing-xs) 0;
    }

    .calc-row.total {
      border-top: 1px solid var(--success-200);
      margin-top: var(--spacing-sm);
      padding-top: var(--spacing-sm);
      font-weight: var(--font-weight-semibold);
    }

    .calc-value.negative {
      color: var(--error-600);
    }

    .calc-value.settlement {
      color: var(--success-700);
      font-size: var(--font-size-md);
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

    .settlement-section, .payout-section {
      margin-bottom: var(--spacing-md);
    }

    .settlement-section label, .payout-section label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
      margin-bottom: var(--spacing-xs);
    }

    .amount-input, .date-input {
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
      .summary-grid, .coverage-details {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .patient-details {
        flex-direction: column;
        gap: var(--spacing-sm);
      }
    }
  `]
})
export class MedicalApprovalsComponent implements OnInit {
  selectedFilter = 'all';
  
  claims = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      claimType: 'Hospitalization',
      claimAmount: 8500,
      treatmentDate: '2024-12-05',
      hospitalName: 'City General Hospital',
      diagnosis: 'Acute appendicitis',
      treatmentDetails: 'Emergency appendectomy surgery with 3-day hospitalization',
      patient: 'John Doe',
      relation: 'Self',
      patientAge: 35,
      policyType: 'Group Health Insurance',
      policyCoverage: 500000,
      deductible: 500,
      copayPercentage: 20,
      documents: [
        { type: 'bill', name: 'Hospital_Bill.pdf' },
        { type: 'prescription', name: 'Prescription.pdf' },
        { type: 'discharge', name: 'Discharge_Summary.pdf' },
        { type: 'lab', name: 'Lab_Reports.pdf' }
      ],
      status: 'pending',
      managerComments: 'Emergency treatment. All documents provided.',
      documentsVerified: false,
      policyActive: false,
      treatmentCovered: false,
      amountVerified: false,
      financeNotes: '',
      settlementAmount: 0,
      settlementDate: '',
      financeDate: null
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      department: 'Marketing',
      claimType: 'Outpatient',
      claimAmount: 1200,
      treatmentDate: '2024-12-08',
      hospitalName: 'Metro Clinic',
      diagnosis: 'Diabetes consultation and tests',
      treatmentDetails: 'Regular diabetes checkup with blood tests and consultation',
      patient: 'Jane Smith',
      relation: 'Self',
      patientAge: 42,
      policyType: 'Group Health Insurance',
      policyCoverage: 500000,
      deductible: 200,
      copayPercentage: 15,
      documents: [
        { type: 'bill', name: 'Clinic_Bill.pdf' },
        { type: 'prescription', name: 'Medicines.pdf' },
        { type: 'lab', name: 'Blood_Test_Report.pdf' }
      ],
      status: 'approved',
      managerComments: 'Regular checkup approved.',
      documentsVerified: true,
      policyActive: true,
      treatmentCovered: true,
      amountVerified: true,
      financeNotes: 'All verifications completed. Settlement processed.',
      settlementAmount: 850,
      settlementDate: '2024-12-15',
      financeDate: '2024-12-12'
    }
  ];

  get filteredClaims() {
    if (this.selectedFilter === 'all') {
      return this.claims;
    }
    return this.claims.filter(c => c.status === this.selectedFilter);
  }

  ngOnInit() {}

  getDocumentIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'bill': 'receipt_long',
      'prescription': 'medication',
      'discharge': 'local_hospital',
      'lab': 'science'
    };
    return icons[type] || 'description';
  }

  viewDocument(doc: any) {
    alert(`Viewing document: ${doc.name}`);
  }

  getEligibleAmount(claim: any): number {
    return Math.max(0, claim.claimAmount - claim.deductible);
  }

  getCopayAmount(claim: any): number {
    const eligible = this.getEligibleAmount(claim);
    return eligible * (claim.copayPercentage / 100);
  }

  getSettlementAmount(claim: any): number {
    const eligible = this.getEligibleAmount(claim);
    const copay = this.getCopayAmount(claim);
    return Math.max(0, eligible - copay);
  }

  canApprove(claim: any): boolean {
    return claim.documentsVerified && claim.policyActive && claim.treatmentCovered && claim.amountVerified;
  }

  approveClaim(claim: any) {
    if (!this.canApprove(claim)) {
      alert('Please complete all verification checks before approving.');
      return;
    }
    
    if (!claim.financeNotes.trim()) {
      alert('Please add finance notes before approving.');
      return;
    }
    
    if (!claim.settlementAmount || claim.settlementAmount <= 0) {
      claim.settlementAmount = this.getSettlementAmount(claim);
    }
    
    claim.status = 'approved';
    claim.financeDate = new Date().toLocaleDateString();
    alert(`Medical claim approved for ${claim.employeeName}. Settlement: $${claim.settlementAmount}`);
  }

  rejectClaim(claim: any) {
    if (!claim.financeNotes.trim()) {
      alert('Please add rejection reason in finance notes.');
      return;
    }
    
    claim.status = 'rejected';
    claim.financeDate = new Date().toLocaleDateString();
    alert(`Medical claim rejected for ${claim.employeeName}`);
  }
}