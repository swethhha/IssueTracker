import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollService } from '../../services/payroll.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <!-- Finance Validation View -->
      <div *ngIf="isFinanceUser" class="finance-view">
        <div class="page-header">
          <h1>Payroll Validation</h1>
          <p>Validate salary components and approve payroll disbursement</p>
        </div>

        <div class="validation-container">
          <div class="validation-stats">
            <div class="stat-card">
              <div class="stat-value">{{ pendingPayrolls.length }}</div>
              <div class="stat-label">Pending Validation</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">₹{{ totalPayrollAmount | number:'1.0-0' }}</div>
              <div class="stat-label">Total Amount</div>
            </div>
          </div>

          <div class="validation-list">
            <div class="validation-item" *ngFor="let payroll of pendingPayrolls">
              <div class="payroll-header">
                <h3>{{ payroll.employeeName }}</h3>
                <span class="status-badge pending">Pending Validation</span>
              </div>
              
              <div class="payroll-details">
                <div class="detail-section">
                  <h4>Salary Components</h4>
                  <div class="component-grid">
                    <div class="component-item">
                      <span class="label">Basic Salary:</span>
                      <span class="value">₹{{ payroll.basicSalary | number:'1.0-0' }}</span>
                    </div>
                    <div class="component-item">
                      <span class="label">Allowances:</span>
                      <span class="value">₹{{ payroll.allowances | number:'1.0-0' }}</span>
                    </div>
                    <div class="component-item">
                      <span class="label">Deductions:</span>
                      <span class="value">₹{{ payroll.deductions | number:'1.0-0' }}</span>
                    </div>
                    <div class="component-item total">
                      <span class="label">Net Pay:</span>
                      <span class="value">₹{{ payroll.netPay | number:'1.0-0' }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="detail-section">
                  <h4>Pay Period</h4>
                  <div class="period-info">
                    <span>{{ payroll.payPeriodStart }} to {{ payroll.payPeriodEnd }}</span>
                  </div>
                </div>
              </div>

              <div class="validation-actions">
                <button class="btn btn-info" (click)="validateComponents(payroll)">Validate Components</button>
                <button class="btn btn-success" (click)="approvePayroll(payroll.id)">Approve & Disburse</button>
                <button class="btn btn-danger" (click)="rejectPayroll(payroll.id)">Reject to Manager</button>
              </div>
            </div>

            <div *ngIf="pendingPayrolls.length === 0" class="empty-state">
              <span class="material-icons">check_circle</span>
              <h3>No Pending Payroll Validations</h3>
              <p>All payrolls have been processed</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee View -->
      <div *ngIf="!isFinanceUser" class="employee-view">
        <div class="page-header">
          <h1>My Payrolls</h1>
          <p>View all your salary slips and payroll history</p>
        </div>

      <div class="payroll-container">
        <div class="table-container">
          <table class="payroll-table">
            <thead>
              <tr>
                <th>Pay Period</th>
                <th>Basic Salary</th>
                <th>Allowances</th>
                <th>Deductions</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let payroll of payrolls">
                <td>{{ payroll.payPeriodStart | date:'MMM yyyy' }} - {{ payroll.payPeriodEnd | date:'MMM yyyy' }}</td>
                <td>₹{{ payroll.basicSalary | number:'1.0-0' }}</td>
                <td>₹{{ payroll.allowances | number:'1.0-0' }}</td>
                <td>₹{{ payroll.deductions | number:'1.0-0' }}</td>
                <td class="net-pay">₹{{ payroll.netPay | number:'1.0-0' }}</td>
                <td>
                  <span class="badge" [ngClass]="getBadgeClass(payroll.status)">
                    {{ payroll.status }}
                  </span>
                </td>
                <td>
                  <button class="btn btn-outline btn-sm" (click)="downloadPayslip(payroll.id)">
                    <span class="material-icons">download</span>
                    Download
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="empty-state" *ngIf="payrolls.length === 0">
          <div class="empty-icon">
            <span class="material-icons">receipt_long</span>
          </div>
          <h3>No Payrolls Found</h3>
          <p>Your payroll records will appear here once they are processed.</p>
        </div>
      </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      padding: var(--spacing-lg);
      max-width: 1200px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--spacing-2xl);
    }

    .page-header h1 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--on-surface);
      margin: 0;
    }

    .page-header p {
      color: var(--on-surface-variant);
      font-size: var(--font-size-lg);
      margin: var(--spacing-sm) 0 0 0;
    }

    .payroll-container {
      background: var(--surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-1);
      overflow: hidden;
    }

    .table-container {
      overflow-x: auto;
    }

    .payroll-table {
      width: 100%;
      border-collapse: collapse;
    }

    .payroll-table th,
    .payroll-table td {
      padding: var(--spacing-md);
      text-align: left;
      border-bottom: 1px solid var(--outline-variant);
    }

    .payroll-table th {
      background: var(--surface-variant);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
      font-size: var(--font-size-sm);
    }

    .payroll-table td {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
    }

    .net-pay {
      font-weight: var(--font-weight-semibold);
      color: var(--primary-500);
    }

    .badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-xl);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      text-transform: uppercase;
    }

    .badge-approved {
      background: var(--success-100);
      color: var(--success-700);
    }

    .badge-pending {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .badge-rejected {
      background: var(--error-100);
      color: var(--error-700);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-xs) var(--spacing-sm);
      border: 1px solid var(--outline);
      border-radius: var(--radius-md);
      background: transparent;
      color: var(--primary-500);
      font-size: var(--font-size-xs);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn:hover {
      background: var(--primary-50);
      border-color: var(--primary-500);
    }

    .btn .material-icons {
      font-size: 16px;
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-3xl);
    }

    .empty-icon {
      margin-bottom: var(--spacing-lg);
    }

    .empty-icon .material-icons {
      font-size: 64px;
      color: var(--on-surface-variant);
    }

    .empty-state h3 {
      margin: 0 0 var(--spacing-sm) 0;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .empty-state p {
      color: var(--on-surface-variant);
      margin: 0;
    }

    @media (max-width: 768px) {
      .payroll-table {
        font-size: var(--font-size-xs);
      }
      
      .payroll-table th,
      .payroll-table td {
        padding: var(--spacing-sm);
      }
    }

    /* Finance Validation Styles */
    .finance-view {
      width: 100%;
    }

    .validation-container {
      background: var(--surface);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      box-shadow: var(--shadow-1);
    }

    .validation-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-2xl);
    }

    .stat-card {
      background: var(--primary-50);
      border: 1px solid var(--primary-200);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      text-align: center;
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--primary-600);
      margin-bottom: var(--spacing-xs);
    }

    .stat-label {
      font-size: var(--font-size-sm);
      color: var(--on-surface-variant);
    }

    .validation-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .validation-item {
      background: var(--surface-variant);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
    }

    .payroll-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);
    }

    .payroll-header h3 {
      margin: 0;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
    }

    .status-badge {
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .pending {
      background: var(--warning-100);
      color: var(--warning-700);
    }

    .payroll-details {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .detail-section h4 {
      margin: 0 0 var(--spacing-md) 0;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--on-surface);
    }

    .component-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-sm);
    }

    .component-item {
      display: flex;
      justify-content: space-between;
      padding: var(--spacing-sm);
      background: var(--surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--outline-variant);
    }

    .component-item.total {
      grid-column: 1 / -1;
      background: var(--primary-50);
      border-color: var(--primary-200);
      font-weight: var(--font-weight-semibold);
    }

    .component-item .label {
      color: var(--on-surface-variant);
    }

    .component-item .value {
      font-weight: var(--font-weight-semibold);
      color: var(--primary-600);
    }

    .period-info {
      padding: var(--spacing-md);
      background: var(--surface);
      border-radius: var(--radius-md);
      border: 1px solid var(--outline-variant);
      text-align: center;
      font-weight: var(--font-weight-medium);
    }

    .validation-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: flex-end;
    }

    .btn {
      padding: var(--spacing-sm) var(--spacing-lg);
      border: none;
      border-radius: var(--radius-md);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-info {
      background: var(--info-100);
      color: var(--info-700);
    }

    .btn-success {
      background: var(--success-500);
      color: white;
    }

    .btn-danger {
      background: var(--error-500);
      color: white;
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: var(--shadow-2);
    }

    .empty-state {
      text-align: center;
      padding: var(--spacing-2xl);
      color: var(--on-surface-variant);
    }

    .empty-state .material-icons {
      font-size: 48px;
      color: var(--success-500);
      margin-bottom: var(--spacing-md);
    }

    @media (max-width: 768px) {
      .payroll-details {
        grid-template-columns: 1fr;
      }

      .component-grid {
        grid-template-columns: 1fr;
      }

      .validation-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PayrollListComponent implements OnInit {
  payrolls: any[] = [];
  isFinanceUser = false;
  pendingPayrolls: any[] = [];
  totalPayrollAmount = 0;

  constructor(
    private payrollService: PayrollService,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isFinanceUser = user?.role === 'Finance';
      if (this.isFinanceUser) {
        this.loadPendingPayrolls();
      } else {
        this.loadPayrolls();
      }
    });
  }

  loadPendingPayrolls() {
    // Mock pending payrolls for Finance validation
    this.pendingPayrolls = [
      {
        id: 4,
        employeeName: 'Sarah Wilson',
        basicSalary: 55000,
        allowances: 5500,
        deductions: 3500,
        netPay: 57000,
        payPeriodStart: '2024-02-01',
        payPeriodEnd: '2024-02-29'
      },
      {
        id: 5,
        employeeName: 'John Doe',
        basicSalary: 50000,
        allowances: 5000,
        deductions: 3000,
        netPay: 52000,
        payPeriodStart: '2024-02-01',
        payPeriodEnd: '2024-02-29'
      },
      {
        id: 6,
        employeeName: 'Alice Smith',
        basicSalary: 60000,
        allowances: 6000,
        deductions: 4000,
        netPay: 62000,
        payPeriodStart: '2024-02-01',
        payPeriodEnd: '2024-02-29'
      }
    ];
    this.totalPayrollAmount = this.pendingPayrolls.reduce((sum, payroll) => sum + payroll.netPay, 0);
  }

  validateComponents(payroll: any) {
    this.toastService.info('Validation', `Validating salary components for ${payroll.employeeName}...`);
    setTimeout(() => {
      this.toastService.success('Validation Complete', 'All salary components are within policy limits.');
    }, 1500);
  }

  approvePayroll(id: number) {
    const payroll = this.pendingPayrolls.find(p => p.id === id);
    this.pendingPayrolls = this.pendingPayrolls.filter(p => p.id !== id);
    this.totalPayrollAmount = this.pendingPayrolls.reduce((sum, payroll) => sum + payroll.netPay, 0);
    this.toastService.success('Payroll Approved', `₹${payroll?.netPay || 0} salary approved! Disbursement triggered for ${payroll?.employeeName}.`);
  }

  rejectPayroll(id: number) {
    const reason = prompt('Enter rejection reason (will be sent back to Manager):');
    if (reason) {
      this.pendingPayrolls = this.pendingPayrolls.filter(p => p.id !== id);
      this.totalPayrollAmount = this.pendingPayrolls.reduce((sum, payroll) => sum + payroll.netPay, 0);
      this.toastService.warning('Payroll Rejected', 'Payroll sent back to Manager for revision.');
    }
  }

  loadPayrolls() {
    // Generate payrolls for last 5 months of current year
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    this.payrolls = [];
    
    for (let i = 4; i >= 0; i--) {
      const monthDate = new Date(currentYear, currentMonth - i, 1);
      const endDate = new Date(currentYear, currentMonth - i + 1, 0);
      
      this.payrolls.push({
        id: i + 1,
        basicSalary: 50000,
        allowances: 5000 + (i * 50), // Slight variation
        deductions: 3000 + (i * 25), // Slight variation
        netPay: 52000 + (i * 25), // Calculated net pay
        payPeriodStart: monthDate,
        payPeriodEnd: endDate,
        status: 'Approved'
      });
    }
  }

  getBadgeClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }

  downloadPayslip(payrollId: number) {
    const payroll = this.payrolls.find(p => p.id === payrollId);
    if (payroll) {
      const content = this.generatePayslipContent(payroll);
      const monthName = payroll.payPeriodStart.toLocaleDateString('en-US', { month: 'short' });
      const year = payroll.payPeriodStart.getFullYear();
      this.downloadFile(content, `payslip-${monthName}-${year}.txt`);
      this.toastService.success('Download Complete', `Payslip for ${monthName} ${year} downloaded successfully!`);
    }
  }

  private generatePayslipContent(payroll: any): string {
    return `
PAYROLL360 - PAYSLIP
====================

Pay Period: ${payroll.payPeriodStart.toLocaleDateString()} - ${payroll.payPeriodEnd.toLocaleDateString()}
Employee ID: EMP001
Status: ${payroll.status}

EARNINGS:
Basic Salary: ₹${payroll.basicSalary.toLocaleString('en-IN')}
Allowances: ₹${payroll.allowances.toLocaleString('en-IN')}
Gross Pay: ₹${(payroll.basicSalary + payroll.allowances).toLocaleString('en-IN')}

DEDUCTIONS:
Total Deductions: ₹${payroll.deductions.toLocaleString('en-IN')}

NET PAY: ₹${payroll.netPay.toLocaleString('en-IN')}

Generated on: ${new Date().toLocaleDateString()}
    `;
  }

  private downloadFile(content: string, filename: string) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}