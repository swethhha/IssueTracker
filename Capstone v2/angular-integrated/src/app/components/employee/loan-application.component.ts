import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Loan Application</h1>
        <p>Apply for personal, home, or education loans</p>
      </div>

      <div class="form-container">
        <form [formGroup]="loanForm" (ngSubmit)="onSubmit()" class="loan-form">
          <div class="form-row">
            <div class="form-group">
              <label for="loanType">Loan Type</label>
              <select id="loanType" class="form-control" formControlName="loanType">
                <option value="">Select loan type</option>
                <option value="Personal">Personal Loan</option>
                <option value="Home">Home Loan</option>
                <option value="Education">Education Loan</option>
                <option value="Vehicle">Vehicle Loan</option>
              </select>
              <div class="form-error" *ngIf="loanForm.get('loanType')?.invalid && loanForm.get('loanType')?.touched">
                Loan type is required
              </div>
            </div>

            <div class="form-group">
              <label for="amount">Loan Amount (₹)</label>
              <input type="number" id="amount" class="form-control" formControlName="amount" placeholder="Enter amount">
              <div class="form-error" *ngIf="loanForm.get('amount')?.invalid && loanForm.get('amount')?.touched">
                <span *ngIf="loanForm.get('amount')?.errors?.['required']">Amount is required</span>
                <span *ngIf="loanForm.get('amount')?.errors?.['min']">Minimum amount is ₹10,000</span>
              </div>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="tenure">Tenure (Months)</label>
              <select id="tenure" class="form-control" formControlName="tenureMonths">
                <option value="">Select tenure</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="48">48 Months</option>
                <option value="60">60 Months</option>
              </select>
              <div class="form-error" *ngIf="loanForm.get('tenureMonths')?.invalid && loanForm.get('tenureMonths')?.touched">
                Tenure is required
              </div>
            </div>

            <div class="form-group">
              <label for="purpose">Purpose</label>
              <input type="text" id="purpose" class="form-control" formControlName="purpose" placeholder="Purpose of loan">
              <div class="form-error" *ngIf="loanForm.get('purpose')?.invalid && loanForm.get('purpose')?.touched">
                Purpose is required
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="description">Additional Details</label>
            <textarea id="description" class="form-control" formControlName="description" rows="3" 
              placeholder="Any additional information"></textarea>
          </div>

          <div class="document-section">
            <h3>Required Documents</h3>
            <div class="document-grid">
              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Salary Slip</span>
                  <input type="file" (change)="onFileSelect($event, 'salarySlip')" accept=".pdf,.jpg,.png">
                </label>
                <span class="file-name" *ngIf="documents.salarySlip">{{ documents.salarySlip.name }}</span>
              </div>

              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>ID Proof</span>
                  <input type="file" (change)="onFileSelect($event, 'idProof')" accept=".pdf,.jpg,.png">
                </label>
                <span class="file-name" *ngIf="documents.idProof">{{ documents.idProof.name }}</span>
              </div>

              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Bank Statement</span>
                  <input type="file" (change)="onFileSelect($event, 'bankStatement')" accept=".pdf,.jpg,.png">
                </label>
                <span class="file-name" *ngIf="documents.bankStatement">{{ documents.bankStatement.name }}</span>
              </div>
            </div>
          </div>

          <div class="emi-calculator" *ngIf="loanForm.get('amount')?.value && loanForm.get('tenureMonths')?.value">
            <h3>EMI Calculator</h3>
            <div class="emi-details">
              <div class="emi-item">
                <span>Monthly EMI:</span>
                <strong>₹{{ calculateEMI() | number:'1.0-0' }}</strong>
              </div>
              <div class="emi-item">
                <span>Total Interest:</span>
                <strong>₹{{ calculateTotalInterest() | number:'1.0-0' }}</strong>
              </div>
              <div class="emi-item">
                <span>Total Amount:</span>
                <strong>₹{{ calculateTotalAmount() | number:'1.0-0' }}</strong>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="loanForm.invalid || isLoading">
              <span class="spinner" *ngIf="isLoading"></span>
              {{ isLoading ? 'Submitting...' : 'Submit Application' }}
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

    .loan-form {
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

    .emi-calculator {
      background: var(--surface-variant);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
    }

    .emi-calculator h3 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .emi-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .emi-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--outline-variant);
    }

    .emi-item:last-child {
      border-bottom: none;
      font-size: var(--font-size-lg);
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
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class LoanApplicationComponent {
  loanForm: FormGroup;
  isLoading = false;
  documents: any = {};

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private router: Router
  ) {
    this.loanForm = this.fb.group({
      loanType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(10000)]],
      tenureMonths: ['', Validators.required],
      purpose: ['', Validators.required],
      description: ['']
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

  calculateEMI(): number {
    const amount = this.loanForm.get('amount')?.value;
    const tenure = this.loanForm.get('tenureMonths')?.value;
    if (!amount || !tenure) return 0;

    const rate = 0.12 / 12; // 12% annual rate
    return (amount * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
  }

  calculateTotalInterest(): number {
    const emi = this.calculateEMI();
    const tenure = this.loanForm.get('tenureMonths')?.value;
    const amount = this.loanForm.get('amount')?.value;
    return (emi * tenure) - amount;
  }

  calculateTotalAmount(): number {
    const emi = this.calculateEMI();
    const tenure = this.loanForm.get('tenureMonths')?.value;
    return emi * tenure;
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.isLoading = true;
      
      const loanData = {
        loanType: this.loanForm.value.loanType,
        amount: this.loanForm.value.amount,
        tenureMonths: parseInt(this.loanForm.value.tenureMonths),
        purpose: this.loanForm.value.purpose,
        documentPaths: []
      };

      this.loanService.applyForLoan(loanData).subscribe({
        next: (response) => {
          this.isLoading = false;
          alert('Loan application submitted successfully!');
          this.router.navigate(['/employee/requests']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Loan submission error:', error);
          alert('Failed to submit loan application: ' + (error.error?.message || error.message || 'Please try again.'));
        }
      });
    } else {
      alert('Please fill all required fields.');
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}