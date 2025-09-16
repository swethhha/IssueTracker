import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementService } from '../../services/reimbursement.service';

@Component({
  selector: 'app-reimbursement-request',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="padding: 20px; width: 100%; margin: 0;">
      <h2>Submit Reimbursement Request</h2>
      <p>Submit your expense reimbursement with receipts</p>
      
      <div style="width: 100%;">
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <form [formGroup]="reimbursementForm" (ngSubmit)="onSubmit()">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Reimbursement Request Form</h3>
          </div>
          
          <div class="card-body space-y-6">
            <!-- Category -->
            <div class="form-group">
              <label class="form-label required">Category</label>
              <select formControlName="category" class="form-select">
                <option value="">Select category</option>
                <option value="Travel">Travel & Transportation</option>
                <option value="Meals">Meals & Entertainment</option>
                <option value="Medical">Medical Expenses</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Training">Training & Development</option>
                <option value="Communication">Communication</option>
                <option value="Fuel">Fuel & Vehicle</option>
                <option value="Other">Other</option>
              </select>
              <div *ngIf="reimbursementForm.get('category')?.invalid && reimbursementForm.get('category')?.touched" 
                   class="text-xs text-error-600 mt-1">
                Category is required
              </div>
            </div>

            <!-- Amount -->
            <div class="form-group">
              <label class="form-label required">Amount (₹)</label>
              <input type="number" formControlName="amount" class="form-input" 
                     placeholder="Enter expense amount" min="1" max="50000" step="0.01">
              <div *ngIf="reimbursementForm.get('amount')?.invalid && reimbursementForm.get('amount')?.touched" 
                   class="text-xs text-error-600 mt-1">
                <span *ngIf="reimbursementForm.get('amount')?.errors?.['required']">Amount is required</span>
                <span *ngIf="reimbursementForm.get('amount')?.errors?.['min']">Amount must be greater than 0</span>
                <span *ngIf="reimbursementForm.get('amount')?.errors?.['max']">Maximum amount is ₹50,000</span>
              </div>
            </div>

            <!-- Expense Date -->
            <div class="form-group">
              <label class="form-label required">Expense Date</label>
              <input type="date" formControlName="expenseDate" class="form-input" 
                     [max]="maxDate">
              <div *ngIf="reimbursementForm.get('expenseDate')?.invalid && reimbursementForm.get('expenseDate')?.touched" 
                   class="text-xs text-error-600 mt-1">
                Expense date is required
              </div>
            </div>

            <!-- Description -->
            <div class="form-group">
              <label class="form-label required">Description</label>
              <textarea formControlName="description" class="form-textarea" rows="3"
                        placeholder="Provide detailed description of the expense"></textarea>
              <div *ngIf="reimbursementForm.get('description')?.invalid && reimbursementForm.get('description')?.touched" 
                   class="text-xs text-error-600 mt-1">
                Description is required
              </div>
            </div>

            <!-- Receipt Upload Section -->
            <div class="border-t pt-6">
              <h4 class="text-lg font-medium text-gray-900 mb-4">Upload Receipts</h4>
              
              <div class="form-group">
                <label class="form-label required">Receipt/Invoice</label>
                <input type="file" (change)="onFileSelect($event)" 
                       accept=".pdf,.jpg,.jpeg,.png" multiple class="form-input">
                <p class="text-xs text-gray-500 mt-1">
                  Upload PDF, JPG, or PNG files (Max 5MB each, up to 5 files)
                </p>
                
                <!-- Selected Files Display -->
                <div *ngIf="selectedFiles.length > 0" class="mt-3 space-y-2">
                  <div *ngFor="let file of selectedFiles; let i = index" 
                       class="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                    <div class="flex items-center gap-2">
                      <i class="fas fa-file text-gray-400"></i>
                      <span class="text-sm text-gray-700">{{file.name}}</span>
                      <span class="text-xs text-gray-500">({{formatFileSize(file.size)}})</span>
                    </div>
                    <button type="button" (click)="removeFile(i)" 
                            class="text-error-600 hover:text-error-700">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Policy Guidelines -->
            <div class="bg-info-50 border border-info-200 rounded-lg p-4">
              <h4 class="text-sm font-medium text-info-900 mb-2">
                <i class="fas fa-info-circle mr-2"></i>Reimbursement Guidelines
              </h4>
              <ul class="text-xs text-info-800 space-y-1">
                <li>• Submit requests within 30 days of expense</li>
                <li>• Original receipts/invoices are mandatory</li>
                <li>• Business purpose must be clearly mentioned</li>
                <li>• Manager approval required for amounts above ₹5,000</li>
                <li>• Finance approval required for all reimbursements</li>
              </ul>
            </div>

            <!-- Terms and Conditions -->
            <div class="form-group">
              <label class="flex items-start gap-2">
                <input type="checkbox" formControlName="acceptTerms" class="mt-1">
                <span class="text-sm text-gray-700">
                  I certify that this expense was incurred for legitimate business purposes and 
                  I have attached valid receipts/invoices for the claimed amount.
                </span>
              </label>
              <div *ngIf="reimbursementForm.get('acceptTerms')?.invalid && reimbursementForm.get('acceptTerms')?.touched" 
                   class="text-xs text-error-600 mt-1">
                You must certify the expense details
              </div>
            </div>
          </div>

          <div class="card-footer card-footer-actions">
            <button type="button" (click)="goBack()" class="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" [disabled]="reimbursementForm.invalid || selectedFiles.length === 0 || isSubmitting" 
                    class="btn btn-primary">
              <span *ngIf="isSubmitting" class="animate-spin mr-2">⏳</span>
              {{isSubmitting ? 'Submitting...' : 'Submit Request'}}
            </button>
          </div>
        </form>
        </div>

        <!-- Category Limits Information -->
        <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-top: 30px;">
          <div class="card-header">
            <h3 class="text-lg font-semibold text-gray-900">Category Limits & Processing Time</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Monthly Limits</h4>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-600">Travel & Transportation:</span>
                    <span class="font-medium">₹15,000</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Meals & Entertainment:</span>
                    <span class="font-medium">₹8,000</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Medical Expenses:</span>
                    <span class="font-medium">₹25,000</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Office Supplies:</span>
                    <span class="font-medium">₹5,000</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-600">Training & Development:</span>
                    <span class="font-medium">₹20,000</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 class="font-medium text-gray-900 mb-3">Processing Time</h4>
                <div class="space-y-2 text-sm text-gray-600">
                  <p>• Manager review: 1-2 business days</p>
                  <p>• Finance verification: 2-3 business days</p>
                  <p>• Payment processing: 3-5 business days</p>
                  <p>• Total time: 6-10 business days</p>
                </div>
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
    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
    .space-y-1 > * + * {
      margin-top: 0.25rem;
    }
    
    /* Responsive grid fix */
    .grid {
      display: grid;
    }
    .grid-cols-1 {
      grid-template-columns: repeat(1, minmax(0, 1fr));
    }
    @media (min-width: 768px) {
      .md\:grid-cols-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }
    .gap-6 {
      gap: 1.5rem;
    }
  `]
})
export class ReimbursementRequestComponent implements OnInit {
  reimbursementForm: FormGroup;
  isSubmitting = false;
  selectedFiles: File[] = [];
  maxDate: string;

  constructor(
    private fb: FormBuilder,
    private reimbursementService: ReimbursementService,
    private router: Router
  ) {
    this.reimbursementForm = this.fb.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1), Validators.max(50000)]],
      expenseDate: ['', Validators.required],
      description: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });

    // Set max date to today
    this.maxDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    // Set default expense date to today
    this.reimbursementForm.patchValue({
      expenseDate: this.maxDate
    });
  }

  onFileSelect(event: any) {
    const files = Array.from(event.target.files) as File[];
    
    for (const file of files) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }
      
      // Check if we already have 5 files
      if (this.selectedFiles.length >= 5) {
        alert('Maximum 5 files allowed');
        break;
      }
      
      // Check if file already exists
      if (!this.selectedFiles.find(f => f.name === file.name)) {
        this.selectedFiles.push(file);
      }
    }
    
    // Clear the input
    event.target.value = '';
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async onSubmit() {
    if (this.reimbursementForm.valid && this.selectedFiles.length > 0) {
      this.isSubmitting = true;
      
      try {
        const formData = new FormData();
        
        // Add form fields
        Object.keys(this.reimbursementForm.value).forEach(key => {
          if (key !== 'acceptTerms') {
            formData.append(key, this.reimbursementForm.value[key]);
          }
        });

        // Add files
        this.selectedFiles.forEach((file, index) => {
          formData.append(`receipts`, file);
        });

        await this.reimbursementService.requestReimbursement(formData as any).toPromise();
        
        alert('Reimbursement request submitted successfully!');
        this.router.navigate(['/reimbursements']);
        
      } catch (error) {
        console.error('Error submitting reimbursement request:', error);
        alert('Error submitting request. Please try again.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      this.markFormGroupTouched();
      if (this.selectedFiles.length === 0) {
        alert('Please upload at least one receipt');
      }
    }
  }

  private markFormGroupTouched() {
    Object.keys(this.reimbursementForm.controls).forEach(key => {
      this.reimbursementForm.get(key)?.markAsTouched();
    });
  }

  goBack() {
    this.router.navigate(['/reimbursements']);
  }
}