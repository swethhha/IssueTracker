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
            Export All
          </button>
        </div>
      </div>

      <div class="report-categories">
        <div class="category-card" 
             *ngFor="let category of reportCategories" 
             [class.active]="selectedCategory === category.id"
             (click)="selectCategory(category.id)">
          <div class="category-info">
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </div>

      <div class="report-content">
        <div *ngIf="selectedCategory === 'payroll'" class="report-section">
          <div class="section-header">
            <h3>Payroll Expense Reports</h3>
            <button class="btn btn-secondary" (click)="exportReport('payroll')">
              Export PDF
            </button>
          </div>
          
          <div class="report-summary">
            <div class="summary-card">
              <h4>Total Payroll Expense</h4>
              <p class="amount">\${{ payrollData.totalExpense | number:'1.2-2' }}</p>
            </div>
            <div class="summary-card">
              <h4>Employees Paid</h4>
              <p class="count">{{ payrollData.employeeCount }}</p>
            </div>
            <div class="summary-card">
              <h4>Average Salary</h4>
              <p class="amount">\${{ payrollData.averageSalary | number:'1.2-2' }}</p>
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
                  <td>\${{ dept.totalExpense | number:'1.2-2' }}</td>
                  <td>\${{ dept.averageSalary | number:'1.2-2' }}</td>
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
      padding: 20px;
    }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .category-card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      cursor: pointer;
      margin-bottom: 15px;
    }
    .category-card.active {
      border: 2px solid #007bff;
    }
    .btn {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-primary {
      background: #007bff;
      color: white;
    }
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    .summary-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
      margin-bottom: 15px;
    }
    .amount {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
    }
    .count {
      font-size: 24px;
      font-weight: bold;
      color: #28a745;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }
    th {
      background: #f8f9fa;
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
      description: 'Monthly payroll expenses and department-wise breakdown'
    }
  ];

  payrollData = {
    totalExpense: 485000,
    employeeCount: 97,
    averageSalary: 5000,
    departments: [
      { name: 'Engineering', employeeCount: 35, totalExpense: 210000, averageSalary: 6000 },
      { name: 'Marketing', employeeCount: 20, totalExpense: 90000, averageSalary: 4500 }
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