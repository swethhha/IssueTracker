using System;
using System.Collections.Generic;
using Payroll360.Core.Enums;

namespace Payroll360.Core.Entities
{
    public class MedicalClaim
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime RequestedDate { get; set; }
        public DateTime ClaimDate { get; set; }
        public string HospitalName { get; set; } = string.Empty;
        public string TreatmentType { get; set; } = string.Empty;
        public ClaimStatus Status { get; set; } = ClaimStatus.PendingManagerApproval;

        // Approval workflow
        public bool? ManagerApproved { get; set; }
        public int? ManagerId { get; set; }
        public string? ManagerComments { get; set; }

        public bool? FinanceApproved { get; set; }
        public int? FinanceId { get; set; }
        public string? FinanceComments { get; set; }

        // Navigation
        public Employee? Employee { get; set; }
        public ICollection<ApprovalHistory> ApprovalHistory { get; set; } = new List<ApprovalHistory>();
        public ICollection<DocumentAttachment> Documents { get; set; } = new List<DocumentAttachment>();
    }
}
