import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { RoleGuard } from '../../guards/role.guard';
import { EmployeeRole } from '../../models/auth.models';

import { ReimbursementDashboardComponent } from './reimbursement-dashboard.component';
import { RequestReimbursementComponent } from './request-reimbursement.component';
import { MyReimbursementsComponent } from './my-reimbursements.component';
import { ManagerApprovalsComponent } from './manager-approvals.component';
import { FinanceApprovalsComponent } from './finance-approvals.component';

const routes: Routes = [
  {
    path: '',
    component: RequestReimbursementComponent,
    canActivate: [AuthGuard],
    data: { title: 'Request Reimbursement' }
  },
  {
    path: 'dashboard',
    component: ReimbursementDashboardComponent,
    canActivate: [AuthGuard],
    data: { title: 'Reimbursement Dashboard' }
  },
  {
    path: 'request',
    component: RequestReimbursementComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Request Reimbursement',
      roles: [EmployeeRole.Employee]
    }
  },
  {
    path: 'my-reimbursements',
    component: MyReimbursementsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'My Reimbursements',
      roles: [EmployeeRole.Employee]
    }
  },
  {
    path: 'manager-approvals',
    component: ManagerApprovalsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Manager Approvals',
      roles: [EmployeeRole.Manager]
    }
  },
  {
    path: 'finance-approvals',
    component: FinanceApprovalsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { 
      title: 'Finance Approvals',
      roles: [EmployeeRole.FinanceAdmin]
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReimbursementRoutingModule { }