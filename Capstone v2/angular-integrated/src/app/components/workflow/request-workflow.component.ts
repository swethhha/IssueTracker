import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MockPayrollService, MockLoan, MockReimbursement } from '../../services/mock-payroll.service';

@Component({
  selector: 'app-request-workflow',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="workflow-container">
      <h2>Request Workflow</h2>
      
      <!-- Employee Section -->
      <div class="workflow-section" *ngIf="currentUser?.role === 'Employee'">
        <h3>My Requests</h3>
        <div class="request-grid">
          <div class="request-card" *ngFor="let loan of myLoans">
            <h4>Loan Request #{{loan.loanId}}</h4>
            <p><strong>Amount:</strong> ₹{{loan.amount | number}}</p>
            <p><strong>Type:</strong> {{loan.loanType}}</p>
            <p><strong>Status:</strong> 
              <span [class]="'status-' + loan.status.toLowerCase()">{{loan.status}}</span>
            </p>
            <div class="workflow-steps">
              <div class="step" [class.completed]="loan.status !== 'Pending'">
                <span class="step-number">1</span>
                <span>Manager Review</span>
                <span *ngIf="loan.managerApproved === true" class="check">✓</span>
                <span *ngIf="loan.managerApproved === false" class="cross">✗</span>
              </div>
              <div class="step" [class.completed]="loan.status === 'Approved'">
                <span class="step-number">2</span>
                <span>Finance Approval</span>
                <span *ngIf="loan.financeApproved === true" class="check">✓</span>
                <span *ngIf="loan.financeApproved === false" class="cross">✗</span>
              </div>
            </div>
          </div>
          
          <div class="request-card" *ngFor="let reimb of myReimbursements">
            <h4>Reimbursement #{{reimb.requestId}}</h4>
            <p><strong>Amount:</strong> ₹{{reimb.amount | number}}</p>
            <p><strong>Category:</strong> {{reimb.category}}</p>
            <p><strong>Status:</strong> 
              <span [class]="'status-' + reimb.status.toLowerCase()">{{reimb.status}}</span>
            </p>
            <div class="workflow-steps">
              <div class="step" [class.completed]="reimb.status !== 'Pending'">
                <span class="step-number">1</span>
                <span>Manager Review</span>
                <span *ngIf="reimb.managerApproved === true" class="check">✓</span>
                <span *ngIf="reimb.managerApproved === false" class="cross">✗</span>
              </div>
              <div class="step" [class.completed]="reimb.status === 'Approved'">
                <span class="step-number">2</span>
                <span>Finance Approval</span>
                <span *ngIf="reimb.financeApproved === true" class="check">✓</span>
                <span *ngIf="reimb.financeApproved === false" class="cross">✗</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Manager Section -->
      <div class="workflow-section" *ngIf="currentUser?.role === 'Manager'">
        <h3>Pending Manager Approvals</h3>
        <div class="approval-grid">
          <div class="approval-card" *ngFor="let loan of pendingLoans">
            <h4>Loan Request #{{loan.loanId}}</h4>
            <p><strong>Employee:</strong> {{loan.employeeName}}</p>
            <p><strong>Amount:</strong> ₹{{loan.amount | number}}</p>
            <p><strong>Type:</strong> {{loan.loanType}}</p>
            <p><strong>Purpose:</strong> {{loan.purpose}}</p>
            <div class="action-buttons">
              <button class="btn-approve" (click)="approveRequest('loan', loan.loanId)">Approve</button>
              <button class="btn-reject" (click)="rejectRequest('loan', loan.loanId)">Reject</button>
            </div>
          </div>
          
          <div class="approval-card" *ngFor="let reimb of pendingReimbursements">
            <h4>Reimbursement #{{reimb.requestId}}</h4>
            <p><strong>Employee:</strong> {{reimb.employeeName}}</p>
            <p><strong>Amount:</strong> ₹{{reimb.amount | number}}</p>
            <p><strong>Category:</strong> {{reimb.category}}</p>
            <p><strong>Description:</strong> {{reimb.description}}</p>
            <div class="action-buttons">
              <button class="btn-approve" (click)="approveRequest('reimbursement', reimb.requestId)">Approve</button>
              <button class="btn-reject" (click)="rejectRequest('reimbursement', reimb.requestId)">Reject</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Finance Section -->
      <div class="workflow-section" *ngIf="currentUser?.role === 'Finance'">
        <h3>Pending Finance Approvals</h3>
        <div class="approval-grid">
          <div class="approval-card" *ngFor="let loan of financeLoans">
            <h4>Loan Request #{{loan.loanId}}</h4>
            <p><strong>Employee:</strong> {{loan.employeeName}}</p>
            <p><strong>Amount:</strong> ₹{{loan.amount | number}}</p>
            <p><strong>Type:</strong> {{loan.loanType}}</p>
            <p><strong>Manager Comments:</strong> {{loan.managerComments || 'None'}}</p>
            <div class="action-buttons">
              <button class="btn-approve" (click)="finalApprove('loan', loan.loanId)">Final Approve</button>
              <button class="btn-reject" (click)="finalReject('loan', loan.loanId)">Reject</button>
            </div>
          </div>
          
          <div class="approval-card" *ngFor="let reimb of financeReimbursements">
            <h4>Reimbursement #{{reimb.requestId}}</h4>
            <p><strong>Employee:</strong> {{reimb.employeeName}}</p>
            <p><strong>Amount:</strong> ₹{{reimb.amount | number}}</p>
            <p><strong>Category:</strong> {{reimb.category}}</p>
            <p><strong>Manager Comments:</strong> {{reimb.managerComments || 'None'}}</p>
            <div class="action-buttons">
              <button class="btn-approve" (click)="finalApprove('reimbursement', reimb.requestId)">Final Approve</button>
              <button class="btn-reject" (click)="finalReject('reimbursement', reimb.requestId)">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .workflow-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .workflow-section {
      margin-bottom: 30px;
    }

    .request-grid, .approval-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 20px;
    }

    .request-card, .approval-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .workflow-steps {
      margin-top: 15px;
      display: flex;
      gap: 20px;
    }

    .step {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: #f8f9fa;
    }

    .step.completed {
      background: #e8f5e8;
      border-color: #28a745;
    }

    .step-number {
      background: #6c757d;
      color: white;
      border-radius: 50%;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }

    .step.completed .step-number {
      background: #28a745;
    }

    .check {
      color: #28a745;
      font-weight: bold;
    }

    .cross {
      color: #dc3545;
      font-weight: bold;
    }

    .status-pending {
      color: #ffc107;
      font-weight: bold;
    }

    .status-managerapproved {
      color: #17a2b8;
      font-weight: bold;
    }

    .status-approved {
      color: #28a745;
      font-weight: bold;
    }

    .status-rejected {
      color: #dc3545;
      font-weight: bold;
    }

    .action-buttons {
      margin-top: 15px;
      display: flex;
      gap: 10px;
    }

    .btn-approve, .btn-reject {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
    }

    .btn-approve {
      background: #28a745;
      color: white;
    }

    .btn-reject {
      background: #dc3545;
      color: white;
    }

    .btn-approve:hover {
      background: #218838;
    }

    .btn-reject:hover {
      background: #c82333;
    }
  `]
})
export class RequestWorkflowComponent implements OnInit {
  currentUser: any;
  myLoans: MockLoan[] = [];
  myReimbursements: MockReimbursement[] = [];
  pendingLoans: MockLoan[] = [];
  pendingReimbursements: MockReimbursement[] = [];
  financeLoans: MockLoan[] = [];
  financeReimbursements: MockReimbursement[] = [];

  constructor(private payrollService: MockPayrollService) {}

  ngOnInit() {
    this.currentUser = this.payrollService.getCurrentUser();
    this.loadData();
  }

  loadData() {
    if (this.currentUser?.role === 'Employee') {
      this.payrollService.getMyLoans().subscribe(loans => this.myLoans = loans);
      this.payrollService.getMyReimbursements().subscribe(reimbs => this.myReimbursements = reimbs);
    } else if (this.currentUser?.role === 'Manager') {
      this.payrollService.getPendingManagerApprovals().subscribe(loans => this.pendingLoans = loans);
      this.payrollService.getPendingReimbursementApprovals().subscribe(reimbs => this.pendingReimbursements = reimbs);
    } else if (this.currentUser?.role === 'Finance') {
      this.payrollService.getPendingFinanceApprovals().subscribe(loans => this.financeLoans = loans);
      this.payrollService.getPendingReimbursementFinanceApprovals().subscribe(reimbs => this.financeReimbursements = reimbs);
    }
  }

  approveRequest(type: string, id: number) {
    if (type === 'loan') {
      this.payrollService.approveByManager(id, 'Approved by manager').subscribe(() => {
        this.loadData();
        alert('Loan approved! It will now go to Finance for final approval.');
      });
    } else if (type === 'reimbursement') {
      this.payrollService.approveReimbursementByManager(id, 'Approved by manager').subscribe(() => {
        this.loadData();
        alert('Reimbursement approved! It will now go to Finance for final approval.');
      });
    }
  }

  rejectRequest(type: string, id: number) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      if (type === 'loan') {
        this.payrollService.rejectByManager(id, reason).subscribe(() => {
          this.loadData();
          alert('Loan rejected.');
        });
      } else if (type === 'reimbursement') {
        this.payrollService.rejectReimbursementByManager(id, reason).subscribe(() => {
          this.loadData();
          alert('Reimbursement rejected.');
        });
      }
    }
  }

  finalApprove(type: string, id: number) {
    if (type === 'loan') {
      this.payrollService.approveByFinance(id, 'Final approval by finance').subscribe(() => {
        this.loadData();
        alert('Loan finally approved! Funds will be disbursed.');
      });
    } else if (type === 'reimbursement') {
      this.payrollService.approveReimbursementByFinance(id, 'Final approval by finance').subscribe(() => {
        this.loadData();
        alert('Reimbursement finally approved! Payment will be processed.');
      });
    }
  }

  finalReject(type: string, id: number) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      if (type === 'loan') {
        this.payrollService.rejectByFinance(id, reason).subscribe(() => {
          this.loadData();
          alert('Loan rejected by finance.');
        });
      } else if (type === 'reimbursement') {
        this.payrollService.rejectReimbursementByFinance(id, reason).subscribe(() => {
          this.loadData();
          alert('Reimbursement rejected by finance.');
        });
      }
    }
  }
}