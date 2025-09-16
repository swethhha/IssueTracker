import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayrollService } from '../../../services/payroll.service';
import { ReimbursementService } from '../../../services/reimbursement.service';
import { LoanService } from '../../../services/loan.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-manager-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="row">
      <!-- Pending Approvals Cards -->
      <div class="col-xl-4">
        <div class="card gradient-card-1">
          <div class="card-block text-white">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h6 class="mb-2 text-white-50">Pending Payroll Approvals</h6>
                <h3 class="mb-0 text-white">{{ pendingPayrollApprovals }}</h3>
                <small class="text-white-50">Requires Action</small>
              </div>
              <div class="metric-icon">
                <i class="feather icon-dollar-sign"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card gradient-card-2">
          <div class="card-block text-white">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h6 class="mb-2 text-white-50">Pending Reimbursement Approvals</h6>
                <h3 class="mb-0 text-white">{{ pendingReimbursementApprovals }}</h3>
                <small class="text-white-50">Requires Action</small>
              </div>
              <div class="metric-icon">
                <i class="feather icon-file-text"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-xl-4">
        <div class="card gradient-card-3">
          <div class="card-block text-white">
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h6 class="mb-2 text-white-50">Pending Loan Approvals</h6>
                <h3 class="mb-0 text-white">{{ pendingLoanApprovals }}</h3>
                <small class="text-white-50">Requires Action</small>
              </div>
              <div class="metric-icon">
                <i class="feather icon-trending-up"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header">
            <h5><i class="feather icon-zap me-2"></i>Manager Actions</h5>
          </div>
          <div class="card-block">
            <div class="row">
              <div class="col-md-3">
                <button class="btn btn-primary btn-block" routerLink="/approvals/payroll">
                  <i class="feather icon-dollar-sign me-2"></i>Payroll Approvals
                </button>
              </div>
              <div class="col-md-3">
                <button class="btn btn-success btn-block" routerLink="/approvals/reimbursements">
                  <i class="feather icon-file-text me-2"></i>Reimbursement Approvals
                </button>
              </div>
              <div class="col-md-3">
                <button class="btn btn-info btn-block" routerLink="/approvals/loans">
                  <i class="feather icon-trending-up me-2"></i>Loan Approvals
                </button>
              </div>
              <div class="col-md-3">
                <button class="btn btn-warning btn-block" routerLink="/payroll">
                  <i class="feather icon-users me-2"></i>Team Payrolls
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Notifications -->
      <div class="col-xl-12" *ngIf="notifications.length > 0">
        <div class="card">
          <div class="card-header">
            <h5><i class="feather icon-bell me-2"></i>Recent Notifications</h5>
          </div>
          <div class="card-block">
            <div class="list-group list-group-flush">
              <div 
                class="list-group-item" 
                *ngFor="let notification of notifications.slice(0, 5)"
                [class.list-group-item-light]="!notification.isRead"
                (click)="markAsRead(notification.notificationId)"
                style="cursor: pointer;"
              >
                <div class="d-flex w-100 justify-content-between">
                  <h6 class="mb-1">{{ notification.title }}</h6>
                  <small>{{ notification.createdAt | date:'short' }}</small>
                </div>
                <p class="mb-1">{{ notification.message }}</p>
                <span *ngIf="!notification.isRead" class="badge badge-primary">New</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gradient-card-1 {
      background: linear-gradient(135deg, #4099ff 0%, #73b4ff 100%);
      border: none;
    }
    .gradient-card-2 {
      background: linear-gradient(135deg, #2ed8b6 0%, #59e0c5 100%);
      border: none;
    }
    .gradient-card-3 {
      background: linear-gradient(135deg, #ff5370 0%, #ff7aa3 100%);
      border: none;
    }
    .metric-icon {
      width: 60px;
      height: 60px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
    }
    .card {
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      margin-bottom: 25px;
    }
    .btn-block {
      width: 100%;
      padding: 15px;
    }
  `]
})
export class ManagerDashboardComponent implements OnInit {
  pendingPayrollApprovals = 0;
  pendingReimbursementApprovals = 0;
  pendingLoanApprovals = 0;
  notifications: any[] = [];

  constructor(
    private payrollService: PayrollService,
    private reimbursementService: ReimbursementService,
    private loanService: LoanService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadPendingCounts();
    this.loadNotifications();
  }

  loadPendingCounts(): void {
    this.reimbursementService.getPendingManagerCount().subscribe({
      next: (count) => {
        this.pendingReimbursementApprovals = count;
      },
      error: (error) => {
        console.error('Error loading pending reimbursement count:', error);
      }
    });

    this.loanService.getPendingManagerCount().subscribe({
      next: (count) => {
        this.pendingLoanApprovals = count;
      },
      error: (error) => {
        console.error('Error loading pending loan count:', error);
      }
    });
  }

  loadNotifications(): void {
    this.notificationService.getMyNotifications().subscribe({
      next: (data) => {
        this.notifications = data;
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.loadNotifications();
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }
}