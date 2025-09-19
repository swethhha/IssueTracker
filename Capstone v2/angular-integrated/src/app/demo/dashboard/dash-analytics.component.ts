import { Component, viewChild, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/theme/shared/shared.module';
import { ApexOptions, ChartComponent, NgApexchartsModule } from 'ng-apexcharts';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-dash-analytics',
  imports: [SharedModule, NgApexchartsModule],
  templateUrl: './dash-analytics.component.html',
  styleUrls: ['./dash-analytics.component.scss']
})
export class DashAnalyticsComponent implements OnInit {
  chart = viewChild<ChartComponent>('chart');
  
  // KPI Cards - Will be loaded from service
  kpiCards: any[] = [];

  // Monthly Payroll Trend - Updated with realistic data
  payrollTrendOptions: Partial<ApexOptions> = {
    chart: { height: 300, type: 'area', toolbar: { show: false } },
    series: [{ name: 'Payroll Amount (₹)', data: [2650000, 2720000, 2580000, 2890000, 2750000, 2850000] }],
    xaxis: { categories: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
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

  // Recent Activities - Updated with real data
  recentActivities = [
    { user: 'John Doe', action: 'Applied for personal loan', amount: '₹500,000', time: '2 hours ago', status: 'pending' },
    { user: 'Sarah Wilson', action: 'Submitted travel reimbursement', amount: '₹2,500', time: '4 hours ago', status: 'approved' },
    { user: 'Mike Johnson', action: 'Insurance enrollment approved', amount: '₹25,000', time: '6 hours ago', status: 'completed' },
    { user: 'Jane Smith', action: 'Payroll processed', amount: '₹69,800', time: '1 day ago', status: 'completed' },
    { user: 'David Brown', action: 'Reimbursement rejected', amount: '₹1,200', time: '2 days ago', status: 'rejected' }
  ];

  // Top Performers
  topPerformers = [
    { name: 'Alice Cooper', department: 'Engineering', score: 98, avatar: 'AC' },
    { name: 'Bob Smith', department: 'Sales', score: 95, avatar: 'BS' },
    { name: 'Carol White', department: 'Marketing', score: 92, avatar: 'CW' },
    { name: 'David Brown', department: 'Finance', score: 89, avatar: 'DB' }
  ];

  selectedPeriod = 'monthly';
  
  constructor(private analyticsService: AnalyticsService) {}
  
  ngOnInit() {
    this.loadAnalyticsData();
  }
  
  loadAnalyticsData() {
    this.analyticsService.getAnalyticsData().subscribe(data => {
      this.kpiCards = data.kpis;
      
      // Update chart data
      this.payrollTrendOptions = {
        ...this.payrollTrendOptions,
        series: data.payrollTrend.series,
        xaxis: { categories: data.payrollTrend.categories }
      };
      
      this.departmentOptions = {
        ...this.departmentOptions,
        series: data.departmentDistribution.series,
        labels: data.departmentDistribution.labels
      };
    });
  }
  
  onPeriodChange(period: string) {
    this.selectedPeriod = period;
    this.loadAnalyticsData();
  }
}