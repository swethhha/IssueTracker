import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PayrollService } from '../../../services/payroll.service';
import { ReimbursementService } from '../../../services/reimbursement.service';
import { NotificationService } from '../../../services/notification.service';
import { PayrollResponse } from '../../../models/payroll.models';
import { ReimbursementResponse } from '../../../models/reimbursement.models';
import { NotificationResponse } from '../../../models/notification.models';

@Component({
  selector: 'app-employee-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="row">
      <!-- Recent Payrolls -->
      <div class="col-xl-6">
        <div class="card">
          <div class="card-header">
            <h5><i class="feather icon-dollar-sign me-2"></i>My Recent Payrolls</h5>
          </div>
          <div class="card-block">
            <div *ngFor="let payroll of recentPayrolls" class="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
              <div>
                <h6 class="mb-1">{{ payroll.payPeriodStart | date:'MMM yyyy' }}</h6>
                <small class="text-muted">{{ payroll.payPeriodStart | date:'shortDate' }} - {{ payroll.payPeriodEnd | date:'shortDate' }}</small>
              </div>
              <div class="text-end">
                <h5 class="mb-0 text-success">{{ payroll.netPay | currency }}</h5>
                <span class="badge badge-{{ payroll.status === 'Approved' ? 'success' : 'warning' }}">{{ payroll.status }}</span>
              </div>
            </div>
            <div class="text-center mt-3">
              <button class="btn btn-outline-primary" routerLink="/payroll">View All Payrolls</button>
            </div>
          </div>
        </div>
      </div>

      <!-- My Reimbursements -->
      <div class="col-xl-6">
        <div class="card">
          <div class="card-header">
            <h5><i class="feather icon-file-text me-2"></i>My Reimbursements</h5>
          </div>
          <div class="card-block">
            <div *ngFor="let reimbursement of recentReimbursements" class="d-flex justify-content-between align-items-center mb-3 p-3 border rounded">
              <div>
                <h6 class="mb-1">{{ reimbursement.category }}</h6>
                <small class="text-muted">{{ reimbursement.requestDate | date:'shortDate' }}</small>
              </div>
              <div class="text-end">
                <h6 class="mb-0">{{ reimbursement.amount | currency }}</h6>
                <span class="badge badge-{{ reimbursement.status === 'Approved' ? 'success' : reimbursement.status === 'Pending' ? 'warning' : 'danger' }}">{{ reimbursement.status }}</span>
              </div>
            </div>
            <div class="text-center mt-3">
              <button class="btn btn-outline-primary" routerLink="/reimbursements">View All Reimbursements</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Available Medical Claims -->
      <div class="col-xl-6">
        <div class="card">
          <div class="card-header">
            <h5><i class="feather icon-heart me-2"></i>Available Medical Claims</h5>
          </div>
          <div class="card-block">
            <div class="row">
              <div class="col-6 mb-3" *ngFor="let claim of medicalClaimTypes">
                <div class="text-center p-3 border rounded">
                  <i class="feather icon-{{ claim.icon }} f-30 text-primary mb-2"></i>
                  <h6>{{ claim.name }}</h6>
                  <small class="text-muted">Up to {{ claim.limit | currency }}</small>
                </div>
              </div>
            </div>
            <div class="text-center mt-3">
              <button class="btn btn-primary" routerLink="/medical-claims">Submit Medical Claim</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="col-xl-6">
        <div class="card">
          <div class="card-header">
            <h5><i class="feather icon-zap me-2"></i>Quick Actions</h5>
          </div>
          <div class="card-block">
            <div class="row">
              <div class="col-6 mb-3">
                <button class="btn btn-outline-success btn-block" routerLink="/reimbursements">
                  <i class="feather icon-plus-circle mb-2"></i><br>
                  Request Reimbursement
                </button>
              </div>
              <div class="col-6 mb-3">
                <button class="btn btn-outline-info btn-block" routerLink="/loans">
                  <i class="feather icon-trending-up mb-2"></i><br>
                  Apply for Loan
                </button>
              </div>
              <div class="col-6 mb-3">
                <button class="btn btn-outline-warning btn-block" routerLink="/insurance">
                  <i class="feather icon-shield mb-2"></i><br>
                  View Insurance
                </button>
              </div>
              <div class="col-6 mb-3">
                <button class="btn btn-outline-primary btn-block" routerLink="/medical-claims">
                  <i class="feather icon-heart mb-2"></i><br>
                  Medical Claims
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
    .card {
      border-radius: 15px;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      margin-bottom: 25px;
    }
    .btn-block {
      width: 100%;
      padding: 15px;
      text-align: center;
    }
    .f-30 {
      font-size: 30px;
    }
  `]
})
export class EmployeeDashboardComponent implements OnInit {
  recentPayrolls: PayrollResponse[] = [];
  recentReimbursements: ReimbursementResponse[] = [];
  notifications: NotificationResponse[] = [];
  
  medicalClaimTypes = [
    { name: 'OPD', icon: 'user', limit: 5000 },
    { name: 'Hospitalization', icon: 'home', limit: 50000 },
    { name: 'Maternity', icon: 'heart', limit: 25000 },
    { name: 'Dental', icon: 'smile', limit: 10000 },
    { name: 'Eye Care', icon: 'eye', limit: 8000 },
    { name: 'Emergency', icon: 'alert-circle', limit: 100000 }
  ];

  constructor(
    private payrollService: PayrollService,
    private reimbursementService: ReimbursementService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadRecentPayrolls();
    this.loadRecentReimbursements();
    this.loadNotifications();
  }

  loadRecentPayrolls(): void {
    this.payrollService.getMyPayrolls().subscribe({
      next: (data) => {
        this.recentPayrolls = data.slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading payrolls:', error);
      }
    });
  }

  loadRecentReimbursements(): void {
    this.reimbursementService.getMyReimbursements().subscribe({
      next: (data) => {
        this.recentReimbursements = data.slice(0, 3);
      },
      error: (error) => {
        console.error('Error loading reimbursements:', error);
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