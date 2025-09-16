import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { RegisterComponent } from './components/auth/register.component';
import { LayoutComponent } from './shared/layout/layout.component';
import { EmployeeDashboardComponent } from './components/dashboard/employee-dashboard.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: EmployeeDashboardComponent },
      { path: 'payroll', loadComponent: () => import('./components/employee/payroll-list.component').then(m => m.PayrollListComponent) },
      { path: 'loans', loadComponent: () => import('./components/employee/loan-application.component').then(m => m.LoanApplicationComponent) },
      { path: 'reimbursements', loadComponent: () => import('./components/employee/reimbursement-form.component').then(m => m.ReimbursementFormComponent) },
      { path: 'insurance', loadComponent: () => import('./components/employee/insurance-enrollment.component').then(m => m.InsuranceEnrollmentComponent) },
      { path: 'medical-claims', loadComponent: () => import('./components/employee/medical-claim-form.component').then(m => m.MedicalClaimFormComponent) },
      { path: 'request-tracker', loadComponent: () => import('./components/employee/request-tracker.component').then(m => m.RequestTrackerComponent) },
      { path: 'approvals', loadComponent: () => import('./components/manager/approval-center.component').then(m => m.ApprovalCenterComponent) },
      { path: 'finance-approvals', loadComponent: () => import('./components/finance/finance-approvals.component').then(m => m.FinanceApprovalsComponent) },
      { path: 'reports', loadComponent: () => import('./components/finance/reports.component').then(m => m.ReportsComponent) }
    ]
  }
];