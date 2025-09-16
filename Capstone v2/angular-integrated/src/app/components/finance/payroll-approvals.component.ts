import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-payroll-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="approvals-container">
      <div class="page-header">
        <h2>Payroll Approvals</h2>
        <div class="filters">
          <select [(ngModel)]="selectedFilter" class="filter-select">
            <option value="all">All Payrolls</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div class="approvals-list">
        <div *ngFor="let payroll of filteredPayrolls" class="approval-card">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ payroll.employeeName }}</h3>
              <p>{{ payroll.department }} • {{ payroll.period }}</p>
            </div>
            <div class="status-badge" [class]="payroll.status">
              {{ payroll.status | titlecase }}
            </div>
          </div>

          <div class="payroll-details">
            <div class="detail-item">
              <span class="label">Basic Salary:</span>
              <span class="value">\${{ payroll.basicSalary | number:'1.2-2' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Allowances:</span>
              <span class="value">\${{ payroll.allowances | number:'1.2-2' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Deductions:</span>
              <span class="value">\${{ payroll.deductions | number:'1.2-2' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Net Pay:</span>
              <span class="value">\${{ payroll.netPay | number:'1.2-2' }}</span>
            </div>
          </div>

          <div *ngIf="payroll.status === 'pending'" class="approval-actions">
            <div class="action-buttons">
              <button 
                class="btn btn-approve" 
                (click)="approvePayroll(payroll)"
              >
                Approve
              </button>
              <button 
                class="btn btn-reject" 
                (click)="rejectPayroll(payroll)"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .approvals-container {
      padding: 20px;
    }
    .approval-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 15px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
    }
    .status-badge.pending {
      background: #fff3cd;
      color: #856404;
    }
    .status-badge.approved {
      background: #d4edda;
      color: #155724;
    }
    .status-badge.rejected {
      background: #f8d7da;
      color: #721c24;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }
    .btn-approve {
      background: #28a745;
      color: white;
    }
    .btn-reject {
      background: #dc3545;
      color: white;
    }
  `]
})
export class PayrollApprovalsComponent implements OnInit {
  selectedFilter = 'all';
  
  payrolls = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      period: 'December 2024',
      basicSalary: 5000,
      allowances: 1000,
      deductions: 500,
      netPay: 5500,
      status: 'pending'
    }
  ];

  get filteredPayrolls() {
    if (this.selectedFilter === 'all') {
      return this.payrolls;
    }
    return this.payrolls.filter(p => p.status === this.selectedFilter);
  }

  ngOnInit() {}

  approvePayroll(payroll: any) {
    payroll.status = 'approved';
    alert(`Payroll approved for ${payroll.employeeName}`);
  }

  rejectPayroll(payroll: any) {
    payroll.status = 'rejected';
    alert(`Payroll rejected for ${payroll.employeeName}`);
  }
}