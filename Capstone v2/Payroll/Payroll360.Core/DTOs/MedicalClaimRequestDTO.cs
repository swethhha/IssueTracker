using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Payroll360.Core.DTOs
{
    public class MedicalClaimRequestDTO
    {
        public int EmployeeId { get; set; }
        
        [Required]
        public string PatientName { get; set; } = string.Empty;
        
        [Required]
        public string Relationship { get; set; } = string.Empty;
        
        [Required]
        public int PatientAge { get; set; }
        
        [Required]
        public string ContactNumber { get; set; } = string.Empty;
        
        [Required]
        public DateTime TreatmentDate { get; set; }
        
        public DateTime? DischargeDate { get; set; }
        
        [Required]
        public string HospitalName { get; set; } = string.Empty;
        
        [Required]
        public string DoctorName { get; set; } = string.Empty;
        
        [Required]
        public string TreatmentType { get; set; } = string.Empty;
        
        [Required]
        public string Diagnosis { get; set; } = string.Empty;
        
        [Required]
        [Range(1, double.MaxValue)]
        public decimal ClaimAmount { get; set; }
        
        [Required]
        [Range(1, double.MaxValue)]
        public decimal PaidAmount { get; set; }
        
        // Additional properties for compatibility
        public decimal? Amount => ClaimAmount;
        public DateTime? ClaimDate => TreatmentDate;
        public string Description => $"{TreatmentType} - {Diagnosis}";
        
        [Required]
        public string BankAccount { get; set; } = string.Empty;
        
        [Required]
        public bool Declaration { get; set; }
        
        public List<string> DocumentPaths { get; set; } = new();
    }
}
