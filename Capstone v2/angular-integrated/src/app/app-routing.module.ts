import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashAnalyticsComponent } from './demo/dashboard/dash-analytics.component';
import { LoanApprovalsComponent } from './components/finance/loan-approvals.component';
import { ReimbursementApprovalsComponent } from './components/finance/reimbursement-approvals.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'analytics', component: DashAnalyticsComponent },
  { path: 'finance/loan-approvals', component: LoanApprovalsComponent },
  { path: 'finance/reimbursement-approvals', component: ReimbursementApprovalsComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }