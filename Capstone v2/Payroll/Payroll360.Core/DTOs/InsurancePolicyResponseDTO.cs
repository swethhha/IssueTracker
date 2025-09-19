namespace Payroll360.Core.DTOs
{
    public class InsurancePolicyResponseDTO
    {
        public int Id { get; set; }
        public string PolicyName { get; set; } = string.Empty;
        public string EmployeeName { get; set; } = string.Empty;
        public decimal Premium { get; set; }
        public string Status { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Coverage { get; set; } = string.Empty;
    }
}