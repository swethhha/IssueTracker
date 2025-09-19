namespace Payroll360.Core.DTOs
{
    public class InsuranceEnrollmentDTO
    {
        public int EmployeeId { get; set; }
        public bool EnrollSpouse { get; set; }
        public string? SpouseName { get; set; }
        public DateTime? SpouseDOB { get; set; }
        
        public bool EnrollChildren { get; set; }
        public List<DependentDTO> Children { get; set; } = new();
        
        public bool EnrollParents { get; set; }
        public List<DependentDTO> Parents { get; set; } = new();
        
        public string? TopUpOption { get; set; } // "4L", "8L", "12L"
        public decimal TotalPremium { get; set; }
        public decimal EmployeeContribution { get; set; }
    }

    public class DependentDTO
    {
        public string Name { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string Relationship { get; set; } = string.Empty;
    }

    public class InsuranceEnrollmentPolicyDTO
    {
        public int PolicyId { get; set; }
        public string PolicyType { get; set; } = string.Empty;
        public decimal SumInsured { get; set; }
        public decimal PremiumAmount { get; set; }
        public decimal EmployeeContribution { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public bool IsActive { get; set; }
        public List<DependentDTO> Dependents { get; set; } = new();
    }
}