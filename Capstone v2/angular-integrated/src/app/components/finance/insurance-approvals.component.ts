import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InsuranceService } from '../../services/insurance.service';
import { ToastService } from '../../services/toast.service';
import { MockPayrollService } from '../../services/mock-payroll.service';

@Component({
  selector: 'app-insurance-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-content">
          <h1>Insurance Approvals</h1>
          <p>Review and approve employee insurance enrollments</p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-number">{{ pendingCount }}</span>
            <span class="stat-label">Pending</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ approvedCount }}</span>
            <span class="stat-label">Approved</span>
          </div>
        </div>
      </div>

      <div class="filters-section">
        <div class="filter-group">
          <label>Filter by Status:</label>
          <select [(ngModel)]="selectedFilter" class="filter-select">
            <option value="all">All Enrollments</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div class="approvals-grid" *ngIf="!isLoading">
        <div *ngFor="let enrollment of filteredEnrollments" class="insurance-card">
          <div class="card-header">
            <div class="employee-info">
              <h3>{{ enrollment.employeeName }}</h3>
              <p class="department">{{ enrollment.department }}</p>
              <p class="policy-type">{{ enrollment.policyType }}</p>
            </div>
            <div class="status-badge" [ngClass]="enrollment.status.toLowerCase()">
              {{ enrollment.status }}
            </div>
          </div>

          <div class="insurance-details">
            <div class="detail-item">
              <span class="label">Coverage Amount</span>
              <span class="amount">₹{{ enrollment.coverageAmount | number:'1.0-0' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Monthly Premium</span>
              <span class="amount">₹{{ enrollment.monthlyPremium | number:'1.0-0' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Annual Premium</span>
              <span class="amount">₹{{ enrollment.monthlyPremium * 12 | number:'1.0-0' }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Company Contribution</span>
              <span class="amount">{{ enrollment.companyContribution }}%</span>
            </div>
            <div class="detail-item">
              <span class="label">Enrollment Date</span>
              <span class="date">{{ enrollment.enrollmentDate | date:'MMM dd, yyyy' }}</span>
            </div>
            <div class="detail-item" *ngIf="enrollment.monthlyPremium === 0">
              <span class="label">Cost to Company</span>
              <span class="amount company-cost">₹{{ (enrollment.coverageAmount * 0.05 / 12) | number:'1.0-0' }}/month</span>
            </div>
          </div>

          <div class="card-actions" *ngIf="enrollment.status === 'Pending'">
            <button class="btn btn-approve" (click)="approveEnrollment(enrollment)">
              <span class="material-icons">check_circle</span>
              Approve
            </button>
            <button class="btn btn-reject" (click)="rejectEnrollment(enrollment)">
              <span class="material-icons">cancel</span>
              Reject
            </button>
          </div>

          <div class="card-actions" *ngIf="enrollment.status !== 'Pending'">
            <span class="status-text">{{ enrollment.status }} on {{ enrollment.enrollmentDate | date:'MMM dd, yyyy' }}</span>
          </div>
        </div>
      </div>

      <div class="loading-state" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading insurance data...</p>
      </div>

      <div class="empty-state" *ngIf="!isLoading && filteredEnrollments.length === 0">
        <span class="material-icons">security</span>
        <h3>No insurance enrollments found</h3>
        <p>No insurance enrollments match the selected filter.</p>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: var(--spacing-lg);
      width: 100%;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);
      padding-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--outline-variant);
    }

    .header-content h1 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
      margin: 0;
    }

    .header-content p {
      color: var(--on-surface-variant);
      margin: var(--spacing-xs) 0 0 0;
    }

    .header-stats {
      display: flex;
      gap: var(--spacing-md);
    }

    .stat-card {
      background: var(--surface-variant);
      padding: var(--spacing-md);
      border-radius: var(--radius-lg);
      text-align: center;
      min-width: 80px;
    }

    .stat-number {
      display: block;
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-500);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .filters-section {
      margin-bottom: var(--spacing-xl);
    }

    .filter-group {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .filter-group label {
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }

    .filter-select {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--outline);
      border-radius: var(--radius-md);
      background: var(--surface);
      color: var(--on-surface);
    }

    .approvals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: var(--spacing-lg);
    }

    .insurance-card {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-1);
      transition: all 0.2s ease;
    }

    .insurance-card:hover {
      box-shadow: var(--shadow-2);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-lg);
    }

    .employee-info h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0;
    }

    .department {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
      margin: var(--spacing-xs) 0;
    }

    .policy-type {
      color: var(--primary-500);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      margin: 0;
    }

    .status-badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.pending {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .status-badge.approved {
      background: var(--success-100);
      color: var(--success-700);
    }

    .status-badge.rejected {
      background: var(--error-100);
      color: var(--error-700);
    }

    .insurance-details {
      margin-bottom: var(--spacing-lg);
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--outline-variant);
    }

    .detail-item:last-child {
      border-bottom: none;
    }

    .detail-item .label {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
    }

    .detail-item .amount {
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .detail-item .date {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
    }

    .detail-item .company-cost {
      color: var(--error-500);
      font-weight: var(--font-weight-semibold);
    }

    .card-actions {
      display: flex;
      gap: var(--spacing-sm);
      justify-content: flex-end;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-approve {
      background: var(--success-500);
      color: white;
    }

    .btn-approve:hover {
      background: var(--success-600);
    }

    .btn-reject {
      background: var(--error-500);
      color: white;
    }

    .btn-reject:hover {
      background: var(--error-600);
    }

    .status-text {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
      font-style: italic;
    }

    .loading-state, .empty-state {
      text-align: center;
      padding: var(--spacing-3xl);
      color: var(--on-surface-variant);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid var(--outline-variant);
      border-top: 4px solid var(--primary-500);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto var(--spacing-md);
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .empty-state .material-icons {
      font-size: 64px;
      color: var(--outline);
      margin-bottom: var(--spacing-md);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: var(--spacing-md);
      }

      .approvals-grid {
        grid-template-columns: 1fr;
      }

      .card-actions {
        flex-direction: column;
      }
    }
  `]
})
export class InsuranceApprovalsComponent implements OnInit {
  selectedFilter = 'all';
  enrollments: any[] = [];
  isLoading = false;

  constructor(
    private insuranceService: InsuranceService,
    private toastService: ToastService,
    private mockService: MockPayrollService
  ) {}

  get filteredEnrollments() {
    if (this.selectedFilter === 'all') {
      return this.enrollments;
    }
    return this.enrollments.filter(e => e.status.toLowerCase() === this.selectedFilter);
  }

  get pendingCount() {
    return this.enrollments.filter(e => e.status === 'Pending').length;
  }

  get approvedCount() {
    return this.enrollments.filter(e => e.status === 'Approved').length;
  }

  ngOnInit() {
    this.loadEnrollments();
  }

  loadEnrollments() {
    this.isLoading = true;
    const data = this.mockService.getData();
    const insurances = data.insurances || [];
    
    // Convert insurance data to enrollment format with realistic business data
    this.enrollments = [
      {
        id: 1,
        employeeName: 'John Doe',
        department: 'IT',
        policyType: 'Group Mediclaim Policy',
        coverageAmount: 500000,
        monthlyPremium: 0, // Company paid
        status: 'Approved',
        enrollmentDate: '2024-01-01',
        companyContribution: 100
      },
      {
        id: 2,
        employeeName: 'Alice Smith',
        department: 'HR',
        policyType: 'Family Health Coverage',
        coverageAmount: 800000,
        monthlyPremium: 1500, // Employee contribution for family
        status: 'Pending',
        enrollmentDate: '2024-12-01',
        companyContribution: 70
      },
      {
        id: 3,
        employeeName: 'Mike Johnson',
        department: 'IT',
        policyType: 'Term Life Insurance',
        coverageAmount: 2500000,
        monthlyPremium: 1800, // Employee pays 40%
        status: 'Pending',
        enrollmentDate: '2024-12-02',
        companyContribution: 60
      },
      {
        id: 4,
        employeeName: 'Sarah Wilson',
        department: 'Operations',
        policyType: 'Personal Accident Insurance',
        coverageAmount: 500000,
        monthlyPremium: 0, // Company paid
        status: 'Approved',
        enrollmentDate: '2024-01-01',
        companyContribution: 100
      },
      {
        id: 5,
        employeeName: 'David Brown',
        department: 'Finance',
        policyType: 'Critical Illness Coverage',
        coverageAmount: 1500000,
        monthlyPremium: 3400, // Employee pays 40%
        status: 'Pending',
        enrollmentDate: '2024-12-03',
        companyContribution: 60
      }
    ];
    this.isLoading = false;
  }

  approveEnrollment(enrollment: any) {
    enrollment.status = 'Approved';
    const savings = enrollment.monthlyPremium > 0 
      ? `Company saves ₹${(enrollment.monthlyPremium * enrollment.companyContribution / 100 * 12).toLocaleString()}/year` 
      : 'Fully company-sponsored policy';
    this.toastService.success('Insurance Approved', `${enrollment.policyType} approved for ${enrollment.employeeName}. ${savings}`);
  }

  rejectEnrollment(enrollment: any) {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      enrollment.status = 'Rejected';
      this.toastService.warning('Insurance Rejected', `${enrollment.policyType} rejected for ${enrollment.employeeName}. Reason: ${reason}`);
    }
  }
}