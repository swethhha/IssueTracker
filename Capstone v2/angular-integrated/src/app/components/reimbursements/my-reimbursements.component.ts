import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReimbursementService } from '../../services/reimbursement.service';
import { ReimbursementResponse } from '../../models/reimbursement.models';

@Component({
  selector: 'app-my-reimbursements',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div style="padding: 20px; width: 100%; margin: 0;">
      <h2>My Reimbursements</h2>
      <p>Track your reimbursement requests and their status</p>
      
      <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <div class="page-header">
        <button class="btn btn-primary" routerLink="/reimbursements/request">
          <i class="feather icon-plus"></i>
          New Request
        </button>
      </div>

      <!-- Status Cards -->
      <div class="status-cards">
        <div class="status-card pending">
          <div class="card-icon">
            <i class="feather icon-clock"></i>
          </div>
          <div class="card-content">
            <h3>{{ getStatusCount('Pending') }}</h3>
            <p>Pending</p>
          </div>
        </div>

        <div class="status-card approved">
          <div class="card-icon">
            <i class="feather icon-check-circle"></i>
          </div>
          <div class="card-content">
            <h3>{{ getStatusCount('Approved') }}</h3>
            <p>Approved</p>
          </div>
        </div>

        <div class="status-card rejected">
          <div class="card-icon">
            <i class="feather icon-x-circle"></i>
          </div>
          <div class="card-content">
            <h3>{{ getStatusCount('Rejected') }}</h3>
            <p>Rejected</p>
          </div>
        </div>

        <div class="status-card total">
          <div class="card-icon">
            <i class="feather icon-dollar-sign"></i>
          </div>
          <div class="card-content">
            <h3>₹{{ getTotalAmount() | number }}</h3>
            <p>Total Requested</p>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <select [(ngModel)]="selectedStatus" (change)="filterReimbursements()" class="filter-select">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="ManagerApproved">Manager Approved</option>
          <option value="Approved">Finance Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select [(ngModel)]="selectedCategory" (change)="filterReimbursements()" class="filter-select">
          <option value="">All Categories</option>
          <option value="Travel">Travel</option>
          <option value="Medical">Medical</option>
          <option value="Food">Food</option>
          <option value="Training">Training</option>
          <option value="Others">Others</option>
        </select>
      </div>

      <!-- Reimbursements Table -->
      <div class="table-card">
        <div class="table-container">
          <table class="reimbursements-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let reimbursement of filteredReimbursements">
                <td>{{ reimbursement.requestDate | date:'shortDate' }}</td>
                <td>
                  <span class="category-badge" [class]="'category-' + reimbursement.category.toLowerCase()">
                    {{ reimbursement.category }}
                  </span>
                </td>
                <td class="description">{{ reimbursement.description }}</td>
                <td class="amount">₹{{ reimbursement.amount | number }}</td>
                <td>
                  <span class="status-badge" [class]="'status-' + reimbursement.status.toLowerCase()">
                    {{ getStatusDisplay(reimbursement.status) }}
                  </span>
                </td>
                <td>
                  <div class="progress-tracker">
                    <div class="progress-step" [class.completed]="isStepCompleted(reimbursement.status, 'submitted')">
                      <div class="step-circle">1</div>
                      <span>Submitted</span>
                    </div>
                    <div class="progress-line" [class.completed]="isStepCompleted(reimbursement.status, 'manager')"></div>
                    <div class="progress-step" [class.completed]="isStepCompleted(reimbursement.status, 'manager')">
                      <div class="step-circle">2</div>
                      <span>Manager</span>
                    </div>
                    <div class="progress-line" [class.completed]="isStepCompleted(reimbursement.status, 'finance')"></div>
                    <div class="progress-step" [class.completed]="isStepCompleted(reimbursement.status, 'finance')">
                      <div class="step-circle">3</div>
                      <span>Finance</span>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-action view" (click)="viewDetails(reimbursement.reimbursementId)">
                      <i class="feather icon-eye"></i>
                    </button>
                    <button class="btn-action download" *ngIf="reimbursement.attachments && reimbursement.attachments.length > 0">
                      <i class="feather icon-download"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div class="empty-state" *ngIf="filteredReimbursements.length === 0">
            <i class="feather icon-file-text"></i>
            <h3>No reimbursements found</h3>
            <p>You haven't submitted any reimbursement requests yet.</p>
            <button class="btn btn-primary" routerLink="/reimbursements/request">
              Submit Your First Request
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`


    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
    }

    .header-content h2 {
      margin: 0 0 4px 0;
      color: #2d3748;
      font-weight: 600;
    }

    .header-content p {
      margin: 0;
      color: #718096;
    }

    .btn {
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      border: none;
    }

    .btn-primary {
      background: #4299e1;
      color: white;
    }

    .status-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .status-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .status-card:hover {
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

    .status-card.pending .card-icon { background: #ed8936; }
    .status-card.approved .card-icon { background: #48bb78; }
    .status-card.rejected .card-icon { background: #f56565; }
    .status-card.total .card-icon { background: #4299e1; }

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

    .filters {
      display: flex;
      gap: 16px;
      margin-bottom: 24px;
    }

    .filter-select {
      padding: 8px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: white;
      cursor: pointer;
    }

    .table-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .reimbursements-table {
      width: 100%;
      border-collapse: collapse;
    }

    .reimbursements-table th {
      background: #f7fafc;
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: #4a5568;
      border-bottom: 1px solid #e2e8f0;
    }

    .reimbursements-table td {
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
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

    .status-badge {
      padding: 6px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-pending { background: #fef5e7; color: #c05621; }
    .status-managerapproved { background: #bee3f8; color: #2a69ac; }
    .status-approved { background: #c6f6d5; color: #22543d; }
    .status-rejected { background: #fed7d7; color: #c53030; }

    .progress-tracker {
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 200px;
    }

    .progress-step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .step-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #e2e8f0;
      color: #718096;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
    }

    .progress-step.completed .step-circle {
      background: #48bb78;
      color: white;
    }

    .progress-step span {
      font-size: 10px;
      color: #718096;
    }

    .progress-line {
      width: 20px;
      height: 2px;
      background: #e2e8f0;
    }

    .progress-line.completed {
      background: #48bb78;
    }

    .action-buttons {
      display: flex;
      gap: 8px;
    }

    .btn-action {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
    }

    .btn-action.view {
      background: #e6fffa;
      color: #319795;
    }

    .btn-action.download {
      background: #ebf8ff;
      color: #3182ce;
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

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #4a5568;
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
      
      .status-cards {
        grid-template-columns: 1fr;
      }
      
      .filters {
        flex-direction: column;
      }
      
      .table-container {
        overflow-x: auto;
      }
    }
  `]
})
export class MyReimbursementsComponent implements OnInit {
  reimbursements: ReimbursementResponse[] = [];
  filteredReimbursements: ReimbursementResponse[] = [];
  selectedStatus = '';
  selectedCategory = '';

