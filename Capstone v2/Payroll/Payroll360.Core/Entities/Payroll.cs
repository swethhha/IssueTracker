using Payroll360.Core.Enums;
using System;
using System.Collections.Generic;

namespace Payroll360.Core.Entities
{
    public class Payroll
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public decimal BasicSalary { get; set; }
        public decimal Allowances { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetSalary { get; set; }
        public DateTime PeriodStart { get; set; }
        public DateTime PeriodEnd { get; set; }
        public DateTime? PaymentDate { get; set; }

        public bool? ManagerApproved { get; set; }
        public int? ManagerId { get; set; }
        public string? ManagerComments { get; set; }

        public bool? FinanceApproved { get; set; }
        public int? FinanceId { get; set; }
        public string? FinanceComments { get; set; }

        public PayrollStatus Status { get; set; } = PayrollStatus.PendingManagerApproval;

        // Navigation
        public Employee Employee { get; set; } = null!;
        public ICollection<ApprovalHistory> ApprovalHistory { get; set; } = new List<ApprovalHistory>();
        public ICollection<DocumentAttachment> Documents { get; set; } = new List<DocumentAttachment>();
    }
}
