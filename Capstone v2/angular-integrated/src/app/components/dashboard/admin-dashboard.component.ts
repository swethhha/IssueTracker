import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>System overview and management</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">{{ totalEmployees }}</div>
          <div class="stat-label">Total Employees</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalRequests }}</div>
          <div class="stat-label">Total Requests</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ systemUptime }}%</div>
          <div class="stat-label">System Uptime</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ totalDisbursed | currency:'USD':'symbol':'1.0-0' }}</div>
          <div class="stat-label">Total Disbursed</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="chart-container">
          <h3 class="chart-title">Monthly Request Trends</h3>
          <div class="chart-placeholder">
            <p>Charts will be displayed here</p>
          </div>
        </div>

        <div class="chart-container">
          <h3 class="chart-title">Request Status Distribution</h3>
          <div class="chart-placeholder">
            <p>Charts will be displayed here</p>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">System Management</h3>
          </div>
          <div class="card-body">
            <div class="system-actions">
              <button class="btn btn-primary" (click)="manageUsers()">
                👥 Manage Users
              </button>
              <button class="btn btn-primary" (click)="systemSettings()">
                ⚙️ System Settings
              </button>
              <button class="btn btn-primary" (click)="auditLogs()">
                📋 Audit Logs
              </button>
              <button class="btn btn-primary" (click)="backupData()">
                💾 Backup Data
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Recent System Activity</h3>
          </div>
          <div class="card-body">
            <div class="activity-list">
              <div class="activity-item" *ngFor="let activity of recentActivities">
                <div class="activity-info">
                  <strong>{{ activity.action }}</strong>
                  <span>{{ activity.user }}</span>
                  <small>{{ activity.timestamp | date:'short' }}</small>
                </div>
                <span class="badge" [ngClass]="getActivityBadgeClass(activity.type)">
                  {{ activity.type }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .system-actions {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .activity-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .activity-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }

    .activity-item:last-child {
      border-bottom: none;
    }

    .activity-info strong {
      display: block;
      font-weight: 600;
    }

    .activity-info span {
      color: var(--text-secondary);
      font-size: 0.875rem;
    }

    .activity-info small {
      color: var(--text-muted);
      font-size: 0.75rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  totalEmployees = 0;
  totalRequests = 0;
  systemUptime = 0;
  totalDisbursed = 0;
  monthlyTrendData: any[] = [];
  statusDistributionData: any[] = [];
  recentActivities: any[] = [];

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // Demo data - replace with actual API calls
    this.totalEmployees = 150;
    this.totalRequests = 1250;
    this.systemUptime = 99.8;
    this.totalDisbursed = 25000000;

    this.monthlyTrendData = [
      {
        name: 'Requests',
        series: [
          { name: 'Jan', value: 120 },
          { name: 'Feb', value: 135 },
          { name: 'Mar', value: 145 },
          { name: 'Apr', value: 160 },
          { name: 'May', value: 155 },
          { name: 'Jun', value: 170 }
        ]
      }
    ];

    this.statusDistributionData = [
      { name: 'Approved', value: 850 },
      { name: 'Pending', value: 200 },
      { name: 'Rejected', value: 100 },
      { name: 'In Review', value: 100 }
    ];

    this.recentActivities = [
      { action: 'User Login', user: 'john.doe@company.com', timestamp: new Date(), type: 'Login' },
      { action: 'Payroll Approved', user: 'manager@company.com', timestamp: new Date(), type: 'Approval' },
      { action: 'Loan Application', user: 'jane.smith@company.com', timestamp: new Date(), type: 'Request' },
      { action: 'System Backup', user: 'System', timestamp: new Date(), type: 'System' }
    ];
  }

  manageUsers() {
    console.log('Managing users');
  }

  systemSettings() {
    console.log('Opening system settings');
  }

  auditLogs() {
    console.log('Viewing audit logs');
  }

  backupData() {
    console.log('Starting data backup');
  }

  getActivityBadgeClass(type: string): string {
    switch (type.toLowerCase()) {
      case 'login': return 'badge-info';
      case 'approval': return 'badge-success';
      case 'request': return 'badge-warning';
      case 'system': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }
}