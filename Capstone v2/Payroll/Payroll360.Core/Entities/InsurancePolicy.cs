using Payroll360.Core.Enums;

namespace Payroll360.Core.Entities
{
    public class InsurancePolicy
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public PolicyType PolicyType { get; set; } // Employee, Spouse, Child, Parent, TopUp
        public decimal SumInsured { get; set; }
        public decimal PremiumAmount { get; set; }
        public decimal EmployeeContribution { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; } = true;
        public string? DependentName { get; set; }
        public string? Relationship { get; set; }
        public DateTime? DependentDOB { get; set; }
        
        // Navigation
        public Employee Employee { get; set; } = null!;
        public ICollection<MedicalClaim> MedicalClaims { get; set; } = new List<MedicalClaim>();
        public ICollection<InsuranceEnrollment> Enrollments { get; set; } = new List<InsuranceEnrollment>();
        public ICollection<InsuranceDependent> Dependents { get; set; } = new List<InsuranceDependent>();
        public ICollection<DocumentAttachment> Documents { get; set; } = new List<DocumentAttachment>();
    }
}