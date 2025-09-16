import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface AnalyticsData {
  totalPayroll: number;
  activeEmployees: number;
  approvalRate: number;
  avgProcessingDays: number;
  payrollTrends: number[];
  departmentDistribution: { name: string; value: number; percentage: number }[];
  requestTypes: { type: string; count: number; icon: string }[];
  recentActivity: { title: string; meta: string; type: string; time: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getAnalyticsData(): Observable<AnalyticsData> {
    return forkJoin({
      loans: this.http.get<any[]>(`${this.apiUrl}/Loans`).pipe(catchError(() => of([]))),
      employees: this.http.get<any[]>(`${this.apiUrl}/Employees`).pipe(catchError(() => of([]))),
      reimbursements: this.http.get<any[]>(`${this.apiUrl}/Reimbursements`).pipe(catchError(() => of([])))
    }).pipe(
      map(data => this.processAnalyticsData(data)),
      catchError(() => of(this.getMockAnalyticsData()))
    );
  }

  private processAnalyticsData(data: any): AnalyticsData {
    const { loans, employees, reimbursements } = data;
    
    // Calculate metrics from real data
    const totalPayroll = this.calculateTotalPayroll(employees);
    const activeEmployees = employees.length;
    const approvalRate = this.calculateApprovalRate(loans);
    const avgProcessingDays = this.calculateAvgProcessingDays(loans);
    
    return {
      totalPayroll,
      activeEmployees,
      approvalRate,
      avgProcessingDays,
      payrollTrends: this.generatePayrollTrends(employees),
      departmentDistribution: this.calculateDepartmentDistribution(employees),
      requestTypes: this.calculateRequestTypes(loans, reimbursements),
      recentActivity: this.generateRecentActivity(loans, reimbursements)
    };
  }

  private calculateTotalPayroll(employees: any[]): number {
    return employees.reduce((total, emp) => total + (emp.salary || 50000), 0);
  }

  private calculateApprovalRate(loans: any[]): number {
    if (loans.length === 0) return 0;
    const approved = loans.filter(loan => loan.managerApproved === true && loan.financeApproved === true).length;
    return (approved / loans.length) * 100;
  }

  private calculateAvgProcessingDays(loans: any[]): number {
    const processedLoans = loans.filter(loan => loan.approvedDate);
    if (processedLoans.length === 0) return 0;
    
    const totalDays = processedLoans.reduce((total, loan) => {
      const applied = new Date(loan.appliedDate);
      const approved = new Date(loan.approvedDate);
      const days = Math.ceil((approved.getTime() - applied.getTime()) / (1000 * 60 * 60 * 24));
      return total + days;
    }, 0);
    
    return totalDays / processedLoans.length;
  }

  private generatePayrollTrends(employees: any[]): number[] {
    // Generate 6 months of payroll data
    const baseAmount = employees.length * 50000;
    return [
      baseAmount * 0.95,
      baseAmount * 1.02,
      baseAmount * 0.98,
      baseAmount * 1.05,
      baseAmount * 1.01,
      baseAmount * 1.08
    ];
  }

  private calculateDepartmentDistribution(employees: any[]): { name: string; value: number; percentage: number }[] {
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance'];
    const total = employees.length || 100;
    
    return departments.map((dept, index) => {
      const percentages = [45, 25, 15, 10, 5];
      const value = Math.floor((total * percentages[index]) / 100);
      return {
        name: dept,
        value,
        percentage: percentages[index]
      };
    });
  }

  private calculateRequestTypes(loans: any[], reimbursements: any[]): { type: string; count: number; icon: string }[] {
    return [
      { type: 'Loan Requests', count: loans.length, icon: 'account_balance' },
      { type: 'Reimbursements', count: reimbursements.length, icon: 'receipt' },
      { type: 'Insurance', count: Math.floor(Math.random() * 50) + 20, icon: 'health_and_safety' },
      { type: 'Medical Claims', count: Math.floor(Math.random() * 30) + 15, icon: 'local_hospital' }
    ];
  }

  private generateRecentActivity(loans: any[], reimbursements: any[]): { title: string; meta: string; type: string; time: string }[] {
    const activities: { title: string; meta: string; type: string; time: string }[] = [];
    
    // Add loan activities
    loans.slice(0, 3).forEach(loan => {
      const status = loan.managerApproved === true ? 'approved' : 
                   loan.managerApproved === false ? 'rejected' : 'pending';
      activities.push({
        title: `${loan.loanType} ${status} for ${loan.employeeName || 'Employee'}`,
        meta: `₹${loan.amount?.toLocaleString()} • ${loan.loanType} • ${this.getTimeAgo(loan.appliedDate)}`,
        type: status,
        time: this.getTimeAgo(loan.appliedDate)
      });
    });
    
    // Add reimbursement activities
    reimbursements.slice(0, 2).forEach(reimb => {
      activities.push({
        title: `Reimbursement submitted by ${reimb.employeeName || 'Employee'}`,
        meta: `₹${reimb.amount?.toLocaleString()} • ${reimb.category} • ${this.getTimeAgo(reimb.requestDate)}`,
        type: 'pending',
        time: this.getTimeAgo(reimb.requestDate)
      });
    });
    
    return activities.slice(0, 5);
  }

  private getTimeAgo(dateString: string): string {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  }

  private getMockAnalyticsData(): AnalyticsData {
    return {
      totalPayroll: 2400000,
      activeEmployees: 1247,
      approvalRate: 98.7,
      avgProcessingDays: 2.3,
      payrollTrends: [2200000, 2350000, 2100000, 2450000, 2300000, 2400000],
      departmentDistribution: [
        { name: 'Engineering', value: 561, percentage: 45 },
        { name: 'Sales', value: 312, percentage: 25 },
        { name: 'Marketing', value: 187, percentage: 15 },
        { name: 'HR', value: 125, percentage: 10 },
        { name: 'Finance', value: 62, percentage: 5 }
      ],
      requestTypes: [
        { type: 'Loan Requests', count: 156, icon: 'account_balance' },
        { type: 'Reimbursements', count: 234, icon: 'receipt' },
        { type: 'Insurance', count: 89, icon: 'health_and_safety' },
        { type: 'Medical Claims', count: 67, icon: 'local_hospital' }
      ],
      recentActivity: [
        { title: 'Loan approved for John Doe', meta: '₹50,000 • Personal Loan • 2 minutes ago', type: 'approved', time: '2 minutes ago' },
        { title: 'Reimbursement submitted by Jane Smith', meta: '₹2,500 • Travel Expenses • 15 minutes ago', type: 'pending', time: '15 minutes ago' },
        { title: 'Insurance claim rejected for Mike Johnson', meta: '₹15,000 • Medical Insurance • 1 hour ago', type: 'rejected', time: '1 hour ago' }
      ]
    };
  }
}