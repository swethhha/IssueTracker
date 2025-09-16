import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PayrollService } from '../../services/payroll.service';
import { LoanService } from '../../services/loan.service';
import { ReimbursementService } from '../../services/reimbursement.service';
import { InsuranceService } from '../../services/insurance.service';
import { MedicalClaimService } from '../../services/medical-claim.service';

@Component({
  selector: 'app-request-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <div class="page-header">
        <h1>Request Tracker</h1>
        <p>Track all your submitted requests and their status</p>
      </div>

      <div class="filter-section">
        <div class="filter-controls">
          <select [(ngModel)]="selectedType" (change)="filterRequests()" class="filter-select">
            <option value="">All Types</option>
            <option value="payroll">Payroll</option>
            <option value="loan">Loan</option>
            <option value="reimbursement">Reimbursement</option>
            <option value="insurance">Insurance</option>
            <option value="medical">Medical Claim</option>
          </select>

          <select [(ngModel)]="selectedStatus" (change)="filterRequests()" class="filter-select">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button class="btn btn-outline" (click)="refreshData()">
            <span class="material-icons">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      <div class="requests-grid">
        <div class="request-card" *ngFor="let request of filteredRequests">
          <div class="request-header">
            <div class="request-type">
              <span class="type-badge" [ngClass]="getTypeClass(request.type)">
                {{ getTypeLabel(request.type) }}
              </span>
            </div>
            <div class="request-status">
              <span class="status-badge" [ngClass]="getStatusClass(request.status)">
                {{ request.status }}
              </span>
            </div>
          </div>

          <div class="request-content">
            <div class="request-info">
              <h3 class="request-title">{{ request.title }}</h3>
              <p class="request-description">{{ request.description }}</p>
              
              <div class="request-details">
                <div class="detail-item">
                  <span class="detail-label">Amount:</span>
                  <span class="detail-value">₹{{ request.amount | number:'1.0-0' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Submitted:</span>
                  <span class="detail-value">{{ request.submittedDate | date:'medium' }}</span>
                </div>
                <div class="detail-item" *ngIf="request.processedDate">
                  <span class="detail-label">Processed:</span>
                  <span class="detail-value">{{ request.processedDate | date:'medium' }}</span>
                </div>
              </div>
            </div>

            <div class="request-actions">
              <button class="btn btn-outline btn-sm" (click)="viewDetails(request)">
                View Details
              </button>
              <button 
                class="btn btn-danger btn-sm" 
                *ngIf="request.status === 'Pending'"
                (click)="cancelRequest(request)"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="filteredRequests.length === 0">
        <div class="empty-icon">
          <span class="material-icons">assignment</span>
        </div>
        <h3>No requests found</h3>
        <p>No requests match your current filters. Try adjusting your search criteria.</p>
        <button class="btn btn-primary" (click)="clearFilters()">
          Clear Filters
        </button>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--on-surface);
      margin: 0;
    }

    .page-header p {
      color: var(--on-surface-variant);
      margin: 0.5rem 0 0 0;
    }

    .filter-section {
      background: var(--surface);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      margin-bottom: 2rem;
    }

    .filter-controls {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .filter-select {
      padding: 0.5rem 1rem;
      border: 1px solid var(--outline);
      border-radius: var(--radius-md);
      background: var(--surface);
      color: var(--on-surface);
    }

    .requests-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .request-card {
      background: var(--surface);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
      overflow: hidden;
      transition: box-shadow 0.2s;
    }

    .request-card:hover {
      box-shadow: var(--shadow-2);
    }

    .request-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: var(--surface-variant);
      border-bottom: 1px solid var(--outline-variant);
    }

    .type-badge {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .type-badge.payroll { background: #e3f2fd; color: #1976d2; }
    .type-badge.loan { background: #f3e5f5; color: #7b1fa2; }
    .type-badge.reimbursement { background: #e8f5e8; color: #388e3c; }
    .type-badge.insurance { background: #fff3e0; color: #f57c00; }
    .type-badge.medical { background: #fce4ec; color: #c2185b; }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .status-badge.pending { background: #fff3cd; color: #856404; }
    .status-badge.approved { background: #d4edda; color: #155724; }
    .status-badge.rejected { background: #f8d7da; color: #721c24; }

    .request-content {
      padding: 1.5rem;
    }

    .request-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: var(--on-surface);
      margin: 0 0 0.5rem 0;
    }

    .request-description {
      color: var(--on-surface-variant);
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }

    .request-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .detail-label {
      font-size: 0.875rem;
      color: var(--on-surface-variant);
    }

    .detail-value {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--on-surface);
    }

    .request-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--surface);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-icon .material-icons {
      font-size: 64px;
      color: var(--on-surface-variant);
    }

    .empty-state h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--on-surface);
      margin: 0 0 0.5rem 0;
    }

    .empty-state p {
      color: var(--on-surface-variant);
      margin: 0 0 2rem 0;
    }

    @media (max-width: 768px) {
      .filter-controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      .requests-grid {
        grid-template-columns: 1fr;
      }
      
      .request-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RequestTrackerComponent implements OnInit {
  allRequests: any[] = [];
  filteredRequests: any[] = [];
  selectedType = '';
  selectedStatus = '';

  constructor(
    private payrollService: PayrollService,
    private loanService: LoanService,
    private reimbursementService: ReimbursementService,
    private insuranceService: InsuranceService,
    private medicalClaimService: MedicalClaimService
  ) {}

  ngOnInit() {
    this.loadAllRequests();
  }

  loadAllRequests() {
    // Demo data for all request types
    this.allRequests = [
      {
        id: 1,
        type: 'loan',
        title: 'Personal Loan Application',
        description: 'Home renovation loan',
        amount: 200000,
        status: 'Pending',
        submittedDate: new Date(2024, 11, 1)
      },
      {
        id: 2,
        type: 'reimbursement',
        title: 'Travel Reimbursement',
        description: 'Client meeting travel expenses',
        amount: 5000,
        status: 'Approved',
        submittedDate: new Date(2024, 10, 15)
      },
      {
        id: 3,
        type: 'insurance',
        title: 'Health Insurance Enrollment',
        description: 'Family health coverage',
        amount: 25000,
        status: 'Pending',
        submittedDate: new Date(2024, 11, 10)
      },
      {
        id: 4,
        type: 'medical',
        title: 'Medical Claim - Surgery',
        description: 'Hospital treatment expenses',
        amount: 15000,
        status: 'Rejected',
        submittedDate: new Date(2024, 10, 20)
      }
    ];
    this.filterRequests();
  }

  filterRequests() {
    this.filteredRequests = this.allRequests.filter(request => {
      const typeMatch = !this.selectedType || request.type === this.selectedType;
      const statusMatch = !this.selectedStatus || request.status === this.selectedStatus;
      return typeMatch && statusMatch;
    });
  }

  refreshData() {
    this.loadAllRequests();
  }

  clearFilters() {
    this.selectedType = '';
    this.selectedStatus = '';
    this.filterRequests();
  }

  getTypeClass(type: string): string {
    return type.toLowerCase();
  }

  getTypeLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'payroll': 'Payroll',
      'loan': 'Loan',
      'reimbursement': 'Reimbursement',
      'insurance': 'Insurance',
      'medical': 'Medical Claim'
    };
    return labels[type] || type;
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  viewDetails(request: any) {
    alert(`Request Details:\nType: ${request.type}\nAmount: ₹${request.amount}\nStatus: ${request.status}`);
  }

  cancelRequest(request: any) {
    if (confirm('Are you sure you want to cancel this request?')) {
      request.status = 'Cancelled';
      this.filterRequests();
    }
  }
}