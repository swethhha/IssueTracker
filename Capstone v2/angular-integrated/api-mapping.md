# API Mapping Documentation

This document maps backend API endpoints to frontend implementation files.

## Authentication Endpoints

| Method | Backend Endpoint | Frontend Service | Frontend Component | Models Used |
|--------|------------------|------------------|-------------------|-------------|
| POST | `/api/auth/login` | `AuthService.login()` | `LoginComponent` | `LoginRequest`, `AuthResponse` |
| POST | `/api/auth/register` | `AuthService.register()` | `LoginComponent` | `RegisterRequest` |

**Files:**
- Service: `src/app/services/auth.service.ts`
- Component: `src/app/components/auth/login.component.ts`
- Models: `src/app/models/auth.models.ts`
- Guard: `src/app/guards/auth.guard.ts`
- Interceptor: `src/app/interceptors/auth.interceptor.ts`

## Dashboard Endpoints

| Method | Backend Endpoint | Frontend Service | Frontend Component | Models Used |
|--------|------------------|------------------|-------------------|-------------|
| GET | `/api/dashboard` | `DashboardService.getDashboard()` | `DashboardComponent` | `Dashboard`, `Notification` |

**Files:**
- Service: `src/app/services/dashboard.service.ts`
- Component: `src/app/components/dashboard/dashboard.component.ts`
- Models: `src/app/models/payroll.models.ts`

## Payroll Endpoints

| Method | Backend Endpoint | Frontend Service | Frontend Component | Models Used |
|--------|------------------|------------------|-------------------|-------------|
| GET | `/api/payroll/my-payrolls` | `PayrollService.getMyPayrolls()` | `PayrollListComponent` | `PayrollResponse` |
| GET | `/api/payroll/summary` | `PayrollService.getPayrollSummary()` | `DashboardComponent` | `PayrollSummary` |
| POST | `/api/payroll/{id}/approve-manager` | `PayrollService.approveByManager()` | `PayrollListComponent` | - |
| POST | `/api/payroll/{id}/reject-manager` | `PayrollService.rejectByManager()` | `PayrollListComponent` | - |
| POST | `/api/payroll/{id}/approve-finance` | `PayrollService.approveByFinance()` | `PayrollListComponent` | - |
| POST | `/api/payroll/{id}/reject-finance` | `PayrollService.rejectByFinance()` | `PayrollListComponent` | - |
| GET | `/api/payroll/pending-manager` | `PayrollService.getPendingManagerApprovals()` | `DashboardComponent` | - |
| GET | `/api/payroll/pending-finance` | `PayrollService.getPendingFinanceApprovals()` | `DashboardComponent` | - |
| GET | `/api/payroll/total-employees` | `PayrollService.getTotalEmployees()` | `DashboardComponent` | - |
| GET | `/api/payroll/total-payrolls` | `PayrollService.getTotalPayrolls()` | `DashboardComponent` | - |

**Files:**
- Service: `src/app/services/payroll.service.ts`
- Component: `src/app/components/payroll/payroll-list.component.ts`
- Models: `src/app/models/payroll.models.ts`

## Loan Endpoints

| Method | Backend Endpoint | Frontend Service | Frontend Component | Models Used |
|--------|------------------|------------------|-------------------|-------------|
| GET | `/api/loans` | `LoanService.getAllLoans()` | `LoanListComponent` | `LoanResponse` |
| GET | `/api/loans/{id}` | `LoanService.getLoanById()` | `LoanListComponent` | `LoanResponse` |
| POST | `/api/loans` | `LoanService.applyForLoan()` | `LoanListComponent` | `LoanRequest`, `LoanResponse` |
| PUT | `/api/loans/{id}/manager-approve` | `LoanService.approveByManager()` | `LoanListComponent` | - |
| PUT | `/api/loans/{id}/manager-reject` | `LoanService.rejectByManager()` | `LoanListComponent` | - |
| PUT | `/api/loans/{id}/finance-approve` | `LoanService.approveByFinance()` | `LoanListComponent` | - |
| PUT | `/api/loans/{id}/finance-reject` | `LoanService.rejectByFinance()` | `LoanListComponent` | - |

**Files:**
- Service: `src/app/services/loan.service.ts`
- Component: `src/app/components/loans/loan-list.component.ts`
- Models: `src/app/models/loan.models.ts`

## Reimbursement Endpoints

