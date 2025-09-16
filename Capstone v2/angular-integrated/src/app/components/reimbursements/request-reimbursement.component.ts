import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ReimbursementService } from '../../services/reimbursement.service';
import { ReimbursementRequest } from '../../models/reimbursement.models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-request-reimbursement',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="row">
      <!-- Request Reimbursement Card -->
      <div class="col-xl-12">
        <div class="card gradient-card">
          <div class="card-header bg-primary text-white">
            <h5 class="mb-0"><i class="feather icon-plus-circle me-2"></i>Request Reimbursement</h5>
          </div>
          <div class="card-block p-4" style="background: white;">
            <form [formGroup]="reimbursementForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <input 
                      type="number" 
                      class="form-control" 
                      id="amount"
                      formControlName="amount"
                      placeholder="0.00"
                      [class.is-invalid]="reimbursementForm.get('amount')?.invalid && reimbursementForm.get('amount')?.touched"
                    />
                    <label for="amount"><i class="feather icon-dollar-sign me-2"></i>Amount (₹)</label>
                    <div class="invalid-feedback" *ngIf="reimbursementForm.get('amount')?.invalid && reimbursementForm.get('amount')?.touched">
                      Amount is required
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <select 
                      class="form-control" 
                      id="category"
                      formControlName="category"
                      [class.is-invalid]="reimbursementForm.get('category')?.invalid && reimbursementForm.get('category')?.touched"
                    >
                      <option value="">Select Category</option>
                      <option value="Travel">Travel</option>
                      <option value="Medical">Medical</option>
                      <option value="Food">Food & Entertainment</option>
                      <option value="Training">Training & Development</option>
                      <option value="Office">Office Supplies</option>
                      <option value="Others">Others</option>
                    </select>
                    <label for="category"><i class="feather icon-tag me-2"></i>Category</label>
                    <div class="invalid-feedback" *ngIf="reimbursementForm.get('category')?.invalid && reimbursementForm.get('category')?.touched">
                      Category is required
                    </div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="form-floating mb-3">
                    <input 
                      type="date" 
                      class="form-control" 
                      id="expenseDate"
                      formControlName="expenseDate"
                    />
                    <label for="expenseDate"><i class="feather icon-calendar me-2"></i>Expense Date</label>
                  </div>
                </div>
              </div>

          <div class="form-group">
            <label>Description *</label>
            <textarea formControlName="description" class="form-control" rows="4" 
                      placeholder="Provide detailed description of the expense"></textarea>
            <div class="error" *ngIf="reimbursementForm.get('description')?.invalid && reimbursementForm.get('description')?.touched">
              Description is required
            </div>
          </div>

          <div class="form-group">
            <label>Attachments</label>
            <div class="file-upload">
              <input type="file" #fileInput (change)="onFileSelect($event)" multiple accept=".pdf,.jpg,.jpeg,.png">
              <div class="upload-area" (click)="fileInput.click()">
                <i class="feather icon-upload"></i>
                <p>Click to upload receipts or drag and drop</p>
                <small>PDF, JPG, PNG files up to 5MB each</small>
              </div>
            </div>
            <div class="file-list" *ngIf="selectedFiles.length > 0">
              <div class="file-item" *ngFor="let file of selectedFiles; let i = index">
                <i class="feather icon-file"></i>
                <span>{{ file.name }}</span>
                <button type="button" (click)="removeFile(i)" class="btn-remove">
                  <i class="feather icon-x"></i>
                </button>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" routerLink="/reimbursements">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="reimbursementForm.invalid || isSubmitting">
              <i class="feather icon-send" *ngIf="!isSubmitting"></i>
              <i class="feather icon-loader rotating" *ngIf="isSubmitting"></i>
              {{ isSubmitting ? 'Submitting...' : 'Submit Request' }}
            </button>
          </div>
        </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gradient-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .row {
      margin-bottom: 24px;
    }

    .form-group {
      margin-bottom: 24px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #4a5568;
    }

    .form-control {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s ease;
    }

    .form-control:focus {
      outline: none;
      border-color: #4299e1;
      box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
    }

    .error {
      color: #e53e3e;
      font-size: 12px;
      margin-top: 4px;
    }

    .file-upload {
      margin-top: 8px;
    }

    .upload-area {
      border: 2px dashed #cbd5e0;
      border-radius: 8px;
      padding: 32px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .upload-area:hover {
      border-color: #4299e1;
      background: #f7fafc;
    }

    .upload-area i {
      font-size: 32px;
      color: #a0aec0;
      margin-bottom: 12px;
    }

    .upload-area p {
      margin: 0 0 4px 0;
      color: #4a5568;
      font-weight: 500;
    }

    .upload-area small {
      color: #718096;
    }

    .file-list {
      margin-top: 16px;
    }

    .file-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      background: #f7fafc;
      border-radius: 6px;
      margin-bottom: 8px;
    }

    .file-item i {
      margin-right: 8px;
      color: #4299e1;
    }

    .file-item span {
      flex: 1;
      font-size: 14px;
      color: #2d3748;
    }

    .btn-remove {
      background: none;
      border: none;
      color: #e53e3e;
      cursor: pointer;
      padding: 4px;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e2e8f0;
    }

    .btn {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
    }

    .btn-primary {
      background: #4299e1;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #3182ce;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #e2e8f0;
      color: #4a5568;
    }

    .btn-secondary:hover {
      background: #cbd5e0;
    }

    .rotating {
      animation: rotate 1s linear infinite;
    }

    @keyframes rotate {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class RequestReimbursementComponent implements OnInit {
  reimbursementForm: FormGroup;
  selectedFiles: File[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private reimbursementService: ReimbursementService
  ) {
    this.reimbursementForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      category: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      expenseDate: [new Date().toISOString().split('T')[0], Validators.required]
    });
  }

  ngOnInit(): void {}

  onFileSelect(event: any): void {
    const files = Array.from(event.target.files) as File[];
    this.selectedFiles = [...this.selectedFiles, ...files];
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(): void {
    if (this.reimbursementForm.valid) {
      this.isSubmitting = true;
      
      const request: ReimbursementRequest = {
        employeeId: 1,
        category: this.reimbursementForm.get('category')?.value,
        amount: Number(this.reimbursementForm.get('amount')?.value),
        description: this.reimbursementForm.get('description')?.value,
        requestDate: new Date(),
        documentPaths: this.selectedFiles.map(f => f.name)
      };
      
      console.log('=== FRONTEND DEBUG ===');
      console.log('Request payload:', JSON.stringify(request, null, 2));
      console.log('API URL:', `${environment.apiBaseUrl}/Reimbursements/request`);
      console.log('HTTP Method: POST');
      console.log('========================');

      this.reimbursementService.requestReimbursement(request).subscribe({
        next: (response) => {
          console.log('=== BACKEND RESPONSE ===');
          console.log('Response:', JSON.stringify(response, null, 2));
          console.log('Response type:', typeof response);
          console.log('Response has ID?', response?.id || 'NO ID RETURNED');
          console.log('=======================');
          this.isSubmitting = false;
          this.reimbursementForm.reset();
          this.selectedFiles = [];
          alert('Reimbursement request submitted successfully!');
        },
        error: (error) => {
          console.error('Full error object:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Backend error details:', error.error);
          this.isSubmitting = false;
          alert(`Error: ${error.error?.message || error.message || 'Please try again'}`);
        }
      });
    }
  }
}