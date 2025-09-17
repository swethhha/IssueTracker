import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DashAnalyticsComponent } from './demo/dashboard/dash-analytics.component';
import { LoanApplicationComponent } from './components/employee/loan-application.component';
import { ReimbursementFormComponent } from './components/employee/reimbursement-form.component';
import { MedicalClaimFormComponent } from './components/employee/medical-claim-form.component';
import { InsuranceEnrollmentComponent } from './components/employee/insurance-enrollment.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'loans/apply', 
    component: LoanApplicationComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'reimbursements/submit', 
    component: ReimbursementFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'medical-claims/submit', 
    component: MedicalClaimFormComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'insurance/enroll', 
    component: InsuranceEnrollmentComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'analytics', 
    component: DashAnalyticsComponent,
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }