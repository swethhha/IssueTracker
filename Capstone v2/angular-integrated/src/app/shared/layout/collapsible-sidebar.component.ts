import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-collapsible-sidebar-disabled',
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
      box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      padding: 1rem;
      transition: all 300ms ease-in-out;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .sidebar.expanded {
      width: 240px;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid #f3f4f6;
      margin: -1rem -1rem 1rem -1rem;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-radius: 0 20px 16px 0;
    }

    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
      transition: all 200ms ease-in-out;
    }

    .toggle-btn {
      background: #f3f4f6;
      border: none;
      border-radius: 6px;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 12px;
      color: #6b7280;
      transition: all 200ms ease-in-out;
    }

    .toggle-btn:hover {
      background: #e5e7eb;
      color: #2563eb;
    }

    .sidebar-nav {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: #6b7280;
      text-decoration: none;
      border-radius: 12px;
      transition: all 200ms ease-in-out;
      font-weight: 500;
      border: none;
      cursor: pointer;
      width: 100%;
      text-align: left;
      background: transparent;
      margin: 0.125rem 0;
    }

    .nav-item.expanded {
      gap: 0.75rem;
    }

    .nav-item.collapsed {
      justify-content: center;
      padding: 0.75rem 0.5rem;
    }

    .nav-item:hover {
      background: #f1f5f9;
      color: #2563eb;
      transform: translateX(2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .nav-item.active {
      background: #dbeafe;
      color: #1d4ed8;
      font-weight: 700;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
      border-left: 3px solid #3b82f6;
    }

    .nav-item.active .nav-icon {
      color: #1d4ed8;
    }

    .nav-item:hover .nav-icon {
      color: #2563eb;
    }

    .nav-icon {
      font-size: 1.25rem;
      width: 20px;
      text-align: center;
      flex-shrink: 0;
    }

    .nav-label {
      font-size: 0.875rem;
      transition: all 200ms ease-in-out;
    }

    .nav-label.visible {
      opacity: 1;
      display: block;
    }

    .nav-label.hidden {
      opacity: 0;
      display: none;
    }

    .sidebar-footer {
      border-top: 1px solid #f3f4f6;
      padding: 1rem;
      margin: 1rem -1rem -1rem -1rem;
      background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
      border-radius: 16px 0 20px 0;
    }

    .logout-btn {
      color: #dc2626;
    }

    .logout-btn:hover {
      background: #fef2f2;
      color: #b91c1c;
      transform: translateX(2px);
      box-shadow: 0 2px 4px rgba(220, 38, 38, 0.1);
    }

    .logout-btn.active {
      background: #fee2e2;
      color: #991b1b;
      border-left: 3px solid #dc2626;
    }
  `]
})
export class CollapsibleSidebarComponent implements OnInit {
  isExpanded = true;
  
  menuItems = [
    { label: 'Dashboard', route: '/employee/dashboard', icon: '🏠' },
    { label: 'Payrolls', route: '/employee/payrolls', icon: '🧾' },
    { label: 'Requests', route: '/employee/requests', icon: '✓' },
    { label: 'Notifications', route: '/employee/notifications', icon: '🔔' },
    { label: 'Settings', route: '/employee/settings', icon: '⚙️' }
  ];

  constructor(private authService: AuthService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isExpanded = event.target.innerWidth >= 768;
  }

  ngOnInit() {
    this.isExpanded = window.innerWidth >= 768;
    const role = this.authService.getUserRole()?.toLowerCase();
    this.updateMenuForRole(role || 'employee');
  }

  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
  }

  get sidebarClasses() {
    return `sidebar ${this.isExpanded ? 'expanded' : 'collapsed'}`;
  }

  get logoClasses() {
    return `logo ${this.isExpanded ? 'expanded' : 'collapsed'}`;
  }

  get labelClasses() {
    return `nav-label ${this.isExpanded ? 'visible' : 'hidden'}`;
  }

  getNavItemClasses(route: string) {
    return `nav-item ${this.isExpanded ? 'expanded' : 'collapsed'}`;
  }

  getLogoutClasses() {
    return `nav-item logout-btn ${this.isExpanded ? 'expanded' : 'collapsed'}`;
  }

  updateMenuForRole(role: string) {
    const roleMenus = {
      employee: [
        { label: 'Dashboard', route: '/employee/dashboard', icon: '🏠' },
        { label: 'Payrolls', route: '/employee/payrolls', icon: '🧾' },
        { label: 'Requests', route: '/employee/requests', icon: '✓' },
        { label: 'Notifications', route: '/employee/notifications', icon: '🔔' },
        { label: 'Settings', route: '/employee/settings', icon: '⚙️' }
      ],
      manager: [
        { label: 'Dashboard', route: '/manager/dashboard', icon: '🏠' },
        { label: 'Payrolls', route: '/manager/payrolls', icon: '🧾' },
        { label: 'Requests', route: '/manager/requests', icon: '✓' },
        { label: 'Notifications', route: '/manager/notifications', icon: '🔔' },
        { label: 'Settings', route: '/manager/settings', icon: '⚙️' }
      ],
      financeadmin: [
        { label: 'Dashboard', route: '/finance/dashboard', icon: '🏠' },
        { label: 'Payrolls', route: '/finance/payrolls', icon: '🧾' },
        { label: 'Requests', route: '/finance/requests', icon: '✓' },
        { label: 'Notifications', route: '/finance/notifications', icon: '🔔' },
        { label: 'Settings', route: '/finance/settings', icon: '⚙️' }
      ],
      admin: [
        { label: 'Dashboard', route: '/admin/dashboard', icon: '🏠' },
        { label: 'Payrolls', route: '/admin/payrolls', icon: '🧾' },
        { label: 'Requests', route: '/admin/requests', icon: '✓' },
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