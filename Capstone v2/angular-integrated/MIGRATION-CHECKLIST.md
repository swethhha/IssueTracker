# Migration Checklist

If you want to update the original `angular` folder instead of using `angular-integrated`, follow this checklist:

## Files to Replace

### Core Application Files
- [ ] `src/environments/environment.ts` - Update API base URL
- [ ] `src/environments/environment.prod.ts` - Update production API URL
- [ ] `src/main.ts` - Add HTTP client and interceptor providers
- [ ] `src/app/app.component.ts` - Add HTTP client imports
- [ ] `src/app/app-routing.module.ts` - Replace with new routing configuration
- [ ] `package.json` - Update project name and scripts

### New Directories to Create
- [ ] `src/app/models/` - TypeScript interfaces for backend DTOs
- [ ] `src/app/services/` - Angular services for API communication
- [ ] `src/app/guards/` - Authentication and role guards
- [ ] `src/app/interceptors/` - HTTP interceptors
- [ ] `src/app/components/` - New feature components
- [ ] `src/app/tests/` - Unit tests
- [ ] `e2e/` - End-to-end tests

### Navigation Updates
- [ ] `src/app/theme/layout/admin/navigation/navigation.ts` - Replace navigation items

### New Files to Add

#### Models (src/app/models/)
- [ ] `auth.models.ts` - Authentication interfaces
- [ ] `payroll.models.ts` - Payroll and dashboard interfaces
- [ ] `loan.models.ts` - Loan management interfaces
- [ ] `reimbursement.models.ts` - Reimbursement interfaces
- [ ] `insurance.models.ts` - Insurance interfaces

#### Services (src/app/services/)
- [ ] `auth.service.ts` - Authentication service
- [ ] `dashboard.service.ts` - Dashboard data service
- [ ] `payroll.service.ts` - Payroll management service
- [ ] `loan.service.ts` - Loan management service
- [ ] `reimbursement.service.ts` - Reimbursement service

#### Guards (src/app/guards/)
- [ ] `auth.guard.ts` - Authentication guard
- [ ] `role.guard.ts` - Role-based access guard

#### Interceptors (src/app/interceptors/)
- [ ] `auth.interceptor.ts` - JWT token interceptor

#### Components (src/app/components/)
- [ ] `auth/login.component.ts` - Login component
- [ ] `dashboard/dashboard.component.ts` - Main dashboard
- [ ] `payroll/payroll-list.component.ts` - Payroll management
- [ ] `loans/loan-list.component.ts` - Loan management
- [ ] `reimbursements/reimbursement-list.component.ts` - Reimbursement management
- [ ] `insurance/insurance-list.component.ts` - Insurance placeholder
- [ ] `approvals/payroll-approvals.component.ts` - Payroll approvals
- [ ] `approvals/loan-approvals.component.ts` - Loan approvals
- [ ] `approvals/reimbursement-approvals.component.ts` - Reimbursement approvals

#### Tests (src/app/tests/)
- [ ] `auth.service.spec.ts` - Authentication service tests
- [ ] `payroll.service.spec.ts` - Payroll service tests

#### E2E Tests (e2e/)
- [ ] `login.e2e.spec.ts` - Login flow E2E test

#### Documentation
- [ ] `README.md` - Replace with new documentation
- [ ] `api-mapping.md` - Add API mapping documentation

## Configuration Changes

### Dependencies to Add
Add these to package.json dependencies (if not already present):
```json
{
  "@angular/common": "^17.0.0",
  "@angular/forms": "^17.0.0"
}
```

### Development Dependencies
Consider adding for testing:
```json
{
  "cypress": "^13.0.0",
  "@angular/testing": "^17.0.0"
}
```

## Step-by-Step Migration Process

1. **Backup Original**
   ```bash
   cp -r angular angular-backup
   ```

2. **Update Core Files**
   - Replace routing configuration
   - Update main.ts with providers
   - Update environment files

3. **Add New Directories**
   ```bash
   mkdir -p src/app/{models,services,guards,interceptors,components,tests}
   mkdir -p src/app/components/{auth,dashboard,payroll,loans,reimbursements,insurance,approvals}
   mkdir e2e
   ```

4. **Copy New Files**
   - Copy all model files
   - Copy all service files
   - Copy all component files
   - Copy guard and interceptor files

5. **Update Navigation**
   - Replace navigation.ts with new menu structure

6. **Test Migration**
   ```bash
   npm ci
   ng serve
   ```

7. **Run Tests**
   ```bash
   npm test
   npx cypress open
   ```

## Verification Checklist

After migration, verify:
- [ ] Application starts without errors
- [ ] Login page loads correctly
- [ ] Authentication works with demo credentials
- [ ] Dashboard displays after login
- [ ] Navigation menu shows payroll system items
- [ ] All routes are accessible based on user role
- [ ] API calls are made with proper authentication headers
- [ ] Logout functionality works
- [ ] Unit tests pass
- [ ] E2E tests pass

## Rollback Plan

If migration fails:
1. Stop the development server
2. Restore from backup:
   ```bash
   rm -rf angular
   mv angular-backup angular
   ```
3. Restart development server

## Notes

- The original template components are preserved and can be accessed if needed
- New components use standalone component architecture
- All styling from the original template is maintained
- The migration maintains backward compatibility with the existing theme