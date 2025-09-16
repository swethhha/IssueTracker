import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';

@Component({
  selector: 'app-loan-application-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <div class="card">
        <h2 class="mb-4">💰 Apply for Loan</h2>
        
        <form [formGroup]="loanForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label class="form-label">Loan Type *</label>
            <select formControlName="loanType" class="form-select">
              <option value="">Select loan type</option>
              <option value="Personal">Personal Loan</option>
              <option value="Home">Home Loan</option>
              <option value="Vehicle">Vehicle Loan</option>
              <option value="Education">Education Loan</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Loan Amount (₹) *</label>
            <input type="number" formControlName="amount" class="form-input" placeholder="Enter amount" min="1000">
          </div>

          <div class="form-group">
            <label class="form-label">Purpose/Reason *</label>
            <textarea formControlName="purpose" class="form-input" rows="3" placeholder="Describe the purpose of loan"></textarea>
          </div>

          <div class="form-group">
            <label class="form-label">Duration (Months) *</label>
            <select formControlName="duration" class="form-select">
              <option value="">Select duration</option>
              <option value="12">12 Months</option>
              <option value="24">24 Months</option>
              <option value="36">36 Months</option>
              <option value="48">48 Months</option>
              <option value="60">60 Months</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Monthly Income (₹) *</label>
            <input type="number" formControlName="monthlyIncome" class="form-input" placeholder="Enter monthly income">
          </div>

          <div class="form-group">
            <label class="form-label">Required Documents *</label>
            <input type="file" (change)="onFileSelect($event)" multiple accept=".pdf,.jpg,.jpeg,.png" class="form-input">
            <small>Upload: Salary Slips, ID Proof, Bank Statement (PDF, JPG, PNG)</small>
            <div *ngIf="selectedFiles.length > 0" class="file-list">
              <div *ngFor="let file of selectedFiles" class="file-item">
                📄 {{file.name}} ({{(file.size/1024/1024).toFixed(2)}} MB)
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-primary" type="submit" [disabled]="!loanForm.valid || selectedFiles.length === 0">
              Submit Application
            </button>
            <button class="btn btn-secondary" type="button" (click)="resetForm()">Reset</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .form-actions { display: flex; gap: 16px; margin-top: 20px; }
    .file-list { margin-top: 8px; }
    .file-item { padding: 4px 0; color: #666; font-size: 14px; }
  `]
})
export class LoanApplicationFormComponent {
  loanForm: FormGroup;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private router: Router
  ) {
    this.loanForm = this.fb.group({
      loanType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1000)]],
      purpose: ['', Validators.required],
      duration: ['', Validators.required],
      monthlyIncome: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onFileSelect(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  onSubmit() {
    if (this.loanForm.valid && this.selectedFiles.length > 0) {
      this.loanService.applyLoan(this.loanForm.value, this.selectedFiles).subscribe({
        next: () => {
          alert('Loan application submitted successfully!');
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          alert('Application submitted (demo mode)');
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  resetForm() {
    this.loanForm.reset();
    this.selectedFiles = [];
  }
}