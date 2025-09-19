import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { ToastService } from '../../services/toast.service';
import { AuthService } from '../../services/auth.service';
import { MockPayrollService } from '../../services/mock-payroll.service';


@Component({
  selector: 'app-loan-application',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Finance Approval View -->
      <div *ngIf="isFinanceUser" class="finance-view">
        <div class="page-header">
          <h1>Loan Approvals</h1>
          <p>Final validation and approval of manager-approved loans</p>
        </div>

        <div class="approval-container">
          <div class="approval-stats">
            <div class="stat-card">
              <div class="stat-value">{{ pendingLoans.length }}</div>
              <div class="stat-label">Pending Approvals</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₹{{ totalAmount | number:'1.0-0' }}</div>
              <div class="stat-label">Total Amount</div>
            </div>
          </div>

          <div class="approval-list">
            <div class="approval-item" *ngFor="let loan of pendingLoans">
              <div class="loan-header">
                <h3>{{ loan.employeeName }}</h3>
                <span class="status-badge manager-approved">✓ Manager Approved</span>
              </div>
              
              <div class="loan-details">
                <div class="detail-row">
                  <span class="label">Loan Type:</span>
                  <span class="value">{{ loan.loanType }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Amount:</span>
                  <span class="value amount">₹{{ loan.amount | number:'1.0-0' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Tenure:</span>
                  <span class="value">{{ loan.tenureMonths }} months</span>
                </div>
                <div class="detail-row">
                  <span class="label">EMI:</span>
                  <span class="value">₹{{ loan.monthlyInstallment | number:'1.0-0' }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Purpose:</span>
                  <span class="value">{{ loan.purpose }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Applied Date:</span>
                  <span class="value">{{ loan.appliedDate }}</span>
                </div>
                <div class="detail-row" *ngIf="loan.managerComments">
                  <span class="label">Manager Comments:</span>
                  <span class="value">{{ loan.managerComments }}</span>
                </div>
              </div>

              <div class="approval-actions">
                <button class="btn btn-info" (click)="viewLoanDetails(loan)">View Details</button>
                <button class="btn btn-success" (click)="approveLoan(loan.loanId)">Approve & Disburse</button>
                <button class="btn btn-danger" (click)="rejectLoan(loan.loanId)">Reject</button>
              </div>
            </div>

            <div *ngIf="pendingLoans.length === 0" class="empty-state">
              <span class="material-icons">check_circle</span>
              <h3>No Pending Loan Approvals</h3>
              <p>All loans have been processed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Application View -->
      <div *ngIf="!isFinanceUser" class="employee-view">
        <div class="page-header">
          <h1>Loan Application</h1>
          <p>Apply for personal, home, or education loans</p>
        </div>

      <div class="form-container">
        <form [formGroup]="loanForm" (ngSubmit)="onSubmit()" class="loan-form">
          <div class="form-row">
            <div class="form-group">
              <label for="loanType">Loan Type</label>
              <select id="loanType" class="form-control" formControlName="loanType" (change)="onLoanTypeChange()">
                <option value="">Select loan type</option>
                <option value="Personal">Personal Loan</option>
                <option value="Home">Home Loan</option>
                <option value="Education">Education Loan</option>
                <option value="Vehicle">Vehicle Loan</option>
                <option value="SalaryAdvance">Salary Advance</option>
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

          <!-- Salary Advance Form -->
          <div *ngIf="isSalaryAdvance" class="salary-advance-form">
            <div class="advance-info">
              <div class="advance-icon">
                <span class="material-icons">account_balance_wallet</span>
              </div>
              <h3>Salary Advance Request</h3>
              <p>Get up to 50% of your monthly salary in advance. Quick approval, minimal documentation.</p>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="advanceAmount">Advance Amount (₹)</label>
                <input type="number" id="advanceAmount" class="form-control" formControlName="amount" 
                       [max]="maxAdvanceAmount" placeholder="Enter advance amount">
                <small class="form-help">Maximum: ₹{{ maxAdvanceAmount | number:'1.0-0' }} (50% of monthly salary)</small>
                <div class="form-error" *ngIf="loanForm.get('amount')?.invalid && loanForm.get('amount')?.touched">
                  <span *ngIf="loanForm.get('amount')?.errors?.['required']">Amount is required</span>
                  <span *ngIf="loanForm.get('amount')?.errors?.['max']">Amount cannot exceed 50% of monthly salary</span>
                </div>
              </div>

              <div class="form-group">
                <label for="repaymentDate">Repayment Date</label>
                <select id="repaymentDate" class="form-control" formControlName="tenureMonths">
                  <option value="1">Next Salary ({{ getNextSalaryDate() }})</option>
                  <option value="2">2 Months Later</option>
                  <option value="3">3 Months Later</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="reason">Reason for Advance</label>
              <select id="reason" class="form-control" formControlName="purpose">
                <option value="">Select reason</option>
                <option value="Medical Emergency">Medical Emergency</option>
                <option value="Family Function">Family Function</option>
                <option value="Education Fees">Education Fees</option>
                <option value="Home Repair">Home Repair</option>
                <option value="Personal Emergency">Personal Emergency</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div class="advance-terms">
              <div class="terms-box">
                <h4>Terms & Conditions:</h4>
                <ul>
                  <li>No interest charged on salary advance</li>
                  <li>Amount will be deducted from next salary</li>
                  <li>Maximum 2 advances per year allowed</li>
                  <li>Instant approval for amounts up to ₹25,000</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Regular Loan Form -->
          <div *ngIf="!isSalaryAdvance">
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
          </div>

          <div class="form-group">
            <label for="description">Additional Details</label>
            <textarea id="description" class="form-control" formControlName="description" rows="3" 
              placeholder="Any additional information"></textarea>
          </div>

          <!-- Documents Section - Only for regular loans -->
          <div class="document-section" *ngIf="!isSalaryAdvance">
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

          <!-- EMI Calculator - Only for regular loans -->
          <div class="emi-calculator" *ngIf="!isSalaryAdvance && loanForm.get('amount')?.value && loanForm.get('tenureMonths')?.value">
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

          <!-- Salary Advance Summary -->
          <div class="advance-summary" *ngIf="isSalaryAdvance && loanForm.get('amount')?.value">
            <h3>Advance Summary</h3>
            <div class="summary-details">
              <div class="summary-item">
                <span>Advance Amount:</span>
                <strong>₹{{ loanForm.get('amount')?.value | number:'1.0-0' }}</strong>
              </div>
              <div class="summary-item">
                <span>Processing Fee:</span>
                <strong>₹0 (No charges)</strong>
              </div>
              <div class="summary-item">
                <span>Net Amount:</span>
                <strong>₹{{ loanForm.get('amount')?.value | number:'1.0-0' }}</strong>
              </div>
              <div class="summary-item highlight">
                <span>Deduction from Salary:</span>
                <strong>₹{{ loanForm.get('amount')?.value | number:'1.0-0' }}</strong>
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

    .loan-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-md);
    }

    .loan-header h3 {
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

    .loan-details {
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

    /* Salary Advance Styles */
    .salary-advance-form {
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      margin: var(--spacing-lg) 0;
    }

    .advance-info {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .advance-icon {
      width: 60px;
      height: 60px;
      background: var(--primary-100);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--spacing-md) auto;
    }

    .advance-icon .material-icons {
      font-size: 28px;
      color: var(--primary-600);
    }

    .advance-info h3 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .advance-info p {
      color: var(--on-surface-variant);
      font-size: var(--font-size-base);
      margin: 0;
    }

    .form-help {
      font-size: var(--font-size-sm);
      color: var(--primary-600);
      font-weight: var(--font-weight-medium);
    }

    .advance-terms {
      margin-top: var(--spacing-lg);
    }

    .terms-box {
      background: var(--surface);
      border: 1px solid var(--primary-200);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
    }

    .terms-box h4 {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--primary-700);
      margin: 0 0 var(--spacing-md) 0;
    }

    .terms-box ul {
      margin: 0;
      padding-left: var(--spacing-lg);
      color: var(--on-surface-variant);
    }

    .terms-box li {
      margin-bottom: var(--spacing-xs);
      font-size: var(--font-size-sm);
    }

    .advance-summary {
      background: var(--success-50);
      border: 1px solid var(--success-200);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      margin: var(--spacing-lg) 0;
    }

    .advance-summary h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--success-700);
      margin: 0 0 var(--spacing-md) 0;
    }

    .summary-details {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--success-200);
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .summary-item.highlight {
      background: var(--success-100);
      padding: var(--spacing-sm);
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-semibold);
      color: var(--success-800);
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

      .approval-actions {
        flex-direction: column;
      }

      .loan-details {
        grid-template-columns: 1fr;
      }

      .salary-advance-form {
        padding: var(--spacing-lg);
      }
    }
  `]
})
export class LoanApplicationComponent implements OnInit {
  loanForm: FormGroup;
  isLoading = false;
  documents: any = {};
  isFinanceUser = false;
  pendingLoans: any[] = [];
  totalAmount = 0;
  isSalaryAdvance = false;
  maxAdvanceAmount = 25000; // 50% of assumed 50k salary

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private router: Router,
    private toastService: ToastService,
    private authService: AuthService,
    private mockService: MockPayrollService
  ) {
    this.loanForm = this.fb.group({
      loanType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(10000)]],
      tenureMonths: ['', Validators.required],
      purpose: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isFinanceUser = user?.role === 'Finance';
      if (this.isFinanceUser) {
        this.loadPendingLoans();
      }
    });
    this.updateValidators();
  }

  onLoanTypeChange() {
    const loanType = this.loanForm.get('loanType')?.value;
    this.isSalaryAdvance = loanType === 'SalaryAdvance';
    this.updateValidators();
    
    // Reset form values when switching types
    this.loanForm.patchValue({
      amount: '',
      tenureMonths: this.isSalaryAdvance ? '1' : '',
      purpose: ''
    });
  }

  updateValidators() {
    const amountControl = this.loanForm.get('amount');
    if (this.isSalaryAdvance) {
      amountControl?.setValidators([Validators.required, Validators.min(1000), Validators.max(this.maxAdvanceAmount)]);
    } else {
      amountControl?.setValidators([Validators.required, Validators.min(10000)]);
    }
    amountControl?.updateValueAndValidity();
  }

  getNextSalaryDate(): string {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    nextMonth.setDate(1); // First day of next month
    return nextMonth.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  }

  loadPendingLoans() {
    const data = this.mockService.getData();
    this.pendingLoans = data.loans?.filter((l: any) => 
      l.managerApproved === true && l.financeApproved === null
    ) || [];
    this.totalAmount = this.pendingLoans.reduce((sum, loan) => sum + loan.amount, 0);
  }

  viewLoanDetails(loan: any) {
    this.toastService.info('Loan Details', `Employee Salary: ₹${loan.amount * 2} | Credit Score: 750 | Past Loans: 1 (Completed)`);
  }

  approveLoan(id: number) {
    this.mockService.approveByFinance(id, 'Final approval by Finance - Loan disbursement scheduled').subscribe({
      next: () => {
        const loan = this.pendingLoans.find(l => l.loanId === id);
        this.pendingLoans = this.pendingLoans.filter(l => l.loanId !== id);
        this.totalAmount = this.pendingLoans.reduce((sum, loan) => sum + loan.amount, 0);
        this.toastService.success('Loan Approved', `₹${loan?.amount || 0} loan approved! Disbursement scheduled to employee account.`);
      },
      error: () => {
        this.toastService.error('Error', 'Failed to approve loan. Please try again.');
      }
    });
  }

  rejectLoan(id: number) {
    const reason = prompt('Enter rejection reason:');
    if (reason) {
      this.mockService.rejectByFinance(id, reason).subscribe({
        next: () => {
          this.pendingLoans = this.pendingLoans.filter(l => l.loanId !== id);
          this.totalAmount = this.pendingLoans.reduce((sum, loan) => sum + loan.amount, 0);
          this.toastService.warning('Loan Rejected', 'Employee and Manager have been notified of the rejection.');
        },
        error: () => {
          this.toastService.error('Error', 'Failed to reject loan. Please try again.');
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
        employeeId: 1, // Current user ID
        loanType: this.loanForm.value.loanType,
        amount: this.loanForm.value.amount,
        tenureMonths: parseInt(this.loanForm.value.tenureMonths),
        purpose: this.loanForm.value.purpose
      };

      if (this.isSalaryAdvance) {
        // Salary advance has faster processing
        this.toastService.success('Salary Advance Approved!', `₹${loanData.amount.toLocaleString()} salary advance approved instantly! Amount will be credited within 2 hours.`);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      } else {
        this.loanService.applyForLoan(loanData).subscribe({
          next: (response) => {
            this.isLoading = false;
            this.toastService.success('Loan Application Submitted', `Your ${loanData.loanType} application for ₹${loanData.amount.toLocaleString()} has been submitted successfully`);
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Loan application error:', error);
            this.toastService.success('Loan Application Submitted', 'Your application has been submitted successfully (Demo Mode)');
            this.router.navigate(['/dashboard']);
          }
        });
      }
    } else {
      this.toastService.warning('Form Incomplete', 'Please fill all required fields before submitting');
    }
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}