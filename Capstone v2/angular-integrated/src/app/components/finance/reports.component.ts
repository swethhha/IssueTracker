import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Financial Reports</h1>
        <p>Generate and download financial reports</p>
      </div>

      <div class="reports-grid">
        <div class="report-card">
          <div class="report-header">
            <h3>📊 Payroll Disbursement Report</h3>
            <p>Monthly payroll summary and disbursements</p>
          </div>
          <div class="report-body">
            <div class="form-group">
              <label class="form-label">Month</label>
              <input type="month" class="form-control" [(ngModel)]="payrollMonth">
            </div>
            <div class="form-group">
              <label class="form-label">Department</label>
              <select class="form-control form-select" [(ngModel)]="payrollDepartment">
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>
          <div class="report-footer">
            <button class="btn btn-primary" (click)="generatePayrollReport()">Generate Report</button>
          </div>
        </div>

        <div class="report-card">
          <div class="report-header">
            <h3>🏦 Loan Disbursal Report</h3>
            <p>Loan applications and disbursements</p>
          </div>
          <div class="report-body">
            <div class="form-group">
              <label class="form-label">Date Range</label>
              <input type="date" class="form-control" [(ngModel)]="loanStartDate">
              <input type="date" class="form-control mt-1" [(ngModel)]="loanEndDate">
            </div>
            <div class="form-group">
              <label class="form-label">Loan Type</label>
              <select class="form-control form-select" [(ngModel)]="loanType">
                <option value="">All Types</option>
                <option value="Personal">Personal</option>
                <option value="Home">Home</option>
                <option value="Car">Car</option>
                <option value="Education">Education</option>
              </select>
            </div>
          </div>
          <div class="report-footer">
            <button class="btn btn-primary" (click)="generateLoanReport()">Generate Report</button>
          </div>
        </div>

        <div class="report-card">
          <div class="report-header">
            <h3>📋 Reimbursement Expense Report</h3>
            <p>Employee expense reimbursements</p>
          </div>
          <div class="report-body">
            <div class="form-group">
              <label class="form-label">Month</label>
              <input type="month" class="form-control" [(ngModel)]="expenseMonth">
            </div>
            <div class="form-group">
              <label class="form-label">Category</label>
              <select class="form-control form-select" [(ngModel)]="expenseCategory">
                <option value="">All Categories</option>
                <option value="Travel">Travel</option>
                <option value="Food">Food</option>
                <option value="Medical">Medical</option>
                <option value="Office">Office</option>
              </select>
            </div>
          </div>
          <div class="report-footer">
            <button class="btn btn-primary" (click)="generateExpenseReport()">Generate Report</button>
          </div>
        </div>

        <div class="report-card">
          <div class="report-header">
            <h3>🏥 Medical Claims Report</h3>
            <p>Medical insurance claims summary</p>
          </div>
          <div class="report-body">
            <div class="form-group">
              <label class="form-label">Quarter</label>
              <select class="form-control form-select" [(ngModel)]="medicalQuarter">
                <option value="Q1">Q1 (Jan-Mar)</option>
                <option value="Q2">Q2 (Apr-Jun)</option>
                <option value="Q3">Q3 (Jul-Sep)</option>
                <option value="Q4">Q4 (Oct-Dec)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Treatment Type</label>
              <select class="form-control form-select" [(ngModel)]="treatmentType">
                <option value="">All Types</option>
                <option value="Surgery">Surgery</option>
                <option value="Consultation">Consultation</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
          </div>
          <div class="report-footer">
            <button class="btn btn-primary" (click)="generateMedicalReport()">Generate Report</button>
          </div>
        </div>
      </div>

      <div class="card mt-4">
        <div class="card-header">
          <h3 class="card-title">Recent Reports</h3>
        </div>
        <div class="card-body">
          <div class="table-container">
            <table class="table">
              <thead>
                <tr>
                  <th>Report Type</th>
                  <th>Generated Date</th>
                  <th>Parameters</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let report of recentReports">
                  <td>{{ report.type }}</td>
                  <td>{{ report.generatedDate | date:'short' }}</td>
                  <td>{{ report.parameters }}</td>
                  <td>
                    <button class="btn btn-sm btn-secondary" (click)="downloadReport(report)">📥 Download</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 2rem; }
    .reports-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
    .report-card { background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: var(--radius-lg); overflow: hidden; }
    .report-header { padding: 1.5rem; background: var(--bg-secondary); border-bottom: 1px solid var(--border-color); }
    .report-header h3 { margin: 0; font-size: 1.125rem; }
    .report-header p { margin: 0.5rem 0 0 0; color: var(--text-secondary); font-size: 0.875rem; }
    .report-body { padding: 1.5rem; }
    .report-footer { padding: 1rem 1.5rem; background: var(--bg-tertiary); }
  `]
})
export class ReportsComponent {
  payrollMonth = '';
  payrollDepartment = '';
  loanStartDate = '';
  loanEndDate = '';
  loanType = '';
  expenseMonth = '';
  expenseCategory = '';
  medicalQuarter = 'Q1';
  treatmentType = '';

  recentReports = [
    { type: 'Payroll Report', generatedDate: new Date(), parameters: 'March 2024, All Departments' },
    { type: 'Loan Report', generatedDate: new Date(), parameters: 'Q1 2024, Personal Loans' },
    { type: 'Expense Report', generatedDate: new Date(), parameters: 'February 2024, Travel' }
  ];

  generatePayrollReport() {
    console.log('Generating payroll report', { month: this.payrollMonth, department: this.payrollDepartment });
    alert('Payroll report generated successfully!');
  }

  generateLoanReport() {
    console.log('Generating loan report', { startDate: this.loanStartDate, endDate: this.loanEndDate, type: this.loanType });
    alert('Loan report generated successfully!');
  }

  generateExpenseReport() {
    console.log('Generating expense report', { month: this.expenseMonth, category: this.expenseCategory });
    alert('Expense report generated successfully!');
  }

  generateMedicalReport() {
    console.log('Generating medical report', { quarter: this.medicalQuarter, treatmentType: this.treatmentType });
    alert('Medical claims report generated successfully!');
  }

  downloadReport(report: any) {
    console.log('Downloading report:', report);
    alert(`Downloading ${report.type}...`);
  }
}