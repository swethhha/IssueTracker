using System.Collections.Generic;

namespace Payroll360.Core.DTOs
{
    public class DashboardDTO
    {
        public string Role { get; set; } = string.Empty;
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;

        // Employee-specific
        public decimal TotalEarnings { get; set; }
        public decimal TotalNetPay { get; set; }
        public int PendingReimbursementsCount { get; set; }
        public int ActiveLoansCount { get; set; }
        public int ActivePoliciesCount { get; set; }
        public int UnreadNotificationsCount { get; set; }

        // Manager-specific (only for Manager role)
        public int? PendingPayrollApprovals { get; set; }
        public int? PendingReimbursementApprovals { get; set; }
        public int? PendingLoanApprovals { get; set; }

        // Finance-specific (only for FinanceAdmin role)
        public int? PendingPayrollFinanceApprovals { get; set; }
        public int? PendingReimbursementFinanceApprovals { get; set; }
        public int? PendingLoanFinanceApprovals { get; set; }

        // Admin-specific (only for Admin role)
        public int? TotalEmployees { get; set; }
        public int? TotalPayrolls { get; set; }
        public int? TotalReimbursements { get; set; }
        public int? TotalLoans { get; set; }
        public int? TotalPolicies { get; set; }

        // Notifications
        public IEnumerable<NotificationDTO> Notifications { get; set; } = new List<NotificationDTO>();
    }
}
