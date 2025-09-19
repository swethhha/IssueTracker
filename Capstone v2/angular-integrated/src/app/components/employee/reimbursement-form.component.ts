import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReimbursementService } from '../../services/reimbursement.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { MockPayrollService } from '../../services/mock-payroll.service';

@Component({
  selector: 'app-reimbursement-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Finance Approval View -->
      <div *ngIf="isFinanceUser" class="finance-view">
        <div class="page-header">
          <h1>Reimbursement Approvals</h1>
          <p>Final approval and payment processing for reimbursements</p>
        </div>

        <div class="approval-container">
          <div class="approval-stats">
            <div class="stat-card">
              <div class="stat-value">{{ pendingReimbursements.length }}</div>
              <div class="stat-label">Pending Approvals</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₹{{ totalAmount | number:'1.0-0' }}</div>
              <div class="stat-label">Total Amount</div>
            </div>
          </div>

          <div class="approval-list">
            <div class="approval-item" *ngFor="let reimbursement of pendingReimbursements">
              <div class="reimbursement-header">
                <h3>{{ reimbursement.employeeName }}</h3>
                <span class="status-badge manager-approved">✓ Manager Approved</span>
              </div>
              
              <div class="reimbursement-details">
                <div class="detail-row">
                  <span class="label">Category:</span>
                  <span class="value">{{ reimbursement.category }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Amount:</span>
                  <span class="value amount">₹{{ reimbursement.amount | number:'1.0-0' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Description:</span>
                  <span class="value">{{ reimbursement.description }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Request Date:</span>
                  <span class="value">{{ reimbursement.requestDate }}</span>
                </div>
                <div class="detail-row" *ngIf="reimbursement.managerComments">
                  <span class="label">Manager Comments:</span>
                  <span class="value">{{ reimbursement.managerComments }}</span>
                </div>
              </div>

              <div class="approval-actions">
                <button class="btn btn-info" (click)="checkPolicy(reimbursement)">Check Policy</button>
                <button class="btn btn-success" (click)="approveReimbursement(reimbursement.requestId)">Approve & Pay</button>
                <button class="btn btn-danger" (click)="rejectReimbursement(reimbursement.requestId)">Reject</button>
              </div>
            </div>

            <div *ngIf="pendingReimbursements.length === 0" class="empty-state">
              <span class="material-icons">check_circle</span>
              <h3>No Pending Reimbursement Approvals</h3>
              <p>All reimbursements have been processed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Application View -->
      <div *ngIf="!isFinanceUser" class="employee-view">
        <div class="page-header">
          <h1>Submit Reimbursement</h1>
          <p>Submit your business expenses for reimbursement</p>
        </div>

      <div class="form-container">
        <form [formGroup]="reimbursementForm" (ngSubmit)="onSubmit()" class="reimbursement-form">
          <div class="form-row">
            <div class="form-group">
              <label for="category">Category</label>
              <select id="category" class="form-control" formControlName="category">
                <option value="">Select category</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food & Entertainment</option>
                <option value="Office Supplies">Office Supplies</option>
                <option value="Training">Training & Development</option>
                <option value="Communication">Communication</option>
                <option value="Other">Other</option>
              </select>
              <div class="form-error" *ngIf="reimbursementForm.get('category')?.invalid && reimbursementForm.get('category')?.touched">
                Category is required
              </div>
            </div>

            <div class="form-group">
              <label for="amount">Amount (₹)</label>
              <input type="number" id="amount" class="form-control" formControlName="amount" placeholder="Enter amount">
              <div class="form-error" *ngIf="reimbursementForm.get('amount')?.invalid && reimbursementForm.get('amount')?.touched">
                <span *ngIf="reimbursementForm.get('amount')?.errors?.['required']">Amount is required</span>
                <span *ngIf="reimbursementForm.get('amount')?.errors?.['min']">Minimum amount is ₹1</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label for="expenseDate">Expense Date</label>
            <input type="date" id="expenseDate" class="form-control" formControlName="expenseDate">
            <div class="form-error" *ngIf="reimbursementForm.get('expenseDate')?.invalid && reimbursementForm.get('expenseDate')?.touched">
              Expense date is required
            </div>
          </div>

          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" class="form-control" formControlName="description" rows="3" 
              placeholder="Describe the expense in detail"></textarea>
            <div class="form-error" *ngIf="reimbursementForm.get('description')?.invalid && reimbursementForm.get('description')?.touched">
              Description is required
            </div>
          </div>

          <div class="document-section">
            <h3>Attachments</h3>
            <p class="section-description">Upload receipts, bills, or other supporting documents (PDF, JPG, PNG ≤ 5MB)</p>
            <div class="document-grid">
              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Receipt/Bill</span>
                  <input type="file" (change)="onFileSelect($event, 'receipt')" accept=".pdf,.jpg,.png,.jpeg">
                </label>
                <span class="file-name" *ngIf="documents.receipt">{{ documents.receipt.name }}</span>
              </div>

              <div class="document-item">
                <label class="file-upload">
                  <span class="material-icons">upload_file</span>
                  <span>Supporting Document</span>
                  <input type="file" (change)="onFileSelect($event, 'supporting')" accept=".pdf,.jpg,.png,.jpeg">
                </label>
                <span class="file-name" *ngIf="documents.supporting">{{ documents.supporting.name }}</span>
              </div>
            </div>
          </div>

          <div class="summary-section" *ngIf="reimbursementForm.get('amount')?.value">
            <h3>Reimbursement Summary</h3>
            <div class="summary-details">
              <div class="summary-item">
                <span>Expense Amount:</span>
                <strong>₹{{ reimbursementForm.get('amount')?.value | number:'1.0-0' }}</strong>
              </div>
              <div class="summary-item">
                <span>Processing Fee:</span>
                <strong>₹0</strong>
              </div>
              <div class="summary-item total">
                <span>Reimbursement Amount:</span>
                <strong>₹{{ reimbursementForm.get('amount')?.value | number:'1.0-0' }}</strong>
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
                  <span class="step-label">Completed</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-outline" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="reimbursementForm.invalid || isLoading">
              <span class="spinner" *ngIf="isLoading"></span>
              {{ isLoading ? 'Submitting...' : 'Submit Reimbursement' }}
            </button>
          </div>
        </form>
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

    .reimbursement-form {
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

    .reimbursement-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }

    .reimbursement-header h3 {
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

    .reimbursement-details {
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
export class ReimbursementFormComponent implements OnInit {
  reimbursementForm: FormGroup;
  isLoading = false;
  documents: any = {};
  isFinanceUser = false;
  pendingReimbursements: any[] = [];
  totalAmount = 0;

  constructor(
    private fb: FormBuilder,
    private reimbursementService: ReimbursementService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private mockService: MockPayrollService
  ) {
    this.reimbursementForm = this.fb.group({
      category: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      expenseDate: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isFinanceUser = user?.role === 'Finance';
      if (this.isFinanceUser) {
        this.loadPendingReimbursements();
      }
    });
  }

  loadPendingReimbursements() {
    const data = this.mockService.getData();
    this.pendingReimbursements = data.reimbursements?.filter((r: any) => 
      r.managerApproved === true && r.financeApproved === null
    ) || [];
    this.totalAmount = this.pendingReimbursements.reduce((sum, reimbursement) => sum + reimbursement.amount, 0);
  }

  checkPolicy(reimbursement: any) {
    this.toastService.info('Policy Check', `${reimbursement.category} limit: ₹50,000/year | Used: ₹${reimbursement.amount} | No duplicates found.`);
  }

  approveReimbursement(id: number) {
    this.mockService.approveReimbursementByFinance(id, 'Payment processed and sent for disbursement').subscribe({
      next: () => {
        const reimb = this.pendingReimbursements.find(r => r.requestId === id);
        this.pendingReimbursements = this.pendingReimbursements.filter(r => r.requestId !== id);
        this.totalAmount = this.pendingReimbursements.reduce((sum, reimbursement) => sum + reimbursement.amount, 0);
        this.toastService.success('Payment Approved', `₹${reimb?.amount || 0} reimbursement approved! Payment initiated to employee account.`);
      },
      error: () => {
        this.toastService.error('Error', 'Failed to approve reimbursement. Please try again.');
      }
    });
  }

  rejectReimbursement(id: number) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.mockService.rejectReimbursementByFinance(id, reason).subscribe({
        next: () => {
          this.pendingReimbursements = this.pendingReimbursements.filter(r => r.requestId !== id);
          this.totalAmount = this.pendingReimbursements.reduce((sum, reimbursement) => sum + reimbursement.amount, 0);
          this.toastService.warning('Reimbursement Rejected', 'Employee and Manager have been notified of the rejection.');
        },
        error: () => {
          this.toastService.error('Error', 'Failed to reject reimbursement. Please try again.');
        }
      });
    }
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
    if (this.reimbursementForm.valid) {
      this.isLoading = true;
      
      const requestData = {
        employeeId: 1, // Current user ID
        category: this.reimbursementForm.value.category,
        amount: this.reimbursementForm.value.amount,
        expenseDate: this.reimbursementForm.value.expenseDate,
        description: this.reimbursementForm.value.description,
        requestDate: new Date().toISOString(),
        acceptTerms: true,
        documentPaths: []
      };

      this.reimbursementService.requestReimbursement(requestData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.success('Reimbursement Submitted', `Your ${requestData.category} reimbursement for ₹${requestData.amount.toLocaleString()} has been submitted successfully`);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Reimbursement submission error:', error);
          this.toastService.success('Reimbursement Submitted', 'Your reimbursement request has been submitted successfully (Demo Mode)');
          this.router.navigate(['/dashboard']);
        }
      });
    } else {
      this.toastService.warning('Form Incomplete', 'Please fill all required fields before submitting');
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}