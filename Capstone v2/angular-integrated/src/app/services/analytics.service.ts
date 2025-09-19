import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  getAnalyticsData(): Observable<any> {
    // Calculate based on our mock data
    const payrollData = [
      { period: 'December 2024', netPay: 81500, status: 'Approved' },
      { period: 'November 2024', netPay: 75200, status: 'Approved' },
      { period: 'October 2024', netPay: 69800, status: 'Approved' },
      { period: 'September 2024', netPay: 61600, status: 'Approved' },
      { period: 'August 2024', netPay: 66600, status: 'Approved' }
    ];

    const totalPayroll = payrollData.reduce((sum, p) => sum + p.netPay, 0);
    const activeEmployees = 247;
    const pendingApprovals = 12; // 5 loans + 7 reimbursements
    const totalRequests = 45;
    const approvalRate = ((totalRequests - pendingApprovals) / totalRequests * 100);
    const avgProcessingDays = 2.3;

    const analytics = {
      kpis: [
        { 
          title: 'Total Payroll', 
          value: `₹${(totalPayroll / 100000).toFixed(1)}L`, 
          change: '+12.5%', 
          trend: 'up', 
          icon: 'trending_up', 
          color: 'blue' 
        },
        { 
          title: 'Active Employees', 
          value: activeEmployees.toString(), 
          change: '+3.2%', 
          trend: 'up', 
          icon: 'group', 
          color: 'green' 
        },
        { 
          title: 'Approval Rate', 
          value: `${approvalRate.toFixed(1)}%`, 
          change: '+1.8%', 
          trend: 'up', 
          icon: 'check_circle', 
          color: 'orange' 
        },
        { 
          title: 'Avg Processing Days', 
          value: avgProcessingDays.toString(), 
          change: '-0.5 days', 
          trend: 'down', 
          icon: 'schedule', 
          color: 'red' 
        }
      ],
      payrollTrend: {
        series: [{ name: 'Payroll Amount (₹)', data: [2650000, 2720000, 2580000, 2890000, 2750000, 2850000] }],
        categories: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      },
      departmentDistribution: {
        series: [111, 62, 37, 25, 12],
        labels: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance']
      }
    };

    return of(analytics);
  }
}