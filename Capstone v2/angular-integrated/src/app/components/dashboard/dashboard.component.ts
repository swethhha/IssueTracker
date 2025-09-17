import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { ManagerDashboardComponent } from './manager-dashboard.component';
import { FinanceDashboardComponent } from './finance-dashboard.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, EmployeeDashboardComponent, ManagerDashboardComponent, FinanceDashboardComponent],
  template: `
    <div class="dashboard-wrapper">
      <!-- Role-based dashboard rendering -->
      <app-employee-dashboard *ngIf="userRole === 'Employee'"></app-employee-dashboard>
      <app-manager-dashboard *ngIf="userRole === 'Manager'"></app-manager-dashboard>
      <app-finance-dashboard *ngIf="userRole === 'Finance'"></app-finance-dashboard>
      
      <!-- Admin dashboard (fallback) -->
      <div *ngIf="userRole === 'Admin'" class="admin-dashboard">
        <div class="dashboard-container">
          <div class="dashboard-header">
            <h1>Admin Dashboard</h1>
            <p>System administration and overview</p>
          </div>
          
          <div class="admin-grid">
            <div class="admin-card" (click)="navigate('/employees')">
              <div class="admin-icon">👥</div>
              <h3>Employee Management</h3>
              <p>Manage employee accounts and roles</p>
            </div>
            
            <div class="admin-card" (click)="navigate('/reports')">
              <div class="admin-icon">📊</div>
              <h3>Reports & Analytics</h3>
              <p>View system reports and analytics</p>
            </div>
            
            <div class="admin-card" (click)="navigate('/settings')">
              <div class="admin-icon">⚙️</div>
              <h3>System Settings</h3>
              <p>Configure system parameters</p>
            </div>
            
            <div class="admin-card" (click)="navigate('/audit')">
              <div class="admin-icon">🔍</div>
              <h3>Audit Logs</h3>
              <p>Review system audit trails</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Loading state -->
      <div *ngIf="!userRole" class="loading-dashboard">
        <div class="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper {
      min-height: 100vh;
      background: var(--bg-primary, #f8fafc);
    }
    
    .admin-dashboard {
      padding: 2rem;
    }
    
    .dashboard-container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }
    
    .dashboard-header h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: var(--text-primary, #1a202c);
      margin: 0;
    }
    
    .dashboard-header p {
      font-size: 1.125rem;
      color: var(--text-secondary, #718096);
      margin: 0.5rem 0 0 0;
    }
    
    .admin-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
    }
    
    .admin-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
    }
    
    .admin-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
    }
    
    .admin-icon {
      font-size: 3rem;
      margin-bottom: 1rem;
    }
    
    .admin-card h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary, #1a202c);
      margin: 0 0 0.5rem 0;
    }
    
    .admin-card p {
      color: var(--text-secondary, #718096);
      margin: 0;
    }
    
    .loading-dashboard {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 50vh;
      color: var(--text-secondary, #718096);
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #667eea;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userRole: string | null = null;
  
  constructor(private router: Router, private authService: AuthService) {}
  
  ngOnInit() {
    this.userRole = this.authService.getUserRole();
    
    // Subscribe to user changes
    this.authService.currentUser$.subscribe(user => {
      this.userRole = user?.role || null;
    });
  }
  
  navigate(path: string) {
    this.router.navigate([path]);
  }
}