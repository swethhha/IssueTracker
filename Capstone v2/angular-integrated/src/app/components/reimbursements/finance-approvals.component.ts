import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ReimbursementService } from '../../services/reimbursement.service';

@Component({
  selector: 'app-finance-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule, NgApexchartsModule],
  template: `
    <div class="finance-container">
      <!-- Dashboard Cards -->
      <div class="dashboard-cards">
        <div class="dashboard-card pending">
          <div class="card-icon">
            <i class="feather icon-clock"></i>
          </div>
          <div class="card-content">
            <h3>{{ pendingFinanceApprovals.length }}</h3>
            <p>Pending Finance Approval</p>
          </div>
        </div>

        <div class="dashboard-card approved">
          <div class="card-icon">
            <i class="feather icon-check-circle"></i>
          </div>
          <div class="card-content">
            <h3>{{ getApprovedCount() }}</h3>
            <p>Approved This Month</p>
          </div>
        </div>

        <div class="dashboard-card rejected">
          <div class="card-icon">
            <i class="feather icon-x-circle"></i>
          </div>
          <div class="card-content">
            <h3>{{ getRejectedCount() }}</h3>
            <p>Rejected This Month</p>
          </div>
        </div>

        <div class="dashboard-card total">
          <div class="card-icon">
            <i class="feather icon-dollar-sign"></i>
          </div>
          <div class="card-content">
            <h3>₹{{ getTotalAmount() | number }}</h3>
            <p>Total Amount Pending</p>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="charts-section">
        <div class="chart-card">
          <div class="chart-header">
            <h4>Approval vs Rejection Trend</h4>
            <p>Monthly finance decisions</p>
          </div>
          <div class="chart-container">
            <apx-chart
              [series]="approvalTrendOptions.series"
              [chart]="approvalTrendOptions.chart"
              [xaxis]="approvalTrendOptions.xaxis"
              [colors]="approvalTrendOptions.colors"
              [plotOptions]="approvalTrendOptions.plotOptions">
            </apx-chart>
          </div>
        </div>

        <div class="chart-card">
          <div class="chart-header">
            <h4>Department Wise Expenses</h4>
            <p>Reimbursement distribution</p>
          </div>
          <div class="chart-container">
            <apx-chart
              [series]="departmentExpenseOptions.series"
              [chart]="departmentExpenseOptions.chart"
              [labels]="departmentExpenseOptions.labels"
              [colors]="departmentExpenseOptions.colors"
              [plotOptions]="departmentExpenseOptions.plotOptions">
            </apx-chart>
          </div>
        </div>
      </div>

      <!-- Pending Approvals Table -->
      <div class="approvals-section">
        <div class="section-header">
          <h3>Pending Finance Approvals</h3>
          <div class="header-actions">
            <select [(ngModel)]="selectedDepartment" (change)="filterApprovals()" class="filter-select">
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
            </select>
            <button class="btn btn-export">
              <i class="feather icon-download"></i>
              Export
            </button>
          </div>
        </div>

        <div class="table-card">
          <table class="finance-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Manager Approved</th>
                <th>Description</th>
                <th>Attachments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let approval of filteredApprovals">
                <td>
                  <div class="employee-info">
                    <div class="employee-avatar">
                      {{ approval.employeeName.charAt(0) }}
                    </div>
                    <div class="employee-details">
                      <span class="name">{{ approval.employeeName }}</span>
                      <span class="id">ID: {{ approval.employeeId }}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="department-badge">{{ approval.department }}</span>
                </td>
                <td>
                  <span class="category-badge" [class]="'category-' + approval.category.toLowerCase()">
                    {{ approval.category }}
                  </span>
                </td>
                <td class="amount">₹{{ approval.amount | number }}</td>
                <td>
                  <div class="approval-info">
                    <span class="date">{{ approval.managerApprovalDate | date:'shortDate' }}</span>
                    <span class="manager">{{ approval.managerName }}</span>
                  </div>
                </td>
                <td class="description">{{ approval.description }}</td>
                <td>
                  <div class="attachments" *ngIf="approval.attachments?.length > 0">
                    <button class="btn-attachment" *ngFor="let attachment of approval.attachments" 
                            (click)="viewAttachment(attachment)">
                      <i class="feather icon-paperclip"></i>
                      {{ attachment }}
                    </button>
                  </div>
                  <span *ngIf="!approval.attachments?.length" class="no-attachments">No attachments</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-action approve" (click)="openFinanceModal(approval, 'approve')">
                      <i class="feather icon-check"></i>
                      Approve
                    </button>
                    <button class="btn-action reject" (click)="openFinanceModal(approval, 'reject')">
                      <i class="feather icon-x"></i>
                      Reject
                    </button>
                    <button class="btn-action view" (click)="viewDetails(approval)">
                      <i class="feather icon-eye"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="empty-state" *ngIf="filteredApprovals.length === 0">
            <i class="feather icon-check-circle"></i>
            <h3>All caught up!</h3>
            <p>No reimbursements pending finance approval.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Finance Approval Modal -->
    <div class="modal-overlay" *ngIf="showFinanceModal" (click)="closeFinanceModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ financeAction === 'approve' ? 'Finance Approval' : 'Finance Rejection' }}</h3>
          <button class="btn-close" (click)="closeFinanceModal()">
            <i class="feather icon-x"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="approval-summary">
            <div class="summary-row">
              <span class="label">Employee:</span>
              <span class="value">{{ selectedApproval?.employeeName }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Department:</span>
              <span class="value">{{ selectedApproval?.department }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Amount:</span>
              <span class="value amount">₹{{ selectedApproval?.amount | number }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Category:</span>
              <span class="value">{{ selectedApproval?.category }}</span>
            </div>
            <div class="summary-row">
              <span class="label">Manager Approved:</span>
              <span class="value">{{ selectedApproval?.managerApprovalDate | date:'medium' }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Finance Comments</label>
            <textarea [(ngModel)]="financeComments" class="form-control" rows="4" 
                      placeholder="Add your finance review comments..."></textarea>
          </div>

          <div class="form-group" *ngIf="financeAction === 'approve'">
            <label>Payment Method</label>
            <select [(ngModel)]="paymentMethod" class="form-control">
              <option value="">Select Payment Method</option>
              <option value="BankTransfer">Bank Transfer</option>
              <option value="Cheque">Cheque</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeFinanceModal()">Cancel</button>
          <button class="btn" [class]="financeAction === 'approve' ? 'btn-success' : 'btn-danger'" 
                  (click)="confirmFinanceAction()" [disabled]="isProcessingFinance">
            <i class="feather" [class]="financeAction === 'approve' ? 'icon-check' : 'icon-x'"></i>
            {{ isProcessingFinance ? 'Processing...' : (financeAction === 'approve' ? 'Approve & Process Payment' : 'Reject Request') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .finance-container {
      padding: 24px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h2 {
      margin: 0 0 8px 0;
      color: #2d3748;
      font-weight: 600;
    }

    .dashboard-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .dashboard-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .dashboard-card:hover {
      transform: translateY(-2px);
    }

    .card-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }

    .dashboard-card.pending .card-icon { background: #ed8936; }
    .dashboard-card.approved .card-icon { background: #48bb78; }
    .dashboard-card.rejected .card-icon { background: #f56565; }
    .dashboard-card.total .card-icon { background: #4299e1; }

    .card-content h3 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 700;
      color: #2d3748;
    }

    .card-content p {
      margin: 0;
      color: #718096;
      font-size: 14px;
    }

    .charts-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .chart-header h4 {
      margin: 0 0 4px 0;
      color: #2d3748;
      font-weight: 600;
    }

    .chart-header p {
      margin: 0 0 20px 0;
      color: #718096;
      font-size: 14px;
    }

    .approvals-section {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h3 {
      margin: 0;
      color: #2d3748;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: white;
      cursor: pointer;
    }

    .btn-export {
      padding: 8px 16px;
      background: #4299e1;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .finance-table {
      width: 100%;
      border-collapse: collapse;
    }

    .finance-table th {
      background: #f7fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #4a5568;
      border-bottom: 1px solid #e2e8f0;
    }

    .finance-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .employee-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #4299e1;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .employee-details {
      display: flex;
      flex-direction: column;
    }

    .employee-details .name {
      font-weight: 500;
      color: #2d3748;
    }

    .employee-details .id {
      font-size: 12px;
      color: #718096;
    }

    .department-badge {
      background: #e6fffa;
      color: #319795;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .category-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .category-travel { background: #bee3f8; color: #2a69ac; }
    .category-medical { background: #fed7d7; color: #c53030; }
    .category-food { background: #c6f6d5; color: #22543d; }

    .approval-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .approval-info .date {
      font-weight: 500;
      color: #2d3748;
    }

    .approval-info .manager {
      font-size: 12px;
      color: #718096;
    }

    .btn-attachment {
      background: #ebf8ff;
      color: #3182ce;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      margin-right: 4px;
      margin-bottom: 4px;
    }

    .action-buttons {
      display: flex;
      gap: 6px;
    }

    .btn-action {
      padding: 6px 12px;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .btn-action.approve {
      background: #c6f6d5;
      color: #22543d;
    }

    .btn-action.reject {
      background: #fed7d7;
      color: #c53030;
    }

    .btn-action.view {
      background: #e6fffa;
      color: #319795;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 24px 24px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-body {
      padding: 24px;
    }

    .approval-summary {
      background: #f7fafc;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 24px;
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .summary-row:last-child {
      margin-bottom: 0;
    }

    .summary-row .label {
      font-weight: 500;
      color: #4a5568;
    }

    .summary-row .value {
      color: #2d3748;
    }

    .summary-row .value.amount {
      font-weight: 600;
      color: #4299e1;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #4a5568;
    }

    .form-control {
      width: 100%;
      padding: 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }

    .modal-footer {
      padding: 0 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn {
      padding: 10px 20px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .btn-success { background: #48bb78; color: white; }
    .btn-danger { background: #f56565; color: white; }
    .btn-secondary { background: #e2e8f0; color: #4a5568; }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #718096;
    }

    .empty-state i {
      font-size: 48px;
      margin-bottom: 16px;
      color: #48bb78;
    }

    @media (max-width: 768px) {
      .dashboard-cards {
        grid-template-columns: 1fr;
      }
      
      .charts-section {
        grid-template-columns: 1fr;
      }
      
      .section-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
    }
  `]
})
export class FinanceApprovalsComponent implements OnInit {
  pendingFinanceApprovals: any[] = [];
  filteredApprovals: any[] = [];
  selectedDepartment = '';
  
