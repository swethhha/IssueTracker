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
    <div style="padding: 20px; width: 100%; margin: 0;">
      <h2>Request Tracker</h2>
      <p>Track all your submitted requests and their status</p>
      
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <!-- Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
          <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #2563eb;">{{ getTotalCount() }}</div>
            <div style="color: #64748b; font-size: 14px;">Total Requests</div>
          </div>
          <div style="background: #fef3c7; padding: 20px; border-radius: 10px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #d97706;">{{ getPendingCount() }}</div>
            <div style="color: #64748b; font-size: 14px;">Pending</div>
          </div>
          <div style="background: #dcfce7; padding: 20px; border-radius: 10px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #16a34a;">{{ getApprovedCount() }}</div>
            <div style="color: #64748b; font-size: 14px;">Approved</div>
          </div>
          <div style="background: #fecaca; padding: 20px; border-radius: 10px; text-align: center;">
            <div style="font-size: 24px; font-weight: bold; color: #dc2626;">{{ getRejectedCount() }}</div>
            <div style="color: #64748b; font-size: 14px;">Rejected</div>
          </div>
        </div>

        <!-- Filters -->
        <div style="display: flex; gap: 15px; margin-bottom: 25px; align-items: center;">
          <select [(ngModel)]="selectedType" (change)="filterRequests()" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; background: white;">
            <option value="">All Types</option>
            <option value="loan">Loans</option>
            <option value="reimbursement">Reimbursements</option>
            <option value="insurance">Insurance</option>
            <option value="medical">Medical Claims</option>
          </select>

          <select [(ngModel)]="selectedStatus" (change)="filterRequests()" style="padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 6px; background: white;">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="ManagerApproved">Manager Approved</option>
            <option value="Approved">Finance Approved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button (click)="refreshData()" style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            🔄 Refresh
          </button>
          
          <button (click)="clearFilters()" style="background: #64748b; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">
            Clear Filters
          </button>
        </div>

        <!-- Requests Table -->
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; background: white;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #e2e8f0;">
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Type</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Description</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Amount</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Status</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Submitted</th>
                <th style="padding: 12px; text-align: left; font-weight: 600; color: #374151;">Progress</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let request of filteredRequests" style="border-bottom: 1px solid #f1f5f9;">
                <td style="padding: 12px;">
                  <span [style.background]="getTypeBadgeColor(request.type)" style="padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; color: white;">
                    {{ getTypeLabel(request.type) }}
                  </span>
                </td>
                <td style="padding: 12px;">
                  <div style="font-weight: 500; color: #374151;">{{ request.title }}</div>
                  <div style="font-size: 14px; color: #64748b;">{{ request.description }}</div>
                </td>
                <td style="padding: 12px; font-weight: 500; color: #374151;">₹{{ request.amount | number:'1.0-0' }}</td>
                <td style="padding: 12px;">
                  <span [style.background]="getStatusBadgeColor(request.status)" [style.color]="getStatusTextColor(request.status)" style="padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 500; border: 1px solid; border-color: inherit;">
                    {{ getStatusLabel(request.status) }}
                  </span>
                </td>
                <td style="padding: 12px; color: #64748b; font-size: 14px;">{{ request.submittedDate | date:'MMM dd, yyyy' }}</td>
                <td style="padding: 12px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="width: 100px; height: 6px; background: #e2e8f0; border-radius: 3px; overflow: hidden;">
                      <div [style.width]="getProgressWidth(request.status)" [style.background]="getProgressColor(request.status)" style="height: 100%; transition: width 0.3s;"></div>
                    </div>
                    <span style="font-size: 12px; color: #64748b;">{{ getProgressText(request.status) }}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredRequests.length === 0" style="text-align: center; padding: 40px; color: #64748b;">
          <div style="font-size: 48px; margin-bottom: 16px;">📄</div>
          <h3 style="color: #374151; margin-bottom: 8px;">No requests found</h3>
          <p style="margin-bottom: 20px;">No requests match your current filters. Try adjusting your search criteria.</p>
          <button (click)="clearFilters()" style="background: #3b82f6; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
            Clear Filters
          </button>
        </div>
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

  async loadAllRequests() {
    this.allRequests = [];
    
    try {
      // Load loans
      const loans = await this.loanService.getMyLoans().toPromise();
      loans?.forEach(loan => {
        this.allRequests.push({
          id: loan.loanId,
          type: 'loan',
          title: `${loan.loanType} Loan`,
          description: loan.purpose,
          amount: loan.amount,
          status: loan.status,
          submittedDate: new Date(loan.appliedDate)
        });
      });
    } catch (error) {
      console.log('Error loading loans:', error);
    }

    try {
      // Load reimbursements
      const reimbursements = await this.reimbursementService.getMyReimbursements().toPromise();
      reimbursements?.forEach(reimb => {
        this.allRequests.push({
          id: reimb.reimbursementId,
          type: 'reimbursement',
          title: `${reimb.category} Reimbursement`,
          description: reimb.description,
          amount: reimb.amount,
          status: reimb.status,
          submittedDate: new Date(reimb.requestDate)
        });
      });
    } catch (error) {
      console.log('Error loading reimbursements:', error);
    }

    try {
      // Load medical claims
      const claims = await this.medicalClaimService.getMyClaims().toPromise();
      claims?.forEach(claim => {
        this.allRequests.push({
          id: claim.claimId,
          type: 'medical',
          title: `Medical Claim - ${claim.treatmentType}`,
          description: claim.diagnosis,
          amount: claim.claimAmount,
          status: claim.status,
          submittedDate: new Date(claim.claimDate)
        });
      });
    } catch (error) {
      console.log('Error loading medical claims:', error);
    }

    // Add demo data if no real data
    if (this.allRequests.length === 0) {
      this.allRequests = [
        {
          id: 1,
          type: 'loan',
          title: 'Personal Loan Application',
          description: 'Home renovation expenses',
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
          status: 'ManagerApproved',
          submittedDate: new Date(2024, 10, 15)
        },
        {
          id: 3,
          type: 'medical',
          title: 'Medical Claim - Surgery',
          description: 'Hospital treatment expenses',
          amount: 15000,
          status: 'Approved',
          submittedDate: new Date(2024, 10, 20)
        }
      ];
    }
    
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

  getTotalCount(): number {
    return this.allRequests.length;
  }

  getPendingCount(): number {
    return this.allRequests.filter(r => r.status === 'Pending').length;
  }

  getApprovedCount(): number {
    return this.allRequests.filter(r => r.status === 'Approved').length;
  }

  getRejectedCount(): number {
    return this.allRequests.filter(r => r.status === 'Rejected').length;
  }

  getTypeBadgeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'loan': '#7c3aed',
      'reimbursement': '#059669',
      'insurance': '#ea580c',
      'medical': '#dc2626'
    };
    return colors[type] || '#64748b';
  }

  getStatusBadgeColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Pending': '#fef3c7',
      'ManagerApproved': '#dbeafe',
      'Approved': '#dcfce7',
      'Rejected': '#fecaca'
    };
    return colors[status] || '#f1f5f9';
  }

  getStatusTextColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Pending': '#92400e',
      'ManagerApproved': '#1e40af',
      'Approved': '#166534',
      'Rejected': '#991b1b'
    };
    return colors[status] || '#64748b';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'Pending': 'Pending',
      'ManagerApproved': 'Manager Approved',
      'Approved': 'Finance Approved',
      'Rejected': 'Rejected'
    };
    return labels[status] || status;
  }

  getProgressWidth(status: string): string {
    const widths: { [key: string]: string } = {
      'Pending': '25%',
      'ManagerApproved': '75%',
      'Approved': '100%',
      'Rejected': '100%'
    };
    return widths[status] || '0%';
  }

  getProgressColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Pending': '#d97706',
      'ManagerApproved': '#2563eb',
      'Approved': '#059669',
      'Rejected': '#dc2626'
    };
    return colors[status] || '#e5e7eb';
  }

  getProgressText(status: string): string {
    const texts: { [key: string]: string } = {
      'Pending': '1/3',
      'ManagerApproved': '2/3',
      'Approved': '3/3',
      'Rejected': 'X'
    };
    return texts[status] || '0/3';
  }

  viewDetails(request: any) {
    const details = `Request Details:

Type: ${this.getTypeLabel(request.type)}
Description: ${request.description}
Amount: ₹${request.amount.toLocaleString()}
Status: ${this.getStatusLabel(request.status)}
Submitted: ${request.submittedDate.toLocaleDateString()}`;
    alert(details);
  }

  cancelRequest(request: any) {
    if (confirm('Are you sure you want to cancel this request?')) {
      request.status = 'Cancelled';
      this.filterRequests();
    }
  }
}