using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payroll360.Core.Interfaces;
using System.Security.Claims;

namespace Payroll360.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    [ApiExplorerSettings(GroupName = "dashboard")]
    public class DashboardController : ControllerBase
    {
        private readonly IPayrollService _payrollService;
        private readonly ILoanService _loanService;
        private readonly IReimbursementService _reimbursementService;
        private readonly IInsuranceService _insuranceService;
        private readonly IMedicalClaimService _medicalClaimService;

        public DashboardController(
            IPayrollService payrollService,
            ILoanService loanService,
            IReimbursementService reimbursementService,
            IInsuranceService insuranceService,
            IMedicalClaimService medicalClaimService)
        {
            _payrollService = payrollService;
            _loanService = loanService;
            _reimbursementService = reimbursementService;
            _insuranceService = insuranceService;
            _medicalClaimService = medicalClaimService;
        }

        // ================= EMPLOYEE DASHBOARD =================
        [HttpGet("employee-stats")]
        [Authorize(Roles = "Employee,Manager")]
        public async Task<IActionResult> GetEmployeeStats()
        {
            var employeeId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var stats = new
            {
                TotalEarnings = await _payrollService.GetTotalEarningsAsync(employeeId),
                PendingRequests = await GetTotalPendingRequests(employeeId),
                RecentPayrolls = await _payrollService.GetRecentPayrollsAsync(employeeId, 3),
                PayrollHistory = await _payrollService.GetPayrollHistoryAsync(employeeId, 12),
                RequestSummary = await GetRequestSummary(employeeId)
            };

            return Ok(stats);
        }

        // ================= MANAGER DASHBOARD =================
        [HttpGet("manager-stats")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetManagerStats()
        {
            var managerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var stats = new
            {
                PendingPayroll = await _payrollService.GetPendingManagerApprovalsAsync(),
                PendingLoans = await _loanService.GetPendingManagerApprovalsAsync(),
                PendingReimbursements = await _reimbursementService.GetPendingManagerApprovalsAsync(),
                PendingInsurance = await _insuranceService.GetPendingManagerApprovalsAsync(),
                PendingMedicalClaims = await _medicalClaimService.GetPendingManagerApprovalsAsync(),
                TotalApprovalsThisMonth = await GetTotalApprovalsThisMonth(managerId),
                TeamSize = await GetTeamSize(managerId)
            };

            return Ok(stats);
        }

        [HttpGet("manager-approvals")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> GetManagerApprovals()
        {
            var managerId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var approvals = new
            {
                Payroll = await _payrollService.GetPendingManagerApprovals(),
                Loans = await _loanService.GetPendingManagerApprovalsAsync(managerId),
                Reimbursements = await _reimbursementService.GetPendingManagerApprovals(),
                Insurance = await _insuranceService.GetPendingManagerApprovals(),
                MedicalClaims = await _medicalClaimService.GetPendingManagerApprovals()
            };

            return Ok(approvals);
        }

        // ================= FINANCE DASHBOARD =================
        [HttpGet("finance-stats")]
        [Authorize(Roles = "FinanceAdmin")]
        public async Task<IActionResult> GetFinanceStats()
        {
            var financeId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var stats = new
            {
                TotalProcessedRequests = await GetTotalProcessedRequestsThisMonth(),
                PendingFinanceApprovals = await GetPendingFinanceApprovals(),
                TotalExpenses = await GetTotalExpensesThisMonth(),
                DepartmentCount = await GetDepartmentCount(),
                DepartmentWiseExpenses = await GetDepartmentWiseExpenses(),
                ExpenseCategories = await GetExpenseCategories()
            };

            return Ok(stats);
        }

        [HttpGet("finance-approvals")]
        [Authorize(Roles = "FinanceAdmin")]
        public async Task<IActionResult> GetFinanceApprovals()
        {
            var approvals = new
            {
                Payroll = await _payrollService.GetPendingFinanceApprovals(),
                Loans = await _loanService.GetPendingFinanceApprovals(),
                Reimbursements = await _reimbursementService.GetPendingFinanceApprovals(),
                Insurance = await _insuranceService.GetPendingFinanceApprovals(),
                MedicalClaims = await _medicalClaimService.GetPendingFinanceApprovals()
            };

            return Ok(approvals);
        }

        // ================= ADMIN DASHBOARD =================
        [HttpGet("admin-stats")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminStats()
        {
            var stats = new
            {
                TotalEmployees = await _payrollService.GetTotalEmployeesAsync(),
                TotalPayrolls = await _payrollService.GetTotalPayrollsAsync(),
                TotalLoans = await _loanService.GetTotalLoansAsync(),
                TotalReimbursements = await _reimbursementService.GetTotalReimbursementsAsync(),
                TotalInsurancePolicies = await _insuranceService.GetTotalPoliciesAsync(),
                TotalMedicalClaims = await _medicalClaimService.GetTotalClaimsAsync(),
                SystemHealth = await GetSystemHealth()
            };

            return Ok(stats);
        }

        // ================= HELPER METHODS =================
        private async Task<int> GetTotalPendingRequests(int employeeId)
        {
            var pendingLoans = await _loanService.GetPendingEmployeeCountAsync(employeeId);
            var pendingReimbursements = await _reimbursementService.GetPendingEmployeeCountAsync(employeeId);
            var pendingInsurance = await _insuranceService.GetPendingEmployeeCountAsync(employeeId);
            var pendingMedicalClaims = await _medicalClaimService.GetPendingEmployeeCountAsync(employeeId);
            
            return pendingLoans + pendingReimbursements + pendingInsurance + pendingMedicalClaims;
        }

        private async Task<object> GetRequestSummary(int employeeId)
        {
            return new
            {
                Approved = await GetApprovedCount(employeeId),
                Pending = await GetPendingCount(employeeId),
                Rejected = await GetRejectedCount(employeeId)
            };
        }

        private async Task<int> GetApprovedCount(int employeeId)
        {
            // Implementation to get approved requests count
            return 0;
        }

        private async Task<int> GetPendingCount(int employeeId)
        {
            // Implementation to get pending requests count
            return 0;
        }

        private async Task<int> GetRejectedCount(int employeeId)
        {
            // Implementation to get rejected requests count
            return 0;
        }

        private async Task<int> GetTotalApprovalsThisMonth(int managerId)
        {
            // Implementation to get total approvals this month
            return 0;
        }

        private async Task<int> GetTeamSize(int managerId)
        {
            // Implementation to get team size
            return 0;
        }

        private async Task<int> GetTotalProcessedRequestsThisMonth()
        {
            // Implementation to get total processed requests this month
            return 0;
        }

        private async Task<int> GetPendingFinanceApprovals()
        {
            var payroll = await _payrollService.GetPendingFinanceApprovalsAsync();
            var loans = await _loanService.GetPendingFinanceApprovalsAsync();
            var reimbursements = await _reimbursementService.GetPendingFinanceApprovalsAsync();
            var insurance = await _insuranceService.GetPendingFinanceApprovalsAsync();
            var medicalClaims = await _medicalClaimService.GetPendingFinanceApprovalsAsync();
            
            return payroll + loans + reimbursements + insurance + medicalClaims;
        }

        private async Task<decimal> GetTotalExpensesThisMonth()
        {
            // Implementation to get total expenses this month
            return 0;
        }

        private async Task<int> GetDepartmentCount()
        {
            // Implementation to get department count
            return 0;
        }

        private async Task<object> GetDepartmentWiseExpenses()
        {
            // Implementation to get department-wise expenses
            return new { };
        }

        private async Task<object> GetExpenseCategories()
        {
            // Implementation to get expense categories
            return new { };
        }

        private async Task<object> GetSystemHealth()
        {
            // Implementation to get system health metrics
            return new { };
        }
    }
}