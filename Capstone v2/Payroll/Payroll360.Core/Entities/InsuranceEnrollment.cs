using System;

namespace Payroll360.Core.Entities
{
    public class InsuranceEnrollment
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int PolicyId { get; set; }

        public string EnrollmentStatus { get; set; } = "Active"; // Active, Expired, Cancelled
        public DateTime EnrolledOn { get; set; } = DateTime.UtcNow;

        // Navigation
        public Employee Employee { get; set; } = null!;
        public InsurancePolicy Policy { get; set; } = null!;
    }
}
