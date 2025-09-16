import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-all-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>All Requests</h1>
        <p>Company-wide view of all employee requests</p>
      </div>

      <div class="filters-section">
        <div class="filter-row">
          <div class="filter-group">
            <label class="form-label">Request Type</label>
            <select class="form-control form-select" [(ngModel)]="filterType" (change)="applyFilters()">
              <option value="">All Types</option>
              <option value="Payroll">Payroll</option>
              <option value="Loan">Loan</option>
              <option value="Reimbursement">Reimbursement</option>
              <option value="Medical">Medical Claim</option>
              <option value="Insurance">Insurance</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="form-label">Status</label>
            <select class="form-control form-select" [(ngModel)]="filterStatus" (change)="applyFilters()">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Manager Approved">Manager Approved</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="form-label">Department</label>
            <select class="form-control form-select" [(ngModel)]="filterDepartment" (change)="applyFilters()">
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="form-label">Date Range</label>
            <input type="date" class="form-control" [(ngModel)]="filterStartDate" (change)="applyFilters()">
            <input type="date" class="form-control mt-1" [(ngModel)]="filterEndDate" (change)="applyFilters()">
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="d-flex justify-between align-center">
            <h3 class="card-title">All Requests ({{ filteredRequests.length }})</h3>
            <button class="btn btn-primary" (click)="exportToExcel()">📊 Export to Excel</button>
          </div>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Manager</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let request of filteredRequests">
                  <td>
                    <div>
                      <strong>{{ request.employeeName }}</strong>
                      <small class="d-block text-muted">{{ request.employeeId }}</small>
                    </div>
                  </td>
                  <td>{{ request.department }}</td>
                  <td>
                    <span class="request-type">{{ request.type }}</span>
                  </td>
                  <td>{{ request.amount | currency }}</td>
                  <td>{{ request.submittedDate | date:'short' }}</td>
                  <td>
                    <span class="badge" [ngClass]="getBadgeClass(request.status)">
                      {{ request.status }}
                    </span>
                  </td>
                  <td>{{ request.managerName || '-' }}</td>
                  <td>
                    <button class="btn btn-sm btn-secondary" (click)="viewDetails(request)">View</button>
                  </td>
                </tr>
                <tr *ngIf="filteredRequests.length === 0">
                  <td colspan="8" class="text-center">No requests found</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="summary-cards">
        <div class="summary-card">
          <div class="summary-value">{{ getTotalAmount() | currency }}</div>
          <div class="summary-label">Total Amount</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">{{ getApprovedCount() }}</div>
          <div class="summary-label">Approved Requests</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">{{ getPendingCount() }}</div>
          <div class="summary-label">Pending Requests</div>
        </div>
        <div class="summary-card">
          <div class="summary-value">{{ getRejectedCount() }}</div>
          <div class="summary-label">Rejected Requests</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; }
    .filters-section { background: var(--bg-primary); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2rem; border: 1px solid var(--border-color); }
    .filter-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; }
    .filter-group label { font-size: 0.875rem; font-weight: 500; }
    .request-type { font-weight: 600; text-transform: uppercase; font-size: 0.75rem; }
    .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 2rem; }
    .summary-card { background: var(--bg-primary); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border-color); text-align: center; }
    .summary-value { font-size: 1.5rem; font-weight: 700; color: var(--primary-color); }
    .summary-label { font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem; }
  `]
})
export class AllRequestsComponent implements OnInit {
  allRequests: any[] = [];
  filteredRequests: any[] = [];
  filterType = '';
  filterStatus = '';
  filterDepartment = '';
  filterStartDate = '';
  filterEndDate = '';

  ngOnInit() {
    this.loadAllRequests();
  }

  loadAllRequests() {
    // Demo data - company-wide requests
    this.allRequests = [
      { id: 1, employeeName: 'John Doe', employeeId: 'EMP001', department: 'Engineering', type: 'Payroll', amount: 50000, submittedDate: new Date(), status: 'Approved', managerName: 'Jane Manager' },
      { id: 2, employeeName: 'Mike Johnson', employeeId: 'EMP002', department: 'Sales', type: 'Loan', amount: 100000, submittedDate: new Date(), status: 'Pending', managerName: 'Bob Manager' },
      { id: 3, employeeName: 'Sarah Wilson', employeeId: 'EMP003', department: 'Marketing', type: 'Reimbursement', amount: 5000, submittedDate: new Date(), status: 'Manager Approved', managerName: 'Alice Manager' },
      { id: 4, employeeName: 'David Brown', employeeId: 'EMP004', department: 'HR', type: 'Medical', amount: 15000, submittedDate: new Date(), status: 'Rejected', managerName: 'Carol Manager' },
      { id: 5, employeeName: 'Lisa Garcia', employeeId: 'EMP005', department: 'Engineering', type: 'Insurance', amount: 0, submittedDate: new Date(), status: 'Pending', managerName: 'Jane Manager' }
    ];
    this.filteredRequests = [...this.allRequests];
  }

  applyFilters() {
    this.filteredRequests = this.allRequests.filter(request => {
      return (!this.filterType || request.type === this.filterType) &&
             (!this.filterStatus || request.status === this.filterStatus) &&
             (!this.filterDepartment || request.department === this.filterDepartment);
    });
  }

  getBadgeClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'approved': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'manager approved': return 'badge-info';
      case 'rejected': return 'badge-error';
      default: return 'badge-secondary';
    }
  }

  getTotalAmount(): number {
    return this.filteredRequests.reduce((sum, req) => sum + req.amount, 0);
  }

  getApprovedCount(): number {
    return this.filteredRequests.filter(req => req.status === 'Approved').length;
  }

  getPendingCount(): number {
    return this.filteredRequests.filter(req => req.status === 'Pending').length;
  }

  getRejectedCount(): number {
    return this.filteredRequests.filter(req => req.status === 'Rejected').length;
  }

  viewDetails(request: any) {
    alert(`Request Details:\nEmployee: ${request.employeeName}\nType: ${request.type}\nAmount: ${request.amount}\nStatus: ${request.status}`);
  }

  exportToExcel() {
    console.log('Exporting to Excel:', this.filteredRequests);
    alert('Exporting data to Excel...');
  }
}