using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Payroll360.Core.DTOs
{
    public class LoanRequestDTO
    {
        public int EmployeeId { get; set; }
        
        [Required]
        public string LoanType { get; set; } = string.Empty;
        
        [Required]
        [Range(1000, 1000000)]
        public decimal Amount { get; set; }
        
        [Required]
        [Range(6, 60)]
        public int TenureMonths { get; set; }
        
        [Required]
        [MinLength(5)]
        public string Purpose { get; set; } = string.Empty;
        
        public bool AcceptTerms { get; set; }
        
        public List<string> DocumentPaths { get; set; } = new();
    }
}
