import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="standardized-layout">
      <div class="page-header">
        <h1 class="page-title">Loan Application</h1>
        <p class="page-description">Apply for personal, home, or education loans</p>
      </div>

      <div class="w-full">
        <form [formGroup]="loanForm" (ngSubmit)="onSubmit()" class="card">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Loan Application Form</h3>
          </div>
          
          <div class="card-body space-y-6">
            <!-- Loan Type -->
            <div class="form-group">
              <label class="form-label required">Loan Type</label>
              <select formControlName="loanType" class="form-select">
                <option value="">Select loan type</option>
                <option value="Personal">Personal Loan</option>
                <option value="Education">Education Loan</option>
                <option value="Medical">Medical Loan</option>
                <option value="Emergency">Emergency Loan</option>
                <option value="Home">Home Loan</option>
              </select>
              <div *ngIf="loanForm.get('loanType')?.invalid && loanForm.get('loanType')?.touched" 
                   class="text-xs text-error-600 mt-1">
                Loan type is required
              </div>
            </div>

            <!-- Amount -->
            <div class="form-group">
              <label class="form-label required">Loan Amount (₹)</label>
              <input type="number" formControlName="amount" class="form-input" 
                     placeholder="Enter amount" min="1000" max="1000000">
              <div *ngIf="loanForm.get('amount')?.invalid && loanForm.get('amount')?.touched" 
                   class="text-xs text-error-600 mt-1">
                <span *ngIf="loanForm.get('amount')?.errors?.['required']">Amount is required</span>
                <span *ngIf="loanForm.get('amount')?.errors?.['min']">Minimum amount is ₹1,000</span>
                <span *ngIf="loanForm.get('amount')?.errors?.['max']">Maximum amount is ₹10,00,000</span>
              </div>
            </div>

            <!-- Tenure -->
            <div class="form-group">
              <label class="form-label required">Tenure (Months)</label>
              <select formControlName="tenureMonths" class="form-select">
                <option value="">Select tenure</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="18">18 Months</option>
                <option value="24">24 Months</option>
                <option value="36">36 Months</option>
                <option value="48">48 Months</option>
                <option value="60">60 Months</option>
              </select>
              <div *ngIf="loanForm.get('tenureMonths')?.invalid && loanForm.get('tenureMonths')?.touched" 
                   class="text-xs text-error-600 mt-1">
                Tenure is required
              </div>
            </div>

            <!-- Purpose -->
            <div class="form-group">
              <label class="form-label required">Purpose</label>
              <textarea formControlName="purpose" class="form-textarea" rows="3"
                        placeholder="Purpose of loan"></textarea>
              <div *ngIf="loanForm.get('purpose')?.invalid && loanForm.get('purpose')?.touched" 
                   class="text-xs text-error-600 mt-1">
                Purpose is required
              </div>
            </div>

            <!-- Document Upload Section -->
            <div class="border-t pt-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Required Documents</h4>
              
              <!-- Aadhaar Card -->
              <div class="form-group">
                <label class="form-label required">Aadhaar Card</label>
                <input type="file" (change)="onFileSelect($event, 'aadhaar')" 
                       accept=".pdf,.jpg,.jpeg,.png" class="form-input">
                <p class="text-xs text-gray-500 mt-1">Upload PDF, JPG, or PNG (Max 5MB)</p>
                <div *ngIf="selectedFiles.aadhaar" class="mt-2">
                  <span class="badge badge-success">{{selectedFiles.aadhaar.name}}</span>
                </div>
              </div>

              <!-- PAN Card -->
              <div class="form-group">
                <label class="form-label required">PAN Card</label>
                <input type="file" (change)="onFileSelect($event, 'pan')" 
                       accept=".pdf,.jpg,.jpeg,.png" class="form-input">
                <p class="text-xs text-gray-500 mt-1">Upload PDF, JPG, or PNG (Max 5MB)</p>
                <div *ngIf="selectedFiles.pan" class="mt-2">
                  <span class="badge badge-success">{{selectedFiles.pan.name}}</span>
                </div>
              </div>

              <!-- Salary Slip -->
              <div class="form-group">
                <label class="form-label required">Latest Salary Slip</label>
                <input type="file" (change)="onFileSelect($event, 'salarySlip')" 
                       accept=".pdf,.jpg,.jpeg,.png" class="form-input">
                <p class="text-xs text-gray-500 mt-1">Upload PDF, JPG, or PNG (Max 5MB)</p>
                <div *ngIf="selectedFiles.salarySlip" class="mt-2">
                  <span class="badge badge-success">{{selectedFiles.salarySlip.name}}</span>
                </div>
              </div>

              <!-- Bank Statement -->
              <div class="form-group">
                <label class="form-label required">Bank Statement (Last 3 months)</label>
                <input type="file" (change)="onFileSelect($event, 'bankStatement')" 
                       accept=".pdf" class="form-input">
                <p class="text-xs text-gray-500 mt-1">Upload PDF only (Max 5MB)</p>
                <div *ngIf="selectedFiles.bankStatement" class="mt-2">
                  <span class="badge badge-success">{{selectedFiles.bankStatement.name}}</span>
                </div>
              </div>
            </div>

            <!-- EMI Calculation Display -->
            <div *ngIf="calculatedEMI > 0" class="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-primary-900 mb-2">Estimated EMI</h4>
              <p class="text-2xl font-bold text-primary-600">₹{{calculatedEMI | number:'1.0-0'}}</p>
              <p class="text-xs text-primary-700 mt-1">
                Interest Rate: {{interestRate}}% per annum
              </p>
            </div>

            <!-- Terms and Conditions -->
            <div class="form-group">
              <label class="flex items-start gap-2">
                <input type="checkbox" formControlName="acceptTerms" class="mt-1">
                <span class="text-sm text-gray-700">
                  I agree to the <a href="#" class="text-primary-600 hover:underline">terms and conditions</a> 
                  and understand that this loan application is subject to approval by management and finance team.
                </span>
              </label>
              <div *ngIf="loanForm.get('acceptTerms')?.invalid && loanForm.get('acceptTerms')?.touched" 
                   class="text-xs text-error-600 mt-1">
                You must accept the terms and conditions
              </div>
            </div>
          </div>

          <div class="card-footer card-footer-actions">
            <button type="button" (click)="goBack()" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" [disabled]="loanForm.invalid || isSubmitting" 
                    class="btn btn-primary">
              <span *ngIf="isSubmitting" class="animate-spin mr-2">⏳</span>
              {{isSubmitting ? 'Submitting...' : 'Submit Application'}}
            </button>
          </div>
        </form>

        <!-- Loan Information Card -->
        <div class="card mt-6">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Loan Information</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Processing Time</h4>
                <p class="text-gray-600">• Manager approval: 2-3 business days</p>
                <p class="text-gray-600">• Finance verification: 3-5 business days</p>
                <p class="text-gray-600">• Disbursement: 1-2 business days</p>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 mb-2">Interest Rates</h4>
                <p class="text-gray-600">• Personal: 12-15% per annum</p>
                <p class="text-gray-600">• Education: 10-12% per annum</p>
                <p class="text-gray-600">• Medical: 8-10% per annum</p>
                <p class="text-gray-600">• Emergency: 15-18% per annum</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .space-y-6 > * + * {
      margin-top: 1.5rem;
    }
  `]
})
export class LoanApplicationComponent implements OnInit {
  loanForm: FormGroup;
  isSubmitting = false;
  calculatedEMI = 0;
  interestRate = 12;
  
  selectedFiles = {
    aadhaar: null as File | null,
    pan: null as File | null,
    salarySlip: null as File | null,
    bankStatement: null as File | null
  };

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.loanForm = this.fb.group({
      loanType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1000), Validators.max(1000000)]],
      tenureMonths: ['', Validators.required],
      purpose: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }

  ngOnInit() {
    // Watch for changes to calculate EMI
    this.loanForm.valueChanges.subscribe(() => {
      this.calculateEMI();
    });
  }

  onFileSelect(event: any, documentType: keyof typeof this.selectedFiles) {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.toastService.error('File Too Large', 'File size should not exceed 5MB');
        return;
      }
      
      this.selectedFiles[documentType] = file;
    }
  }

  calculateEMI() {
    const amount = this.loanForm.get('amount')?.value;
    const tenure = this.loanForm.get('tenureMonths')?.value;
    const loanType = this.loanForm.get('loanType')?.value;

    if (amount && tenure && loanType) {
      // Set interest rate based on loan type
      switch (loanType) {
        case 'Personal':
          this.interestRate = 14;
          break;
        case 'Education':
          this.interestRate = 11;
          break;
        case 'Medical':
          this.interestRate = 9;
          break;
        case 'Emergency':
          this.interestRate = 16;
          break;
        case 'Home':
          this.interestRate = 8.5;
          break;
        default:
          this.interestRate = 12;
      }

      // Calculate EMI using formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
      const principal = parseFloat(amount);
      const monthlyRate = this.interestRate / 100 / 12;
      const numPayments = parseInt(tenure);

      if (monthlyRate > 0) {
        const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                   (Math.pow(1 + monthlyRate, numPayments) - 1);
        this.calculatedEMI = Math.round(emi);
      } else {
        this.calculatedEMI = principal / numPayments;
      }
    } else {
      this.calculatedEMI = 0;
    }
  }

  async onSubmit() {
    if (this.loanForm.valid && this.areAllDocumentsUploaded()) {
      this.isSubmitting = true;
      
      try {
        const formData = new FormData();
        
        // Add form fields
        Object.keys(this.loanForm.value).forEach(key => {
          if (key !== 'acceptTerms') {
            formData.append(key, this.loanForm.value[key]);
          }
        });

        // Add documents
        Object.entries(this.selectedFiles).forEach(([key, file]) => {
          if (file) {
            formData.append(key, file);
          }
        });

        await this.loanService.applyForLoan(formData as any).toPromise();
        
        this.toastService.success('Application Submitted', 'Loan application submitted successfully! You will be notified once reviewed.');
        this.router.navigate(['/loans']);
        
      } catch (error) {
        console.error('Error submitting loan application:', error);
        this.toastService.error('Submission Failed', 'Error submitting application. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
      if (!this.areAllDocumentsUploaded()) {
        this.toastService.warning('Documents Required', 'Please upload all required documents before submitting.');
      }
    }
  }

  private areAllDocumentsUploaded(): boolean {
    return Object.values(this.selectedFiles).every(file => file !== null);
  }

  private markFormGroupTouched() {
    Object.keys(this.loanForm.controls).forEach(key => {
      this.loanForm.get(key)?.markAsTouched();
    });
  }

  goBack() {
    this.router.navigate(['/loans']);
  }
}