namespace Payroll360.Core.Entities
{
    public class DocumentAttachment
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public string FileType { get; set; } = string.Empty; // PDF, JPG, PNG
        public long FileSize { get; set; }
        public DateTime UploadedDate { get; set; }

        // Polymorphic relationships
        public int? ReimbursementId { get; set; }
        public int? MedicalClaimId { get; set; }
        public int? LoanId { get; set; }
        public int? InsurancePolicyId { get; set; }

        // Navigation properties
        public Reimbursement? Reimbursement { get; set; }
        public MedicalClaim? MedicalClaim { get; set; }
        public Loan? Loan { get; set; }
        public InsurancePolicy? InsurancePolicy { get; set; }
    }
}