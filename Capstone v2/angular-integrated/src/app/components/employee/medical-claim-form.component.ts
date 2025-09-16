import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MedicalClaimService } from '../../services/medical-claim.service';

@Component({
  selector: 'app-medical-claim-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Medical Claim Application</h1>
        <p>Submit your medical expenses for reimbursement</p>
      </div>

      <div class="form-container">
        <form [formGroup]="claimForm" (ngSubmit)="onSubmit()" class="claim-form">
          <div class="form-row">
            <div class="form-group">
              <label for="hospitalName">Hospital/Clinic Name</label>
              <input type="text" id="hospitalName" class="form-control" formControlName="hospitalName" 
                placeholder="Enter hospital name">
              <div class="form-error" *ngIf="claimForm.get('hospitalName')?.invalid && claimForm.get('hospitalName')?.touched">
                Hospital name is required
              </div>
            </div>

            <div class="form-group">
              <label for="treatmentDate">Treatment Date</label>
              <input type="date" id="treatmentDate" class="form-control" formControlName="treatmentDate">
              <div class="form-error" *ngIf="claimForm.get('treatmentDate')?.invalid && claimForm.get('treatmentDate')?.touched">
                Treatment date is required
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="treatmentType">Treatment Type</label>
              <select id="treatmentType" class="form-control" formControlName="treatmentType">
                <option value="">Select treatment type</option>
                <option value="Consultation">Consultation</option>
                <option value="Surgery">Surgery</option>
                <option value="Emergency">Emergency</option>
                <option value="Diagnostic">Diagnostic Tests</option>
                <option value="Pharmacy">Pharmacy</option>
                <option value="Dental">Dental</option>
                <option value="Physiotherapy">Physiotherapy</option>
              </select>
              <div class="form-error" *ngIf="claimForm.get('treatmentType')?.invalid && claimForm.get('treatmentType')?.touched">
                Treatment type is required
              </div>
            </div>

            <div class="form-group">
              <label for="claimAmount">Claim Amount (₹)</label>
              <input type="number" id="claimAmount" class="form-control" formControlName="claimAmount" 
                placeholder="Enter claim amount">
              <div class="form-error" *ngIf="claimForm.get('claimAmount')?.invalid && claimForm.get('claimAmount')?.touched">
                <span *ngIf="claimForm.get('claimAmount')?.errors?.['required']">Claim amount is required</span>
                <span *ngIf="claimForm.get('claimAmount')?.errors?.['min']">Minimum amount is ₹100</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description of Treatment</label>
            <textarea id="description" class="form-control" formControlName="description" rows="3" 
              placeholder="Describe the treatment received"></textarea>
            <div class="form-error" *ngIf="claimForm.get('description')?.invalid && claimForm.get('description')?.touched">
              Description is required
            </div>
          </div>

          <div class="document-section">
            <h3>Required Documents</h3>
            <div class="document-grid">
              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Hospital Bill</span>
                  <input type="file" (change)="onFileSelect($event, 'hospitalBill')" accept=".pdf,.jpg,.png">
                </label>
                <span class="file-name" *ngIf="documents.hospitalBill">{{ documents.hospitalBill.name }}</span>
              </div>

              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Prescription</span>
                  <input type="file" (change)="onFileSelect($event, 'prescription')" accept=".pdf,.jpg,.png">
                </label>
                <span class="file-name" *ngIf="documents.prescription">{{ documents.prescription.name }}</span>
              </div>

              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Discharge Summary</span>
                  <input type="file" (change)="onFileSelect($event, 'dischargeSummary')" accept=".pdf,.jpg,.png">
                </label>
                <span class="file-name" *ngIf="documents.dischargeSummary">{{ documents.dischargeSummary.name }}</span>
              </div>

              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Lab Reports</span>
                  <input type="file" (change)="onFileSelect($event, 'labReports')" accept=".pdf,.jpg,.png">
                </label>
                <span class="file-name" *ngIf="documents.labReports">{{ documents.labReports.name }}</span>
              </div>
            </div>
          </div>

          <div class="claim-summary" *ngIf="claimForm.get('claimAmount')?.value">
            <h3>Claim Summary</h3>
            <div class="summary-details">
              <div class="summary-item">
                <span>Claim Amount:</span>
                <strong>₹{{ claimForm.get('claimAmount')?.value | number:'1.0-0' }}</strong>
              </div>
              <div class="summary-item">
                <span>Processing Fee:</span>
                <strong>₹0</strong>
              </div>
              <div class="summary-item total">
                <span>Expected Reimbursement:</span>
                <strong>₹{{ claimForm.get('claimAmount')?.value | number:'1.0-0' }}</strong>
              </div>
            </div>
            <div class="claim-note">
              <p><strong>Note:</strong> Claims are subject to policy terms and approval by management and finance team.</p>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="claimForm.invalid || isLoading">
              <span class="spinner" *ngIf="isLoading"></span>
              {{ isLoading ? 'Submitting...' : 'Submit Claim' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: var(--spacing-lg);
      max-width: 800px;
      margin: 0 auto;
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

    .claim-form {
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
      margin: 0 0 var(--spacing-lg) 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .document-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
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
      padding: var(--spacing-lg);
      border: 2px dashed var(--outline);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      min-height: 120px;
      justify-content: center;
    }

    .file-upload:hover {
      border-color: var(--primary-500);
      background: var(--primary-50);
    }

    .file-upload input {
      display: none;
    }

    .file-upload .material-icons {
      font-size: 28px;
      color: var(--primary-500);
    }

    .file-upload span:last-child {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }

    .file-name {
      font-size: var(--font-size-xs);
      color: var(--success-500);
      font-weight: var(--font-weight-medium);
      text-align: center;
      word-break: break-all;
    }

    .claim-summary {
      background: var(--surface-variant);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
    }

    .claim-summary h3 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
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

    .claim-note {
      background: var(--warning-50);
      border: 1px solid var(--warning-200);
      border-radius: var(--radius-md);
      padding: var(--spacing-md);
    }

    .claim-note p {
      margin: 0;
      font-size: var(--font-size-sm);
      color: var(--warning-800);
    }

    .form-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
      margin-top: var(--spacing-xl);
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .document-grid {
        grid-template-columns: 1fr 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }

    @media (max-width: 480px) {
      .document-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MedicalClaimFormComponent {
  claimForm: FormGroup;
  isLoading = false;
  documents: any = {};

  constructor(
    private fb: FormBuilder,
    private medicalClaimService: MedicalClaimService,
    private router: Router
  ) {
    this.claimForm = this.fb.group({
      hospitalName: ['', Validators.required],
      treatmentDate: ['', Validators.required],
      treatmentType: ['', Validators.required],
      claimAmount: ['', [Validators.required, Validators.min(100)]],
      description: ['', Validators.required]
    });
  }

  onFileSelect(event: any, documentType: string) {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) { // 5MB limit
      this.documents[documentType] = file;
    } else {
      alert('File size should be less than 5MB');
    }
  }

  onSubmit() {
    if (this.claimForm.valid) {
      this.isLoading = true;
      
      const formData = {
        ...this.claimForm.value,
        employeeId: 1 // Get from auth service
      };

      this.medicalClaimService.submitClaim(formData).subscribe({
        next: () => {
          this.isLoading = false;
          alert('Medical claim submitted successfully!');
          this.router.navigate(['/request-tracker']);
        },
        error: () => {
          this.isLoading = false;
          alert('Failed to submit medical claim. Please try again.');
        }
      });
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}