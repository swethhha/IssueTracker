import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { MockPayrollService } from '../../services/mock-payroll.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="content-header">
      <div class="page-container">
        <h1>Financial Reports & Analytics</h1>
        <p>Generate comprehensive financial reports and view analytics</p>
        <div class="header-actions">
          <select [(ngModel)]="selectedPeriod" class="form-select">
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button class="btn btn-primary" (click)="exportAllReports()">
            📥 Export All Reports
          </button>
        </div>
      </div>
    </div>

    <div class="content-body">
      <div class="page-container">
        <!-- Key Metrics -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-value">₹{{ totalDisbursed | number:'1.0-0' }}</div>
              <div class="stat-label">Total Disbursed</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <div class="stat-value">{{ approvalRate }}%</div>
              <div class="stat-label">Approval Rate</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <div class="stat-value">{{ pendingApprovals }}</div>
              <div class="stat-label">Pending Approvals</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⏱️</div>
            <div class="stat-content">
              <div class="stat-value">{{ avgProcessingTime }} days</div>
              <div class="stat-label">Avg Processing Time</div>
            </div>
          </div>
        </div>

        <!-- Report Categories -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Report Categories</h3>
          </div>
          <div class="card-body">
            <div class="category-tabs">
              <button 
                *ngFor="let category of reportCategories" 
                class="tab-btn"
                [class.active]="selectedCategory === category.id"
                (click)="selectCategory(category.id)">
                {{ category.icon }} {{ category.name }} ({{ category.count }})
              </button>
            </div>
          </div>
        </div>

        <!-- Report Content -->
        <div class="dashboard-row">
          <!-- Analytics Section -->
          <div class="card">
            <div class="card-header">
              <h4>{{ getCategoryTitle() }} Analytics</h4>
              <div class="card-actions">
                <button class="btn btn-secondary btn-sm" (click)="refreshData()">
                  🔄 Refresh
                </button>
                <button class="btn btn-primary btn-sm" (click)="exportReport(selectedCategory)">
                  📥 Export PDF
                </button>
              </div>
            </div>
            <div class="card-body">
              <!-- Payroll Analytics -->
              <div *ngIf="selectedCategory === 'payroll'">
                <div class="analytics-summary">
                  <div class="summary-item">
                    <span class="summary-label">Total Employees:</span>
                    <span class="summary-value">{{ payrollData.employeeCount }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Average Salary:</span>
                    <span class="summary-value">₹{{ payrollData.averageSalary | number:'1.0-0' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Total Expense:</span>
                    <span class="summary-value">₹{{ payrollData.totalExpense | number:'1.0-0' }}</span>
                  </div>
                </div>
                
                <h5>Department Breakdown</h5>
                <div class="department-list">
                  <div class="department-item" *ngFor="let dept of payrollData.departments">
                    <div class="dept-info">
                      <strong>{{ dept.name }}</strong>
                      <span>{{ dept.employeeCount }} employees</span>
                    </div>
                    <div class="dept-amount">₹{{ dept.totalExpense | number:'1.0-0' }}</div>
                  </div>
                </div>
              </div>

              <!-- Loan Analytics -->
              <div *ngIf="selectedCategory === 'loans'">
                <div class="analytics-summary">
                  <div class="summary-item">
                    <span class="summary-label">Total Disbursed:</span>
                    <span class="summary-value">₹{{ loanAnalytics.totalDisbursed | number:'1.0-0' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Approval Rate:</span>
                    <span class="summary-value">{{ loanAnalytics.approvalRate }}%</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Average Loan:</span>
                    <span class="summary-value">₹{{ loanAnalytics.averageLoanAmount | number:'1.0-0' }}</span>
                  </div>
                </div>
                
                <h5>Loan Types</h5>
                <div class="loan-types">
                  <div class="loan-type-item" *ngFor="let type of loanAnalytics.loanTypes">
                    <div class="loan-info">
                      <strong>{{ type.type }}</strong>
                      <span>{{ type.count }} loans</span>
                    </div>
                    <div class="loan-amount">₹{{ type.amount | number:'1.0-0' }}</div>
                  </div>
                </div>
              </div>

              <!-- Expense Analytics -->
              <div *ngIf="selectedCategory === 'expenses'">
                <div class="analytics-summary">
                  <div class="summary-item">
                    <span class="summary-label">Total Paid:</span>
                    <span class="summary-value">₹{{ reimbursementAnalytics.totalPaid | number:'1.0-0' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Total Requests:</span>
                    <span class="summary-value">{{ reimbursementAnalytics.totalRequests }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Average Amount:</span>
                    <span class="summary-value">₹{{ reimbursementAnalytics.averageAmount | number:'1.0-0' }}</span>
                  </div>
                </div>
                
                <h5>Expense Categories</h5>
                <div class="expense-categories">
                  <div class="expense-item" *ngFor="let cat of reimbursementAnalytics.categories">
                    <div class="expense-info">
                      <strong>{{ cat.name }}</strong>
                      <span>{{ cat.count }} requests</span>
                    </div>
                    <div class="expense-amount">₹{{ cat.amount | number:'1.0-0' }}</div>
                  </div>
                </div>
              </div>

              <!-- Medical Analytics -->
              <div *ngIf="selectedCategory === 'medical'">
                <div class="analytics-summary">
                  <div class="summary-item">
                    <span class="summary-label">Total Claims:</span>
                    <span class="summary-value">{{ medicalClaimAnalytics.totalClaims }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Total Paid:</span>
                    <span class="summary-value">₹{{ medicalClaimAnalytics.totalClaimed | number:'1.0-0' }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Average Claim:</span>
                    <span class="summary-value">₹{{ medicalClaimAnalytics.averageClaim | number:'1.0-0' }}</span>
                  </div>
                </div>
                
                <h5>Treatment Types</h5>
                <div class="treatment-types">
                  <div class="treatment-item" *ngFor="let treatment of medicalClaimAnalytics.treatmentTypes">
                    <div class="treatment-info">
                      <strong>{{ treatment.type }}</strong>
                      <span>{{ treatment.count }} claims</span>
                    </div>
                    <div class="treatment-amount">₹{{ treatment.amount | number:'1.0-0' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Reports -->
          <div class="card">
            <div class="card-header">
              <h4>Recent Reports</h4>
              <button class="btn btn-secondary btn-sm" (click)="clearReportHistory()">
                🗑️ Clear History
              </button>
            </div>
            <div class="card-body">
              <div class="report-list">
                <div class="report-item" *ngFor="let report of recentReports">
                  <div class="report-info">
                    <div class="report-title">
                      {{ getReportIcon(report.type) }} {{ report.type }}
                    </div>
                    <div class="report-details">
                      <small>{{ report.generatedDate | date:'MMM dd, yyyy HH:mm' }}</small>
                      <small>{{ report.parameters }}</small>
                    </div>
                  </div>
                  <div class="report-actions">
                    <button class="btn btn-sm btn-secondary" (click)="downloadReport(report)">
                      📥 Download
                    </button>
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
    .content-header h1 {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0;
    }

    .content-header p {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin: 0.25rem 0 0 0;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-top: 1rem;
    }

    .form-select {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      font-size: 0.75rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .stat-icon {
      width: 40px;
      height: 40px;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: var(--primary-color);
    }

    .stat-content {
      flex: 1;
    }

    .stat-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0;
    }

    .stat-label {
      font-size: 0.625rem;
      color: var(--text-secondary);
      margin: 0.25rem 0 0 0;
    }

    .category-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 1rem;
    }

    .tab-btn {
      padding: 0.5rem 1rem;
      border: 1px solid var(--border-color);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      cursor: pointer;
      font-size: 0.625rem;
      transition: all 0.2s ease;
    }

    .tab-btn.active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }

    .card-actions {
      display: flex;
      gap: 0.5rem;
    }

    .analytics-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .summary-label {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }

    .summary-value {
      font-weight: 600;
      color: var(--text-primary);
      font-size: 0.75rem;
    }

    .department-list,
    .loan-types,
    .expense-categories,
    .treatment-types {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .department-item,
    .loan-type-item,
    .expense-item,
    .treatment-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
    }

    .dept-info,
    .loan-info,
    .expense-info,
    .treatment-info {
      display: flex;
      flex-direction: column;
    }

    .dept-info strong,
    .loan-info strong,
    .expense-info strong,
    .treatment-info strong {
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .dept-info span,
    .loan-info span,
    .expense-info span,
    .treatment-info span {
      font-size: 0.625rem;
      color: var(--text-secondary);
    }

    .dept-amount,
    .loan-amount,
    .expense-amount,
    .treatment-amount {
      font-weight: 600;
      color: var(--primary-color);
      font-size: 0.75rem;
    }

    .report-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .report-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      border: 1px solid var(--border-color);
    }

    .report-title {
      font-weight: 600;
      font-size: 0.75rem;
      margin-bottom: 0.25rem;
    }

    .report-details {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .report-details small {
      font-size: 0.625rem;
      color: var(--text-secondary);
    }

    .card-header h4 {
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0;
    }

    h5 {
      font-size: 0.75rem;
      font-weight: 600;
      margin: 1rem 0 0.5rem 0;
      color: var(--text-primary);
    }
  `]
})
export class ReportsComponent implements OnInit {
  selectedCategory = 'payroll';
  selectedPeriod = 'current';
  
  // Key Metrics
  totalDisbursed = 2850000;
  approvalRate = 94;
  pendingApprovals = 12;
  avgProcessingTime = 2.3;
  
  // Report Categories
  reportCategories = [
    { id: 'payroll', name: 'Payroll', icon: '💰', count: 47 },
    { id: 'loans', name: 'Loans', icon: '🏦', count: 15 },
    { id: 'expenses', name: 'Expenses', icon: '💳', count: 28 },
    { id: 'medical', name: 'Medical', icon: '🏥', count: 12 }
  ];
  
  // Analytics Data
  payrollData: any = {};
  loanAnalytics: any = {};
  reimbursementAnalytics: any = {};
  medicalClaimAnalytics: any = {};
  
  recentReports = [
    { type: 'Payroll Analytics Report', generatedDate: new Date(Date.now() - 86400000), parameters: 'December 2024, All Departments - ₹2.85M disbursed' },
    { type: 'Loan Disbursement Report', generatedDate: new Date(Date.now() - 172800000), parameters: 'Q4 2024, All Types - 15 loans approved, ₹1.8M disbursed' },
    { type: 'Expense Analytics Report', generatedDate: new Date(Date.now() - 259200000), parameters: 'November 2024, Travel & Training - ₹125K reimbursed' },
    { type: 'Medical Claims Summary', generatedDate: new Date(Date.now() - 345600000), parameters: 'Q4 2024, All Treatments - ₹85K claims processed' },
    { type: 'Financial Overview Report', generatedDate: new Date(Date.now() - 432000000), parameters: 'October 2024, Complete Analysis - ₹3.2M total' }
  ];

  constructor(
    private toastService: ToastService,
    private mockService: MockPayrollService
  ) {}
  
  ngOnInit() {
    this.loadAnalyticsData();
  }
  
  loadAnalyticsData() {
    const data = this.mockService.getData();
    
    // Payroll Analytics
    this.payrollData = {
      totalExpense: 2850000,
      employeeCount: 47,
      averageSalary: 60638,
      departments: [
        { name: 'IT', employeeCount: 25, totalExpense: 1750000, averageSalary: 70000 },
        { name: 'Finance', employeeCount: 8, totalExpense: 520000, averageSalary: 65000 },
        { name: 'HR', employeeCount: 6, totalExpense: 330000, averageSalary: 55000 },
        { name: 'Operations', employeeCount: 8, totalExpense: 250000, averageSalary: 31250 }
      ]
    };

    // Loan Analytics
    const loans = data.loans || [];
    const approvedLoans = loans.filter((l: any) => l.financeApproved === true);
    this.loanAnalytics = {
      totalDisbursed: 1800000,
      approvalRate: 94,
      averageLoanAmount: 120000,
      loanTypes: [
        { type: 'Personal', count: 8, amount: 600000 },
        { type: 'Education', count: 4, amount: 800000 },
        { type: 'Vehicle', count: 3, amount: 400000 }
      ]
    };

    // Reimbursement Analytics
    this.reimbursementAnalytics = {
      totalPaid: 125000,
      totalRequests: 28,
      averageAmount: 4464,
      categories: [
        { name: 'Travel', count: 12, amount: 65000 },
        { name: 'Training', count: 8, amount: 35000 },
        { name: 'Office Supplies', count: 8, amount: 25000 }
      ]
    };

    // Medical Claims Analytics
    this.medicalClaimAnalytics = {
      totalClaimed: 85000,
      totalClaims: 12,
      averageClaim: 7083,
      treatmentTypes: [
        { type: 'Surgery', count: 3, amount: 45000 },
        { type: 'Dental', count: 5, amount: 25000 },
        { type: 'Physiotherapy', count: 4, amount: 15000 }
      ]
    };
  }
  
  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
  }
  
  refreshData() {
    this.loadAnalyticsData();
    this.toastService.success('Data Refreshed', 'Analytics data has been updated with the latest information.');
  }
  
  exportReport(reportType: string) {
    const reportNames: { [key: string]: string } = {
      'payroll': 'Payroll Analytics',
      'loans': 'Loan Disbursement',
      'expenses': 'Expense Analytics',
      'medical': 'Medical Claims'
    };
    
    const reportName = reportNames[reportType] || reportType;
    this.toastService.success('Report Generated', `${reportName} report exported successfully for ${this.selectedPeriod} period.`);
    
    this.addToRecentReports(`${reportName} Report`, `${this.selectedPeriod} period - Generated on ${new Date().toLocaleDateString()}`);
  }
  
  exportAllReports() {
    this.toastService.success('All Reports Generated', `Complete analytics package exported for ${this.selectedPeriod} period.`);
    this.addToRecentReports('Complete Analytics Package', `${this.selectedPeriod} period - All reports included`);
  }
  
  downloadReport(report: any) {
    this.toastService.info('Downloading Report', `${report.type} is being downloaded to your device.`);
  }
  
  shareReport(report: any) {
    this.toastService.info('Sharing Report', `${report.type} sharing link has been copied to clipboard.`);
  }
  
  deleteReport(report: any) {
    if (confirm(`Are you sure you want to delete ${report.type}?`)) {
      this.recentReports = this.recentReports.filter(r => r !== report);
      this.toastService.success('Report Deleted', 'Report has been removed from history.');
    }
  }
  
  clearReportHistory() {
    if (confirm('Are you sure you want to clear all report history?')) {
      this.recentReports = [];
      this.toastService.success('History Cleared', 'All report history has been cleared.');
    }
  }
  
  getCategoryTitle(): string {
    const titles: { [key: string]: string } = {
      'payroll': 'Payroll',
      'loans': 'Loan',
      'expenses': 'Expense',
      'medical': 'Medical Claims'
    };
    return titles[this.selectedCategory] || 'Financial';
  }
  
  getReportIcon(reportType: string): string {
    const icons: { [key: string]: string } = {
      'Payroll Analytics Report': '💰',
      'Loan Disbursement Report': '🏦',
      'Expense Analytics Report': '💳',
      'Medical Claims Summary': '🏥',
      'Financial Overview Report': '📊'
    };
    return icons[reportType] || '📄';
  }
  
  private addToRecentReports(type: string, parameters: string) {
    this.recentReports.unshift({
      type,
      generatedDate: new Date(),
      parameters
    });
    if (this.recentReports.length > 10) {
      this.recentReports = this.recentReports.slice(0, 10);
    }
  }
}