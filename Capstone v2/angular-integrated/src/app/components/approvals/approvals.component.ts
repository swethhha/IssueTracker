import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayrollService } from '../../services/payroll.service';
import { LoanService } from '../../services/loan.service';
import { ReimbursementService } from '../../services/reimbursement.service';
import { InsuranceService } from '../../services/insurance.service';
import { MedicalClaimService } from '../../services/medical-claim.service';
import { AuthService } from '../../services/auth.service';
import { EmployeeRole } from '../../models/auth.models';

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="row">
      <!-- Pending Approvals Summary -->
      <div class="col-xl-12 mb-4">
        <div class="card">
          <div class="card-header">
            <h5><i class="feather icon-clock me-2"></i>Pending Approvals Summary</h5>
          </div>
          <div class="card-block">
            <div class="row">
              <div class="col-md-2">
                <div class="text-center p-3 border rounded">
                  <h3 class="text-warning">{{ pendingPayroll }}</h3>
                  <small>Payroll</small>
                </div>
              </div>
              <div class="col-md-2">
                <div class="text-center p-3 border rounded">
                  <h3 class="text-info">{{ pendingLoans }}</h3>
                  <small>Loans</small>
                </div>
              </div>
              <div class="col-md-2">
                <div class="text-center p-3 border rounded">
                  <h3 class="text-success">{{ pendingReimbursements }}</h3>
                  <small>Reimbursements</small>
                </div>
              </div>
              <div class="col-md-2">
                <div class="text-center p-3 border rounded">
                  <h3 class="text-primary">{{ pendingInsurance }}</h3>
                  <small>Insurance</small>
                </div>
              </div>
              <div class="col-md-2">
                <div class="text-center p-3 border rounded">
                  <h3 class="text-danger">{{ pendingMedical }}</h3>
                  <small>Medical</small>
                </div>
              </div>
              <div class="col-md-2">
                <div class="text-center p-3 border rounded">
                  <h3 class="text-dark">{{ totalPending }}</h3>
                  <small>Total</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pending Requests Lists -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h5><i class="feather icon-list me-2"></i>Pending Approval Requests</h5>
          </div>
          <div class="card-block">
            <!-- Tabs -->
            <ul class="nav nav-tabs" role="tablist">
              <li class="nav-item">
                <a class="nav-link active" data-bs-toggle="tab" href="#loans" role="tab">
                  Loans ({{ pendingLoans }})
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#reimbursements" role="tab">
                  Reimbursements ({{ pendingReimbursements }})
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#insurance" role="tab">
                  Insurance ({{ pendingInsurance }})
                </a>
              </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content mt-3">
              <!-- Loans Tab -->
              <div class="tab-pane active" id="loans" role="tabpanel">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Loan Type</th>
                        <th>Amount</th>
                        <th>Duration</th>
                        <th>Applied Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let loan of pendingLoansList">
                        <td>{{ loan.employeeName }}</td>
                        <td>{{ loan.loanType }}</td>
                        <td>{{ loan.amount | currency }}</td>
                        <td>{{ loan.duration }} months</td>
                        <td>{{ loan.applicationDate | date:'shortDate' }}</td>
                        <td>
                          <button class="btn btn-sm btn-success me-2" (click)="approveLoan(loan.id)">
                            <i class="feather icon-check"></i> Approve
                          </button>
                          <button class="btn btn-sm btn-danger" (click)="rejectLoan(loan.id)">
                            <i class="feather icon-x"></i> Reject
                          </button>
                        </td>
                      </tr>
                      <tr *ngIf="pendingLoansList.length === 0">
                        <td colspan="6" class="text-center">No pending loan requests</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Reimbursements Tab -->
              <div class="tab-pane" id="reimbursements" role="tabpanel">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th>Description</th>
                        <th>Request Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let reimbursement of pendingReimbursementsList">
                        <td>{{ reimbursement.employeeName }}</td>
                        <td>{{ reimbursement.category }}</td>
                        <td>{{ reimbursement.amount | currency }}</td>
                        <td>{{ reimbursement.description }}</td>
                        <td>{{ reimbursement.requestDate | date:'shortDate' }}</td>
                        <td>
                          <button class="btn btn-sm btn-success me-2" (click)="approveReimbursement(reimbursement.id)">
                            <i class="feather icon-check"></i> Approve
                          </button>
                          <button class="btn btn-sm btn-danger" (click)="rejectReimbursement(reimbursement.id)">
                            <i class="feather icon-x"></i> Reject
                          </button>
                        </td>
                      </tr>
                      <tr *ngIf="pendingReimbursementsList.length === 0">
                        <td colspan="6" class="text-center">No pending reimbursement requests</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Insurance Tab -->
              <div class="tab-pane" id="insurance" role="tabpanel">
                <div class="table-responsive">
                  <table class="table table-hover">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Policy Type</th>
                        <th>Coverage</th>
                        <th>Enrollment Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let insurance of pendingInsuranceList">
                        <td>{{ insurance.employeeName }}</td>
                        <td>{{ insurance.policyName }}</td>
                        <td>{{ insurance.coverage }}</td>
                        <td>{{ insurance.enrollmentDate | date:'shortDate' }}</td>
                        <td>
                          <button class="btn btn-sm btn-success me-2" (click)="approveInsurance(insurance.id)">
                            <i class="feather icon-check"></i> Approve
                          </button>
                          <button class="btn btn-sm btn-danger" (click)="rejectInsurance(insurance.id)">
                            <i class="feather icon-x"></i> Reject
                          </button>
                        </td>
                      </tr>
                      <tr *ngIf="pendingInsuranceList.length === 0">
                        <td colspan="5" class="text-center">No pending insurance requests</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .border-left-warning { border-left: 4px solid #ffc107; }
    .border-left-info { border-left: 4px solid #17a2b8; }
    .border-left-success { border-left: 4px solid #28a745; }
    .border-left-primary { border-left: 4px solid #007bff; }
    .f-30 { font-size: 30px; }
  `]
})
export class ApprovalsComponent implements OnInit {
  pendingPayroll = 0;
  pendingLoans = 0;
  pendingReimbursements = 0;
  pendingInsurance = 0;
  pendingMedical = 0;
  totalPending = 0;
  
  pendingLoansList: any[] = [];
  pendingReimbursementsList: any[] = [];
  pendingInsuranceList: any[] = [];

  constructor(
    private payrollService: PayrollService,
    private loanService: LoanService,
    private reimbursementService: ReimbursementService,
    private insuranceService: InsuranceService,
    private medicalClaimService: MedicalClaimService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadPendingCounts();
  }

  loadPendingCounts(): void {
    // Load pending lists and counts
    this.loadPendingLoans();
    this.loadPendingReimbursements();
    this.loadPendingInsurance();
    
    // Mock data for others
    this.pendingPayroll = 4;
    this.pendingMedical = 1;
    this.calculateTotal();
  }

  loadPendingLoans(): void {
    this.loanService.getAllLoans().subscribe({
      next: (loans: any[]) => {
        this.pendingLoansList = loans.filter(l => l.status === 'Pending');
        this.pendingLoans = this.pendingLoansList.length;
        this.calculateTotal();
      },
      error: () => {
        // Mock data
        this.pendingLoansList = [
          { id: 1, employeeName: 'John Doe', loanType: 'Personal', amount: 50000, duration: 12, applicationDate: new Date() },
          { id: 2, employeeName: 'Jane Smith', loanType: 'Education', amount: 100000, duration: 24, applicationDate: new Date() }
        ];
        this.pendingLoans = this.pendingLoansList.length;
        this.calculateTotal();
      }
    });
  }

  loadPendingReimbursements(): void {
    this.reimbursementService.getMyReimbursements().subscribe({
      next: (reimbursements: any[]) => {
        this.pendingReimbursementsList = reimbursements.filter(r => r.status === 'Pending');
        this.pendingReimbursements = this.pendingReimbursementsList.length;
        this.calculateTotal();
      },
      error: () => {
        // Mock data
        this.pendingReimbursementsList = [
          { id: 1, employeeName: 'Alice Johnson', category: 'Travel', amount: 5000, description: 'Client meeting travel', requestDate: new Date() },
          { id: 2, employeeName: 'Bob Wilson', category: 'Food', amount: 1200, description: 'Team lunch', requestDate: new Date() }
        ];
        this.pendingReimbursements = this.pendingReimbursementsList.length;
        this.calculateTotal();
      }
    });
  }

  loadPendingInsurance(): void {
    this.insuranceService.getMyEnrollments().subscribe({
      next: (insurance: any[]) => {
        this.pendingInsuranceList = insurance.filter(i => i.status === 'Pending');
        this.pendingInsurance = this.pendingInsuranceList.length;
        this.calculateTotal();
      },
      error: () => {
        // Mock data
        this.pendingInsuranceList = [
          { id: 1, employeeName: 'Carol Brown', policyName: 'Health Insurance', coverage: '₹5 Lakhs', enrollmentDate: new Date() }
        ];
        this.pendingInsurance = this.pendingInsuranceList.length;
        this.calculateTotal();
      }
    });
  }

  // Approval methods
  approveLoan(loanId: number): void {
    this.loanService.approveByManager(loanId).subscribe({
      next: () => {
        this.loadPendingLoans();
        alert('Loan approved successfully!');
      },
      error: (error) => {
        console.error('Error approving loan:', error);
        alert('Error approving loan');
      }
    });
  }

  rejectLoan(loanId: number): void {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.loanService.rejectByManager(loanId, reason).subscribe({
        next: () => {
          this.loadPendingLoans();
          alert('Loan rejected successfully!');
        },
        error: (error) => {
          console.error('Error rejecting loan:', error);
          alert('Error rejecting loan');
        }
      });
    }
  }

  approveReimbursement(reimbursementId: number): void {
    this.reimbursementService.approveByManager(reimbursementId).subscribe({
      next: () => {
        this.loadPendingReimbursements();
        alert('Reimbursement approved successfully!');
      },
      error: (error) => {
        console.error('Error approving reimbursement:', error);
        alert('Error approving reimbursement');
      }
    });
  }

  rejectReimbursement(reimbursementId: number): void {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.reimbursementService.rejectByManager(reimbursementId, reason).subscribe({
        next: () => {
          this.loadPendingReimbursements();
          alert('Reimbursement rejected successfully!');
        },
        error: (error) => {
          console.error('Error rejecting reimbursement:', error);
          alert('Error rejecting reimbursement');
        }
      });
    }
  }

  approveInsurance(insuranceId: number): void {
    this.insuranceService.approveByManager(insuranceId).subscribe({
      next: () => {
        this.loadPendingInsurance();
        alert('Insurance approved successfully!');
      },
      error: (error) => {
        console.error('Error approving insurance:', error);
        alert('Error approving insurance');
      }
    });
  }

  rejectInsurance(insuranceId: number): void {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      this.insuranceService.rejectByManager(insuranceId, reason).subscribe({
        next: () => {
          this.loadPendingInsurance();
          alert('Insurance rejected successfully!');
        },
        error: (error) => {
          console.error('Error rejecting insurance:', error);
          alert('Error rejecting insurance');
        }
      });
    }
  }

  calculateTotal(): void {
    this.totalPending = this.pendingPayroll + this.pendingLoans + 
                      this.pendingReimbursements + this.pendingInsurance + this.pendingMedical;
  }
}