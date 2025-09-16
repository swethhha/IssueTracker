import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
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
  `]
})
export class PayrollListComponent implements OnInit {
  payrolls: any[] = [];

  constructor(private payrollService: PayrollService) {}

  ngOnInit() {
    this.loadPayrolls();
  }

  loadPayrolls() {
    // Load from API or use demo data
    this.payrolls = [
      {
        id: 1,
        payPeriodStart: new Date(2024, 0, 1),
        payPeriodEnd: new Date(2024, 0, 31),
        basicSalary: 500000,
        allowances: 50000,
        deductions: 80000,
        netPay: 470000,
        status: 'Approved'
      },
      {
        id: 2,
        payPeriodStart: new Date(2024, 1, 1),
        payPeriodEnd: new Date(2024, 1, 29),
        basicSalary: 500000,
        allowances: 50000,
        deductions: 80000,
        netPay: 470000,
        status: 'Approved'
      },
      {
        id: 3,
        payPeriodStart: new Date(2024, 2, 1),
        payPeriodEnd: new Date(2024, 2, 31),
        basicSalary: 500000,
        allowances: 50000,
        deductions: 80000,
        netPay: 470000,
        status: 'Pending'
      }
    ];
  }

  getBadgeClass(status: string): string {
    return `badge-${status.toLowerCase()}`;
  }

  downloadPayslip(payrollId: number) {
    // Generate and download payslip
    const payroll = this.payrolls.find(p => p.id === payrollId);
    if (payroll) {
      const content = this.generatePayslipContent(payroll);
      this.downloadFile(content, `payslip-${payroll.payPeriodStart.getFullYear()}-${payroll.payPeriodStart.getMonth() + 1}.txt`);
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