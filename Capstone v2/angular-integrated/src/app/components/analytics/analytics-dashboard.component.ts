import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService } from '../../services/analytics.service';
import { AuthService } from '../../services/auth.service';
import { MockPayrollService } from '../../services/mock-payroll.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="analytics-container">
      <div class="analytics-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">{{ getDashboardTitle() }}</h1>
            <p class="page-subtitle">{{ getDashboardSubtitle() }}</p>
          </div>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="refreshData()">
              <span class="material-icons">refresh</span>
              {{ loading ? 'Loading...' : 'Refresh Data' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading analytics data...</p>
      </div>

      <!-- Error State -->
      <div class="error-state" *ngIf="error && !loading">
        <span class="material-icons">error</span>
        <p>{{ error }}</p>
        <button class="btn btn-primary" (click)="refreshData()">Retry</button>
      </div>

      <!-- Data Content -->
      <div *ngIf="!loading && !error && analyticsData">
        <div class="metrics-grid">
          <div class="metric-card revenue">
            <div class="metric-icon">
              <span class="material-icons">trending_up</span>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ getMetricValue(0) }}</div>
              <div class="metric-label">{{ getMetricLabel(0) }}</div>
              <div class="metric-change positive">
                <span class="material-icons">arrow_upward</span>
                +12.5%
              </div>
            </div>
          </div>

          <div class="metric-card employees">
            <div class="metric-icon">
              <span class="material-icons">group</span>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ getMetricValue(1) }}</div>
              <div class="metric-label">{{ getMetricLabel(1) }}</div>
              <div class="metric-change positive">
                <span class="material-icons">arrow_upward</span>
                +3.2%
              </div>
            </div>
          </div>

          <div class="metric-card approvals">
            <div class="metric-icon">
              <span class="material-icons">check_circle</span>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ getMetricValue(2) }}</div>
              <div class="metric-label">{{ getMetricLabel(2) }}</div>
              <div class="metric-change positive">
                <span class="material-icons">arrow_upward</span>
                +1.8%
              </div>
            </div>
          </div>

          <div class="metric-card processing">
            <div class="metric-icon">
              <span class="material-icons">schedule</span>
            </div>
            <div class="metric-content">
              <div class="metric-value">{{ getMetricValue(3) }}</div>
              <div class="metric-label">{{ getMetricLabel(3) }}</div>
              <div class="metric-change negative">
                <span class="material-icons">arrow_downward</span>
                -0.5 days
              </div>
            </div>
          </div>
        </div>

      <div class="charts-section">
        <div class="chart-row">
          <div class="chart-card large">
            <div class="chart-header">
              <h3>Payroll Trends</h3>
            </div>
            <div class="chart-content">
              <div class="chart-placeholder">
                <div class="chart-bars">
                  <div class="bar" style="height: 60%"></div>
                  <div class="bar" style="height: 75%"></div>
                  <div class="bar" style="height: 45%"></div>
                  <div class="bar" style="height: 85%"></div>
                  <div class="bar" style="height: 70%"></div>
                  <div class="bar" style="height: 90%"></div>
                </div>
                <div class="chart-labels">
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h3>Department Distribution</h3>
            </div>
            <div class="chart-content">
              <div class="donut-chart">
                <div class="donut-center">
                  <div class="donut-value">1,247</div>
                  <div class="donut-label">Total</div>
                </div>
              </div>
              <div class="donut-legend">
                <div class="legend-item" *ngFor="let dept of analyticsData.departmentDistribution; let i = index">
                  <div class="legend-color" [ngClass]="dept.name.toLowerCase()"></div>
                  <span>{{ dept.name }} ({{ dept.percentage }}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`
    .analytics-container {
      padding: 1.5rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    .analytics-header {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      margin-bottom: 2rem;
      color: #1e293b;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border: 1px solid #e2e8f0;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .page-subtitle {
      font-size: 0.875rem;
      opacity: 0.7;
      margin: 0.25rem 0 0 0;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      background: #2563eb;
      color: white;
    }

    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .metric-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .metric-icon {
      width: 60px;
      height: 60px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
    }

    .metric-card.revenue .metric-icon {
      background: #2563eb;
    }

    .metric-card.employees .metric-icon {
      background: #10b981;
    }

    .metric-card.approvals .metric-icon {
      background: #f59e0b;
    }

    .metric-card.processing .metric-icon {
      background: #8b5cf6;
    }

    .metric-value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a202c;
    }

    .metric-label {
      font-size: 0.9rem;
      color: #718096;
      margin: 0.25rem 0;
    }

    .metric-change {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .metric-change.positive {
      color: #38a169;
    }

    .chart-row {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    .chart-card {
      background: white;
      border-radius: 20px;
      padding: 2rem;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .chart-header h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #1a202c;
      margin: 0 0 1rem 0;
    }

    .chart-bars {
      display: flex;
      align-items: flex-end;
      gap: 1rem;
      height: 160px;
      margin-bottom: 1rem;
    }

    .bar {
      flex: 1;
      background: #2563eb;
      border-radius: 4px 4px 0 0;
      min-height: 20px;
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
      color: #718096;
    }

    .donut-chart {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      background: conic-gradient(
        #2563eb 0deg 162deg,
        #10b981 162deg 252deg,
        #f59e0b 252deg 306deg
      );
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      position: relative;
    }

    .donut-chart::before {
      content: '';
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 50%;
      position: absolute;
    }

    .donut-center {
      position: relative;
      z-index: 1;
      text-align: center;
    }

    .donut-value {
      font-size: 1rem;
      font-weight: 600;
      color: #1a202c;
    }

    .donut-label {
      font-size: 0.8rem;
      color: #718096;
    }

    .donut-legend {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.85rem;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .legend-color.engineering { background: #2563eb; }
    .legend-color.sales { background: #10b981; }
    .legend-color.marketing { background: #f59e0b; }
    .legend-color.hr { background: #8b5cf6; }
    .legend-color.finance { background: #ef4444; }

    .loading-state, .error-state {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #2563eb;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .error-state .material-icons {
      font-size: 48px;
      color: #e53e3e;
      margin-bottom: 1rem;
    }
  `]
})
export class AnalyticsDashboardComponent implements OnInit {
  analyticsData: any | null = null;
  loading = true;
  error: string | null = null;
  userRole: string | null = null;

