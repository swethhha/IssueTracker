using Payroll360.Core.Enums;
using System;
using System.Collections.Generic;

namespace Payroll360.Core.Entities
{
    public class Loan
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string LoanType { get; set; } = string.Empty; // Personal, Education, Medical, Emergency, Home
        public decimal Amount { get; set; }
        public int TenureMonths { get; set; }
        public string Purpose { get; set; } = string.Empty;
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
        public LoanStatus Status { get; set; } = LoanStatus.ManagerApprovedFinancePending;
        public DateTime IssueDate { get; set; }
        public DateTime? RepaymentDate { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string? RejectedReason { get; set; }

        public bool? ManagerApproved { get; set; }
        public int? ManagerId { get; set; }
        public string? ManagerComments { get; set; }

        public bool? FinanceApproved { get; set; }
        public int? FinanceId { get; set; }
        public string? FinanceComments { get; set; }

        // Navigation
        public Employee Employee { get; set; } = null!;
        public ICollection<DocumentAttachment> Documents { get; set; } = new List<DocumentAttachment>();
        public ICollection<LoanDocument> LoanDocuments { get; set; } = new List<LoanDocument>();
    }
}
