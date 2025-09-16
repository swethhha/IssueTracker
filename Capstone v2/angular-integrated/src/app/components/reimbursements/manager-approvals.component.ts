import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReimbursementService } from '../../services/reimbursement.service';
import { ReimbursementResponse } from '../../models/reimbursement.models';

@Component({
  selector: 'app-manager-approvals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="approvals-container">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card pending">
          <div class="card-icon">
            <i class="feather icon-clock"></i>
          </div>
          <div class="card-content">
            <h3>{{ pendingReimbursements.length }}</h3>
            <p>Pending Approvals</p>
          </div>
        </div>

        <div class="summary-card total">
          <div class="card-icon">
            <i class="feather icon-dollar-sign"></i>
          </div>
          <div class="card-content">
            <h3>₹{{ getTotalPendingAmount() | number }}</h3>
            <p>Total Amount</p>
          </div>
        </div>

        <div class="summary-card approved">
          <div class="card-icon">
            <i class="feather icon-check-circle"></i>
          </div>
          <div class="card-content">
            <h3>{{ getApprovedCount() }}</h3>
            <p>Approved This Month</p>
          </div>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div class="bulk-actions" *ngIf="selectedItems.length > 0">
        <div class="selection-info">
          <span>{{ selectedItems.length }} items selected</span>
        </div>
        <div class="bulk-buttons">
          <button class="btn btn-success" (click)="bulkApprove()">
            <i class="feather icon-check"></i>
            Approve Selected
          </button>
          <button class="btn btn-danger" (click)="bulkReject()">
            <i class="feather icon-x"></i>
            Reject Selected
          </button>
        </div>
      </div>

      <!-- Approvals Table -->
      <div class="table-card">
        <div class="table-header">
          <h3>Reimbursement Requests</h3>
          <div class="table-actions">
            <input type="text" [(ngModel)]="searchTerm" (input)="filterReimbursements()" 
                   placeholder="Search by employee or description..." class="search-input">
          </div>
        </div>

        <div class="table-container">
          <table class="approvals-table">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" [(ngModel)]="selectAll" (change)="toggleSelectAll()">
                </th>
                <th>Employee</th>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Attachments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let reimbursement of filteredReimbursements">
                <td>
                  <input type="checkbox" [(ngModel)]="reimbursement.selected" (change)="updateSelection()">
                </td>
                <td>
                  <div class="employee-info">
                    <div class="employee-avatar">
                      {{ reimbursement.employeeName.charAt(0) }}
                    </div>
                    <span>{{ reimbursement.employeeName }}</span>
                  </div>
                </td>
                <td>{{ reimbursement.requestDate | date:'shortDate' }}</td>
                <td>
                  <span class="category-badge" [class]="'category-' + reimbursement.category.toLowerCase()">
                    {{ reimbursement.category }}
                  </span>
                </td>
                <td class="description">{{ reimbursement.description }}</td>
                <td class="amount">₹{{ reimbursement.amount | number }}</td>
                <td>
                  <div class="attachments" *ngIf="reimbursement.attachments?.length > 0">
                    <button class="btn-attachment" *ngFor="let attachment of reimbursement.attachments">
                      <i class="feather icon-paperclip"></i>
                      {{ attachment }}
                    </button>
                  </div>
                  <span *ngIf="!reimbursement.attachments?.length" class="no-attachments">No attachments</span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-action approve" (click)="openApprovalModal(reimbursement, 'approve')">
                      <i class="feather icon-check"></i>
                      Approve
                    </button>
                    <button class="btn-action reject" (click)="openApprovalModal(reimbursement, 'reject')">
                      <i class="feather icon-x"></i>
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="empty-state" *ngIf="filteredReimbursements.length === 0">
            <i class="feather icon-inbox"></i>
            <h3>No pending approvals</h3>
            <p>All reimbursement requests have been processed.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Approval Modal -->
    <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>{{ modalAction === 'approve' ? 'Approve' : 'Reject' }} Reimbursement</h3>
          <button class="btn-close" (click)="closeModal()">
            <i class="feather icon-x"></i>
          </button>
        </div>

        <div class="modal-body">
          <div class="reimbursement-details">
            <h4>{{ selectedReimbursement?.employeeName }}</h4>
            <p><strong>Amount:</strong> ₹{{ selectedReimbursement?.amount | number }}</p>
            <p><strong>Category:</strong> {{ selectedReimbursement?.category }}</p>
            <p><strong>Description:</strong> {{ selectedReimbursement?.description }}</p>
          </div>

          <div class="form-group">
            <label>{{ modalAction === 'approve' ? 'Approval' : 'Rejection' }} Comments</label>
            <textarea [(ngModel)]="comments" class="form-control" rows="4" 
                      placeholder="Add your comments (optional)"></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" (click)="closeModal()">Cancel</button>
          <button class="btn" [class]="modalAction === 'approve' ? 'btn-success' : 'btn-danger'" 
                  (click)="confirmAction()" [disabled]="isProcessing">
            <i class="feather" [class]="modalAction === 'approve' ? 'icon-check' : 'icon-x'"></i>
            {{ isProcessing ? 'Processing...' : (modalAction === 'approve' ? 'Approve' : 'Reject') }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .approvals-container {
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

    .page-header p {
      margin: 0;
      color: #718096;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .summary-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

    .summary-card.pending .card-icon { background: #ed8936; }
    .summary-card.total .card-icon { background: #4299e1; }
    .summary-card.approved .card-icon { background: #48bb78; }

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

    .bulk-actions {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .selection-info {
      color: #4a5568;
      font-weight: 500;
    }

    .bulk-buttons {
      display: flex;
      gap: 12px;
    }

    .table-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .table-header {
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .table-header h3 {
      margin: 0;
      color: #2d3748;
      font-weight: 600;
    }

    .search-input {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      width: 300px;
    }

    .approvals-table {
      width: 100%;
      border-collapse: collapse;
    }

    .approvals-table th {
      background: #f7fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #4a5568;
      border-bottom: 1px solid #e2e8f0;
    }

    .approvals-table td {
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
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #4299e1;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 14px;
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
    .category-training { background: #e9d8fd; color: #553c9a; }
    .category-others { background: #e2e8f0; color: #4a5568; }

    .btn-attachment {
      background: #ebf8ff;
      color: #3182ce;
      border: none;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
      margin-right: 4px;
    }

    .no-attachments {
      color: #a0aec0;
      font-style: italic;
      font-size: 12px;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
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
      transition: all 0.3s ease;
    }

    .btn-action.approve {
      background: #c6f6d5;
      color: #22543d;
    }

    .btn-action.approve:hover {
      background: #9ae6b4;
    }

    .btn-action.reject {
      background: #fed7d7;
      color: #c53030;
    }

    .btn-action.reject:hover {
      background: #feb2b2;
    }

    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      border: none;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.3s ease;
    }

    .btn-success { background: #48bb78; color: white; }
    .btn-danger { background: #f56565; color: white; }
    .btn-secondary { background: #e2e8f0; color: #4a5568; }

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
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      padding: 24px 24px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      color: #2d3748;
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      color: #718096;
    }

    .modal-body {
      padding: 24px;
    }

    .reimbursement-details {
      background: #f7fafc;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .reimbursement-details h4 {
      margin: 0 0 12px 0;
      color: #2d3748;
    }

    .reimbursement-details p {
      margin: 4px 0;
      color: #4a5568;
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
      resize: vertical;
    }

    .modal-footer {
      padding: 0 24px 24px;
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #718096;
    }

    .empty-state i {
      font-size: 48px;
      margin-bottom: 16px;
      color: #cbd5e0;
    }

    @media (max-width: 768px) {
      .summary-cards {
        grid-template-columns: 1fr;
      }
      
      .table-header {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }
      
      .search-input {
        width: 100%;
      }
      
      .bulk-actions {
        flex-direction: column;
        gap: 12px;
      }
    }
  `]
})
export class ManagerApprovalsComponent implements OnInit {
  pendingReimbursements: any[] = [];
  filteredReimbursements: any[] = [];
  selectedItems: any[] = [];
  selectAll = false;
  searchTerm = '';
  
  showModal = false;
  selectedReimbursement: any = null;
  modalAction = '';
  comments = '';
  isProcessing = false;

  constructor(private reimbursementService: ReimbursementService) {}

  ngOnInit(): void {
    this.loadPendingReimbursements();
  }

  loadPendingReimbursements(): void {
    this.reimbursementService.getPendingManagerApprovals().subscribe({
      next: (data) => {
        this.pendingReimbursements = data.map(r => ({ ...r, selected: false }));
        this.filteredReimbursements = [...this.pendingReimbursements];
      },
      error: (error) => {
        console.error('Error loading pending reimbursements:', error);
        this.pendingReimbursements = [];
        this.filteredReimbursements = [];
      }
    });
  }

  filterReimbursements(): void {
    this.filteredReimbursements = this.pendingReimbursements.filter(r =>
      r.employeeName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  toggleSelectAll(): void {
    this.filteredReimbursements.forEach(r => r.selected = this.selectAll);
    this.updateSelection();
  }

  updateSelection(): void {
    this.selectedItems = this.filteredReimbursements.filter(r => r.selected);
    this.selectAll = this.filteredReimbursements.length > 0 && 
                    this.filteredReimbursements.every(r => r.selected);
  }

  getTotalPendingAmount(): number {
    return this.pendingReimbursements.reduce((sum, r) => sum + r.amount, 0);
  }

  getApprovedCount(): number {
    return 25; // Mock data
  }

  openApprovalModal(reimbursement: any, action: string): void {
    this.selectedReimbursement = reimbursement;
    this.modalAction = action;
    this.comments = '';
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedReimbursement = null;
    this.comments = '';
  }

  confirmAction(): void {
    this.isProcessing = true;
    
    const action = this.modalAction === 'approve' ? 
      this.reimbursementService.approveByManager(this.selectedReimbursement.reimbursementId, this.comments) :
      this.reimbursementService.rejectByManager(this.selectedReimbursement.reimbursementId, this.comments);
    
    action.subscribe({
      next: () => {
        this.loadPendingReimbursements();
        this.isProcessing = false;
        this.closeModal();
      },
      error: (error) => {
        console.error('Error processing reimbursement:', error);
        this.isProcessing = false;
      }
    });
  }

  bulkApprove(): void {
    if (this.selectedItems.length === 0) return;
    
    const approvals = this.selectedItems.map(item => 
      this.reimbursementService.approveByManager(item.reimbursementId, 'Bulk approval')
    );
    
    Promise.all(approvals.map(obs => obs.toPromise())).then(() => {
      this.loadPendingReimbursements();
      this.selectedItems = [];
      this.selectAll = false;
    }).catch(error => {
      console.error('Error in bulk approve:', error);
    });
  }

  bulkReject(): void {
    if (this.selectedItems.length === 0) return;
    
    const rejections = this.selectedItems.map(item => 
      this.reimbursementService.rejectByManager(item.reimbursementId, 'Bulk rejection')
    );
    
    Promise.all(rejections.map(obs => obs.toPromise())).then(() => {
      this.loadPendingReimbursements();
      this.selectedItems = [];
      this.selectAll = false;
    }).catch(error => {
      console.error('Error in bulk reject:', error);
    });
  }
}