  constructor(
    private analyticsService: AnalyticsService,
    private authService: AuthService,
    private mockPayrollService: MockPayrollService
  ) { }

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.authService.currentUser$.subscribe(user => {
      this.userRole = user?.role || null;
    });
    this.loadAnalyticsData();
  }

  loadAnalyticsData(): void {
    this.loading = true;
    this.error = null;
    
    // Load role-specific analytics data
    this.mockPayrollService.getDashboardStats().subscribe({
      next: (data) => {
        this.analyticsData = this.generateRoleSpecificData(data);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading analytics data:', error);
        this.error = 'Failed to load analytics data';
        this.loading = false;
      }
    });
  }

  formatCurrency(amount: number): string {
    if (amount >= 1000000) {
      return `₹${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}K`;
    }
    return `₹${amount.toLocaleString()}`;
  }

  getDashboardTitle(): string {
    switch(this.userRole) {
      case 'Manager': return 'Team Analytics Dashboard';
      case 'Finance': return 'Financial Analytics Dashboard';
      default: return 'Analytics Dashboard';
    }
  }
  
  getDashboardSubtitle(): string {
    switch(this.userRole) {
      case 'Manager': return 'Team performance and approval insights';
      case 'Finance': return 'Financial operations and budget analysis';
      default: return 'Comprehensive insights into operations';
    }
  }
  
  getMetricValue(index: number): string {
    const metrics = this.getMetricsForRole();
    return metrics[index]?.value || '0';
  }
  
  getMetricLabel(index: number): string {
    const metrics = this.getMetricsForRole();
    return metrics[index]?.label || '';
  }
  
  private getMetricsForRole() {
    switch(this.userRole) {
      case 'Manager':
        return [
          { value: '₹485K', label: 'Team Budget' },
          { value: '8', label: 'Team Members' },
          { value: '93.8%', label: 'Approval Rate' },
          { value: '1.2', label: 'Avg Response Days' }
        ];
      case 'Finance':
        return [
          { value: '₹2.5M', label: 'Total Disbursed' },
          { value: '45', label: 'Processed This Month' },
          { value: '96.2%', label: 'Success Rate' },
          { value: '2.1', label: 'Avg Processing Days' }
        ];
      default:
        return [
          { value: '₹1.2M', label: 'Total Payroll' },
          { value: '125', label: 'Active Employees' },
          { value: '94.5%', label: 'Approval Rate' },
          { value: '1.8', label: 'Avg Processing Days' }
        ];
    }
  }
  
  private generateRoleSpecificData(mockData: any): any {
    switch(this.userRole) {
      case 'Manager':
        return {
          totalPayroll: 485000,
          activeEmployees: 8,
          approvalRate: 93.8,
          avgProcessingDays: 1.2,
          departmentDistribution: [
            { name: 'Engineering', percentage: 45 },
            { name: 'Sales', percentage: 30 },
            { name: 'Marketing', percentage: 25 }
          ]
        };
      case 'Finance':
        return {
          totalPayroll: 2500000,
          activeEmployees: 45,
          approvalRate: 96.2,
          avgProcessingDays: 2.1,
          departmentDistribution: [
            { name: 'Loans', percentage: 55 },
            { name: 'Reimbursements', percentage: 25 },
            { name: 'Payroll', percentage: 20 }
          ]
        };
      default:
        return {
          totalPayroll: 1200000,
          activeEmployees: 125,
          approvalRate: 94.5,
          avgProcessingDays: 1.8,
          departmentDistribution: [
            { name: 'Engineering', percentage: 40 },
            { name: 'Sales', percentage: 25 },
            { name: 'Marketing', percentage: 20 },
            { name: 'HR', percentage: 15 }
          ]
        };
    }
  }
  
  refreshData(): void {
    this.loadAnalyticsData();
  }
}