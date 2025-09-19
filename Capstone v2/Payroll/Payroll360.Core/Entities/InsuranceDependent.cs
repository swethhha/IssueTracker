namespace Payroll360.Core.Entities
{
    public class InsuranceDependent
    {
        public int Id { get; set; }
        public int InsurancePolicyId { get; set; }

        public string FullName { get; set; } = string.Empty;
        public string Relationship { get; set; } = string.Empty; // Spouse, Child, Parent
        public DateTime DateOfBirth { get; set; }

        public bool IsCovered { get; set; } = true;
        public DateTime? CoverageStart { get; set; }
        public DateTime? CoverageEnd { get; set; }

        // Navigation
        public InsurancePolicy? InsurancePolicy { get; set; }
    }
}