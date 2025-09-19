import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashAnalyticsComponent } from './demo/dashboard/dash-analytics.component';
import { LoanApplicationComponent } from './components/employee/loan-application.component';
import { ReimbursementFormComponent } from './components/employee/reimbursement-form.component';
import { MedicalClaimFormComponent } from './components/employee/medical-claim-form.component';
import { InsuranceEnrollmentComponent } from './components/employee/insurance-enrollment.component';
import { RequestWorkflowComponent } from './components/workflow/request-workflow.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  // Employee/Manager routes
  { 
    path: 'loans/apply', 
    component: LoanApplicationComponent,
    canActivate: [AuthGuard]
  },
  // Finance routes (same components but role-based views)
  { 
    path: 'loans', 
    component: LoanApplicationComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reimbursements/submit', 
    component: ReimbursementFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reimbursements', 
    component: ReimbursementFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'medical-claims/submit', 
    component: MedicalClaimFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'medical-claims', 
    component: MedicalClaimFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'insurance/enroll', 
    component: InsuranceEnrollmentComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'insurance', 
    component: InsuranceEnrollmentComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'payroll', 
    component: LoanApplicationComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'analytics', 
    component: DashAnalyticsComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'workflow', 
    component: RequestWorkflowComponent,
    canActivate: [AuthGuard]
  },
  // Finance-specific routes
  { 
    path: 'finance/dashboard', 
    loadComponent: () => import('./components/dashboard/finance-dashboard.component').then(m => m.FinanceDashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'finance/approvals', 
    loadComponent: () => import('./components/finance/finance-dashboard.component').then(m => m.FinanceDashboardComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'finance/reports', 
    loadComponent: () => import('./components/finance/modern-reports.component').then(m => m.ModernReportsComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'approvals', 
    component: RequestWorkflowComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }