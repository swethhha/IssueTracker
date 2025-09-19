using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Payroll360.Core.DTOs
{
    public class LoanResponseDTO
    {
        public int LoanId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public string LoanType { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public int TenureMonths { get; set; }
        public string Purpose { get; set; } = string.Empty;
        public DateTime AppliedDate { get; set; }
        public decimal MonthlyInstallment { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public string? RejectedReason { get; set; }

        public bool? ManagerApproved { get; set; }
        public bool? FinanceApproved { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, ManagerApproved, FinanceApproved, Approved, Rejected, Active, Closed

        public List<DocumentAttachmentDTO> Documents { get; set; } = new();
    }
}

