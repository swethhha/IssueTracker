import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Interceptors
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

// Services
import { AuthService } from './services/auth.service';
import { PayrollService } from './services/payroll.service';
import { LoanService } from './services/loan.service';
import { ReimbursementService } from './services/reimbursement.service';
import { InsuranceService } from './services/insurance.service';
import { MedicalClaimService } from './services/medical-claim.service';
import { NotificationService } from './services/notification.service';
import { DashboardService } from './services/dashboard.service';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppComponent
  ],
  providers: [
    // HTTP Interceptors
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    
    // Guards
    AuthGuard,
    RoleGuard,
    
    // Services
    AuthService,
    PayrollService,
    LoanService,
    ReimbursementService,
    InsuranceService,
    MedicalClaimService,
    NotificationService,
    DashboardService
  ],
  bootstrap: []
})
export class AppModule { }