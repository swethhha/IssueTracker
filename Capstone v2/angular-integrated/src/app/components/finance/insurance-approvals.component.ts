import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-insurance-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="approvals-container">
      <div class="page-header">
        <h2>Insurance Enrollment Approvals</h2>
        <div class="filters">
          <select [(ngModel)]="selectedFilter" class="filter-select">
            <option value="all">All Enrollments</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div class="approvals-list">
        <div *ngFor="let enrollment of filteredEnrollments" class="approval-card">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ enrollment.employeeName }}</h3>
              <p>{{ enrollment.department }} • {{ enrollment.policyType }}</p>
            </div>
            <div class="status-badge" [class]="enrollment.status">
              {{ enrollment.status | titlecase }}
            </div>
          </div>

          <div class="enrollment-details">
            <div class="detail-item">
              <span class="label">Coverage Amount:</span>
              <span class="value">\${{ enrollment.coverageAmount | number:'1.0-0' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Monthly Premium:</span>
              <span class="value">\${{ enrollment.monthlyPremium | number:'1.2-2' }}</span>
            </div>
          </div>

          <div *ngIf="enrollment.status === 'pending'" class="approval-actions">
            <div class="action-buttons">
              <button 
                class="btn btn-approve" 
                (click)="approveEnrollment(enrollment)"
              >
                Approve
              </button>
              <button 
                class="btn btn-reject" 
                (click)="rejectEnrollment(enrollment)"
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
export class InsuranceApprovalsComponent implements OnInit {
  selectedFilter = 'all';
  
  enrollments = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      policyType: 'Group Health Insurance',
      coverageAmount: 500000,
      monthlyPremium: 125,
      status: 'pending'
    }
  ];

  get filteredEnrollments() {
    if (this.selectedFilter === 'all') {
      return this.enrollments;
    }
    return this.enrollments.filter(e => e.status === this.selectedFilter);
  }

  ngOnInit() {}

  approveEnrollment(enrollment: any) {
    enrollment.status = 'approved';
    alert(`Insurance enrollment approved for ${enrollment.employeeName}`);
  }

  rejectEnrollment(enrollment: any) {
    enrollment.status = 'rejected';
    alert(`Insurance enrollment rejected for ${enrollment.employeeName}`);
  }
}