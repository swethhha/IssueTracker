import { Component, viewChild } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dash-analytics',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './dash-analytics.component.html',
  styleUrls: ['./dash-analytics.component.scss']
})
export class DashAnalyticsComponent {
  chart = viewChild<ChartComponent>('chart');
  
  // KPI Cards
  kpiCards = [
    { title: 'Total Employees', value: '1,247', change: '+12%', trend: 'up', icon: 'people', color: 'blue' },
    { title: 'Monthly Payroll', value: '$2.4M', change: '+8%', trend: 'up', icon: 'payments', color: 'green' },
    { title: 'Active Loans', value: '89', change: '-5%', trend: 'down', icon: 'account_balance_wallet', color: 'orange' },
    { title: 'Pending Claims', value: '23', change: '+15%', trend: 'up', icon: 'receipt_long', color: 'red' }
  ];

  // Monthly Payroll Trend
  payrollTrendOptions: Partial<ApexOptions> = {
    chart: { height: 300, type: 'area', toolbar: { show: false } },
    series: [{ name: 'Payroll Amount', data: [2100000, 2200000, 2150000, 2300000, 2250000, 2400000] }],
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
    colors: ['#4f46e5'],
    fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 } },
    stroke: { curve: 'smooth', width: 3 },
    dataLabels: { enabled: false }
  };

  // Department Distribution
  departmentOptions: Partial<ApexOptions> = {
    chart: { height: 300, type: 'donut' },
    series: [320, 280, 190, 150, 120, 87],
    labels: ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations'],
    colors: ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    legend: { position: 'bottom' },
    dataLabels: { enabled: true, formatter: (val: any) => Math.round(val) + '%' }
  };

  // Weekly Activity
  weeklyActivityOptions: Partial<ApexOptions> = {
    chart: { height: 250, type: 'bar', toolbar: { show: false } },
    series: [
      { name: 'Loan Applications', data: [12, 8, 15, 10, 18, 14, 9] },
      { name: 'Reimbursements', data: [8, 12, 10, 14, 12, 16, 11] }
    ],
    xaxis: { categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    colors: ['#4f46e5', '#06b6d4'],
    plotOptions: { bar: { borderRadius: 4, columnWidth: '60%' } },
    dataLabels: { enabled: false }
  };

  // Approval Status
  approvalStatusOptions: Partial<ApexOptions> = {
    chart: { height: 200, type: 'radialBar' },
    series: [75, 60, 45],
    labels: ['Loans', 'Claims', 'Reimbursements'],
    colors: ['#10b981', '#f59e0b', '#ef4444'],
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: { fontSize: '14px' },
          value: { fontSize: '16px', formatter: (val: any) => val + '%' }
        }
      }
    }
  };

  // Recent Activities
  recentActivities = [
    { user: 'John Doe', action: 'Applied for loan', amount: '$15,000', time: '2 hours ago', status: 'pending' },
    { user: 'Sarah Wilson', action: 'Submitted reimbursement', amount: '$450', time: '4 hours ago', status: 'approved' },
    { user: 'Mike Johnson', action: 'Medical claim processed', amount: '$1,200', time: '6 hours ago', status: 'completed' },
    { user: 'Emily Davis', action: 'Payroll generated', amount: '$85,000', time: '1 day ago', status: 'completed' }
  ];

  // Top Performers
  topPerformers = [
    { name: 'Alice Cooper', department: 'Engineering', score: 98, avatar: 'AC' },
    { name: 'Bob Smith', department: 'Sales', score: 95, avatar: 'BS' },
    { name: 'Carol White', department: 'Marketing', score: 92, avatar: 'CW' },
    { name: 'David Brown', department: 'Finance', score: 89, avatar: 'DB' }
  ];

  selectedPeriod = 'monthly';
  
  onPeriodChange(period: string) {
    this.selectedPeriod = period;
  }
}