import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { AuthService } from '../../services/auth.service';
import { ReimbursementService } from '../../services/reimbursement.service';
import { EmployeeRole } from '../../models/auth.models';

@Component({
  selector: 'app-reimbursement-dashboard',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  template: `
    <div class="dashboard-container">
      <!-- Employee Dashboard -->
      <div *ngIf="isEmployee()" class="employee-dashboard">
        <div class="kpi-cards">
          <div class="kpi-card total">
            <div class="card-icon">
              <i class="feather icon-dollar-sign"></i>
            </div>
            <div class="card-content">
              <h3>₹{{ employeeStats.totalRequested | number }}</h3>
              <p>Total Requested</p>
              <small>This year</small>
            </div>
          </div>

          <div class="kpi-card approved">
            <div class="card-icon">
              <i class="feather icon-check-circle"></i>
            </div>
            <div class="card-content">
              <h3>₹{{ employeeStats.approvedByFinance | number }}</h3>
              <p>Approved by Finance</p>
              <small>{{ employeeStats.approvedCount }} requests</small>
            </div>
          </div>

          <div class="kpi-card manager">
            <div class="card-icon">
              <i class="feather icon-user-check"></i>
            </div>
            <div class="card-content">
              <h3>₹{{ employeeStats.approvedByManager | number }}</h3>
              <p>Approved by Manager</p>
              <small>{{ employeeStats.managerApprovedCount }} requests</small>
            </div>
          </div>

          <div class="kpi-card pending">
            <div class="card-icon">
              <i class="feather icon-clock"></i>
            </div>
            <div class="card-content">
              <h3>{{ employeeStats.pendingCount }}</h3>
              <p>Pending</p>
              <small>Awaiting approval</small>
            </div>
          </div>
        </div>

        <div class="charts-row">
          <div class="chart-card">
            <div class="chart-header">
              <h4>Status Distribution</h4>
              <p>Approved vs Pending vs Rejected</p>
            </div>
            <div class="chart-container">
              <apx-chart
                [series]="employeeStatusChart.series"
                [chart]="employeeStatusChart.chart"
                [labels]="employeeStatusChart.labels"
                [colors]="employeeStatusChart.colors"
                [plotOptions]="employeeStatusChart.plotOptions">
              </apx-chart>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h4>Reimbursements by Category</h4>
              <p>Expense breakdown</p>
            </div>
            <div class="chart-container">
              <apx-chart
                [series]="employeeCategoryChart.series"
                [chart]="employeeCategoryChart.chart"
                [xaxis]="employeeCategoryChart.xaxis"
                [colors]="employeeCategoryChart.colors"
                [plotOptions]="employeeCategoryChart.plotOptions">
              </apx-chart>
            </div>
          </div>
        </div>
      </div>

      <!-- Manager Dashboard -->
      <div *ngIf="isManager()" class="manager-dashboard">
        <div class="kpi-cards">
          <div class="kpi-card pending">
            <div class="card-icon">
              <i class="feather icon-clock"></i>
            </div>
            <div class="card-content">
              <h3>{{ managerStats.pendingApprovals }}</h3>
              <p>Pending Approvals</p>
              <small>Requires your action</small>
            </div>
          </div>

          <div class="kpi-card approved">
            <div class="card-icon">
              <i class="feather icon-check-circle"></i>
            </div>
            <div class="card-content">
              <h3>{{ managerStats.totalApproved }}</h3>
              <p>Total Approved</p>
              <small>This month</small>
            </div>
          </div>

          <div class="kpi-card rejected">
            <div class="card-icon">
              <i class="feather icon-x-circle"></i>
            </div>
            <div class="card-content">
              <h3>{{ managerStats.totalRejected }}</h3>
              <p>Total Rejected</p>
              <small>This month</small>
            </div>
          </div>

          <div class="kpi-card team">
            <div class="card-icon">
              <i class="feather icon-users"></i>
            </div>
            <div class="card-content">
              <h3>{{ managerStats.teamMembers }}</h3>
              <p>Team Members</p>
              <small>Under management</small>
            </div>
          </div>
        </div>

        <div class="charts-row">
          <div class="chart-card large">
            <div class="chart-header">
              <h4>Monthly Approval Trend</h4>
              <p>Approvals and rejections over time</p>
            </div>
            <div class="chart-container">
              <apx-chart
                [series]="managerTrendChart.series"
                [chart]="managerTrendChart.chart"
                [xaxis]="managerTrendChart.xaxis"
                [colors]="managerTrendChart.colors"
                [stroke]="managerTrendChart.stroke">
              </apx-chart>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h4>Team Activity</h4>
              <p>Requests by team member</p>
            </div>
            <div class="chart-container">
              <apx-chart
                [series]="managerTeamChart.series"
                [chart]="managerTeamChart.chart"
                [xaxis]="managerTeamChart.xaxis"
                [colors]="managerTeamChart.colors"
                [plotOptions]="managerTeamChart.plotOptions">
              </apx-chart>
            </div>
          </div>
        </div>

        <div class="recent-approvals">
          <div class="section-header">
            <h4>Recent Approvals/Rejections</h4>
          </div>
          <div class="approvals-list">
            <div class="approval-item" *ngFor="let approval of recentApprovals">
              <div class="employee-info">
                <div class="employee-avatar">{{ approval.employeeName.charAt(0) }}</div>
                <div class="employee-details">
                  <span class="name">{{ approval.employeeName }}</span>
                  <span class="amount">₹{{ approval.amount | number }}</span>
                </div>
              </div>
              <div class="approval-details">
                <span class="category">{{ approval.category }}</span>
                <span class="date">{{ approval.date | date:'shortDate' }}</span>
              </div>
              <div class="approval-status">
                <span class="status-badge" [class]="'status-' + approval.status.toLowerCase()">
                  {{ approval.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Admin Dashboard -->
      <div *ngIf="isAdmin()" class="admin-dashboard">
        <div class="kpi-cards">
          <div class="kpi-card total">
            <div class="card-icon">
              <i class="feather icon-dollar-sign"></i>
            </div>
            <div class="card-content">
              <h3>₹{{ adminStats.totalReimbursements | number }}</h3>
              <p>Total Reimbursements</p>
              <small>This year</small>
            </div>
          </div>

          <div class="kpi-card pending">
            <div class="card-icon">
              <i class="feather icon-clock"></i>
            </div>
            <div class="card-content">
              <h3>{{ adminStats.pendingCount }}</h3>
              <p>Pending Requests</p>
              <small>Across all stages</small>
            </div>
          </div>

          <div class="kpi-card processed">
            <div class="card-icon">
              <i class="feather icon-check-circle"></i>
            </div>
            <div class="card-content">
              <h3>{{ adminStats.processedCount }}</h3>
              <p>Processed</p>
              <small>This month</small>
            </div>
          </div>

          <div class="kpi-card avg">
            <div class="card-icon">
              <i class="feather icon-trending-up"></i>
            </div>
            <div class="card-content">
              <h3>₹{{ adminStats.averageAmount | number }}</h3>
              <p>Average Amount</p>
              <small>Per request</small>
            </div>
          </div>
        </div>

        <div class="charts-section">
          <div class="chart-card">
            <div class="chart-header">
              <h4>Status Distribution</h4>
              <p>Organization-wide status breakdown</p>
            </div>
            <div class="chart-container">
              <apx-chart
                [series]="adminStatusChart.series"
                [chart]="adminStatusChart.chart"
                [labels]="adminStatusChart.labels"
                [colors]="adminStatusChart.colors"
                [plotOptions]="adminStatusChart.plotOptions">
              </apx-chart>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h4>Department Wise Expenses</h4>
              <p>Reimbursement by department</p>
            </div>
            <div class="chart-container">
              <apx-chart
                [series]="adminDepartmentChart.series"
                [chart]="adminDepartmentChart.chart"
                [xaxis]="adminDepartmentChart.xaxis"
                [colors]="adminDepartmentChart.colors"
                [plotOptions]="adminDepartmentChart.plotOptions">
              </apx-chart>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <h4>Monthly Trend</h4>
              <p>Reimbursement requests over time</p>
            </div>
            <div class="chart-container">
              <apx-chart
                [series]="adminTrendChart.series"
                [chart]="adminTrendChart.chart"
                [xaxis]="adminTrendChart.xaxis"
                [colors]="adminTrendChart.colors"
                [stroke]="adminTrendChart.stroke">
              </apx-chart>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
    }

    .page-header {
      margin-bottom: 32px;
    }

    .page-header h2 {
      margin: 0 0 8px 0;
      color: #2d3748;
      font-weight: 600;
    }

    .page-header p {
      margin: 0;
      color: #718096;
    }

    .kpi-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .kpi-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;
    }

    .kpi-card:hover {
      transform: translateY(-2px);
    }

    .card-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }

    .kpi-card.total .card-icon { background: #4299e1; }
    .kpi-card.approved .card-icon { background: #48bb78; }
    .kpi-card.manager .card-icon { background: #38b2ac; }
    .kpi-card.pending .card-icon { background: #ed8936; }
    .kpi-card.rejected .card-icon { background: #f56565; }
    .kpi-card.team .card-icon { background: #9f7aea; }
    .kpi-card.processed .card-icon { background: #48bb78; }
    .kpi-card.avg .card-icon { background: #38b2ac; }

    .card-content h3 {
      margin: 0 0 4px 0;
      font-size: 24px;
      font-weight: 700;
      color: #2d3748;
    }

    .card-content p {
      margin: 0 0 2px 0;
      color: #4a5568;
      font-weight: 500;
    }

    .card-content small {
      color: #718096;
      font-size: 12px;
    }

    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin-bottom: 32px;
    }

    .charts-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .chart-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .chart-card.large {
      grid-column: span 2;
    }

    .chart-header h4 {
      margin: 0 0 4px 0;
      color: #2d3748;
      font-weight: 600;
    }

    .chart-header p {
      margin: 0 0 20px 0;
      color: #718096;
      font-size: 14px;
    }

    .recent-approvals {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .section-header h4 {
      margin: 0 0 20px 0;
      color: #2d3748;
      font-weight: 600;
    }

    .approval-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-bottom: 1px solid #f1f5f9;
    }

    .approval-item:last-child {
      border-bottom: none;
    }

    .employee-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .employee-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #4299e1;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }

    .employee-details {
      display: flex;
      flex-direction: column;
    }

    .employee-details .name {
      font-weight: 500;
      color: #2d3748;
    }

    .employee-details .amount {
      font-size: 14px;
      color: #4299e1;
      font-weight: 600;
    }

    .approval-details {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
    }

    .approval-details .category {
      font-size: 14px;
      color: #4a5568;
    }

    .approval-details .date {
      font-size: 12px;
      color: #718096;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-approved { background: #c6f6d5; color: #22543d; }
    .status-rejected { background: #fed7d7; color: #c53030; }

    @media (max-width: 768px) {
      .kpi-cards {
        grid-template-columns: 1fr;
      }
      
      .charts-row {
        grid-template-columns: 1fr;
      }
      
      .chart-card.large {
        grid-column: span 1;
      }
      
      .charts-section {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ReimbursementDashboardComponent implements OnInit {
  // Employee Stats
  employeeStats = {
    totalRequested: 85000,
    approvedByFinance: 65000,
    approvedByManager: 75000,
    pendingCount: 3,
    approvedCount: 8,
    managerApprovedCount: 10
  };

  // Manager Stats
  managerStats = {
    pendingApprovals: 5,
    totalApproved: 42,
    totalRejected: 3,
    teamMembers: 12
  };

  // Admin Stats
  adminStats = {
    totalReimbursements: 2450000,
    pendingCount: 28,
    processedCount: 156,
    averageAmount: 12500
  };

  recentApprovals = [
    { employeeName: 'John Doe', amount: 15000, category: 'Travel', date: new Date(), status: 'Approved' },
    { employeeName: 'Jane Smith', amount: 8000, category: 'Medical', date: new Date(), status: 'Approved' },
    { employeeName: 'Mike Johnson', amount: 3000, category: 'Food', date: new Date(), status: 'Rejected' }
  ];

  // Chart configurations
  employeeStatusChart = {
    series: [65, 20, 15],
    chart: { type: 'pie' as const, height: 300 },
    labels: ['Approved', 'Pending', 'Rejected'],
    colors: ['#48bb78', '#ed8936', '#f56565'],
    plotOptions: { pie: { donut: { size: '0%' } } }
  };

  employeeCategoryChart = {
    series: [{ name: 'Amount', data: [25000, 15000, 20000, 12000, 8000] }],
    chart: { type: 'bar' as const, height: 300, toolbar: { show: false } },
    xaxis: { categories: ['Travel', 'Medical', 'Food', 'Training', 'Others'] },
    colors: ['#4299e1'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } }
  };

  managerTrendChart = {
    series: [
      { name: 'Approved', data: [25, 30, 28, 35, 32, 42] },
      { name: 'Rejected', data: [3, 5, 2, 4, 3, 3] }
    ],
    chart: { type: 'line' as const, height: 300, toolbar: { show: false } },
    xaxis: { categories: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    colors: ['#48bb78', '#f56565'],
    stroke: { curve: 'smooth' as const, width: 3 }
  };

  managerTeamChart = {
    series: [{ name: 'Requests', data: [8, 6, 12, 4, 9, 7] }],
    chart: { type: 'bar' as const, height: 300, toolbar: { show: false } },
    xaxis: { categories: ['John', 'Jane', 'Mike', 'Sarah', 'Alex', 'Lisa'] },
    colors: ['#9f7aea'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } }
  };

  adminStatusChart = {
    series: [156, 28, 15, 8],
    chart: { type: 'donut' as const, height: 300 },
    labels: ['Approved', 'Pending Manager', 'Pending Finance', 'Rejected'],
    colors: ['#48bb78', '#ed8936', '#4299e1', '#f56565'],
    plotOptions: { pie: { donut: { size: '60%' } } }
  };

  adminDepartmentChart = {
    series: [{ name: 'Amount', data: [450000, 320000, 280000, 180000, 120000] }],
    chart: { type: 'bar' as const, height: 300, toolbar: { show: false } },
    xaxis: { categories: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'] },
    colors: ['#38b2ac'],
    plotOptions: { bar: { borderRadius: 4, horizontal: true } }
  };

  adminTrendChart = {
    series: [{ name: 'Requests', data: [45, 52, 48, 61, 55, 67, 58, 72, 65, 78, 69, 85] }],
    chart: { type: 'area' as const, height: 300, toolbar: { show: false } },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
    colors: ['#4299e1'],
    stroke: { curve: 'smooth' as const, width: 3 }
  };

  constructor(
    private authService: AuthService,
    private reimbursementService: ReimbursementService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load role-specific dashboard data
    if (this.isEmployee()) {
      this.loadEmployeeStats();
    } else if (this.isManager()) {
      this.loadManagerStats();
    } else if (this.isAdmin()) {
      this.loadAdminStats();
    }
  }

  loadEmployeeStats(): void {
    this.reimbursementService.getMyReimbursements().subscribe({
      next: (data) => {
        this.employeeStats.totalRequested = data.reduce((sum, r) => sum + r.amount, 0);
        this.employeeStats.approvedCount = data.filter(r => r.status === 'Approved').length;
        this.employeeStats.pendingCount = data.filter(r => r.status === 'Pending').length;
        this.employeeStats.approvedByFinance = data.filter(r => r.status === 'Approved').reduce((sum, r) => sum + r.amount, 0);
      },
      error: (error) => console.error('Error loading employee stats:', error)
    });
  }

  loadManagerStats(): void {
    this.reimbursementService.getPendingManagerCount().subscribe({
      next: (count) => this.managerStats.pendingApprovals = count,
      error: (error) => console.error('Error loading manager stats:', error)
    });
  }

  loadAdminStats(): void {
    this.reimbursementService.getTotalReimbursements().subscribe({
      next: (total) => this.adminStats.totalReimbursements = total,
      error: (error) => console.error('Error loading admin stats:', error)
    });
  }

  isEmployee(): boolean {
    return this.authService.hasRole(EmployeeRole.Employee);
  }

  isManager(): boolean {
    return this.authService.hasRole(EmployeeRole.Manager);
  }

  isFinanceAdmin(): boolean {
    return this.authService.hasRole(EmployeeRole.FinanceAdmin);
  }

  isAdmin(): boolean {
    return this.authService.hasRole(EmployeeRole.Admin);
  }
}