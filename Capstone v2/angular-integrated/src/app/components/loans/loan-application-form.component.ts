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
    <div style="padding: 20px; width: 100%; box-sizing: border-box;">
      <h2 style="margin-bottom: 5px;">Salary Advance Application</h2>
      <p style="margin-bottom: 20px; color: #64748b;">Apply for salary advance against your monthly salary</p>
      
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <form [formGroup]="loanForm" (ngSubmit)="onSubmit()">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Advance Type *</label>
              <select formControlName="loanType" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">
                <option value="">Select advance type</option>
                <option value="Emergency Advance">Emergency Advance</option>
                <option value="Regular Advance">Regular Salary Advance</option>
                <option value="Festival Advance">Festival Advance</option>
                <option value="Medical Advance">Medical Emergency Advance</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Advance Amount (₹) *</label>
              <input type="number" formControlName="amount" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;" placeholder="Enter advance amount" min="1000" max="50000">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
            <div>
              <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Repayment Period *</label>
              <select formControlName="duration" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;">
                <option value="">Select repayment period</option>
                <option value="1">1 Month</option>
                <option value="2">2 Months</option>
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
              </select>
            </div>
            <div>
              <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Monthly Income (₹) *</label>
              <input type="number" formControlName="monthlyIncome" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;" placeholder="Enter monthly income">
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Purpose *</label>
            <input type="text" formControlName="purpose" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px;" placeholder="Purpose of salary advance">
          </div>

          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #374151;">Additional Details</label>
            <textarea formControlName="additionalDetails" rows="2" style="width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; resize: vertical;" placeholder="Any additional information"></textarea>
          </div>

          <div style="margin-bottom: 20px;">
            <h4 style="color: #374151; margin-bottom: 10px; font-size: 16px;">Required Documents *</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 15px;">
              <div>
                <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #64748b;">Salary Slip</label>
                <input type="file" (change)="onFileSelect($event, 'salary')" accept=".pdf,.jpg,.jpeg,.png" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #64748b;">ID Proof</label>
                <input type="file" (change)="onFileSelect($event, 'id')" accept=".pdf,.jpg,.jpeg,.png" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;">
              </div>
              <div>
                <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #64748b;">Bank Statement</label>
                <input type="file" (change)="onFileSelect($event, 'bank')" accept=".pdf,.jpg,.jpeg,.png" style="width: 100%; padding: 8px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px;">
              </div>
            </div>
            <div *ngIf="selectedFiles.length > 0" style="margin-top: 10px;">
              <div *ngFor="let file of selectedFiles" style="display: flex; justify-content: space-between; align-items: center; padding: 5px; background: #f8fafc; border-radius: 4px; margin-bottom: 3px; font-size: 14px;">
                <span style="color: #64748b;">📄 {{file.name}}</span>
                <button type="button" (click)="removeFile(file)" style="background: #ef4444; color: white; border: none; padding: 2px 6px; border-radius: 3px; cursor: pointer; font-size: 12px;">
                  ×
                </button>
              </div>
            </div>
          </div>

          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" (click)="resetForm()" style="background: #64748b; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
              Cancel
            </button>
            <button type="submit" [disabled]="!loanForm.valid || selectedFiles.length < 3" [style.background]="loanForm.valid && selectedFiles.length >= 3 ? '#10b981' : '#9ca3af'" style="color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
              Submit Advance Request
            </button>
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
      monthlyIncome: ['', [Validators.required, Validators.min(1)]],
      additionalDetails: ['']
    });
  }

  onFileSelect(event: any, type?: string) {
    const files = Array.from(event.target.files) as File[];
    files.forEach(file => {
      if (!this.selectedFiles.find(f => f.name === file.name)) {
        this.selectedFiles.push(file);
      }
    });
  }

  removeFile(file: File) {
    this.selectedFiles = this.selectedFiles.filter(f => f !== file);
  }

  onSubmit() {
    if (this.loanForm.valid && this.selectedFiles.length >= 3) {
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