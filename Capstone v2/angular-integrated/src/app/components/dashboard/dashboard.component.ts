import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard.component';
import { FinanceDashboardComponent } from './finance-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>{{ getDashboardTitle() }}</h1>
        <p>{{ getDashboardSubtitle() }}</p>
        <!-- Hidden admin controls - Triple-click header to access -->
        <div class="admin-controls" (click)="onHeaderClick()" [class.visible]="showAdminControls">
          <button class="btn-admin-reset" (click)="resetDemoData()" *ngIf="showAdminControls" title="Admin: Reset Demo Data">
            ⚙️ Reset
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <span class="material-icons">account_balance_wallet</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getStatValue(0) }}</div>
            <div class="stat-label">{{ getStatLabel(0) }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon pending">
            <span class="material-icons">pending_actions</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getStatValue(1) }}</div>
            <div class="stat-label">{{ getStatLabel(1) }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon success">
            <span class="material-icons">receipt_long</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getStatValue(2) }}</div>
            <div class="stat-label">{{ getStatLabel(2) }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon info">
            <span class="material-icons">notifications</span>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ getStatValue(3) }}</div>
            <div class="stat-label">{{ getStatLabel(3) }}</div>
          </div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ getCardTitle(0) }}</h3>
            <a [routerLink]="getCardLink(0)" class="view-all-link">View All</a>
          </div>
          <div class="card-body">
            <div class="item-list">
              <div class="item" *ngFor="let item of getCardItems(0)">
                <div class="item-info">
                  <strong>{{ item.title }}</strong>
                  <span class="item-amount">{{ item.amount }}</span>
                </div>
                <div class="item-status">
                  <span class="badge badge-success">{{ item.status }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{ getCardTitle(1) }}</h3>
          </div>
          <div class="card-body">
            <div class="item-list" *ngIf="getCardItems(1).length > 0">
              <div class="item" *ngFor="let item of getCardItems(1)">
                <div class="item-info">
                  <strong>{{ item.title }}</strong>
                  <span class="item-amount">{{ item.amount }}</span>
                </div>
                <div class="item-date">{{ item.date }}</div>
              </div>
            </div>
            <div class="empty-message" *ngIf="getCardItems(1).length === 0">
              <span class="material-icons">check_circle</span>
              <p>No pending items</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent Notifications</h3>
          </div>
          <div class="card-body">
            <div class="notification-list">
              <div class="notification-item" *ngFor="let notification of getNotifications()">
                <div class="notification-icon" [ngClass]="notification.type">
                  <span class="material-icons">{{ notification.icon }}</span>
                </div>
                <div class="notification-content">
                  <div class="notification-title">{{ notification.title }}</div>
                  <div class="notification-time">{{ notification.time | date:'short' }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Quick Actions</h3>
          </div>
          <div class="card-body">
            <div class="quick-actions">
              <a *ngFor="let action of getQuickActions()" [routerLink]="action.link" class="action-btn">
                <div class="action-icon" [ngClass]="action.iconClass">
                  <span class="material-icons">{{ action.icon }}</span>
                </div>
                <div class="action-text">
                  <strong>{{ action.title }}</strong>
                  <small>{{ action.subtitle }}</small>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .dashboard-header {
      margin-bottom: 2rem;
      position: relative;
    }
    
    .admin-controls {
      position: absolute;
      top: 0;
      right: 0;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    .admin-controls.visible {
      opacity: 1;
    }
    
    .btn-admin-reset {
      padding: 0.25rem 0.5rem;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 400;
      transition: all 0.2s ease;
    }
    
    .btn-admin-reset:hover {
      background: #4b5563;
    }

    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0;
    }

    .dashboard-header p {
      color: #718096;
      font-size: 1.125rem;
      margin: 0.5rem 0 0 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 64px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      background: #dbeafe;
      color: #1d4ed8;
    }

    .stat-icon.pending {
      background: #fef3c7;
      color: #d97706;
    }

    .stat-icon.success {
      background: #d1fae5;
      color: #059669;
    }

    .stat-icon.info {
      background: #e0e7ff;
      color: #7c3aed;
    }

    .stat-icon .material-icons {
      font-size: 28px;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1a202c;
      margin-bottom: 0.25rem;
    }

    .stat-label {
      color: #718096;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 1.5rem;
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a202c;
    }

    .view-all-link {
      color: #3b82f6;
      text-decoration: none;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .view-all-link:hover {
      color: #1d4ed8;
    }

    .card-body {
      padding: 1.5rem;
    }

    .item-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .item-info strong {
      display: block;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .item-amount {
      color: #3b82f6;
      font-weight: 600;
    }

    .item-date {
      font-size: 0.875rem;
      color: #718096;
    }

    .notification-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .notification-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      color: white;
    }

    .notification-icon.success { background: #10b981; }
    .notification-icon.warning { background: #f59e0b; }
    .notification-icon.info { background: #3b82f6; }
    .notification-icon.error { background: #ef4444; }

    .notification-title {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .notification-time {
      color: #718096;
      font-size: 0.875rem;
    }

    .empty-message {
      text-align: center;
      padding: 2rem;
      color: #718096;
    }

    .empty-message .material-icons {
      font-size: 48px;
      color: #10b981;
      margin-bottom: 0.5rem;
    }

    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      text-decoration: none;
      color: #1a202c;
      transition: all 0.2s ease;
    }

    .action-btn:hover {
      background: #f9fafb;
      border-color: #3b82f6;
      transform: translateX(4px);
    }

    .action-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      color: white;
    }

    .action-icon.primary { background: #3b82f6; }
    .action-icon.secondary { background: #6b7280; }
    .action-icon.success { background: #10b981; }
    .action-icon.warning { background: #f59e0b; }
    .action-icon.info { background: #8b5cf6; }

    .action-text strong {
      display: block;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .action-text small {
      color: #718096;
      font-size: 0.875rem;
    }

    .badge {
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .badge-success {
      background: #d1fae5;
      color: #065f46;
    }

    @media (max-width: 768px) {
      .dashboard-container {
        padding: 1rem;
      }
      
      .stats-grid,
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userRole: string | null = null;
  showAdminControls = false;
  private clickCount = 0;
  private clickTimer: any;
  
  constructor(private router: Router, private authService: AuthService) {}
  
  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    this.authService.currentUser$.subscribe(user => {
      this.userRole = user?.role || null;
    });
  }
  
  getDashboardTitle(): string {
    switch(this.userRole) {
      case 'Employee': return 'My Benefits Dashboard';
      case 'Manager': return 'Manager Dashboard';
      case 'Finance': return 'Finance Dashboard';
      default: return 'Dashboard';
    }
  }
  
  getDashboardSubtitle(): string {
    switch(this.userRole) {
      case 'Employee': return 'Access your personal benefits and services';
      case 'Manager': return 'Manage team approvals and analytics';
      case 'Finance': return 'Financial operations and approvals';
      default: return 'Welcome to your dashboard';
    }
  }
  
  getStatValue(index: number): string {
    const stats = this.getStatsForRole();
    return stats[index]?.value || '0';
  }
  
  getStatLabel(index: number): string {
    const stats = this.getStatsForRole();
    return stats[index]?.label || '';
  }
  
  private getStatsForRole() {
    switch(this.userRole) {
      case 'Employee':
        return [
          { value: '₹365,000', label: 'Total Earnings' },
          { value: '2', label: 'Pending Requests' },
          { value: '3', label: 'Recent Payrolls' },
          { value: '4', label: 'Notifications' }
        ];
      case 'Manager':
        return [
          { value: '₹485,000', label: 'Team Budget' },
          { value: '5', label: 'Pending Approvals' },
          { value: '15', label: 'Approved This Month' },
          { value: '8', label: 'Team Members' }
        ];
      case 'Finance':
        return [
          { value: '₹2.5M', label: 'Total Disbursed' },
          { value: '12', label: 'Pending Payments' },
          { value: '45', label: 'Processed This Month' },
          { value: '₹850K', label: 'Monthly Budget' }
        ];
      default:
        return [];
    }
  }
  
  getCardTitle(index: number): string {
    const titles = this.getCardTitlesForRole();
    return titles[index] || '';
  }
  
  getCardLink(index: number): string {
    switch(this.userRole) {
      case 'Employee': return '/payroll';
      case 'Manager': return '/analytics';
      case 'Finance': return '/finance/reports';
      default: return '/';
    }
  }
  
  private getCardTitlesForRole(): string[] {
    switch(this.userRole) {
      case 'Employee': return ['My Recent Payrolls', 'Pending Requests'];
      case 'Manager': return ['Team Performance', 'Pending Approvals'];
      case 'Finance': return ['Recent Transactions', 'Pending Finance Approvals'];
      default: return [];
    }
  }
  
  getCardItems(index: number): any[] {
    switch(this.userRole) {
      case 'Employee':
        if (index === 0) {
          return [
            { title: 'December 2024', amount: '₹125,000', status: 'Approved' },
            { title: 'November 2024', amount: '₹118,000', status: 'Approved' },
            { title: 'October 2024', amount: '₹122,000', status: 'Approved' }
          ];
        } else {
          return [
            { title: 'Home Loan', amount: '₹2,500,000', date: '11/28/24' },
            { title: 'Conference Travel', amount: '₹15,000', date: '12/1/24' }
          ];
        }
      case 'Manager':
        if (index === 0) {
          return [
            { title: 'Team Productivity', amount: '94%', status: 'Excellent' },
            { title: 'Budget Utilization', amount: '78%', status: 'On Track' },
            { title: 'Employee Satisfaction', amount: '4.2/5', status: 'Good' }
          ];
        } else {
          return [
            { title: 'John Doe - Personal Loan', amount: '₹50,000', date: 'Dec 1, 2024' },
            { title: 'Alice Smith - Travel Reimbursement', amount: '₹3,000', date: 'Dec 2, 2024' }
          ];
        }
      case 'Finance':
        if (index === 0) {
          return [
            { title: 'Payroll Disbursement', amount: '₹1,250,000', status: 'Completed' },
            { title: 'Loan Approvals', amount: '₹850,000', status: 'Processed' },
            { title: 'Reimbursements', amount: '₹125,000', status: 'Completed' }
          ];
        } else {
          return [
            { title: 'Manager Approved - Home Loan', amount: '₹25,00,000', date: 'Mike Johnson' },
            { title: 'Manager Approved - Conference Travel', amount: '₹15,000', date: 'Sarah Wilson' }
          ];
        }
      default:
        return [];
    }
  }
  
  getNotifications(): any[] {
    switch(this.userRole) {
      case 'Employee':
        return [
          { type: 'success', icon: 'check_circle', title: 'Conference Travel Approved - ₹12,000', time: new Date(Date.now() - 3600000) },
          { type: 'info', icon: 'info', title: 'December 2024 Payroll Generated - ₹125,000', time: new Date(Date.now() - 86400000) },
          { type: 'warning', icon: 'pending', title: 'Home Loan Application Under Review', time: new Date(Date.now() - 172800000) },
          { type: 'info', icon: 'account_balance', title: 'Manager Bonus Scheme Available', time: new Date(Date.now() - 259200000) }
        ];
      case 'Manager':
        return [
          { type: 'warning', icon: 'pending_actions', title: '5 Requests Awaiting Your Approval', time: new Date(Date.now() - 1800000) },
          { type: 'success', icon: 'check_circle', title: 'Team Budget Approved - ₹485,000', time: new Date(Date.now() - 7200000) },
          { type: 'info', icon: 'group', title: 'New Team Member Added - Sarah Wilson', time: new Date(Date.now() - 86400000) },
          { type: 'info', icon: 'analytics', title: 'Monthly Team Report Available', time: new Date(Date.now() - 172800000) }
        ];
      case 'Finance':
        return [
          { type: 'warning', icon: 'account_balance', title: '12 Payments Pending Final Approval', time: new Date(Date.now() - 900000) },
          { type: 'success', icon: 'payments', title: 'Payroll Disbursement Completed - ₹1.25M', time: new Date(Date.now() - 3600000) },
          { type: 'info', icon: 'receipt_long', title: 'Monthly Financial Report Generated', time: new Date(Date.now() - 86400000) },
          { type: 'success', icon: 'trending_up', title: 'Budget Utilization: 68% - On Track', time: new Date(Date.now() - 172800000) }
        ];
      default:
        return [];
    }
  }
  
  getQuickActions(): any[] {
    switch(this.userRole) {
      case 'Employee':
        return [
          { icon: 'account_balance', title: 'Apply for Loan', subtitle: 'Personal, Home, Education', link: '/loans/apply', iconClass: 'primary' },
          { icon: 'receipt', title: 'Submit Reimbursement', subtitle: 'Travel, Office, Others', link: '/reimbursements/submit', iconClass: 'secondary' },
          { icon: 'health_and_safety', title: 'Insurance Enrollment', subtitle: 'Health, Life, Critical', link: '/insurance', iconClass: 'success' },
          { icon: 'local_hospital', title: 'Medical Claim', subtitle: 'Submit medical claims', link: '/medical-claims/submit', iconClass: 'warning' }
        ];
      case 'Manager':
        return [
          { icon: 'analytics', title: 'Team Analytics', subtitle: 'Performance and budget reports', link: '/analytics', iconClass: 'primary' },
          { icon: 'group', title: 'Approval Center', subtitle: 'Review pending approvals', link: '/approvals', iconClass: 'secondary' },
          { icon: 'account_balance_wallet', title: 'Budget Overview', subtitle: 'Track team budget utilization', link: '/analytics', iconClass: 'success' }
        ];
      case 'Finance':
        return [
          { icon: 'payments', title: 'Final Approvals', subtitle: 'Manager-approved requests', link: '/finance/approvals', iconClass: 'success' },
          { icon: 'assessment', title: 'Financial Reports', subtitle: 'Generate and view reports', link: '/finance/reports', iconClass: 'primary' },
          { icon: 'trending_up', title: 'Analytics Dashboard', subtitle: 'Financial trends and insights', link: '/analytics', iconClass: 'info' }
        ];
      default:
        return [];
    }
  }
  
  onHeaderClick() {
    this.clickCount++;
    
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
    }
    
    if (this.clickCount === 3) {
      this.showAdminControls = true;
      this.clickCount = 0;
      // Hide after 10 seconds
      setTimeout(() => {
        this.showAdminControls = false;
      }, 10000);
    } else {
      this.clickTimer = setTimeout(() => {
        this.clickCount = 0;
      }, 1000);
    }
  }
  
  resetDemoData() {
    if (confirm('Reset all demo data? This will clear all applications and start fresh.')) {
      localStorage.clear();
      window.location.reload();
    }
  }
  
  navigate(path: string) {
    this.router.navigate([path]);
  }
}