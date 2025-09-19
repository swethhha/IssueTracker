using System;

namespace Payroll360.Core.DTOs
{
    public class LoanDocumentDTO
    {
        public int Id { get; set; }
        public int LoanId { get; set; }
        public string DocumentType { get; set; } = string.Empty; // Identity, Address, Bank, Specific
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public DateTime UploadDate { get; set; }
    }
}