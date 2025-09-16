import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reimbursement-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Reimbursement Approvals</h1>
        <p>Review and approve pending reimbursement requests</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon pending">
            <span class="material-icons">pending</span>
          </div>
          <div class="stat-content">
            <h3>{{ pendingCount }}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon approved">
            <span class="material-icons">check_circle</span>
          </div>
          <div class="stat-content">
            <h3>{{ approvedCount }}</h3>
            <p>Approved Today</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon rejected">
            <span class="material-icons">cancel</span>
          </div>
          <div class="stat-content">
            <h3>{{ rejectedCount }}</h3>
            <p>Rejected Today</p>
          </div>
        </div>
      </div>

      <div class="reimbursements-section">
        <div class="section-header">
          <h2>Pending Reimbursement Requests</h2>
          <div class="filter-controls">
            <select [(ngModel)]="selectedFilter" (change)="filterReimbursements()" class="filter-select">
              <option value="">All Categories</option>
              <option value="Travel">Travel</option>
              <option value="Medical">Medical</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Training">Training</option>
            </select>
          </div>
        </div>

        <div class="reimbursements-grid">
          <div class="reimbursement-card" *ngFor="let reimbursement of filteredReimbursements">
            <div class="reimbursement-header">
              <div class="employee-info">
                <div class="employee-name">{{ reimbursement.employeeName }}</div>
                <div class="employee-dept">{{ reimbursement.department }} • {{ reimbursement.category }}</div>
              </div>
              <div class="status-badge" [ngClass]="reimbursement.status.toLowerCase()">
                {{ reimbursement.status }}
              </div>
            </div>
            
            <div class="reimbursement-details">
              <div class="detail-row">
                <span class="label">Amount:</span>
                <span class="value amount">₹{{ reimbursement.amount | number:'1.2-2' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Expense Date:</span>
                <span class="value">{{ reimbursement.expenseDate | date:'shortDate' }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Description:</span>
                <span class="value">{{ reimbursement.description }}</span>
              </div>
            </div>

            <div class="reimbursement-actions">
              <button class="btn btn-success" (click)="approveReimbursement(reimbursement)">
                <span class="material-icons">check</span>
                Approve
              </button>
              <button class="btn btn-danger" (click)="rejectReimbursement(reimbursement)">
                <span class="material-icons">close</span>
                Reject
              </button>
            </div>
          </div>
        </div>

        <div class="empty-state" *ngIf="filteredReimbursements.length === 0">
          <div class="empty-icon">
            <span class="material-icons">check_circle</span>
          </div>
          <h3>No Pending Reimbursements</h3>
          <p>All reimbursement requests have been reviewed.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      max-width: 1400px;
      margin: 0 auto;
      background: #f8fafc;
      min-height: 100vh;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .page-header p {
      color: #64748b;
      margin: 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }

    .stat-card:hover {
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .stat-icon.pending { background: #f59e0b; }
    .stat-icon.approved { background: #10b981; }
    .stat-icon.rejected { background: #ef4444; }

    .stat-content h3 {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 4px 0;
      color: #1e293b;
    }

    .stat-content p {
      color: #64748b;
      margin: 0;
      font-size: 14px;
    }

    .reimbursements-section {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .section-header h2 {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      background: white;
      color: #1e293b;
    }

    .reimbursements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 24px;
    }

    .reimbursement-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      transition: all 0.2s;
      background: #fafbfc;
    }

    .reimbursement-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .reimbursement-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
      padding-bottom: 16px;
      border-bottom: 1px solid #f1f5f9;
    }

    .employee-name {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
    }

    .employee-dept {
      color: #64748b;
      font-size: 14px;
    }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-badge.pending {
      background: #fef3c7;
      color: #d97706;
    }

    .reimbursement-details {
      margin-bottom: 20px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .detail-row .label {
      color: #64748b;
      font-size: 14px;
      font-weight: 500;
    }

    .detail-row .value {
      color: #1e293b;
      font-weight: 500;
      font-size: 14px;
    }

    .detail-row .amount {
      color: #059669;
      font-weight: 700;
      font-size: 16px;
    }

    .reimbursement-actions {
      display: flex;
      gap: 8px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 8px 16px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      flex: 1;
      justify-content: center;
    }

    .btn-success {
      background: #10b981;
      color: white;
    }

    .btn-success:hover {
      background: #059669;
    }

    .btn-danger {
      background: #ef4444;
      color: white;
    }

    .btn-danger:hover {
      background: #dc2626;
    }

    .empty-state {
      text-align: center;
      padding: 48px;
    }

    .empty-icon .material-icons {
      font-size: 64px;
      color: #10b981;
      margin-bottom: 16px;
    }

    .empty-state h3 {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .empty-state p {
      color: #64748b;
      margin: 0;
    }

    @media (max-width: 768px) {
      .reimbursements-grid {
        grid-template-columns: 1fr;
      }
      
      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      
      .reimbursement-actions {
        flex-direction: column;
      }
    }
  `]
})
export class ReimbursementApprovalsComponent implements OnInit {
  pendingCount = 7;
  approvedCount = 15;
  rejectedCount = 2;
  selectedFilter = '';

  allReimbursements = [
    {
      id: 1,
      employeeName: 'John Doe',
      department: 'Engineering',
      category: 'Travel',
      amount: 850.00,
      expenseDate: new Date('2024-12-10'),
      description: 'Business trip to client site',
      status: 'Pending'
    },
    {
      id: 2,
      employeeName: 'Sarah Wilson',
      department: 'Sales',
      category: 'Travel',
      amount: 1200.00,
      expenseDate: new Date('2024-12-09'),
      description: 'Conference attendance and accommodation',
      status: 'Pending'
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      department: 'Marketing',
      category: 'Office Supplies',
      amount: 320.50,
      expenseDate: new Date('2024-12-08'),
      description: 'Office equipment and stationery',
      status: 'Pending'
    }
  ];

  filteredReimbursements = [...this.allReimbursements];

  ngOnInit() {
    this.filterReimbursements();
  }

  filterReimbursements() {
    this.filteredReimbursements = this.selectedFilter 
      ? this.allReimbursements.filter(reimbursement => reimbursement.category === this.selectedFilter)
      : this.allReimbursements;
  }

  approveReimbursement(reimbursement: any) {
    if (confirm(`Approve reimbursement for ${reimbursement.employeeName}?`)) {
      this.allReimbursements = this.allReimbursements.filter(r => r.id !== reimbursement.id);
      this.filterReimbursements();
      this.pendingCount--;
      this.approvedCount++;
      alert('Reimbursement approved successfully!');
    }
  }

  rejectReimbursement(reimbursement: any) {
    const reason = prompt(`Reason for rejecting reimbursement:`);
    if (reason && reason.trim()) {
      this.allReimbursements = this.allReimbursements.filter(r => r.id !== reimbursement.id);
      this.filterReimbursements();
      this.pendingCount--;
      this.rejectedCount++;
      alert('Reimbursement rejected successfully!');
    }
  }
}