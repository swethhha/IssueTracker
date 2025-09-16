import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-finance-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-container">
      <div class="page-header">
        <h2>Finance Reports & Analytics</h2>
        <div class="header-actions">
          <select [(ngModel)]="selectedPeriod" class="period-select">
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button class="btn btn-primary" (click)="exportAllReports()">
            <span class="material-icons">download</span>
            Export All
          </button>
        </div>
      </div>

      <!-- Report Categories -->
      <div class="report-categories">
        <div class="category-card" 
             *ngFor="let category of reportCategories" 
             [class.active]="selectedCategory === category.id"
             (click)="selectCategory(category.id)">
          <div class="category-icon">
            <span class="material-icons">{{ category.icon }}</span>
          </div>
          <div class="category-info">
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </div>

      <!-- Report Content -->
      <div class="report-content">
        <!-- Payroll Reports -->
        <div *ngIf="selectedCategory === 'payroll'" class="report-section">
          <div class="section-header">
            <h3>Payroll Expense Reports</h3>
            <button class="btn btn-secondary" (click)="exportReport('payroll')">
              <span class="material-icons">file_download</span>
              Export PDF
            </button>
          </div>
          
          <div class="report-summary">
            <div class="summary-card">
              <h4>Total Payroll Expense</h4>
              <p class="amount">${{ payrollData.totalExpense | number:'1.2-2' }}</p>
            </div>
            <div class="summary-card">
              <h4>Employees Paid</h4>
              <p class="count">{{ payrollData.employeeCount }}</p>
            </div>
            <div class="summary-card">
              <h4>Average Salary</h4>
              <p class="amount">${{ payrollData.averageSalary | number:'1.2-2' }}</p>
            </div>
          </div>

          <div class="data-table">
            <table>
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
                  <td>{{ dept.name }}</td>
                  <td>{{ dept.employeeCount }}</td>
                  <td>${{ dept.totalExpense | number:'1.2-2' }}</td>
                  <td>${{ dept.averageSalary | number:'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Loan Reports -->
        <div *ngIf="selectedCategory === 'loans'" class="report-section">
          <div class="section-header">
            <h3>Loan Disbursement Reports</h3>
            <button class="btn btn-secondary" (click)="exportReport('loans')">
              <span class="material-icons">file_download</span>
              Export PDF
            </button>
          </div>
          
          <div class="report-summary">
            <div class="summary-card">
              <h4>Total Disbursed</h4>
              <p class="amount">${{ loanData.totalDisbursed | number:'1.2-2' }}</p>
            </div>
            <div class="summary-card">
              <h4>Active Loans</h4>
              <p class="count">{{ loanData.activeLoans }}</p>
            </div>
            <div class="summary-card">
              <h4>Default Rate</h4>
              <p class="percentage">{{ loanData.defaultRate }}%</p>
            </div>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Loan Type</th>
                  <th>Count</th>
                  <th>Total Amount</th>
                  <th>Average Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let loan of loanData.loanTypes">
                  <td>{{ loan.type }}</td>
                  <td>{{ loan.count }}</td>
                  <td>${{ loan.totalAmount | number:'1.2-2' }}</td>
                  <td>${{ loan.averageAmount | number:'1.2-2' }}</td>
                  <td>
                    <span class="status-badge" [class]="loan.status">
                      {{ loan.status | titlecase }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Reimbursement Reports -->
        <div *ngIf="selectedCategory === 'reimbursements'" class="report-section">
          <div class="section-header">
            <h3>Reimbursement Expense Breakdown</h3>
            <button class="btn btn-secondary" (click)="exportReport('reimbursements')">
              <span class="material-icons">file_download</span>
              Export PDF
            </button>
          </div>
          
          <div class="report-summary">
            <div class="summary-card">
              <h4>Total Reimbursed</h4>
              <p class="amount">${{ reimbursementData.totalReimbursed | number:'1.2-2' }}</p>
            </div>
            <div class="summary-card">
              <h4>Claims Processed</h4>
              <p class="count">{{ reimbursementData.claimsProcessed }}</p>
            </div>
            <div class="summary-card">
              <h4>Average Claim</h4>
              <p class="amount">${{ reimbursementData.averageClaim | number:'1.2-2' }}</p>
            </div>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Claims</th>
                  <th>Total Amount</th>
                  <th>Average</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let category of reimbursementData.categories">
                  <td>{{ category.name }}</td>
                  <td>{{ category.claims }}</td>
                  <td>${{ category.totalAmount | number:'1.2-2' }}</td>
                  <td>${{ category.average | number:'1.2-2' }}</td>
                  <td>{{ category.percentage }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Insurance Reports -->
        <div *ngIf="selectedCategory === 'insurance'" class="report-section">
          <div class="section-header">
            <h3>Insurance Enrollment Statistics</h3>
            <button class="btn btn-secondary" (click)="exportReport('insurance')">
              <span class="material-icons">file_download</span>
              Export PDF
            </button>
          </div>
          
          <div class="report-summary">
            <div class="summary-card">
              <h4>Total Enrolled</h4>
              <p class="count">{{ insuranceData.totalEnrolled }}</p>
            </div>
            <div class="summary-card">
              <h4>Premium Collected</h4>
              <p class="amount">${{ insuranceData.premiumCollected | number:'1.2-2' }}</p>
            </div>
            <div class="summary-card">
              <h4>Coverage Amount</h4>
              <p class="amount">${{ insuranceData.totalCoverage | number:'1.0-0' }}</p>
            </div>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Policy Type</th>
                  <th>Enrolled</th>
                  <th>Premium/Month</th>
                  <th>Coverage</th>
                  <th>Enrollment Rate</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let policy of insuranceData.policies">
                  <td>{{ policy.type }}</td>
                  <td>{{ policy.enrolled }}</td>
                  <td>${{ policy.premium | number:'1.2-2' }}</td>
                  <td>${{ policy.coverage | number:'1.0-0' }}</td>
                  <td>{{ policy.enrollmentRate }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Medical Claims Reports -->
        <div *ngIf="selectedCategory === 'medical'" class="report-section">
          <div class="section-header">
            <h3>Medical Claim Settlement Reports</h3>
            <button class="btn btn-secondary" (click)="exportReport('medical')">
              <span class="material-icons">file_download</span>
              Export PDF
            </button>
          </div>
          
          <div class="report-summary">
            <div class="summary-card">
              <h4>Claims Settled</h4>
              <p class="count">{{ medicalData.claimsSettled }}</p>
            </div>
            <div class="summary-card">
              <h4>Settlement Amount</h4>
              <p class="amount">${{ medicalData.settlementAmount | number:'1.2-2' }}</p>
            </div>
            <div class="summary-card">
              <h4>Settlement Ratio</h4>
              <p class="percentage">{{ medicalData.settlementRatio }}%</p>
            </div>
          </div>

          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Claim Type</th>
                  <th>Claims</th>
                  <th>Claimed Amount</th>
                  <th>Settled Amount</th>
                  <th>Settlement %</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let claim of medicalData.claimTypes">
                  <td>{{ claim.type }}</td>
                  <td>{{ claim.count }}</td>
                  <td>${{ claim.claimedAmount | number:'1.2-2' }}</td>
                  <td>${{ claim.settledAmount | number:'1.2-2' }}</td>
                  <td>{{ claim.settlementPercentage }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: var(--spacing-lg);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-xl);
    }

    .page-header h2 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: var(--spacing-md);
      align-items: center;
    }

    .period-select {
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--outline);
      border-radius: var(--radius-md);
      background: var(--surface);
      color: var(--on-surface);
    }

    .report-categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .category-card {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-2);
      border: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .category-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-3);
    }

    .category-card.active {
      border-color: var(--primary-500);
      background: var(--primary-50);
    }

    .category-icon {
      width: 60px;
      height: 60px;
      border-radius: var(--radius-lg);
      background: var(--primary-100);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-600);
    }

    .category-card.active .category-icon {
      background: var(--primary-500);
      color: white;
    }

    .category-info h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0 0 var(--spacing-xs) 0;
    }

    .category-info p {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
      margin: 0;
    }

    .report-content {
      background: var(--surface);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-2);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-md);
      border-bottom: 1px solid var(--outline);
    }

    .section-header h3 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      margin: 0;
    }

    .report-summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-xl);
    }

    .summary-card {
      background: var(--surface-variant);
      border-radius: var(--radius-md);
      padding: var(--spacing-lg);
      text-align: center;
    }

    .summary-card h4 {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--on-surface-variant);
      margin: 0 0 var(--spacing-sm) 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .summary-card .amount {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
      margin: 0;
    }

    .summary-card .count {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--success-600);
      margin: 0;
    }

    .summary-card .percentage {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--warning-600);
      margin: 0;
    }

    .data-table {
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--font-size-sm);
    }

    th {
      background: var(--surface-variant);
      padding: var(--spacing-md);
      text-align: left;
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      border-bottom: 1px solid var(--outline);
    }

    td {
      padding: var(--spacing-md);
      border-bottom: 1px solid var(--outline);
      color: var(--on-surface);
    }

    tr:hover {
      background: var(--surface-variant);
    }

    .status-badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
    }

    .status-badge.active {
      background: var(--success-100);
      color: var(--success-700);
    }

    .status-badge.completed {
      background: var(--info-100);
      color: var(--info-700);
    }

    .btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-primary {
      background: var(--primary-500);
      color: white;
    }

    .btn-primary:hover {
      background: var(--primary-600);
    }

    .btn-secondary {
      background: var(--surface-variant);
      color: var(--on-surface-variant);
      border: 1px solid var(--outline);
    }

    .btn-secondary:hover {
      background: var(--surface);
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);
      }

      .header-actions {
        width: 100%;
        justify-content: space-between;
      }

      .report-categories {
        grid-template-columns: 1fr;
      }

      .report-summary {
        grid-template-columns: 1fr;
      }

      .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-md);
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
      name: 'Payroll Reports',
      description: 'Monthly payroll expenses and department-wise breakdown',
      icon: 'payments'
    },
    {
      id: 'loans',
      name: 'Loan Reports',
      description: 'Loan disbursement and repayment tracking',
      icon: 'account_balance'
    },
    {
      id: 'reimbursements',
      name: 'Reimbursement Reports',
      description: 'Expense reimbursements by category and department',
      icon: 'receipt'
    },
    {
      id: 'insurance',
      name: 'Insurance Reports',
      description: 'Policy enrollment and premium collection statistics',
      icon: 'health_and_safety'
    },
    {
      id: 'medical',
      name: 'Medical Claims',
      description: 'Medical claim settlements and coverage analysis',
      icon: 'local_hospital'
    }
  ];

  payrollData = {
    totalExpense: 485000,
    employeeCount: 97,
    averageSalary: 5000,
    departments: [
      { name: 'Engineering', employeeCount: 35, totalExpense: 210000, averageSalary: 6000 },
      { name: 'Marketing', employeeCount: 20, totalExpense: 90000, averageSalary: 4500 },
      { name: 'Sales', employeeCount: 25, totalExpense: 112500, averageSalary: 4500 },
      { name: 'HR', employeeCount: 8, totalExpense: 32000, averageSalary: 4000 },
      { name: 'Finance', employeeCount: 9, totalExpense: 40500, averageSalary: 4500 }
    ]
  };

  loanData = {
    totalDisbursed: 125000,
    activeLoans: 15,
    defaultRate: 2.5,
    loanTypes: [
      { type: 'Personal', count: 8, totalAmount: 65000, averageAmount: 8125, status: 'active' },
      { type: 'Home', count: 4, totalAmount: 45000, averageAmount: 11250, status: 'active' },
      { type: 'Education', count: 3, totalAmount: 15000, averageAmount: 5000, status: 'completed' }
    ]
  };

  reimbursementData = {
    totalReimbursed: 28500,
    claimsProcessed: 45,
    averageClaim: 633,
    categories: [
      { name: 'Travel', claims: 18, totalAmount: 15300, average: 850, percentage: 53.7 },
      { name: 'Office Supplies', claims: 12, totalAmount: 4800, average: 400, percentage: 16.8 },
      { name: 'Food & Entertainment', claims: 10, totalAmount: 5200, average: 520, percentage: 18.2 },
      { name: 'Training', claims: 5, totalAmount: 3200, average: 640, percentage: 11.2 }
    ]
  };

  insuranceData = {
    totalEnrolled: 78,
    premiumCollected: 9750,
    totalCoverage: 39000000,
    policies: [
      { type: 'Group Health', enrolled: 65, premium: 125, coverage: 500000, enrollmentRate: 67 },
      { type: 'Term Life', enrolled: 45, premium: 45, coverage: 1000000, enrollmentRate: 46 },
      { type: 'Critical Illness', enrolled: 25, premium: 75, coverage: 250000, enrollmentRate: 26 },
      { type: 'Accident & Disability', enrolled: 18, premium: 35, coverage: 100000, enrollmentRate: 19 }
    ]
  };

  medicalData = {
    claimsSettled: 23,
    settlementAmount: 45600,
    settlementRatio: 85.2,
    claimTypes: [
      { type: 'Hospitalization', count: 8, claimedAmount: 28500, settledAmount: 24225, settlementPercentage: 85 },
      { type: 'Outpatient', count: 12, claimedAmount: 15200, settledAmount: 13680, settlementPercentage: 90 },
      { type: 'Dental', count: 3, claimedAmount: 2800, settledAmount: 2520, settlementPercentage: 90 }
    ]
  };

  ngOnInit() {}

  selectCategory(categoryId: string) {
    this.selectedCategory = categoryId;
  }

  exportReport(reportType: string) {
    alert(`Exporting ${reportType} report for ${this.selectedPeriod} period...`);
  }

  exportAllReports() {
    alert(`Exporting all reports for ${this.selectedPeriod} period...`);
  }
}