using System;
using System.ComponentModel.DataAnnotations;

namespace Payroll360.Core.Entities
{
    public class LoanDocument
    {
        public int Id { get; set; }
        
        [Required]
        public int LoanId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string DocumentType { get; set; } = string.Empty; // Identity, Address, Bank, Specific
        
        [Required]
        [MaxLength(255)]
        public string FileName { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(500)]
        public string FilePath { get; set; } = string.Empty;
        
        public DateTime UploadDate { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual Loan Loan { get; set; }
    }
}