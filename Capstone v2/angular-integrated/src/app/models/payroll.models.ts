export interface PayrollRequest {
  employeeId: number;
  baseSalary: number;
  allowances: number;
  deductions: number;
  month: Date;
}

export interface PayrollResponse {
  id: number;
  employeeId: number;
  employeeName: string;
  baseSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  payPeriodStart: Date;
  payPeriodEnd: Date;
  status: string;
  generatedDate: Date;
}

export interface PayrollSummary {
  totalEmployees: number;
  totalPayrolls: number;
  totalAmount: number;
  month: string;
}

export interface Dashboard {
  totalEmployees: number;
  totalPayrolls: number;
  totalEarnings: number;
  totalNetPay: number;
  pendingReimbursementsCount: number;
  activeLoansCount: number;
  pendingPayrollApprovals: number;
  pendingReimbursementApprovals: number;
  pendingLoanApprovals: number;
  pendingPayrollFinanceApprovals: number;
  role: string;
  employeeId: number;
  employeeName: string;
  activePoliciesCount: number;
  unreadNotificationsCount: number;
  notifications: any[];
}