import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReimbursementService } from '../../services/reimbursement.service';
import { AuthService } from '../../services/auth.service';
import { ReimbursementResponse, ReimbursementRequest } from '../../models/reimbursement.models';
import { EmployeeRole } from '../../models/auth.models';

@Component({
  selector: 'app-reimbursement-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `


    <div class="row">
      <!-- Request Reimbursement Card (Employee Only) -->
      <div class="col-xl-12" *ngIf="isEmployee()">
        <div class="card">
          <div class="card-header">
            <h5>Request Reimbursement</h5>
          </div>
          <div class="card-block">
            <form [formGroup]="reimbursementForm" (ngSubmit)="onSubmit()">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Category</label>
                    <select class="form-control" formControlName="category">
                      <option value="">Select Category</option>
                      <option value="Travel">Travel</option>
                      <option value="Food">Food</option>
                      <option value="Medical">Medical</option>
                      <option value="Office Supplies">Office Supplies</option>
                      <option value="Training">Training</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label>Amount</label>
                    <input 
                      type="number" 
                      class="form-control" 
                      formControlName="amount"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Description</label>
                <textarea 
                  class="form-control" 
                  formControlName="description"
                  placeholder="Enter description"
                  rows="3"
                ></textarea>
              </div>
              <div class="form-group">
                <label><i class="feather icon-paperclip me-2"></i>Upload Supporting Documents (Receipts, Bills)</label>
                <input 
                  type="file" 
                  class="form-control" 
                  id="documents"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  (change)="onFileSelect($event)"
                />
                <small class="text-muted">Required: Upload receipts or bills (PDF, JPG, PNG, DOC, DOCX - Max 5MB each)</small>
                <div *ngIf="selectedFiles.length > 0" class="mt-2">
                  <div *ngFor="let file of selectedFiles" class="d-flex align-items-center mb-1">
                    <i class="feather icon-file me-2"></i>
                    <span class="me-2">{{ file.name }}</span>
                    <button type="button" class="btn btn-sm btn-outline-danger" (click)="removeFile(file)">
                      <i class="feather icon-x"></i>
                    </button>
                  </div>
                </div>
              </div>
              <button 
                type="submit" 
                class="btn btn-primary"
                [disabled]="reimbursementForm.invalid || isSubmitting"
              >
                <span *ngIf="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ isSubmitting ? 'Submitting...' : 'Request Reimbursement' }}
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Reimbursements List -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h5>{{ isEmployee() ? 'My Reimbursements' : 'All Reimbursements' }}</h5>
          </div>
          <div class="card-block table-border-style">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th *ngIf="!isEmployee()">Employee</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Request Date</th>
                    <th *ngIf="canApprove()">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let reimbursement of reimbursements">
                    <td>{{ reimbursement.id }}</td>
                    <td *ngIf="!isEmployee()">{{ reimbursement.employeeName }}</td>
                    <td>{{ reimbursement.category }}</td>
                    <td>{{ reimbursement.amount | currency }}</td>
                    <td>{{ reimbursement.description }}</td>
                    <td>
                      <span 
                        class="badge"
                        [class.badge-success]="reimbursement.status === 'Approved'"
                        [class.badge-warning]="reimbursement.status === 'Pending'"
                        [class.badge-danger]="reimbursement.status === 'Rejected'"
                      >
                        {{ reimbursement.status }}
                      </span>
                    </td>
                    <td>{{ reimbursement.requestDate | date:'shortDate' }}</td>
                    <td *ngIf="canApprove()">
                      <div class="btn-group" *ngIf="reimbursement.status === 'Pending'">
                        <button 
                          class="btn btn-sm btn-success"
                          (click)="approve(reimbursement.id)"
                          [disabled]="isProcessing"
                        >
                          <i class="feather icon-check"></i> Approve
                        </button>
                        <button 
                          class="btn btn-sm btn-danger"
                          (click)="reject(reimbursement.id)"
                          [disabled]="isProcessing"
                        >
                          <i class="feather icon-x"></i> Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr *ngIf="reimbursements.length === 0">
                    <td [attr.colspan]="isEmployee() ? 6 : (canApprove() ? 8 : 7)" class="text-center">
                      No reimbursement records found
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .table th {
      border-top: none;
      font-weight: 600;
    }
    .badge {
      font-size: 0.75rem;
    }
    .btn-group .btn {
      margin-right: 5px;
    }
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class ReimbursementListComponent implements OnInit {
  reimbursements: ReimbursementResponse[] = [];
  reimbursementForm: FormGroup;
  isSubmitting = false;
  isProcessing = false;
  selectedFiles: File[] = [];

  constructor(
    private reimbursementService: ReimbursementService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.reimbursementForm = this.fb.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadReimbursements();
  }

  loadReimbursements(): void {
    this.reimbursementService.getMyReimbursements().subscribe({
      next: (data: ReimbursementResponse[]) => {
        this.reimbursements = data;
        console.log('Loaded reimbursements:', data);
      },
      error: (error: any) => {
        console.error('Error loading reimbursements:', error);
        this.reimbursements = [];
      }
    });
  }

  onSubmit(): void {
    if (this.reimbursementForm.valid) {
      this.isSubmitting = true;
      
      const request: ReimbursementRequest = {
        ...this.reimbursementForm.value,
        employeeId: this.authService.getCurrentUser()?.id || 0,
        requestDate: new Date(),
        documentPaths: []
      };
      
      this.reimbursementService.requestReimbursement(request).subscribe({
        next: () => {
          this.reimbursementForm.reset();
          this.selectedFiles = [];
          this.loadReimbursements();
          this.isSubmitting = false;
        },
        error: (error) => {
          console.error('Error requesting reimbursement:', error);
          this.isSubmitting = false;
        }
      });
    }
  }

  approve(reimbursementId: number): void {
    this.isProcessing = true;
    this.reimbursementService.approveByManager(reimbursementId).subscribe({
      next: () => {
        this.loadReimbursements();
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error approving reimbursement:', error);
        this.isProcessing = false;
      }
    });
  }

  reject(reimbursementId: number): void {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.isProcessing = true;
      this.reimbursementService.rejectByManager(reimbursementId, reason).subscribe({
        next: () => {
          this.loadReimbursements();
          this.isProcessing = false;
        },
        error: (error) => {
          console.error('Error rejecting reimbursement:', error);
          this.isProcessing = false;
        }
      });
    }
  }

  isEmployee(): boolean {
    return this.authService.hasRole(EmployeeRole.Employee);
  }

  canApprove(): boolean {
    return this.authService.hasAnyRole([EmployeeRole.Manager, EmployeeRole.FinanceAdmin]);
  }

  onFileSelect(event: any): void {
    const files = Array.from(event.target.files) as File[];
    for (const file of files) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        this.selectedFiles.push(file);
      } else {
        alert(`File ${file.name} is too large. Maximum size is 5MB.`);
      }
    }
  }

  removeFile(fileToRemove: File): void {
    this.selectedFiles = this.selectedFiles.filter(file => file !== fileToRemove);
  }
}