| Method | Backend Endpoint | Frontend Service | Frontend Component | Models Used |
|--------|------------------|------------------|-------------------|-------------|
| POST | `/api/reimbursements/request` | `ReimbursementService.requestReimbursement()` | `ReimbursementListComponent` | `ReimbursementRequest`, `ReimbursementResponse` |
| GET | `/api/reimbursements/my` | `ReimbursementService.getMyReimbursements()` | `ReimbursementListComponent` | `ReimbursementResponse` |
| POST | `/api/reimbursements/{id}/approve-manager` | `ReimbursementService.approveByManager()` | `ReimbursementListComponent` | - |
| POST | `/api/reimbursements/{id}/reject-manager` | `ReimbursementService.rejectByManager()` | `ReimbursementListComponent` | - |
| POST | `/api/reimbursements/{id}/approve-finance` | `ReimbursementService.approveByFinance()` | `ReimbursementListComponent` | - |
| POST | `/api/reimbursements/{id}/reject-finance` | `ReimbursementService.rejectByFinance()` | `ReimbursementListComponent` | - |
| GET | `/api/reimbursements/pending-manager-count` | `ReimbursementService.getPendingManagerCount()` | `DashboardComponent` | - |
| GET | `/api/reimbursements/pending-finance-count` | `ReimbursementService.getPendingFinanceCount()` | `DashboardComponent` | - |
| GET | `/api/reimbursements/my-pending-count` | `ReimbursementService.getMyPendingCount()` | `DashboardComponent` | - |
| GET | `/api/reimbursements/total` | `ReimbursementService.getTotalReimbursements()` | `DashboardComponent` | - |

**Files:**
- Service: `src/app/services/reimbursement.service.ts`
- Component: `src/app/components/reimbursements/reimbursement-list.component.ts`
- Models: `src/app/models/reimbursement.models.ts`

## Insurance Endpoints

| Method | Backend Endpoint | Frontend Service | Frontend Component | Models Used |
|--------|------------------|------------------|-------------------|-------------|
| GET | `/api/insurance` | Not implemented | `InsuranceListComponent` | `InsurancePolicyResponse` |
| POST | `/api/insurance/enroll` | Not implemented | `InsuranceListComponent` | `InsuranceEnrollmentRequest` |
| GET | `/api/insurance/total-policies` | Not implemented | `DashboardComponent` | - |
| GET | `/api/insurance/active-count` | Not implemented | `DashboardComponent` | - |

**Files:**
- Service: Not created (placeholder needed)
- Component: `src/app/components/insurance/insurance-list.component.ts` (placeholder)
- Models: `src/app/models/insurance.models.ts`

## JWT Token Claims Mapping

The frontend extracts user information from JWT token claims:

| Backend Claim | Frontend Property | Usage |
|---------------|-------------------|-------|
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier` | `User.id` | Employee ID for API calls |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name` | `User.fullName` | Display name |
| `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress` | `User.email` | Email address |
| `http://schemas.microsoft.com/ws/2008/06/identity/claims/role` | `User.role` | Role-based access control |
| `Department` | `User.department` | Department information |

## Route Guards Implementation

| Route Pattern | Guard | Required Roles | Implementation |
|---------------|-------|----------------|----------------|
| `/dashboard` | `AuthGuard` | Any authenticated user | `src/app/guards/auth.guard.ts` |
| `/payroll` | `AuthGuard` | Any authenticated user | `src/app/guards/auth.guard.ts` |
| `/loans` | `AuthGuard` | Any authenticated user | `src/app/guards/auth.guard.ts` |
| `/reimbursements` | `AuthGuard` | Any authenticated user | `src/app/guards/auth.guard.ts` |
| `/approvals/*` | `AuthGuard` + `RoleGuard` | Manager, FinanceAdmin | `src/app/guards/role.guard.ts` |

## Error Handling

| HTTP Status | Frontend Handling | Implementation |
|-------------|-------------------|----------------|
| 401 Unauthorized | Redirect to login | `AuthInterceptor` |
| 403 Forbidden | Show access denied message | Component level |
| 404 Not Found | Show not found message | Component level |
| 500 Server Error | Show generic error message | Component level |

## Environment Configuration

| Environment | API Base URL | File |
|-------------|--------------|------|
| Development | `https://localhost:7001/api` | `src/environments/environment.ts` |
| Production | `https://your-production-api.com/api` | `src/environments/environment.prod.ts` |

## Missing Backend APIs (Identified Gaps)

The following functionality may require additional backend endpoints:

1. **Bulk Operations**: Bulk approve/reject for managers
2. **Advanced Filtering**: Server-side filtering and pagination
3. **File Upload**: Document attachment endpoints
4. **Notifications**: Mark as read/unread endpoints
5. **User Profile**: Update profile information
6. **Password Reset**: Forgot password functionality
7. **Audit Logs**: Detailed approval history
8. **Reports**: Export functionality for reports

## Frontend-Only Features

These features are implemented client-side and don't require backend changes:

1. **Client-side Validation**: Form validation before API calls
2. **Local Storage**: JWT token management
3. **Route Protection**: Role-based navigation
4. **UI State Management**: Loading states, error messages
5. **Responsive Design**: Mobile-friendly layouts
6. **Theme Customization**: CSS/SCSS styling