import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manager-approvals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Pending Approvals</h1>
      
      <div class="tabs">
        <div class="tab" [class.active]="activeTab === 'loans'" (click)="activeTab = 'loans'">
          Loan Applications ({{loanApprovals.length}})
        </div>
        <div class="tab" [class.active]="activeTab === 'reimbursements'" (click)="activeTab = 'reimbursements'">
          Reimbursements ({{reimbursementApprovals.length}})
        </div>
        <div class="tab" [class.active]="activeTab === 'insurance'" (click)="activeTab = 'insurance'">
          Insurance ({{insuranceApprovals.length}})
        </div>
      </div>
      
      <div *ngIf="activeTab === 'loans'">
        <div *ngFor="let loan of loanApprovals" class="approval-card">
          <h3>{{loan.employeeName}}</h3>
          <p class="subtitle">{{loan.loanType}} - {{loan.amount | currency}}</p>
          <p><strong>Purpose:</strong> {{loan.purpose}}</p>
          <p><strong>Monthly Income:</strong> {{loan.monthlyIncome | currency}}</p>
          <p><strong>Applied:</strong> {{loan.appliedDate | date}}</p>
          <div class="approval-actions">
            <button class="btn btn-primary" (click)="approve('loan', loan.id)">
              ✓ Approve
            </button>
            <button class="btn btn-warn" (click)="reject('loan', loan.id)">
              ✗ Reject
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="activeTab === 'reimbursements'">
        <div *ngFor="let reimbursement of reimbursementApprovals" class="approval-card">
          <h3>{{reimbursement.employeeName}}</h3>
          <p class="subtitle">{{reimbursement.category}} - {{reimbursement.amount | currency}}</p>
          <p><strong>Description:</strong> {{reimbursement.description}}</p>
          <p><strong>Date:</strong> {{reimbursement.expenseDate | date}}</p>
          <p><strong>Submitted:</strong> {{reimbursement.submittedDate | date}}</p>
          <div class="approval-actions">
            <button class="btn btn-primary" (click)="approve('reimbursement', reimbursement.id)">
              ✓ Approve
            </button>
            <button class="btn btn-warn" (click)="reject('reimbursement', reimbursement.id)">
              ✗ Reject
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="activeTab === 'insurance'">
        <div *ngFor="let insurance of insuranceApprovals" class="approval-card">
          <h3>{{insurance.employeeName}}</h3>
          <p class="subtitle">{{insurance.policyType}} - {{insurance.coverageAmount | currency}}</p>
          <p><strong>Premium:</strong> {{insurance.premium | currency}}</p>
          <p><strong>Applied:</strong> {{insurance.appliedDate | date}}</p>
          <div class="approval-actions">
            <button class="btn btn-primary" (click)="approve('insurance', insurance.id)">
              ✓ Approve
            </button>
            <button class="btn btn-warn" (click)="reject('insurance', insurance.id)">
              ✗ Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
  `]
})
export class ManagerApprovalsComponent implements OnInit {
  activeTab = 'loans';
  loanApprovals: any[] = [];
  reimbursementApprovals: any[] = [];
  insuranceApprovals: any[] = [];

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadApprovals();
  }

  private loadApprovals() {
    // Demo data
    this.loanApprovals = [
      {
        id: 1,
        employeeName: 'John Doe',
        loanType: 'Personal',
        amount: 50000,
        purpose: 'Home renovation',
        monthlyIncome: 75000,
        appliedDate: new Date('2024-01-15')
      },
      {
        id: 2,
        employeeName: 'Jane Smith',
        loanType: 'Vehicle',
        amount: 300000,
        purpose: 'Car purchase',
        monthlyIncome: 85000,
        appliedDate: new Date('2024-01-18')
      }
    ];

    this.reimbursementApprovals = [
      {
        id: 1,
        employeeName: 'Mike Johnson',
        category: 'Travel',
        amount: 5000,
        description: 'Client meeting travel expenses',
        expenseDate: new Date('2024-01-10'),
        submittedDate: new Date('2024-01-12')
      }
    ];

    this.insuranceApprovals = [
      {
        id: 1,
        employeeName: 'Sarah Wilson',
        policyType: 'Health',
        coverageAmount: 500000,
        premium: 12000,
        appliedDate: new Date('2024-01-14')
      }
    ];
  }

  approve(type: string, id: number) {
    const apiUrl = 'https://localhost:7101/api';
    this.http.post(`${apiUrl}/${type}s/${id}/approve`, {}).subscribe({
      next: () => {
        alert(`${type} approved successfully!`);
        this.removeFromList(type, id);
      },
      error: () => {
        alert(`${type} approved (demo mode)`);
        this.removeFromList(type, id);
      }
    });
  }

  reject(type: string, id: number) {
    const apiUrl = 'https://localhost:7101/api';
    this.http.post(`${apiUrl}/${type}s/${id}/reject`, {}).subscribe({
      next: () => {
        alert(`${type} rejected successfully!`);
        this.removeFromList(type, id);
      },
      error: () => {
        alert(`${type} rejected (demo mode)`);
        this.removeFromList(type, id);
      }
    });
  }

  private removeFromList(type: string, id: number) {
    switch(type) {
      case 'loan':
        this.loanApprovals = this.loanApprovals.filter(item => item.id !== id);
        break;
      case 'reimbursement':
        this.reimbursementApprovals = this.reimbursementApprovals.filter(item => item.id !== id);
        break;
      case 'insurance':
        this.insuranceApprovals = this.insuranceApprovals.filter(item => item.id !== id);
        break;
    }
  }
}