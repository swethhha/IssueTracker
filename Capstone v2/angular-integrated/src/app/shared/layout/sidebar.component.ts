import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar">
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
        <button class="nav-link w-full" (click)="logout()">
          <span class="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      border-top: 1px solid var(--border-color);
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