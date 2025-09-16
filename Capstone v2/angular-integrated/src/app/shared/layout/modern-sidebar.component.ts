import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-modern-sidebar-disabled',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="display: none;">
      <!-- Header with Logo and Toggle -->
      <div class="sidebar-header">
        <h2 [class]="logoClasses">{{ isExpanded ? 'Payroll360' : 'P360' }}</h2>
        <button class="toggle-btn" (click)="toggleSidebar()">
          {{ isExpanded ? '<' : '>' }}
        </button>
      </div>
      
      <!-- Navigation Items -->
      <nav class="sidebar-nav">
        <a 
          *ngFor="let item of menuItems" 
          [routerLink]="item.route" 
          [class]="getNavItemClasses(item.route)"
          routerLinkActive="active"
        >
          <span class="nav-icon">{{ item.icon }}</span>
          <span [class]="labelClasses">{{ item.label }}</span>
        </a>
      </nav>
      
      <!-- Logout at Bottom -->
      <div class="sidebar-footer">
        <button [class]="getLogoutClasses()" (click)="logout()">
          <span class="nav-icon">🚪</span>
          <span [class]="labelClasses">Logout</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 280px;
      height: 100vh;
      background: #ffffff;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      border-radius: 0 24px 24px 0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }

    .sidebar-header {
      padding: 2rem 1.5rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
      margin: 0;
    }

    .sidebar-nav {
      flex: 1;
      padding: 1.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 16px;
      transition: all 0.3s ease;
      font-weight: 500;
      background: #f9fafb;
      border: none;
      cursor: pointer;
      width: 100%;
      text-align: left;
    }

    .nav-item:hover {
      background: #f3f4f6;
      color: #3b82f6;
      transform: translateX(4px);
    }

    .nav-item.active {
      background: #dbeafe;
      color: #1d4ed8;
      font-weight: 700;
      border-left: 4px solid #3b82f6;
    }

    .nav-icon {
      font-size: 1.5rem;
      width: 24px;
      text-align: center;
      flex-shrink: 0;
    }

    .nav-label {
      font-size: 0.95rem;
      flex: 1;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #f3f4f6;
    }

    .logout-btn {
      color: #dc2626;
      background: #fef2f2;
    }

    .logout-btn:hover {
      background: #fee2e2;
      color: #b91c1c;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 80px;
        border-radius: 0 16px 16px 0;
      }

      .nav-label {
        display: none;
      }

      .logo {
        font-size: 1rem;
      }

      .nav-item {
        justify-content: center;
        padding: 1rem 0.5rem;
      }
    }
  `]
})
export class ModernSidebarComponent implements OnInit {
  menuItems = [
    { label: 'Dashboard', route: '/employee/dashboard', icon: '📊' },
    { label: 'Payrolls', route: '/employee/payrolls', icon: '💰' },
    { label: 'Requests', route: '/employee/requests', icon: '📋' },
    { label: 'Notifications', route: '/employee/notifications', icon: '🔔' },
    { label: 'Settings', route: '/employee/settings', icon: '⚙️' }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const role = this.authService.getUserRole()?.toLowerCase();
    this.updateMenuForRole(role || 'employee');
  }

  updateMenuForRole(role: string) {
    const roleMenus = {
      employee: [
        { label: 'Dashboard', route: '/employee/dashboard', icon: '📊' },
        { label: 'Payrolls', route: '/employee/payrolls', icon: '💰' },
        { label: 'Requests', route: '/employee/requests', icon: '📋' },
        { label: 'Notifications', route: '/employee/notifications', icon: '🔔' },
        { label: 'Settings', route: '/employee/settings', icon: '⚙️' }
      ],
      manager: [
        { label: 'Dashboard', route: '/manager/dashboard', icon: '📊' },
        { label: 'Payrolls', route: '/manager/payrolls', icon: '💰' },
        { label: 'Requests', route: '/manager/requests', icon: '📋' },
        { label: 'Notifications', route: '/manager/notifications', icon: '🔔' },
        { label: 'Settings', route: '/manager/settings', icon: '⚙️' }
      ],
      financeadmin: [
        { label: 'Dashboard', route: '/finance/dashboard', icon: '📊' },
        { label: 'Payrolls', route: '/finance/payrolls', icon: '💰' },
        { label: 'Requests', route: '/finance/requests', icon: '📋' },
        { label: 'Notifications', route: '/finance/notifications', icon: '🔔' },
        { label: 'Settings', route: '/finance/settings', icon: '⚙️' }
      ],
      admin: [
        { label: 'Dashboard', route: '/admin/dashboard', icon: '📊' },
        { label: 'Payrolls', route: '/admin/payrolls', icon: '💰' },
        { label: 'Requests', route: '/admin/requests', icon: '📋' },
        { label: 'Notifications', route: '/admin/notifications', icon: '🔔' },
        { label: 'Settings', route: '/admin/settings', icon: '⚙️' }
      ]
    };
    
    this.menuItems = roleMenus[role as keyof typeof roleMenus] || roleMenus.employee;
  }

  logout() {
    this.authService.logout();
  }
}