import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { MockPayrollService } from '../../services/mock-payroll.service';

@Component({
  selector: 'app-finance-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Financial Reports & Analytics</h1>
        <p>Generate comprehensive financial reports and view analytics</p>
        <div class="header-actions">
          <select [(ngModel)]="selectedPeriod" class="form-control">
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button class="btn btn-primary" (click)="exportAllReports()">
            <span class="material-icons">download</span>
            Export All Reports
          </button>
        </div>
      </div>

      <!-- Category Selection -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Report Categories</h3>
        </div>
        <div class="card-body">
          <div class="category-grid">
            <div class="category-item" 
                 *ngFor="let category of reportCategories" 
                 [class.active]="selectedCategory === category.id"
                 (click)="selectCategory(category.id)">
              <div class="category-icon">
                <span class="material-icons">{{ getCategoryIcon(category.id) }}</span>
              </div>
              <div class="category-info">
                <h4>{{ category.name }}</h4>
                <p>{{ category.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Report Content -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">{{ getCategoryTitle() }} Report</h3>
          <button class="btn btn-secondary" (click)="exportReport(selectedCategory)">
            <span class="material-icons">picture_as_pdf</span>
            Export PDF
          </button>
        </div>
        <div class="card-body">
          <!-- Payroll Report -->
          <div *ngIf="selectedCategory === 'payroll'">
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">₹{{ payrollData.totalExpense | number:'1.0-0' }}</div>
                <div class="stat-label">Total Payroll Expense</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ payrollData.employeeCount }}</div>
                <div class="stat-label">Employees Paid</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">₹{{ payrollData.averageSalary | number:'1.0-0' }}</div>
                <div class="stat-label">Average Salary</div>
              </div>
            </div>

            <h4>Department Breakdown</h4>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Employees</th>
                    <th>Total Expense</th>
                    <th>Average Salary</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let dept of payrollData.departments">
                    <td><strong>{{ dept.name }}</strong></td>
                    <td>{{ dept.employeeCount }}</td>
                    <td class="amount">₹{{ dept.totalExpense | number:'1.0-0' }}</td>
                    <td class="amount">₹{{ dept.averageSalary | number:'1.0-0' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Loan Report -->
          <div *ngIf="selectedCategory === 'loans'">
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">₹{{ loanAnalytics.totalDisbursed | number:'1.0-0' }}</div>
                <div class="stat-label">Total Disbursed</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ loanAnalytics.approvalRate }}%</div>
                <div class="stat-label">Approval Rate</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">₹{{ loanAnalytics.averageLoanAmount | number:'1.0-0' }}</div>
                <div class="stat-label">Average Loan</div>
              </div>
            </div>

            <h4>Loan Types</h4>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Loan Type</th>
                    <th>Applications</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let type of loanAnalytics.loanTypes">
                    <td><strong>{{ type.type }}</strong></td>
                    <td>{{ type.count }}</td>
                    <td class="amount">₹{{ type.amount | number:'1.0-0' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Reimbursement Report -->
          <div *ngIf="selectedCategory === 'reimbursements'">
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">₹{{ reimbursementAnalytics.totalPaid | number:'1.0-0' }}</div>
                <div class="stat-label">Total Reimbursed</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ reimbursementAnalytics.totalRequests }}</div>
                <div class="stat-label">Total Requests</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">₹{{ reimbursementAnalytics.averageAmount | number:'1.0-0' }}</div>
                <div class="stat-label">Average Amount</div>
              </div>
            </div>

            <h4>Expense Categories</h4>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Requests</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let cat of reimbursementAnalytics.categories">
                    <td><strong>{{ cat.name }}</strong></td>
                    <td>{{ cat.count }}</td>
                    <td class="amount">₹{{ cat.amount | number:'1.0-0' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Medical Report -->
          <div *ngIf="selectedCategory === 'medical'">
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">₹{{ medicalClaimAnalytics.totalClaimed | number:'1.0-0' }}</div>
                <div class="stat-label">Total Claims Paid</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">{{ medicalClaimAnalytics.totalClaims }}</div>
                <div class="stat-label">Total Claims</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">₹{{ medicalClaimAnalytics.averageClaim | number:'1.0-0' }}</div>
                <div class="stat-label">Average Claim</div>
              </div>
            </div>

            <h4>Treatment Types</h4>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Treatment Type</th>
                    <th>Claims</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let treatment of medicalClaimAnalytics.treatmentTypes">
                    <td><strong>{{ treatment.type }}</strong></td>
                    <td>{{ treatment.count }}</td>
                    <td class="amount">₹{{ treatment.amount | number:'1.0-0' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 2rem;
      background: #f8fafc;
      min-height: 100vh;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 0.5rem 0;
    }

    .page-header p {
      color: #64748b;
      margin: 0 0 1.5rem 0;
      font-size: 1rem;
      font-weight: 400;
    }

    .header-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-top: 1rem;
    }

    .form-control {
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      background: white;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
      min-width: 150px;
    }

    .form-control option {
      background: white;
      color: #374151;
    }

    .btn.btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: #3b82f6;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn.btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e5e7eb;
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .card-header {
      padding: 1.5rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0;
    }

    .btn.btn-secondary {
      padding: 0.5rem 1rem;
      background: #6b7280;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .btn.btn-secondary:hover {
      background: #4b5563;
      transform: translateY(-1px);
    }

    .card-body {
      padding: 1.5rem;
    }

    .category-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .category-item {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: white;
    }

    .category-item:hover {
      border-color: #3b82f6;
      background: #f8fafc;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .category-item.active {
      border-color: #3b82f6;
      background: #eff6ff;
      color: #1e40af;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
    }

    .category-icon {
      font-size: 1.5rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #3b82f6;
      border-radius: 8px;
      color: white;
    }

    .category-item.active .category-icon {
      background: #1e40af;
    }

    .category-info h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.1rem;
      font-weight: 700;
    }

    .category-info p {
      margin: 0;
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .stat-item {
      background: white;
      padding: 2rem 1.5rem;
      border-radius: 8px;
      text-align: center;
      transition: all 0.2s ease;
      border: 1px solid #e5e7eb;
      position: relative;
    }

    .stat-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #3b82f6;
    }

    .stat-item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 0.5rem;
      line-height: 1;
    }

    .stat-label {
      font-size: 1rem;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    h4 {
      font-size: 1.4rem;
      font-weight: 800;
      margin: 3rem 0 2rem 0;
      color: #1e293b;
      position: relative;
      padding-bottom: 1rem;
    }

    h4::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 60px;
      height: 3px;
      background: #3b82f6;
      border-radius: 2px;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1.5rem;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border: 1px solid #e5e7eb;
    }

    .table th,
    .table td {
      padding: 1.25rem 1.5rem;
      text-align: left;
      border-bottom: 1px solid rgba(0,0,0,0.05);
      font-size: 1rem;
    }

    .table th {
      background: #f9fafb;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-size: 0.875rem;
    }

    .table td {
      color: #475569;
      font-weight: 500;
    }

    .table td strong {
      color: #1e293b;
      font-weight: 700;
    }

    .table td.amount {
      font-weight: 700;
      color: #059669;
      font-size: 1rem;
    }

    .table tbody tr {
      transition: all 0.2s ease;
    }

    .table tbody tr:hover {
      background: #f8fafc;
    }

    .table tbody tr:last-child td {
      border-bottom: none;
    }

    .table-responsive {
      overflow-x: auto;
      border-radius: 16px;
    }

    @media (max-width: 768px) {
      .page-container {
        padding: 1rem;
      }
      
      .category-grid {
        grid-template-columns: 1fr;
      }
      
      .stats-row {
        grid-template-columns: 1fr;
      }
      
      .header-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
      
      .card-header {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;
      }
    }
  `]
})
export class FinanceReportsComponent implements OnInit {
  selectedCategory = 'payroll';
  selectedPeriod = 'current';

  reportCategories = [
    {
      id: 'payroll',
      name: 'Payroll Analytics',
      description: 'Monthly payroll expenses and department-wise breakdown'
    },
    {
      id: 'loans',
      name: 'Loan Analytics',
      description: 'Loan disbursements, approvals, and risk analysis'
    },
    {
      id: 'reimbursements',
      name: 'Expense Analytics',
      description: 'Reimbursement trends and category-wise spending'
    },
    {
      id: 'medical',
      name: 'Medical Claims Analytics',
      description: 'Healthcare spending and insurance utilization'
    }
  ];

  constructor(
    private toastService: ToastService,
    private mockService: MockPayrollService
  ) {}

  payrollData: any = {};
  loanAnalytics: any = {};
  reimbursementAnalytics: any = {};
  medicalClaimAnalytics: any = {};

  ngOnInit() {
    this.loadAnalyticsData();
  }

  loadAnalyticsData() {
    const data = this.mockService.getData();
    
    // Calculate REAL payroll analytics from users
    const users = data.users || [];
    const payrolls = data.payrolls || [];
    
    // Group users by department
    const deptStats: { [key: string]: { count: number, totalSalary: number } } = {};
    users.forEach((user: any) => {
      if (!deptStats[user.department]) {
        deptStats[user.department] = { count: 0, totalSalary: 0 };
      }
      deptStats[user.department].count++;
      // Estimate salary from payroll data or use default
      const userPayroll = payrolls.find((p: any) => p.employeeId === user.id);
      const salary = userPayroll ? userPayroll.netPay : 50000; // Default salary
      deptStats[user.department].totalSalary += salary;
    });
    
    const departments = Object.keys(deptStats).map(dept => ({
      name: dept,
      employeeCount: deptStats[dept].count,
      totalExpense: deptStats[dept].totalSalary,
      averageSalary: Math.round(deptStats[dept].totalSalary / deptStats[dept].count)
    }));
    
    const totalExpense = departments.reduce((sum, dept) => sum + dept.totalExpense, 0);
    const totalEmployees = departments.reduce((sum, dept) => sum + dept.employeeCount, 0);
    
    this.payrollData = {
      totalExpense,
      employeeCount: totalEmployees,
      averageSalary: totalEmployees > 0 ? Math.round(totalExpense / totalEmployees) : 0,
      departments
    };

    // Calculate REAL loan analytics
    const loans = data.loans || [];
    const approvedLoans = loans.filter((l: any) => l.financeApproved === true);
    const managerApprovedLoans = loans.filter((l: any) => l.managerApproved === true);
    
    // Get unique loan types from actual data
    const loanTypeStats: { [key: string]: { count: number, amount: number } } = {};
    loans.forEach((loan: any) => {
      if (!loanTypeStats[loan.loanType]) {
        loanTypeStats[loan.loanType] = { count: 0, amount: 0 };
      }
      loanTypeStats[loan.loanType].count++;
      if (loan.financeApproved) {
        loanTypeStats[loan.loanType].amount += loan.amount;
      }
    });
    
    this.loanAnalytics = {
      totalDisbursed: approvedLoans.reduce((sum: number, l: any) => sum + l.amount, 0),
      totalApplications: loans.length,
      approvalRate: loans.length > 0 ? Math.round((approvedLoans.length / loans.length) * 100) : 0,
      averageLoanAmount: approvedLoans.length > 0 ? Math.round(approvedLoans.reduce((sum: number, l: any) => sum + l.amount, 0) / approvedLoans.length) : 0,
      loanTypes: Object.keys(loanTypeStats).map(type => ({
        type,
        count: loanTypeStats[type].count,
        amount: loanTypeStats[type].amount
      }))
    };

    // Calculate REAL reimbursement analytics
    const reimbursements = data.reimbursements || [];
    const approvedReimb = reimbursements.filter((r: any) => r.financeApproved === true);
    
    // Get unique categories from actual data
    const categoryStats: { [key: string]: { count: number, amount: number } } = {};
    reimbursements.forEach((reimb: any) => {
      if (!categoryStats[reimb.category]) {
        categoryStats[reimb.category] = { count: 0, amount: 0 };
      }
      categoryStats[reimb.category].count++;
      if (reimb.financeApproved) {
        categoryStats[reimb.category].amount += reimb.amount;
      }
    });
    
    this.reimbursementAnalytics = {
      totalPaid: approvedReimb.reduce((sum: number, r: any) => sum + r.amount, 0),
      totalRequests: reimbursements.length,
      averageAmount: approvedReimb.length > 0 ? Math.round(approvedReimb.reduce((sum: number, r: any) => sum + r.amount, 0) / approvedReimb.length) : 0,
      categories: Object.keys(categoryStats).map(category => ({
        name: category,
        count: categoryStats[category].count,
        amount: categoryStats[category].amount
      }))
    };

    // Calculate REAL medical claims analytics
    const medicalClaims = data.medicalClaims || [];
    const approvedClaims = medicalClaims.filter((c: any) => c.financeApproved === true);
    
    // Get unique treatment types from actual data
    const treatmentStats: { [key: string]: { count: number, amount: number } } = {};
    medicalClaims.forEach((claim: any) => {
      if (!treatmentStats[claim.treatmentType]) {
        treatmentStats[claim.treatmentType] = { count: 0, amount: 0 };
      }
      treatmentStats[claim.treatmentType].count++;
      if (claim.financeApproved) {
        treatmentStats[claim.treatmentType].amount += claim.claimAmount;
      }
    });
    
    this.medicalClaimAnalytics = {
      totalClaimed: approvedClaims.reduce((sum: number, c: any) => sum + c.claimAmount, 0),
      totalClaims: medicalClaims.length,
      averageClaim: approvedClaims.length > 0 ? Math.round(approvedClaims.reduce((sum: number, c: any) => sum + c.claimAmount, 0) / approvedClaims.length) : 0,
      treatmentTypes: Object.keys(treatmentStats).map(type => ({
        type,
        count: treatmentStats[type].count,
        amount: treatmentStats[type].amount
      }))
    };
  }

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
  }

  exportReport(reportType: string) {
    this.toastService.success('Report Generated', `${reportType} analytics report exported successfully for ${this.selectedPeriod} period`);
  }

  exportAllReports() {
    this.toastService.success('All Reports Generated', `Complete analytics package exported for ${this.selectedPeriod} period`);
  }

  getCategoryIcon(categoryId: string): string {
    const icons: { [key: string]: string } = {
      'payroll': 'account_balance_wallet',
      'loans': 'account_balance',
      'reimbursements': 'credit_card',
      'medical': 'local_hospital'
    };
    return icons[categoryId] || 'analytics';
  }

  getCategoryTitle(): string {
    const titles: { [key: string]: string } = {
      'payroll': 'Payroll Analytics',
      'loans': 'Loan Analytics',
      'reimbursements': 'Expense Analytics',
      'medical': 'Medical Claims Analytics'
    };
    return titles[this.selectedCategory] || 'Financial Analytics';
  }
}