  showFinanceModal = false;
  selectedApproval: any = null;
  financeAction = '';
  financeComments = '';
  paymentMethod = '';
  isProcessingFinance = false;

  approvalTrendOptions = {
    series: [
      { name: 'Approved', data: [45, 52, 48, 61, 55, 67] },
      { name: 'Rejected', data: [8, 12, 7, 15, 9, 11] }
    ],
    chart: {
      type: 'bar' as const,
      height: 300,
      toolbar: { show: false }
    },
    xaxis: {
      categories: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    colors: ['#48bb78', '#f56565'],
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%'
      }
    }
  };

  departmentExpenseOptions = {
    series: [35, 25, 20, 15, 5],
    chart: {
      type: 'donut' as const,
      height: 300
    },
    labels: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'],
    colors: ['#4299e1', '#48bb78', '#ed8936', '#9f7aea', '#f56565'],
    plotOptions: {
      pie: {
        donut: {
          size: '60%'
        }
      }
    }
  };

  constructor(private reimbursementService: ReimbursementService) {}

  ngOnInit(): void {
    this.loadPendingFinanceApprovals();
  }

  loadPendingFinanceApprovals(): void {
    this.reimbursementService.getPendingFinanceApprovals().subscribe({
      next: (data) => {
        this.pendingFinanceApprovals = data;
        this.filteredApprovals = [...data];
      },
      error: (error) => {
        console.error('Error loading pending finance approvals:', error);
        this.pendingFinanceApprovals = [];
        this.filteredApprovals = [];
      }
    });
  }

  filterApprovals(): void {
    this.filteredApprovals = this.pendingFinanceApprovals.filter(approval =>
      !this.selectedDepartment || approval.department === this.selectedDepartment
    );
  }

  getApprovedCount(): number {
    return 67; // Mock data
  }

  getRejectedCount(): number {
    return 11; // Mock data
  }

  getTotalAmount(): number {
    return this.pendingFinanceApprovals.reduce((sum, approval) => sum + approval.amount, 0);
  }

  openFinanceModal(approval: any, action: string): void {
    this.selectedApproval = approval;
    this.financeAction = action;
    this.financeComments = '';
    this.paymentMethod = '';
    this.showFinanceModal = true;
  }

  closeFinanceModal(): void {
    this.showFinanceModal = false;
    this.selectedApproval = null;
    this.financeComments = '';
    this.paymentMethod = '';
  }

  confirmFinanceAction(): void {
    this.isProcessingFinance = true;
    
    const action = this.financeAction === 'approve' ?
      this.reimbursementService.approveByFinance(this.selectedApproval.reimbursementId, this.financeComments) :
      this.reimbursementService.rejectByFinance(this.selectedApproval.reimbursementId, this.financeComments);
    
    action.subscribe({
      next: () => {
        this.loadPendingFinanceApprovals();
        this.isProcessingFinance = false;
        this.closeFinanceModal();
      },
      error: (error) => {
        console.error('Error processing finance approval:', error);
        this.isProcessingFinance = false;
      }
    });
  }

  viewAttachment(attachment: string): void {
    console.log('View attachment:', attachment);
  }

  viewDetails(approval: any): void {
    console.log('View details:', approval);
  }
}