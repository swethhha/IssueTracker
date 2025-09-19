import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-modern-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reports-dashboard">
      <!-- Hero Header -->
      <div class="hero-header">
        <div class="hero-content">
          <h1>Financial Analytics</h1>
          <p>Real-time insights and comprehensive reporting</p>
        </div>
        <div class="hero-actions">
          <select [(ngModel)]="selectedPeriod" class="period-select">
            <option value="current">Current Month</option>
            <option value="last">Last Month</option>
            <option value="quarter">This Quarter</option>
          </select>
          <button class="export-all-btn" (click)="exportAll()">
            <i class="material-icons">cloud_download</i>
            Export All
          </button>
        </div>
      </div>

      <!-- KPI Overview -->
      <div class="kpi-section">
        <div class="kpi-card revenue">
          <div class="kpi-icon">
            <i class="material-icons">trending_up</i>
          </div>
          <div class="kpi-data">
            <h3>₹28.5L</h3>
            <p>Total Revenue</p>
            <span class="trend positive">+12.5%</span>
          </div>
        </div>
        <div class="kpi-card expenses">
          <div class="kpi-icon">
            <i class="material-icons">account_balance_wallet</i>
          </div>
          <div class="kpi-data">
            <h3>₹15.2L</h3>
            <p>Total Expenses</p>
            <span class="trend positive">+8.3%</span>
          </div>
        </div>
        <div class="kpi-card profit">
          <div class="kpi-icon">
            <i class="material-icons">savings</i>
          </div>
          <div class="kpi-data">
            <h3>₹13.3L</h3>
            <p>Net Profit</p>
            <span class="trend positive">+18.2%</span>
          </div>
        </div>
        <div class="kpi-card employees">
          <div class="kpi-icon">
            <i class="material-icons">groups</i>
          </div>
          <div class="kpi-data">
            <h3>247</h3>
            <p>Active Employees</p>
            <span class="trend positive">+3.2%</span>
          </div>
        </div>
      </div>

      <!-- Report Categories -->
      <div class="categories-section">
        <h2>Report Categories</h2>
        <div class="categories-grid">
          <div class="category-card" [class.active]="selectedCategory === 'payroll'" (click)="selectCategory('payroll')">
            <div class="category-header">
              <i class="material-icons">payments</i>
              <h3>Payroll Analytics</h3>
            </div>
            <p>Employee salaries, benefits, and department breakdowns</p>
            <div class="category-stats">
              <span>₹28.5L processed</span>
              <span>247 employees</span>
            </div>
          </div>
          
          <div class="category-card" [class.active]="selectedCategory === 'loans'" (click)="selectCategory('loans')">
            <div class="category-header">
              <i class="material-icons">account_balance</i>
              <h3>Loan Management</h3>
            </div>
            <p>Loan disbursements, approvals, and repayment tracking</p>
            <div class="category-stats">
              <span>₹15.2L disbursed</span>
              <span>85% approval rate</span>
            </div>
          </div>
          
          <div class="category-card" [class.active]="selectedCategory === 'expenses'" (click)="selectCategory('expenses')">
            <div class="category-header">
              <i class="material-icons">receipt_long</i>
              <h3>Expense Management</h3>
            </div>
            <p>Reimbursements, travel expenses, and budget tracking</p>
            <div class="category-stats">
              <span>₹3.8L reimbursed</span>
              <span>156 requests</span>
            </div>
          </div>
          
          <div class="category-card" [class.active]="selectedCategory === 'benefits'" (click)="selectCategory('benefits')">
            <div class="category-header">
              <i class="material-icons">health_and_safety</i>
              <h3>Benefits & Insurance</h3>
            </div>
            <p>Health insurance, medical claims, and employee benefits</p>
            <div class="category-stats">
              <span>₹2.1L claims</span>
              <span>89% coverage</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Detailed Report -->
      <div class="report-section" *ngIf="selectedCategory">
        <div class="report-header">
          <h2>{{ getCategoryTitle() }}</h2>
          <div class="report-actions">
            <button class="action-btn secondary" (click)="refreshData()">
              <i class="material-icons">refresh</i>
              Refresh
            </button>
            <button class="action-btn primary" (click)="exportReport()">
              <i class="material-icons">picture_as_pdf</i>
              Export PDF
            </button>
          </div>
        </div>

        <!-- Payroll Report -->
        <div *ngIf="selectedCategory === 'payroll'" class="report-content">
          <div class="metrics-row">
            <div class="metric-box">
              <h4>₹28,50,000</h4>
              <p>Total Payroll</p>
            </div>
            <div class="metric-box">
              <h4>247</h4>
              <p>Employees</p>
            </div>
            <div class="metric-box">
              <h4>₹1,15,385</h4>
              <p>Average Salary</p>
            </div>
            <div class="metric-box">
              <h4>6</h4>
              <p>Departments</p>
            </div>
          </div>

          <div class="data-table-container">
            <h3>Department Breakdown</h3>
            <table class="modern-table">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Total Expense</th>
                  <th>Avg Salary</th>
                  <th>% of Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Engineering</strong></td>
                  <td>89</td>
                  <td>₹12,50,000</td>
                  <td>₹1,40,449</td>
                  <td>43.9%</td>
                </tr>
                <tr>
                  <td><strong>Sales</strong></td>
                  <td>67</td>
                  <td>₹8,20,000</td>
                  <td>₹1,22,388</td>
                  <td>28.8%</td>
                </tr>
                <tr>
                  <td><strong>Marketing</strong></td>
                  <td>34</td>
                  <td>₹4,10,000</td>
                  <td>₹1,20,588</td>
                  <td>14.4%</td>
                </tr>
                <tr>
                  <td><strong>HR</strong></td>
                  <td>28</td>
                  <td>₹2,80,000</td>
                  <td>₹1,00,000</td>
                  <td>9.8%</td>
                </tr>
                <tr>
                  <td><strong>Finance</strong></td>
                  <td>19</td>
                  <td>₹2,10,000</td>
                  <td>₹1,10,526</td>
                  <td>7.4%</td>
                </tr>
                <tr>
                  <td><strong>Operations</strong></td>
                  <td>10</td>
                  <td>₹90,000</td>
                  <td>₹90,000</td>
                  <td>3.2%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Other category reports would go here -->
        <div *ngIf="selectedCategory !== 'payroll'" class="report-content">
          <div class="coming-soon">
            <i class="material-icons">construction</i>
            <h3>{{ getCategoryTitle() }} Report</h3>
            <p>Detailed analytics for {{ getCategoryTitle().toLowerCase() }} coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-dashboard {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 0;
    }

    .hero-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .hero-content h1 {
      font-size: 3rem;
      font-weight: 800;
      margin: 0;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .hero-content p {
      font-size: 1.2rem;
      margin: 0.5rem 0 0 0;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .period-select {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      background: rgba(255,255,255,0.2);
      color: white;
      font-weight: 500;
      backdrop-filter: blur(10px);
    }

    .period-select option {
      background: #333;
      color: white;
    }

    .export-all-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      backdrop-filter: blur(10px);
    }

    .export-all-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }

    .kpi-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      padding: 2rem;
      margin-top: -2rem;
      position: relative;
      z-index: 2;
    }

    .kpi-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      display: flex;
      align-items: center;
      gap: 1.5rem;
      transition: all 0.3s ease;
    }

    .kpi-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }

    .kpi-icon {
      width: 70px;
      height: 70px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      color: white;
    }

    .kpi-card.revenue .kpi-icon { background: linear-gradient(135deg, #667eea, #764ba2); }
    .kpi-card.expenses .kpi-icon { background: linear-gradient(135deg, #f093fb, #f5576c); }
    .kpi-card.profit .kpi-icon { background: linear-gradient(135deg, #4facfe, #00f2fe); }
    .kpi-card.employees .kpi-icon { background: linear-gradient(135deg, #43e97b, #38f9d7); }

    .kpi-data h3 {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      color: #1a202c;
    }

    .kpi-data p {
      font-size: 1rem;
      color: #718096;
      margin: 0.25rem 0;
      font-weight: 500;
    }

    .trend {
      font-size: 0.875rem;
      font-weight: 600;
      padding: 0.25rem 0.5rem;
      border-radius: 12px;
    }

    .trend.positive {
      background: #c6f6d5;
      color: #22543d;
    }

    .categories-section {
      padding: 2rem;
      background: #f7fafc;
    }

    .categories-section h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 2rem 0;
    }

    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    .category-card {
      background: white;
      border-radius: 16px;
      padding: 2rem;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .category-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(0,0,0,0.12);
      border-color: #667eea;
    }

    .category-card.active {
      border-color: #667eea;
      background: linear-gradient(135deg, #667eea10, #764ba210);
    }

    .category-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .category-header i {
      font-size: 2rem;
      color: #667eea;
    }

    .category-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0;
    }

    .category-card p {
      color: #718096;
      margin: 0 0 1.5rem 0;
      line-height: 1.6;
    }

    .category-stats {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .category-stats span {
      background: #edf2f7;
      color: #4a5568;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .report-section {
      background: white;
      margin: 2rem;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .report-header {
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .report-header h2 {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
    }

    .report-actions {
      display: flex;
      gap: 1rem;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .action-btn.primary {
      background: rgba(255,255,255,0.2);
      color: white;
      border: 2px solid rgba(255,255,255,0.3);
    }

    .action-btn.secondary {
      background: transparent;
      color: white;
      border: 2px solid rgba(255,255,255,0.3);
    }

    .action-btn:hover {
      background: rgba(255,255,255,0.3);
      transform: translateY(-2px);
    }

    .report-content {
      padding: 2rem;
    }

    .metrics-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .metric-box {
      background: #f7fafc;
      padding: 1.5rem;
      border-radius: 12px;
      text-align: center;
      border-left: 4px solid #667eea;
    }

    .metric-box h4 {
      font-size: 2rem;
      font-weight: 800;
      color: #1a202c;
      margin: 0 0 0.5rem 0;
    }

    .metric-box p {
      color: #718096;
      margin: 0;
      font-weight: 500;
    }

    .data-table-container h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a202c;
      margin: 0 0 1.5rem 0;
    }

    .modern-table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    }

    .modern-table th {
      background: #667eea;
      color: white;
      padding: 1rem 1.5rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .modern-table td {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e2e8f0;
      color: #4a5568;
    }

    .modern-table tbody tr:hover {
      background: #f7fafc;
    }

    .modern-table tbody tr:last-child td {
      border-bottom: none;
    }

    .coming-soon {
      text-align: center;
      padding: 4rem 2rem;
      color: #718096;
    }

    .coming-soon i {
      font-size: 4rem;
      color: #cbd5e0;
      margin-bottom: 1rem;
    }

    .coming-soon h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #4a5568;
      margin: 0 0 1rem 0;
    }

    @media (max-width: 768px) {
      .hero-header {
        flex-direction: column;
        gap: 2rem;
        text-align: center;
      }

      .hero-content h1 {
        font-size: 2rem;
      }

      .kpi-section {
        grid-template-columns: 1fr;
        padding: 1rem;
      }

      .categories-grid {
        grid-template-columns: 1fr;
      }

      .report-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .metrics-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ModernReportsComponent implements OnInit {
  selectedPeriod = 'current';
  selectedCategory = 'payroll';

  ngOnInit(): void {}

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  getCategoryTitle(): string {
    const titles: { [key: string]: string } = {
      'payroll': 'Payroll Analytics',
      'loans': 'Loan Management',
      'expenses': 'Expense Management',
      'benefits': 'Benefits & Insurance'
    };
    return titles[this.selectedCategory] || 'Financial Report';
  }

  exportAll() {
    alert('Exporting all financial reports...');
  }

  exportReport() {
    alert(`Exporting ${this.getCategoryTitle()} report...`);
  }

  refreshData() {
    alert('Refreshing data...');
  }
}