using Microsoft.EntityFrameworkCore;
using Payroll360.Core.DTOs;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;
using System.Threading.Tasks;

namespace Payroll360.Application.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly IPayrollService _payrollService;
        private readonly ILoanService _loanService;
        private readonly IReimbursementService _reimbursementService;
        private readonly IInsuranceService _insuranceService;
        private readonly INotificationService _notificationService;
        private readonly Payroll360Context _context;

        public DashboardService(
            IPayrollService payrollService,
            ILoanService loanService,
            IReimbursementService reimbursementService,
            IInsuranceService insuranceService,
            INotificationService notificationService,
            Payroll360Context context)
        {
            _payrollService = payrollService;
            _loanService = loanService;
            _reimbursementService = reimbursementService;
            _insuranceService = insuranceService;
            _notificationService = notificationService;
            _context = context;
        }

        public async Task<DashboardDTO> GetDashboardAsync(int employeeId, string role)
        {
            var employee = await _context.Employees.FirstOrDefaultAsync(e => e.Id == employeeId);
            if (employee == null)
                throw new ArgumentException("Invalid employee ID.");

            var dashboard = new DashboardDTO
            {
                Role = role,
                EmployeeId = employeeId,
                EmployeeName = employee.FullName
            };

            // Employee-specific
            if (role == "Employee")
            {
                dashboard.TotalEarnings = await _payrollService.GetTotalEarningsAsync(employeeId);
                dashboard.TotalNetPay = await _payrollService.GetTotalNetPayAsync(employeeId);
                dashboard.PendingReimbursementsCount = await _reimbursementService.GetPendingEmployeeReimbursementsCount(employeeId);
                dashboard.ActiveLoansCount = await _loanService.GetActiveLoansCountAsync(employeeId);
                dashboard.ActivePoliciesCount = await _insuranceService.GetActivePoliciesCountAsync(employeeId);
                dashboard.UnreadNotificationsCount = await _notificationService.GetUnreadNotificationsCountAsync(employeeId);
            }

            // Manager-specific
            if (role == "Manager")
            {
                dashboard.PendingPayrollApprovals = await _payrollService.GetPendingManagerApprovalsAsync();
                dashboard.PendingReimbursementApprovals = await _reimbursementService.GetPendingManagerApprovalsAsync();
                dashboard.PendingLoanApprovals = await _loanService.GetPendingManagerApprovalsAsync();
                
                // Manager also sees admin totals
                dashboard.TotalEmployees = await _payrollService.GetTotalEmployeesAsync();
                dashboard.TotalPayrolls = await _payrollService.GetTotalPayrollsAsync();
                dashboard.TotalReimbursements = await _reimbursementService.GetTotalReimbursementsAsync();
                dashboard.TotalLoans = await _loanService.GetTotalLoansAsync();
                dashboard.TotalPolicies = await _insuranceService.GetTotalPoliciesAsync();
            }

            // Finance-specific
            if (role == "FinanceAdmin")
            {
                dashboard.PendingPayrollFinanceApprovals = await _payrollService.GetPendingFinanceApprovalsAsync();
                dashboard.PendingReimbursementFinanceApprovals = await _reimbursementService.GetPendingFinanceApprovalsAsync();
                dashboard.PendingLoanFinanceApprovals = await _loanService.GetPendingFinanceApprovalsAsync();
                
                // FinanceAdmin also sees admin totals
                dashboard.TotalEmployees = await _payrollService.GetTotalEmployeesAsync();
                dashboard.TotalPayrolls = await _payrollService.GetTotalPayrollsAsync();
                dashboard.TotalReimbursements = await _reimbursementService.GetTotalReimbursementsAsync();
                dashboard.TotalLoans = await _loanService.GetTotalLoansAsync();
                dashboard.TotalPolicies = await _insuranceService.GetTotalPoliciesAsync();
            }

            // Admin-specific
            if (role == "Admin")
            {
                dashboard.TotalEmployees = await _payrollService.GetTotalEmployeesAsync();
                dashboard.TotalPayrolls = await _payrollService.GetTotalPayrollsAsync();
                dashboard.TotalReimbursements = await _reimbursementService.GetTotalReimbursementsAsync();
                dashboard.TotalLoans = await _loanService.GetTotalLoansAsync();
                dashboard.TotalPolicies = await _insuranceService.GetTotalPoliciesAsync();
            }

            // Notifications (for all roles)
            dashboard.Notifications = await _notificationService.GetNotificationsAsync(employeeId);

            return dashboard;
        }
    }
}