  constructor(private reimbursementService: ReimbursementService) {}

  ngOnInit(): void {
    this.loadMyReimbursements();
  }

  loadMyReimbursements(): void {
    this.reimbursementService.getMyReimbursements().subscribe({
      next: (data) => {
        this.reimbursements = data;
        this.filteredReimbursements = data;
      },
      error: (error) => {
        console.error('Error loading reimbursements:', error);
        this.reimbursements = [];
        this.filteredReimbursements = [];
      }
    });
  }

  filterReimbursements(): void {
    this.filteredReimbursements = this.reimbursements.filter(r => {
      const statusMatch = !this.selectedStatus || r.status === this.selectedStatus;
      const categoryMatch = !this.selectedCategory || r.category === this.selectedCategory;
      return statusMatch && categoryMatch;
    });
  }

  getStatusCount(status: string): number {
    return this.reimbursements.filter(r => r.status === status).length;
  }

  getTotalAmount(): number {
    return this.reimbursements.reduce((sum, r) => sum + r.amount, 0);
  }

  getStatusDisplay(status: string): string {
    const statusMap: { [key: string]: string } = {
      'Pending': 'Pending',
      'ManagerApproved': 'Manager Approved',
      'Approved': 'Finance Approved',
      'Rejected': 'Rejected'
    };
    return statusMap[status] || status;
  }

  isStepCompleted(status: string, step: string): boolean {
    const statusOrder = ['Pending', 'ManagerApproved', 'Approved'];
    const currentIndex = statusOrder.indexOf(status);
    
    switch (step) {
      case 'submitted': return true;
      case 'manager': return currentIndex >= 1;
      case 'finance': return currentIndex >= 2;
      default: return false;
    }
  }

  viewDetails(id: number): void {
    console.log('View details for reimbursement:', id);
  }
}