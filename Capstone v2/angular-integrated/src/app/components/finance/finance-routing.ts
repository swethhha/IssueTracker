import { Routes } from '@angular/router';

export const financeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./finance-dashboard.component').then(m => m.FinanceDashboardComponent)
  },
  {
    path: 'payroll-approvals',
    loadComponent: () => import('./payroll-approvals.component').then(m => m.PayrollApprovalsComponent)
  },
  {
    path: 'loan-approvals',
    loadComponent: () => import('./loan-approvals.component').then(m => m.LoanApprovalsComponent)
  },
  {
    path: 'reimbursement-approvals',
    loadComponent: () => import('./reimbursement-approvals.component').then(m => m.ReimbursementApprovalsComponent)
  },
  {
    path: 'insurance-approvals',
    loadComponent: () => import('./insurance-approvals.component').then(m => m.InsuranceApprovalsComponent)
  },
  {
    path: 'medical-approvals',
    loadComponent: () => import('./medical-approvals.component').then(m => m.MedicalApprovalsComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./finance-reports.component').then(m => m.FinanceReportsComponent)
  },
  {
    path: 'apply-loan',
    loadComponent: () => import('../loans/loan-application.component').then(m => m.LoanApplicationComponent)
  },
  {
    path: 'apply-reimbursement',
    loadComponent: () => import('../reimbursements/reimbursement-application.component').then(m => m.ReimbursementApplicationComponent)
  }
];