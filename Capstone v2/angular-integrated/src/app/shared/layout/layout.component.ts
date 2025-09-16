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
      <!-- Mobile Overlay -->
      <div class="mobile-overlay" 
           [class.active]="!sidebarCollapsed" 
           (click)="closeSidebar()"
           *ngIf="isMobile"></div>

      <header class="top-nav">
        <div class="nav-brand">
          <button class="sidebar-toggle" (click)="toggleSidebar()" title="Toggle Menu">
            <span class="material-icons">{{ sidebarCollapsed ? 'menu' : 'close' }}</span>
          </button>
          <span class="brand-text">Payroll360</span>
        </div>
        <div class="nav-actions">
          <span class="material-icons user-icon">account_circle</span>
          <span class="user-name">{{ currentUser?.name || 'Swetha R.' }}</span>
          <span class="user-role">Role: {{ currentUser?.role || 'Employee' }}</span>
          <button class="logout-btn" (click)="logout()" title="Logout">
            Logout
          </button>
        </div>
      </header>

      <div class="app-body">
        <nav class="sidebar" [class.collapsed]="sidebarCollapsed">
          <div class="nav-section">
            <div class="nav-title">Dashboard</div>
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">dashboard</span>
              <span class="nav-text">Overview</span>
            </a>
          </div>

          <div class="nav-section" *ngIf="hasRole(['Employee', 'Manager'])">
            <div class="nav-title">Employee Services</div>
            <a routerLink="/payroll" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">receipt_long</span>
              <span class="nav-text">My Payrolls</span>
            </a>
            <a routerLink="/loans" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">account_balance_wallet</span>
              <span class="nav-text">Loans</span>
            </a>
            <a routerLink="/reimbursements" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">receipt</span>
              <span class="nav-text">Reimbursements</span>
            </a>
            <a routerLink="/insurance" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">health_and_safety</span>
              <span class="nav-text">Insurance</span>
            </a>
            <a routerLink="/medical-claims" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">local_hospital</span>
              <span class="nav-text">Medical Claims</span>
            </a>
            <a routerLink="/request-tracker" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">track_changes</span>
              <span class="nav-text">Track Requests</span>
            </a>
          </div>

          <div class="nav-section" *ngIf="hasRole(['Manager'])">
            <div class="nav-title">Approvals</div>
            <a routerLink="/approvals" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">approval</span>
              <span class="nav-text">Approval Center</span>
              <span class="nav-badge" *ngIf="pendingApprovals > 0">{{ pendingApprovals }}</span>
            </a>
            <a routerLink="/analytics" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">analytics</span>
              <span class="nav-text">Analytics</span>
            </a>
          </div>

          <div class="nav-section" *ngIf="hasRole(['FinanceAdmin'])">
            <div class="nav-title">Finance Dashboard</div>
            <a routerLink="/finance" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">analytics</span>
              <span class="nav-text">Dashboard</span>
            </a>
          </div>

          <div class="nav-section" *ngIf="hasRole(['FinanceAdmin'])">
            <div class="nav-title">Approvals</div>
            <a routerLink="/finance/payroll-approvals" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">payments</span>
              <span class="nav-text">Payroll Approvals</span>
            </a>
            <a routerLink="/finance/loan-approvals" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">account_balance</span>
              <span class="nav-text">Loan Approvals</span>
            </a>
            <a routerLink="/finance/reimbursement-approvals" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">receipt</span>
              <span class="nav-text">Reimbursement Approvals</span>
            </a>
            <a routerLink="/finance/insurance-approvals" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">health_and_safety</span>
              <span class="nav-text">Insurance Approvals</span>
            </a>
            <a routerLink="/finance/medical-approvals" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">local_hospital</span>
              <span class="nav-text">Medical Approvals</span>
            </a>
          </div>

          <div class="nav-section" *ngIf="hasRole(['FinanceAdmin'])">
            <div class="nav-title">Reports & Analytics</div>
            <a routerLink="/finance/reports" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">assessment</span>
              <span class="nav-text">Financial Reports</span>
            </a>
          </div>

          <div class="nav-section" *ngIf="hasRole(['FinanceAdmin'])">
            <div class="nav-title">Employee Services</div>
            <a routerLink="/finance/apply-loan" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">account_balance_wallet</span>
              <span class="nav-text">Apply Loan</span>
            </a>
            <a routerLink="/finance/apply-reimbursement" routerLinkActive="active" class="nav-item" (click)="onNavClick()">
              <span class="material-icons">receipt</span>
              <span class="nav-text">Apply Reimbursement</span>
            </a>
          </div>
        </nav>

        <main class="main-content" [class.sidebar-open]="!sidebarCollapsed">
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
      position: relative;
    }

    .top-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      height: 64px;
      background: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      position: relative;
      z-index: 1000;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #333;
    }

    .sidebar-toggle {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 8px;
      border-radius: 4px;
      margin-right: 0.5rem;
      transition: all 0.2s ease;
    }

    .sidebar-toggle:hover {
      background-color: #f5f5f5;
    }

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      color: #333;
    }

    .user-icon {
      color: #666;
      font-size: 24px;
    }

    .user-name {
      font-weight: 500;
    }

    .user-role {
      color: #666;
      font-size: 0.9rem;
    }

    .logout-btn {
      background: none;
      border: 1px solid #ddd;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      color: #333;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }

    .logout-btn:hover {
      background-color: #f5f5f5;
      border-color: #ccc;
    }

    .app-body {
      display: flex;
      flex: 1;
      overflow: hidden;
      position: relative;
    }

    .sidebar {
      width: 280px;
      background: white;
      border-right: 1px solid #e5e7eb;
      overflow-y: auto;
      padding: 1rem 0;
      transition: all 0.3s ease;
      flex-shrink: 0;
      position: relative;
      z-index: 100;
    }

    .sidebar.collapsed {
      width: 0;
      padding: 0;
      overflow: hidden;
      border-right: none;
    }

    .nav-section {
      margin-bottom: 1.5rem;
    }

    .nav-title {
      padding: 0 1rem;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #6b7280;
      white-space: nowrap;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      color: #374151;
      text-decoration: none;
      transition: all 0.2s ease;
      position: relative;
      white-space: nowrap;
    }

    .nav-item:hover {
      background-color: #eff6ff;
      color: #1d4ed8;
    }

    .nav-item.active {
      background-color: #dbeafe;
      color: #1d4ed8;
      font-weight: 500;
    }

    .nav-item.active::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: #3b82f6;
    }

    .nav-item .material-icons {
      font-size: 20px;
    }

    .nav-badge {
      margin-left: auto;
      background-color: #ef4444;
      color: white;
      font-size: 0.75rem;
      font-weight: 500;
      padding: 2px 6px;
      border-radius: 9999px;
      min-width: 18px;
      text-align: center;
    }

    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      background: #f9fafb;
      position: relative;
      z-index: 1;
    }

    /* Mobile Overlay */
    .mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 150;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .mobile-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Navigation text visibility */
    .nav-text {
      transition: opacity 0.3s ease;
    }

    .sidebar.collapsed .nav-text,
    .sidebar.collapsed .nav-title,
    .sidebar.collapsed .nav-badge {
      opacity: 0;
      pointer-events: none;
    }

    .logout-text {
      display: inline;
    }

    /* Mobile responsiveness */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed;
        left: 0;
        top: 64px;
        height: calc(100vh - 64px);
        z-index: 200;
        box-shadow: 2px 0 15px rgba(0,0,0,0.15);
        transform: translateX(0);
      }
      
      .sidebar.collapsed {
        transform: translateX(-100%);
        width: 280px;
      }
      
      .main-content {
        width: 100%;
        margin-left: 0;
      }

      .main-content.sidebar-open {
        margin-left: 0;
      }

      .user-name,
      .user-role {
        display: none;
      }
      
      .nav-actions {
        gap: 0.5rem;
      }
    }

    /* Desktop responsiveness */
    @media (min-width: 769px) {
      .main-content {
        margin-left: 0;
        transition: margin-left 0.3s ease;
      }

      .main-content.sidebar-open {
        margin-left: 280px;
      }
      
      .user-name,
      .user-role {
        display: inline;
      }
    }

    /* Improved sidebar toggle button */
    .sidebar-toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
    }

    .sidebar-toggle .material-icons {
      font-size: 24px;
    }
  `]
})
export class LayoutComponent implements OnInit {
  currentUser: any = null;
  pendingApprovals = 0;
  financeApprovals = 0;
  sidebarCollapsed = true;
  isMobile = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.checkMobile();
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.loadNotificationCounts();
    this.initializeSidebar();
    
    // Listen for window resize
    window.addEventListener('resize', () => {
      this.checkMobile();
      this.initializeSidebar();
    });
  }

  private checkMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  private initializeSidebar() {
    // Always start collapsed
    this.sidebarCollapsed = true;
  }

  hasRole(roles: string[]): boolean {
    return roles.includes(this.currentUser?.role);
  }

  loadNotificationCounts() {
    if (this.hasRole(['Manager'])) {
      this.pendingApprovals = 5;
    }
    
    if (this.hasRole(['Finance'])) {
      this.financeApprovals = 3;
    }
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  closeSidebar() {
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  onNavClick() {
    // Close sidebar on mobile when navigation item is clicked
    if (this.isMobile) {
      this.sidebarCollapsed = true;
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}