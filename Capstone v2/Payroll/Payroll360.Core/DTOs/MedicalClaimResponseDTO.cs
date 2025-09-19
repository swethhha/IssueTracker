using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Payroll360.Core.DTOs
{
    public class MedicalClaimResponseDTO
    {
        public int ClaimId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeName { get; set; } = string.Empty;
        public int PolicyId { get; set; }
        public decimal ClaimAmount { get; set; }
        public decimal ApprovedAmount { get; set; }
        public DateTime ClaimDate { get; set; }
        public string HospitalName { get; set; } = string.Empty;
        public string TreatmentType { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }

        public bool? ManagerApproved { get; set; }
        public bool? FinanceApproved { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, ManagerApproved, FinanceApproved, Approved, Rejected, Paid

        public DateTime ProcessedDate { get; set; }
        public List<DocumentAttachmentDTO> Documents { get; set; } = new();
    }
}
