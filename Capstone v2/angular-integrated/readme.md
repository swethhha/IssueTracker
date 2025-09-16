# Payroll360 - Employee Self-Service Portal

A comprehensive payroll management system with role-based dashboards and approval workflows.

## Features

### 🔹 Employee Role (Self-service Portal)
- **Dashboard**: Recent payrolls, pending approvals, notifications
- **Payroll**: View salary slips, download payslips as PDF
- **Loans**: Apply for loans with document upload (Aadhaar/PAN, salary slips, bank statements)
- **Reimbursements**: Submit reimbursement requests with receipt uploads
- **Insurance**: View available policies, enroll in policies
- **Medical Claims**: Submit medical claims with hospital bills and prescriptions

### 🔹 Manager Role (Dual: Applicant + Approver)
- **Dashboard**: Pending approvals overview with charts and trends
- **Employee Services**: Same as Employee role (can apply for benefits)
- **Management Approvals**: 
  - Payroll approvals for direct reports
  - Loan approvals with document verification
  - Reimbursement approvals
  - Insurance & Medical claims approvals
- **Special Rule**: Managers cannot self-approve (requests go to Finance)

### 🔹 Finance Role
- **Dashboard**: Financial metrics and pending approvals overview
- **Final Approvals**: Review manager-approved requests
- **Document Verification**: Validate attached documents
- **Reports**: Generate monthly/quarterly financial reports
- **Policy Compliance**: Ensure all transactions meet policy requirements

### 🔹 Admin Role
- **Dashboard**: Organization-wide statistics and system health
- **User Management**: Add/edit employees, assign roles
- **Policy Management**: Manage insurance policies and claim categories
- **Audit & Compliance**: Access logs, SLA compliance tracking
- **System Reports**: Export comprehensive system reports

## Technology Stack

- **Frontend**: Angular 17+ with Standalone Components
- **Styling**: Custom CSS with AssetDesk design system
- **Backend**: .NET Core Web API
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: JWT tokens with role-based access control

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- .NET 8 SDK
- SQL Server (LocalDB or full instance)

### Backend Setup
1. Navigate to the API project:
   ```bash
   cd "Capstone v2/Payroll/Payroll360.API"
   ```

2. Update connection string in `appsettings.json`

3. Run database migrations:
   ```bash
   dotnet ef database update
   ```

4. Start the API:
   ```bash
   dotnet run
   ```

### Frontend Setup
1. Navigate to the Angular project:
   ```bash
   cd "Capstone v2/angular-integrated"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   ng serve
   ```

4. Open browser to `http://localhost:4200`

## Demo Accounts

### Employee
- **Email**: employee@payroll360.com
- **Password**: Employee@123

### Manager
- **Email**: manager@payroll360.com
- **Password**: Manager@123

### Finance Admin
- **Email**: finance@payroll360.com
- **Password**: Finance@123

### System Admin
- **Email**: admin@payroll360.com
- **Password**: Admin@123

## API Endpoints

### Authentication
- `POST /api/Auth/login` - User login
- `POST /api/Auth/register` - User registration

### Payroll
- `GET /api/Payroll/my-payrolls` - Get employee payrolls
- `GET /api/Payroll/summary` - Get payroll summary
- `POST /api/Payroll/{id}/approve-manager` - Manager approval
- `POST /api/Payroll/{id}/approve-finance` - Finance approval

### Loans
- `POST /api/Loans/apply` - Apply for loan
- `GET /api/Loans/my` - Get employee loans
- `GET /api/Loans/pending-manager` - Pending manager approvals
- `POST /api/Loans/{id}/approve` - Approve loan

### Reimbursements
- `POST /api/Reimbursements` - Submit reimbursement
- `GET /api/Reimbursements/my` - Get employee reimbursements
- `GET /api/Reimbursements/pending-manager` - Pending approvals

### Insurance & Medical Claims
- `GET /api/Insurance/policies` - Available policies
- `POST /api/Insurance/enroll` - Enroll in policy
- `POST /api/MedicalClaims/request` - Submit medical claim

## Workflow Process

1. **Employee** submits request (Loan/Reimbursement/Insurance/Medical Claim)
2. **System** stores in database and sends notification to Manager
3. **Manager** reviews and approves/rejects (except own requests → Finance)
4. **Finance** performs final verification and approval
5. **System** updates status and processes disbursement
6. **Admin** oversees entire process and manages policies

## Key Features

- ✅ Role-based dashboards with real-time metrics
- ✅ Document upload with validation (PDF/JPG/PNG, max 5MB)
- ✅ Two-level approval workflow (Manager → Finance)
- ✅ EMI calculator for loan applications
- ✅ Receipt management for reimbursements
- ✅ Policy compliance and audit trails
- ✅ Responsive design with AssetDesk styling
- ✅ Real-time notifications
- ✅ Comprehensive reporting system

## Project Structure

```
angular-integrated/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── loans/
│   │   │   ├── reimbursements/
│   │   │   └── shared/
│   │   ├── services/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── models/
│   ├── styles.scss
│   └── index.html
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.