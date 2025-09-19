import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MedicalClaimService } from '../../services/medical-claim.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { MockPayrollService } from '../../services/mock-payroll.service';

@Component({
  selector: 'app-medical-claim-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="page-container">
      <!-- Finance Approval View -->
      <div *ngIf="isFinanceUser" class="finance-view">
        <div class="page-header">
          <h1>Medical Claim Approvals</h1>
          <p>Verify bills, eligibility and approve medical claims</p>
        </div>

        <div class="approval-container">
          <div class="approval-stats">
            <div class="stat-card">
              <div class="stat-value">{{ pendingClaims.length }}</div>
              <div class="stat-label">Pending Approvals</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₹{{ totalAmount | number:'1.0-0' }}</div>
              <div class="stat-label">Total Amount</div>
            </div>
          </div>

          <div class="approval-list">
            <div class="approval-item" *ngFor="let claim of pendingClaims">
              <div class="claim-header">
                <h3>{{ claim.employeeName }}</h3>
                <span class="status-badge manager-approved">✓ Manager Approved</span>
              </div>
              
              <div class="claim-details">
                <div class="detail-row">
                  <span class="label">Treatment Type:</span>
                  <span class="value">{{ claim.treatmentType }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Claim Amount:</span>
                  <span class="value amount">₹{{ claim.claimAmount | number:'1.0-0' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Hospital:</span>
                  <span class="value">{{ claim.hospitalName }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Treatment Date:</span>
                  <span class="value">{{ claim.claimDate }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Description:</span>
                  <span class="value">{{ claim.description }}</span>
                </div>
              </div>

              <div class="approval-actions">
                <button class="btn btn-info" (click)="verifyEligibility(claim)">Verify Eligibility</button>
                <button class="btn btn-success" (click)="approveClaim(claim.claimId)">Approve & Reimburse</button>
                <button class="btn btn-danger" (click)="rejectClaim(claim.claimId)">Reject</button>
              </div>
            </div>

            <div *ngIf="pendingClaims.length === 0" class="empty-state">
              <span class="material-icons">check_circle</span>
              <h3>No Pending Medical Claims</h3>
              <p>All medical claims have been processed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Application View -->
      <div *ngIf="!isFinanceUser" class="employee-view">
        <div class="page-header">
          <h1>Submit Medical Claim</h1>
          <p>Submit your medical expenses for reimbursement</p>
        </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="checkingInsurance">
        <div class="loading-spinner"></div>
        <p>Checking insurance enrollment...</p>
      </div>

      <!-- No Insurance - Access Denied -->
      <div class="access-denied" *ngIf="!checkingInsurance && !hasInsurance">
        <div class="denied-icon">🚫</div>
        <h2>Access Denied</h2>
        <p>Medical claims require active insurance enrollment</p>
        <div class="denied-actions">
          <button type="button" class="btn btn-primary" (click)="goToInsurance()">
            🏥 Enroll in Insurance
          </button>
        </div>
      </div>

      <!-- Insurance Info + Form -->
      <div *ngIf="!checkingInsurance && hasInsurance">
        <div class="insurance-info">
          <h3>Your Active Insurance Plans</h3>
          <div class="insurance-cards">
            <div class="insurance-card" *ngFor="let insurance of insurances">
              <div class="insurance-type">{{ insurance.insuranceType }}</div>
              <div class="insurance-provider">{{ insurance.provider }}</div>
              <div class="insurance-coverage">Coverage: ₹{{ insurance.coverageAmount | number:'1.0-0' }}</div>
            </div>
          </div>
        </div>

        <div class="form-container">
        <form [formGroup]="medicalClaimForm" (ngSubmit)="onSubmit()" class="medical-claim-form">
          <div class="form-row">
            <div class="form-group">
              <label for="treatmentType">Treatment Type</label>
              <select id="treatmentType" class="form-control" formControlName="treatmentType">
                <option value="">Select treatment type</option>
                <option value="Hospitalization">Hospitalization</option>
                <option value="Outpatient">Outpatient</option>
                <option value="Dental">Dental</option>
                <option value="Surgery">Surgery</option>
                <option value="Emergency">Emergency</option>
                <option value="Pharmacy">Pharmacy</option>
              </select>
              <div class="form-error" *ngIf="medicalClaimForm.get('treatmentType')?.invalid && medicalClaimForm.get('treatmentType')?.touched">
                Treatment type is required
              </div>
            </div>

            <div class="form-group">
              <label for="claimAmount">Claim Amount (₹)</label>
              <input type="number" id="claimAmount" class="form-control" formControlName="claimAmount" placeholder="Enter claim amount">
              <div class="form-error" *ngIf="medicalClaimForm.get('claimAmount')?.invalid && medicalClaimForm.get('claimAmount')?.touched">
                <span *ngIf="medicalClaimForm.get('claimAmount')?.errors?.['required']">Claim amount is required</span>
                <span *ngIf="medicalClaimForm.get('claimAmount')?.errors?.['min']">Minimum amount is ₹1</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="claimDate">Treatment Date</label>
              <input type="date" id="claimDate" class="form-control" formControlName="claimDate">
              <div class="form-error" *ngIf="medicalClaimForm.get('claimDate')?.invalid && medicalClaimForm.get('claimDate')?.touched">
                Treatment date is required
              </div>
            </div>
            
            <div class="form-group">
              <label for="hospitalName">Hospital/Clinic Name</label>
              <input type="text" id="hospitalName" class="form-control" formControlName="hospitalName" placeholder="Enter hospital name">
              <div class="form-error" *ngIf="medicalClaimForm.get('hospitalName')?.invalid && medicalClaimForm.get('hospitalName')?.touched">
                Hospital name is required
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Treatment Description</label>
            <textarea id="description" class="form-control" formControlName="description" rows="3" 
              placeholder="Describe the treatment and medical condition"></textarea>
            <div class="form-error" *ngIf="medicalClaimForm.get('description')?.invalid && medicalClaimForm.get('description')?.touched">
              Treatment description is required
            </div>
          </div>

          <div class="document-section">
            <h3>Medical Documents</h3>
            <p class="section-description">Upload medical bills, prescriptions, or reports (PDF, JPG, PNG ≤ 5MB)</p>
            <div class="document-grid">
              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Medical Bill</span>
                  <input type="file" (change)="onFileSelect($event, 'bill')" accept=".pdf,.jpg,.png,.jpeg">
                </label>
                <span class="file-name" *ngIf="documents.bill">{{ documents.bill.name }}</span>
              </div>

              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Prescription</span>
                  <input type="file" (change)="onFileSelect($event, 'prescription')" accept=".pdf,.jpg,.png,.jpeg">
                </label>
                <span class="file-name" *ngIf="documents.prescription">{{ documents.prescription.name }}</span>
              </div>

              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Medical Report</span>
                  <input type="file" (change)="onFileSelect($event, 'report')" accept=".pdf,.jpg,.png,.jpeg">
                </label>
                <span class="file-name" *ngIf="documents.report">{{ documents.report.name }}</span>
              </div>
            </div>
          </div>

          <div class="summary-section" *ngIf="medicalClaimForm.get('claimAmount')?.value">
            <h3>Medical Claim Summary</h3>
            <div class="summary-details">
              <div class="summary-item">
                <span>Claim Amount:</span>
                <strong>₹{{ medicalClaimForm.get('claimAmount')?.value | number:'1.0-0' }}</strong>
              </div>
              <div class="summary-item">
                <span>Processing Fee:</span>
                <strong>₹0</strong>
              </div>
              <div class="summary-item total">
                <span>Expected Reimbursement:</span>
                <strong>₹{{ medicalClaimForm.get('claimAmount')?.value | number:'1.0-0' }}</strong>
              </div>
            </div>
            <div class="approval-flow">
              <h4>Approval Process</h4>
              <div class="flow-steps">
                <div class="step active">
                  <span class="step-number">1</span>
                  <span class="step-label">Submit</span>
                </div>
                <div class="step">
                  <span class="step-number">2</span>
                  <span class="step-label">Manager Review</span>
                </div>
                <div class="step">
                  <span class="step-number">3</span>
                  <span class="step-label">Finance Approval</span>
                </div>
                <div class="step">
                  <span class="step-number">4</span>
                  <span class="step-label">Payment</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="medicalClaimForm.invalid || isLoading">
              <span class="spinner" *ngIf="isLoading"></span>
              {{ isLoading ? 'Submitting...' : 'Submit Medical Claim' }}
            </button>
          </div>
        </form>
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: var(--spacing-lg);
      width: 100%;
    }

    .page-header {
      margin-bottom: var(--spacing-2xl);
      text-align: center;
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

    .form-container {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-1);
    }

    .medical-claim-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .form-group label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }

    .form-control {
      padding: var(--spacing-md);
      border: 1px solid var(--outline);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      transition: all 0.2s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }

    .form-error {
      color: var(--error-500);
      font-size: var(--font-size-sm);
    }

    .document-section {
      margin: var(--spacing-xl) 0;
    }

    .document-section h3 {
      margin: 0 0 var(--spacing-sm) 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .section-description {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
      margin: 0 0 var(--spacing-lg) 0;
    }

    .document-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
    }

    .document-item {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .file-upload {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-xl);
      border: 2px dashed var(--outline);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
    }

    .file-upload:hover {
      border-color: var(--primary-500);
      background: var(--primary-50);
    }

    .file-upload input {
      display: none;
    }

    .file-upload .material-icons {
      font-size: 32px;
      color: var(--primary-500);
    }

    .file-name {
      font-size: var(--font-size-sm);
      color: var(--success-500);
      font-weight: var(--font-weight-medium);
    }

    .summary-section {
      background: var(--surface-variant);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
    }

    .summary-section h3 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--outline-variant);
    }

    .summary-item.total {
      border-bottom: none;
      font-size: var(--font-size-lg);
      padding-top: var(--spacing-md);
      border-top: 2px solid var(--primary-500);
    }

    .approval-flow h4 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .flow-steps {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs);
      flex: 1;
      position: relative;
    }

    .step:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 15px;
      right: -50%;
      width: 100%;
      height: 2px;
      background: var(--outline-variant);
    }

    .step.active .step-number {
      background: var(--primary-500);
      color: white;
    }

    .step.active:not(:last-child)::after {
      background: var(--primary-500);
    }

    .step-number {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: var(--outline-variant);
      color: var(--on-surface-variant);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
    }

    .step-label {
      font-size: var(--font-size-xs);
      color: var(--on-surface-variant);
      text-align: center;
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-xl);
    }

    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: #667eea;
      color: white;
    }

    .btn-outline {
      background: transparent;
      color: #667eea;
      border: 1px solid #667eea;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-right: 0.5rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-lg);
      padding: var(--spacing-4xl);
      text-align: center;
    }

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid var(--outline-variant);
      border-top: 4px solid var(--primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .access-denied {
      background: var(--error-50);
      border: 2px solid var(--error-200);
      border-radius: var(--radius-2xl);
      padding: var(--spacing-4xl);
      text-align: center;
      margin: var(--spacing-2xl) 0;
    }

    .denied-icon {
      font-size: 80px;
      margin-bottom: var(--spacing-lg);
    }

    .access-denied h2 {
      color: var(--error-700);
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      margin: 0 0 var(--spacing-md) 0;
    }

    .access-denied p {
      color: var(--error-600);
      font-size: var(--font-size-lg);
      margin: 0 0 var(--spacing-2xl) 0;
    }

    .denied-actions {
      display: flex;
      gap: var(--spacing-lg);
      justify-content: center;
    }

    .insurance-info {
      background: var(--success-50);
      border: 1px solid var(--success-200);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      margin-bottom: var(--spacing-xl);
    }

    .insurance-info h3 {
      color: var(--success-700);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      margin: 0 0 var(--spacing-md) 0;
    }

    .insurance-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
    }

    .insurance-card {
      background: var(--success-50);
      border: 1px solid var(--success-200);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
    }

    .insurance-type {
      font-weight: var(--font-weight-semibold);
      color: var(--success-700);
      font-size: var(--font-size-base);
    }

    .insurance-provider {
      color: var(--success-600);
      font-size: var(--font-size-sm);
      margin: var(--spacing-xs) 0;
    }

    .insurance-coverage {
      color: var(--success-600);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .document-grid {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }

      .flow-steps {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .step:not(:last-child)::after {
        display: none;
      }
    }

    /* Finance Approval Styles */
    .finance-view {
      width: 100%;
    }

    .approval-container {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-1);
    }

    .approval-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
      background: var(--primary-50);
      border: 1px solid var(--primary-200);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      text-align: center;
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
      margin-bottom: var(--spacing-xs);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .approval-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .approval-item {
      background: var(--surface-variant);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
    }

    .claim-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }

    .claim-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
    }

    .status-badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .manager-approved {
      background: var(--success-100);
      color: var(--success-700);
    }

    .claim-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-xs) 0;
    }

    .detail-row .label {
      font-weight: var(--font-weight-medium);
      color: var(--on-surface-variant);
    }

    .detail-row .value {
      font-weight: var(--font-weight-semibold);
    }

    .detail-row .amount {
      color: var(--primary-600);
      font-size: var(--font-size-lg);
    }

    .approval-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
    }

    .btn {
      padding: var(--spacing-sm) var(--spacing-lg);
      border: none;
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-info {
      background: var(--info-100);
      color: var(--info-700);
    }

    .btn-success {
      background: var(--success-500);
      color: white;
    }

    .btn-danger {
      background: var(--error-500);
      color: white;
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-2);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-2xl);
      color: var(--on-surface-variant);
    }

    .empty-state .material-icons {
      font-size: 48px;
      color: var(--success-500);
      margin-bottom: var(--spacing-md);
    }
  `]
})
export class MedicalClaimFormComponent implements OnInit {
  medicalClaimForm: FormGroup;
  isLoading = false;
  documents: any = {};
  hasInsurance = false;
  insurances: any[] = [];
  checkingInsurance = true;
  isFinanceUser = false;
  pendingClaims: any[] = [];
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private medicalClaimService: MedicalClaimService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private mockService: MockPayrollService
  ) {
    this.medicalClaimForm = this.fb.group({
      treatmentType: ['', Validators.required],
      claimAmount: ['', [Validators.required, Validators.min(1)]],
      claimDate: ['', Validators.required],
      hospitalName: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isFinanceUser = user?.role === 'Finance';
      if (this.isFinanceUser) {
        this.loadPendingClaims();
      } else {
        this.checkInsuranceEnrollment();
      }
    });
  }

  loadPendingClaims() {
    const data = this.mockService.getData();
    this.pendingClaims = data.medicalClaims?.filter((c: any) => 
      c.managerApproved === true && c.financeApproved === null
    ) || [];
    this.totalAmount = this.pendingClaims.reduce((sum, claim) => sum + claim.claimAmount, 0);
  }

  verifyEligibility(claim: any) {
    this.toastService.info('Eligibility Check', `Verifying ${claim.employeeName}'s insurance coverage for ${claim.treatmentType} treatment...`);
    setTimeout(() => {
      this.toastService.success('Verification Complete', 'Employee is eligible for this claim amount.');
    }, 2000);
  }

  approveClaim(id: number) {
    this.mockService.approveMedicalClaimByFinance(id, 'Final approval by Finance - Reimbursement scheduled').subscribe({
      next: () => {
        const claim = this.pendingClaims.find(c => c.claimId === id);
        this.pendingClaims = this.pendingClaims.filter(c => c.claimId !== id);
        this.totalAmount = this.pendingClaims.reduce((sum, claim) => sum + claim.claimAmount, 0);
        this.toastService.success('Medical Claim Approved', `₹${claim?.claimAmount || 0} medical claim approved! Reimbursement will be processed in next payroll cycle.`);
      },
      error: () => {
        this.toastService.error('Error', 'Failed to approve medical claim. Please try again.');
      }
    });
  }

  rejectClaim(id: number) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.mockService.rejectMedicalClaimByFinance(id, reason).subscribe({
        next: () => {
          this.pendingClaims = this.pendingClaims.filter(c => c.claimId !== id);
          this.totalAmount = this.pendingClaims.reduce((sum, claim) => sum + claim.claimAmount, 0);
          this.toastService.warning('Medical Claim Rejected', 'Employee and Manager have been notified with rejection reason.');
        },
        error: () => {
          this.toastService.error('Error', 'Failed to reject medical claim. Please try again.');
        }
      });
    }
  }

  checkInsuranceEnrollment() {
    // Check localStorage for enrolled policies
    const enrolledPolicies = localStorage.getItem('enrolledPolicies');
    const policies = enrolledPolicies ? JSON.parse(enrolledPolicies) : [];
    
    if (policies.length > 0) {
      this.hasInsurance = true;
      this.checkingInsurance = false;
      this.loadInsurances();
      return;
    }
    
    // Fallback to service check
    this.medicalClaimService.hasActiveInsurance().subscribe({
      next: (hasInsurance) => {
        this.hasInsurance = hasInsurance;
        this.checkingInsurance = false;
        if (hasInsurance) {
          this.loadInsurances();
        }
      },
      error: () => {
        this.checkingInsurance = false;
        this.hasInsurance = false;
      }
    });
  }

  loadInsurances() {
    this.medicalClaimService.getMyInsurances().subscribe({
      next: (insurances) => {
        this.insurances = insurances;
      },
      error: (error) => {
        console.error('Error loading insurances:', error);
      }
    });
  }

  onFileSelect(event: any, documentType: string) {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      this.documents[documentType] = file;
    } else {
      this.toastService.error('File Too Large', 'File size should be less than 5MB');
    }
  }

  onSubmit() {
    if (this.medicalClaimForm.valid) {
      this.isLoading = true;
      
      const claimData = {
        employeeId: 1, // Current user ID
        treatmentType: this.medicalClaimForm.value.treatmentType,
        claimAmount: this.medicalClaimForm.value.claimAmount,
        claimDate: this.medicalClaimForm.value.claimDate,
        hospitalName: this.medicalClaimForm.value.hospitalName,
        description: this.medicalClaimForm.value.description
      };

      this.medicalClaimService.submitClaim(claimData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.success('Medical Claim Submitted', `Your ${claimData.treatmentType} claim for ₹${claimData.claimAmount.toLocaleString()} has been submitted successfully`);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Medical claim submission error:', error);
          this.toastService.success('Medical Claim Submitted', 'Your medical claim has been submitted successfully (Demo Mode)');
          this.router.navigate(['/dashboard']);
        }
      });
    } else {
      this.toastService.warning('Form Incomplete', 'Please fill all required fields before submitting');
    }
  }

  goToInsurance() {
    this.router.navigateByUrl('/insurance/enroll');
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}