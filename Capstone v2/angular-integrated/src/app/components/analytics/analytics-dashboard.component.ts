import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AnalyticsService, AnalyticsData } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="analytics-container">
      <div class="analytics-header">
        <div class="header-content">
          <div class="header-text">
            <h1 class="page-title">Analytics Dashboard</h1>
            <p class="page-subtitle">Comprehensive insights into your payroll operations</p>
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
              <div class="metric-value">{{ formatCurrency(analyticsData.totalPayroll) }}</div>
              <div class="metric-label">Total Payroll</div>
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
              <div class="metric-value">{{ analyticsData.activeEmployees | number }}</div>
              <div class="metric-label">Active Employees</div>
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
              <div class="metric-value">{{ analyticsData.approvalRate | number:'1.1-1' }}%</div>
              <div class="metric-label">Approval Rate</div>
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
              <div class="metric-value">{{ analyticsData.avgProcessingDays | number:'1.1-1' }}</div>
              <div class="metric-label">Avg Processing Days</div>
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
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      min-height: 100vh;
    }

    .analytics-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 2rem;
      margin-bottom: 2rem;
      color: white;
      box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-title {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
    }

    .page-subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      margin: 0.5rem 0 0 0;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      background: rgba(255, 255, 255, 0.2);
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .metric-card.employees .metric-icon {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .metric-card.approvals .metric-icon {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }

    .metric-card.processing .metric-icon {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }

    .metric-value {
      font-size: 2.5rem;
      font-weight: 800;
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
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 1.5rem 0;
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
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
        #667eea 0deg 162deg,
        #f093fb 162deg 252deg,
        #4facfe 252deg 306deg
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
      font-size: 1.5rem;
      font-weight: 800;
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

    .legend-color.engineering { background: #667eea; }
    .legend-color.sales { background: #f093fb; }
    .legend-color.marketing { background: #4facfe; }
    .legend-color.hr { background: #43e97b; }
    .legend-color.finance { background: #ffeaa7; }

    .loading-state, .error-state {
      text-align: center;
      padding: 3rem;
      color: #718096;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e2e8f0;
      border-top: 4px solid #667eea;
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
  analyticsData: AnalyticsData | null = null;
  loading = true;
  error: string | null = null;

  constructor(private analyticsService: AnalyticsService) { }

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  loadAnalyticsData(): void {
    this.loading = true;
    this.error = null;
    
    this.analyticsService.getAnalyticsData().subscribe({
      next: (data) => {
        this.analyticsData = data;
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

  refreshData(): void {
    this.loadAnalyticsData();
  }
}