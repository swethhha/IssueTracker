import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../theme/shared/shared.module';
import { SpinnerComponent } from '../../theme/shared/components/spinner/spinner.component';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { LoanResponse, LoanRequest } from '../../models/loan.models';

@Component({
  selector: 'app-loan-list',
  imports: [CommonModule, RouterModule, SharedModule, ReactiveFormsModule, SpinnerComponent],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {
  loans: LoanResponse[] = [];
  loading = true;
  error: string | null = null;
  userRole: string = '';
  showForm = false;
  loanForm: FormGroup;
  submitting = false;
  selectedDocuments: { type: string; file: File }[] = [];

  constructor(
    private loanService: LoanService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.loanForm = this.fb.group({
      loanType: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1000)]],
      reason: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(6), Validators.max(60)]]
    });
  }

  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.loadLoans();
  }

  loadLoans() {
    this.loading = true;
    this.loanService.getMyLoans().subscribe({
      next: (data) => {
        this.loans = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load loans';
        this.loading = false;
        console.error('Loan error:', error);
      }
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.loanForm.reset();
    }
  }

  onSubmit() {
    if (this.loanForm.valid) {
      this.submitting = true;
      const loanRequest: LoanRequest = this.loanForm.value;
      
      this.loanService.applyForLoan(loanRequest).subscribe({
        next: () => {
          this.submitting = false;
          this.showForm = false;
          this.loanForm.reset();
          this.loadLoans();
        },
        error: (error) => {
          this.submitting = false;
          console.error('Loan application error:', error);
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'approved': return 'badge-success';
      case 'rejected': return 'badge-danger';
      case 'pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }

  canApply(): boolean {
    return this.userRole === 'Employee' || this.userRole === 'Manager';
  }

  onFileSelect(event: any, documentType: string) {
    const file = event.target.files[0];
    if (file) {
      // Remove existing document of same type
      this.selectedDocuments = this.selectedDocuments.filter(doc => doc.type !== documentType);
      
      // Add new document
      this.selectedDocuments.push({ type: documentType, file });
    }
  }

  removeDocument(index: number) {
    this.selectedDocuments.splice(index, 1);
  }
}