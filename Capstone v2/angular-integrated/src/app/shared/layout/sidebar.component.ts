import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar-disabled',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="display: none;">
      <div class="sidebar-header">
        <div class="sidebar-logo">Payroll360</div>
      </div>
      
      <nav class="sidebar-nav">
        <div class="nav-item" *ngFor="let item of menuItems">
          <a [routerLink]="item.route" class="nav-link" routerLinkActive="active">
            <span class="nav-icon">{{ item.icon }}</span>
            <span>{{ item.label }}</span>
          </a>
        </div>
      </nav>
      
      <div class="sidebar-footer">
        <button class="nav-link logout-btn" (click)="logout()">
          <span class="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
    }

    .sidebar-header {
      padding: 1.5rem 1rem;
      border-bottom: 1px solid #e5e7eb;
    }

    .sidebar-logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1rem 0.75rem;
      overflow-y: auto;
    }

    .nav-item {
      margin-bottom: 0.25rem;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 12px;
      transition: all 0.2s ease;
      font-weight: 500;
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
    }

    .nav-link:hover {
      background: #f3f4f6;
      color: #374151;
      transform: translateX(4px);
    }

    .nav-link.active {
      background: #dbeafe;
      color: #1d4ed8;
      border-left: 4px solid #3b82f6;
      font-weight: 600;
    }

    .nav-icon {
      font-size: 1.25rem;
      width: 24px;
      text-align: center;
    }

    .sidebar-footer {
      padding: 1rem 0.75rem;
      border-top: 1px solid #e5e7eb;
      margin-top: auto;
    }

    .logout-btn {
      color: #dc2626;
      justify-content: flex-start;
    }

    .logout-btn:hover {
      background: #fef2f2;
      color: #b91c1c;
    }
  `]
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const role = this.authService.getUserRole()?.toLowerCase();
    this.menuItems = this.getMenuForRole(role || 'employee');
  }

  getMenuForRole(role: string) {
    const menus = {
      employee: [
        { label: 'Dashboard', route: '/employee/dashboard', icon: '📊' },
        { label: 'My Payrolls', route: '/employee/payrolls', icon: '💰' },
        { label: 'Loans', route: '/employee/loans', icon: '🏦' },
        { label: 'Reimbursements', route: '/employee/reimbursements', icon: '📋' },
        { label: 'Insurance', route: '/employee/insurance', icon: '🛡️' },
        { label: 'Medical Claims', route: '/employee/medical-claims', icon: '🏥' },
        { label: 'Track Requests', route: '/employee/requests', icon: '📈' }
      ],
      manager: [
        { label: 'Dashboard', route: '/manager/dashboard', icon: '📊' },
        { label: 'Approvals', route: '/manager/approvals', icon: '✅' },
        { label: 'My Payrolls', route: '/manager/payrolls', icon: '💰' },
        { label: 'My Requests', route: '/manager/requests', icon: '📋' }
      ],
      financeadmin: [
        { label: 'Dashboard', route: '/finance/dashboard', icon: '📊' },
        { label: 'Approvals', route: '/finance/approvals', icon: '✅' },
        { label: 'Reports', route: '/finance/reports', icon: '📈' },
        { label: 'All Requests', route: '/finance/requests', icon: '📋' }
      ],
      admin: [
        { label: 'Dashboard', route: '/admin/dashboard', icon: '📊' },
        { label: 'All Approvals', route: '/admin/approvals', icon: '✅' },
        { label: 'Reports', route: '/admin/reports', icon: '📈' },
        { label: 'System', route: '/admin/system', icon: '⚙️' }
      ]
    };
    return menus[role as keyof typeof menus] || menus.employee;
  }

  logout() {
    this.authService.logout();
  }
}