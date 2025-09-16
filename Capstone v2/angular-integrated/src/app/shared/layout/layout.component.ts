import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-layout">
      <!-- Top Navigation -->
      <header class="top-nav">
        <div class="nav-brand">
          <span class="material-icons">account_balance</span>
          <span class="brand-text">Payroll360</span>
        </div>
        <div class="nav-actions">
          <div class="user-info">
            <span class="material-icons">account_circle</span>
            <span class="user-name">{{ currentUser?.name || 'User' }}</span>
            <span class="user-role badge badge-primary">{{ currentUser?.role }}</span>
          </div>
          <button class="btn btn-text" (click)="logout()">
            <span class="material-icons">logout</span>
            Logout
          </button>
        </div>
      </header>

      <div class="app-body">
        <!-- Sidebar Navigation -->
        <nav class="sidebar">
          <div class="nav-section">
            <div class="nav-title">Dashboard</div>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
              <span class="material-icons">dashboard</span>
              <span>Overview</span>
            </a>
          </div>

          <!-- Employee Services -->
          <div class="nav-section" *ngIf="hasRole(['Employee', 'Manager'])">
            <div class="nav-title">Employee Services</div>
            <a routerLink="/payroll" routerLinkActive="active" class="nav-item">
              <span class="material-icons">receipt_long</span>
              <span>My Payrolls</span>
            </a>
            <a routerLink="/loans" routerLinkActive="active" class="nav-item">
              <span class="material-icons">account_balance_wallet</span>
              <span>Loans</span>
            </a>
            <a routerLink="/reimbursements" routerLinkActive="active" class="nav-item">
              <span class="material-icons">receipt</span>
              <span>Reimbursements</span>
            </a>
            <a routerLink="/insurance" routerLinkActive="active" class="nav-item">
              <span class="material-icons">health_and_safety</span>
              <span>Insurance</span>
            </a>
            <a routerLink="/medical-claims" routerLinkActive="active" class="nav-item">
              <span class="material-icons">local_hospital</span>
              <span>Medical Claims</span>
            </a>
            <a routerLink="/request-tracker" routerLinkActive="active" class="nav-item">
              <span class="material-icons">track_changes</span>
              <span>Track Requests</span>
            </a>
          </div>

          <!-- Manager Approvals -->
          <div class="nav-section" *ngIf="hasRole(['Manager'])">
            <div class="nav-title">Approvals</div>
            <a routerLink="/approvals" routerLinkActive="active" class="nav-item">
              <span class="material-icons">approval</span>
              <span>Approval Center</span>
              <span class="nav-badge" *ngIf="pendingApprovals > 0">{{ pendingApprovals }}</span>
            </a>
            <a routerLink="/analytics" routerLinkActive="active" class="nav-item">
              <span class="material-icons">analytics</span>
              <span>Analytics</span>
            </a>
          </div>

          <!-- Finance Services -->
          <div class="nav-section" *ngIf="hasRole(['Finance'])">
            <div class="nav-title">Finance Services</div>
            <a routerLink="/finance-approvals" routerLinkActive="active" class="nav-item">
              <span class="material-icons">verified</span>
              <span>Final Approvals</span>
              <span class="nav-badge" *ngIf="financeApprovals > 0">{{ financeApprovals }}</span>
            </a>
            <a routerLink="/reports" routerLinkActive="active" class="nav-item">
              <span class="material-icons">assessment</span>
              <span>Reports</span>
            </a>
            <a routerLink="/finance-analytics" routerLinkActive="active" class="nav-item">
              <span class="material-icons">trending_up</span>
              <span>Analytics</span>
            </a>
          </div>
        </nav>

        <!-- Main Content -->
        <main class="main-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .app-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background-color: var(--gray-50);
    }

    .top-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--spacing-lg);
      height: 64px;
      background-color: var(--surface);
      border-bottom: 1px solid var(--outline-variant);
      box-shadow: var(--shadow-1);
      z-index: 1000;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-500);
    }

    .brand-text {
      background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-lg);
      background-color: var(--surface-variant);
    }

    .user-name {
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }

    .app-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .sidebar {
      width: 280px;
      background-color: var(--surface);
      border-right: 1px solid var(--outline-variant);
      overflow-y: auto;
      padding: var(--spacing-lg) 0;
    }

    .nav-section {
      margin-bottom: var(--spacing-xl);
    }

    .nav-title {
      padding: 0 var(--spacing-lg);
      margin-bottom: var(--spacing-sm);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--on-surface-variant);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-lg);
      color: var(--on-surface);
      text-decoration: none;
      transition: all 0.2s ease;
      position: relative;

      &:hover {
        background-color: var(--primary-50);
        color: var(--primary-700);
      }

      &.active {
        background-color: var(--primary-100);
        color: var(--primary-700);
        font-weight: var(--font-weight-medium);

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: var(--primary-500);
        }
      }

      .material-icons {
        font-size: 20px;
      }
    }

    .nav-badge {
      margin-left: auto;
      background-color: var(--error-500);
      color: white;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      padding: 2px 6px;
      border-radius: var(--radius-xl);
      min-width: 18px;
      text-align: center;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--spacing-lg);
    }

    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: -280px;
        top: 64px;
        height: calc(100vh - 64px);
        z-index: 999;
        transition: left 0.3s ease;
      }

      .sidebar.open {
        left: 0;
      }

      .main-content {
        padding: var(--spacing-md);
      }

      .user-info .user-name {
        display: none;
      }
    }
  `]
})
export class LayoutComponent implements OnInit {
  currentUser: any = null;
  pendingApprovals = 0;
  financeApprovals = 0;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadNotificationCounts();
  }

  hasRole(roles: string[]): boolean {
    return roles.includes(this.currentUser?.role);
  }

  loadNotificationCounts() {
    // Load pending approval counts based on role
    if (this.hasRole(['Manager'])) {
      // Load manager pending approvals count
      this.pendingApprovals = 5; // Replace with actual API call
    }
    
    if (this.hasRole(['Finance'])) {
      // Load finance pending approvals count
      this.financeApprovals = 3; // Replace with actual API call
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}