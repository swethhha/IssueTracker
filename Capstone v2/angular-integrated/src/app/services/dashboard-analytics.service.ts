import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface DashboardAnalytics {
  payrollTrends: number[];
  departmentDistribution: { name: string; value: number; percentage: number }[];
  loanRepaymentData: { paid: number; pending: number };
  reimbursementCategories: { category: string; amount: number; percentage: number }[];
  systemMetrics: { cpu: number; memory: number; storage: number; network: number };
  userActivity: { activeUsers: number; pageViews: number; loginCount: number };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardAnalyticsService {
  constructor() {}

  getDashboardAnalytics(): Observable<DashboardAnalytics> {
    // Mock analytics data - replace with actual API calls
    const analytics: DashboardAnalytics = {
      payrollTrends: [2800000, 2950000, 3100000, 2900000, 3200000, 3350000, 3100000, 3400000, 3250000, 3500000, 3300000, 3600000],
      departmentDistribution: [
        { name: 'Engineering', value: 45, percentage: 34 },
        { name: 'Sales', value: 32, percentage: 24 },
        { name: 'Marketing', value: 28, percentage: 21 },
        { name: 'HR', value: 15, percentage: 11 },
        { name: 'Finance', value: 12, percentage: 9 }
      ],
      loanRepaymentData: { paid: 65, pending: 35 },
      reimbursementCategories: [
        { category: 'Travel', amount: 450000, percentage: 35 },
        { category: 'Medical', amount: 320000, percentage: 25 },
        { category: 'Food', amount: 256000, percentage: 20 },
        { category: 'Training', amount: 192000, percentage: 15 },
        { category: 'Others', amount: 64000, percentage: 5 }
      ],
      systemMetrics: { cpu: 65, memory: 78, storage: 45, network: 32 },
      userActivity: { activeUsers: 148, pageViews: 1120, loginCount: 89 }
    };

    return of(analytics);
  }

  getPayrollTrendData(months: number = 12): Observable<number[]> {
    const fullData = [2800000, 2950000, 3100000, 2900000, 3200000, 3350000, 3100000, 3400000, 3250000, 3500000, 3300000, 3600000];
    return of(fullData.slice(-months));
  }

  getDepartmentExpenses(): Observable<{ department: string; amount: number; employeeCount: number }[]> {
    const expenses = [
      { department: 'Engineering', amount: 3375000, employeeCount: 45 },
      { department: 'Sales', amount: 2240000, employeeCount: 32 },
      { department: 'Marketing', amount: 1960000, employeeCount: 28 },
      { department: 'HR', amount: 1125000, employeeCount: 15 },
      { department: 'Finance', amount: 900000, employeeCount: 12 }
    ];
    return of(expenses);
  }

  getApprovalMetrics(): Observable<{ type: string; approved: number; rejected: number; pending: number }[]> {
    const metrics = [
      { type: 'Payroll', approved: 156, rejected: 8, pending: 12 },
      { type: 'Loans', approved: 89, rejected: 15, pending: 8 },
      { type: 'Reimbursements', approved: 234, rejected: 12, pending: 18 }
    ];
    return of(metrics);
  }

  getInsuranceEnrollmentData(): Observable<{ type: string; count: number; percentage: number }[]> {
    const enrollment = [
      { type: 'Health Insurance', count: 98, percentage: 45 },
      { type: 'Life Insurance', count: 65, percentage: 30 },
      { type: 'Dental Insurance', count: 32, percentage: 15 },
      { type: 'Vision Insurance', count: 22, percentage: 10 }
    ];
    return of(enrollment);
  }

  getSystemPerformanceMetrics(): Observable<{ metric: string; value: number; status: 'good' | 'warning' | 'critical' }[]> {
    const metrics = [
      { metric: 'CPU Usage', value: 65, status: 'good' as const },
      { metric: 'Memory Usage', value: 78, status: 'warning' as const },
      { metric: 'Storage Usage', value: 45, status: 'good' as const },
      { metric: 'Network Load', value: 32, status: 'good' as const },
      { metric: 'Database Performance', value: 92, status: 'critical' as const },
      { metric: 'API Response Time', value: 156, status: 'good' as const }
    ];
    return of(metrics);
  }

  getRecentActivities(): Observable<{ type: string; description: string; timestamp: Date; user: string }[]> {
    const activities = [
      { type: 'payroll', description: 'Payroll processed for December 2024', timestamp: new Date('2024-12-20T10:30:00'), user: 'System' },
      { type: 'loan', description: 'Loan application approved for John Doe', timestamp: new Date('2024-12-20T09:15:00'), user: 'Manager' },
      { type: 'reimbursement', description: 'Travel reimbursement submitted by Jane Smith', timestamp: new Date('2024-12-20T08:45:00'), user: 'Jane Smith' },
      { type: 'employee', description: 'New employee Alice Johnson onboarded', timestamp: new Date('2024-12-19T16:20:00'), user: 'HR Admin' },
      { type: 'insurance', description: 'Health insurance policy renewed', timestamp: new Date('2024-12-19T14:10:00'), user: 'System' }
    ];
    return of(activities);
  }

  // Utility methods for chart configurations
  getChartColors(): { [key: string]: string[] } {
    return {
      primary: ['#667eea', '#764ba2'],
      success: ['#43e97b', '#38f9d7'],
      warning: ['#fa709a', '#fee140'],
      info: ['#4facfe', '#00f2fe'],
      danger: ['#f093fb', '#f5576c'],
      purple: ['#d299c2', '#fef9d7'],
      gradient: ['#667eea', '#764ba2', '#43e97b', '#fa709a', '#4facfe']
    };
  }

  formatCurrency(amount: number): string {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  }

  calculatePercentageChange(current: number, previous: number): { value: number; isPositive: boolean } {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(change),
      isPositive: change >= 0
    };
  }
}