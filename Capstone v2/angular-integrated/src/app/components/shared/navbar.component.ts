import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="bg-white border-b border-gray-200 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <div class="flex-shrink-0 flex items-center">
              <img class="h-8 w-auto" src="assets/logo.png" alt="Payroll360" 
                   onerror="this.style.display='none'">
              <span class="ml-2 text-xl font-bold text-primary-600">Payroll360</span>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="hidden md:flex items-center space-x-8">
            <!-- Dashboard -->
            <a [routerLink]="getDashboardRoute()" 
               routerLinkActive="text-primary-600 border-primary-600"
               class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
              <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
            </a>

            <!-- Employee Services -->
            <div class="relative" *ngIf="userRole !== 'Admin'">
              <button (click)="toggleServicesDropdown()" 
                      class="text-gray-500 hover:text-gray-700 whitespace-nowrap py-2 px-1 font-medium text-sm transition-colors flex items-center">
                <i class="fas fa-briefcase mr-2"></i>Services
                <i class="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              
              <div *ngIf="showServicesDropdown" 
                   class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <a routerLink="/payroll" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-money-bill-wave mr-2"></i>My Payrolls
                </a>
                <a routerLink="/loans" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-hand-holding-usd mr-2"></i>Loans
                </a>
                <a routerLink="/reimbursements" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-receipt mr-2"></i>Reimbursements
                </a>
                <a routerLink="/insurance" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-shield-alt mr-2"></i>Insurance
                </a>
                <a routerLink="/medical-claims" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-hospital mr-2"></i>Medical Claims
                </a>
              </div>
            </div>

            <!-- Manager Approvals -->
            <a *ngIf="userRole === 'Manager'" 
               routerLink="/approvals" 
               routerLinkActive="text-primary-600 border-primary-600"
               class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors relative">
              <i class="fas fa-tasks mr-2"></i>Approvals
              <span *ngIf="pendingApprovals > 0" 
                    class="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {{pendingApprovals}}
              </span>
            </a>

            <!-- Finance -->
            <a *ngIf="userRole === 'FinanceAdmin'" 
               routerLink="/finance" 
               routerLinkActive="text-primary-600 border-primary-600"
               class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
              <i class="fas fa-calculator mr-2"></i>Finance
            </a>

            <!-- Admin -->
            <a *ngIf="userRole === 'Admin'" 
               routerLink="/admin" 
               routerLinkActive="text-primary-600 border-primary-600"
               class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
              <i class="fas fa-cog mr-2"></i>Admin
            </a>

            <!-- Reports -->
            <a *ngIf="userRole !== 'Employee'" 
               routerLink="/reports" 
               routerLinkActive="text-primary-600 border-primary-600"
               class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors">
              <i class="fas fa-chart-bar mr-2"></i>Reports
            </a>
          </div>

          <!-- Right side -->
          <div class="flex items-center space-x-4">
            <!-- Notifications -->
            <div class="relative">
              <button (click)="toggleNotifications()" 
                      class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors relative">
                <i class="fas fa-bell text-lg"></i>
                <span *ngIf="unreadNotifications > 0" 
                      class="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {{unreadNotifications}}
                </span>
              </button>
              
              <div *ngIf="showNotifications" 
                   class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div class="px-4 py-2 border-b border-gray-200">
                  <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
                </div>
                <div class="max-h-64 overflow-y-auto">
                  <div *ngFor="let notification of recentNotifications" 
                       class="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                    <p class="text-sm text-gray-900">{{notification.message}}</p>
                    <p class="text-xs text-gray-500 mt-1">{{notification.createdAt | date:'short'}}</p>
                  </div>
                  <div *ngIf="recentNotifications.length === 0" 
                       class="px-4 py-3 text-sm text-gray-500 text-center">
                    No notifications
                  </div>
                </div>
                <div class="px-4 py-2 border-t border-gray-200">
                  <a routerLink="/notifications" 
                     class="text-sm text-primary-600 hover:text-primary-700">
                    View all notifications
                  </a>
                </div>
              </div>
            </div>

            <!-- User Menu -->
            <div class="relative">
              <button (click)="toggleUserMenu()" 
                      class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <i class="fas fa-user text-primary-600"></i>
                </div>
                <span class="ml-2 text-gray-700 font-medium">{{userName}}</span>
                <i class="fas fa-chevron-down ml-1 text-xs text-gray-500"></i>
              </button>
              
              <div *ngIf="showUserMenu" 
                   class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div class="px-4 py-2 border-b border-gray-200">
                  <p class="text-sm font-medium text-gray-900">{{userName}}</p>
                  <p class="text-xs text-gray-500">{{userRole}}</p>
                </div>
                <a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-user mr-2"></i>Profile
                </a>
                <a routerLink="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-cog mr-2"></i>Settings
                </a>
                <button (click)="logout()" 
                        class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <i class="fas fa-sign-out-alt mr-2"></i>Logout
                </button>
              </div>
            </div>

            <!-- Mobile menu button -->
            <button (click)="toggleMobileMenu()" 
                    class="md:hidden text-gray-500 hover:text-gray-700 p-2">
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu -->
      <div *ngIf="showMobileMenu" class="md:hidden border-t border-gray-200">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a [routerLink]="getDashboardRoute()" 
             class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
            <i class="fas fa-tachometer-alt mr-2"></i>Dashboard
          </a>
          
          <div *ngIf="userRole !== 'Admin'" class="space-y-1">
            <p class="px-3 py-2 text-sm font-medium text-gray-500 uppercase tracking-wider">Services</p>
            <a routerLink="/payroll" class="block px-6 py-2 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <i class="fas fa-money-bill-wave mr-2"></i>My Payrolls
            </a>
            <a routerLink="/loans" class="block px-6 py-2 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <i class="fas fa-hand-holding-usd mr-2"></i>Loans
            </a>
            <a routerLink="/reimbursements" class="block px-6 py-2 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <i class="fas fa-receipt mr-2"></i>Reimbursements
            </a>
            <a routerLink="/insurance" class="block px-6 py-2 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <i class="fas fa-shield-alt mr-2"></i>Insurance
            </a>
            <a routerLink="/medical-claims" class="block px-6 py-2 text-base text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
              <i class="fas fa-hospital mr-2"></i>Medical Claims
            </a>
          </div>

          <a *ngIf="userRole === 'Manager'" routerLink="/approvals" 
             class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
            <i class="fas fa-tasks mr-2"></i>Approvals
          </a>

          <a *ngIf="userRole === 'FinanceAdmin'" routerLink="/finance" 
             class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
            <i class="fas fa-calculator mr-2"></i>Finance
          </a>

          <a *ngIf="userRole === 'Admin'" routerLink="/admin" 
             class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
            <i class="fas fa-cog mr-2"></i>Admin
          </a>

          <a *ngIf="userRole !== 'Employee'" routerLink="/reports" 
             class="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md">
            <i class="fas fa-chart-bar mr-2"></i>Reports
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .space-x-8 > * + * {
      margin-left: 2rem;
    }
    .space-x-4 > * + * {
      margin-left: 1rem;
    }
    .space-y-1 > * + * {
      margin-top: 0.25rem;
    }
  `]
})
export class NavbarComponent implements OnInit {
  userName = '';
  userRole = '';
  showUserMenu = false;
  showServicesDropdown = false;
  showNotifications = false;
  showMobileMenu = false;
  
  pendingApprovals = 0;
  unreadNotifications = 0;
  recentNotifications: any[] = [];

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.loadNotifications();
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.relative')) {
        this.closeAllDropdowns();
      }
    });
  }

  private loadUserInfo() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = (user as any).name || user.email;
      this.userRole = user.role;
    }
  }

  private async loadNotifications() {
    try {
      const notifications = await this.notificationService.getMyNotifications().toPromise();
      this.recentNotifications = notifications?.slice(0, 5) || [];
      this.unreadNotifications = notifications?.filter((n: any) => !n.isRead).length || 0;
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }

  getDashboardRoute(): string {
    switch (this.userRole) {
      case 'Manager':
        return '/dashboard/manager';
      case 'FinanceAdmin':
        return '/dashboard/finance';
      case 'Admin':
        return '/dashboard/admin';
      default:
        return '/dashboard';
    }
  }

  toggleUserMenu() {
    this.showUserMenu = !this.showUserMenu;
    this.showServicesDropdown = false;
    this.showNotifications = false;
  }

  toggleServicesDropdown() {
    this.showServicesDropdown = !this.showServicesDropdown;
    this.showUserMenu = false;
    this.showNotifications = false;
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    this.showUserMenu = false;
    this.showServicesDropdown = false;
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
  }

  closeAllDropdowns() {
    this.showUserMenu = false;
    this.showServicesDropdown = false;
    this.showNotifications = false;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}