using System;
using System.Collections.Generic;
using Payroll360.Core.Enums;

namespace Payroll360.Core.Entities
{
    public class Employee
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public EmployeeRole Role { get; set; } = EmployeeRole.Employee;
        public decimal BaseSalary { get; set; }
        public string PasswordHash { get; set; } = string.Empty;

        // Navigation collections (non-nullable)
        public ICollection<Payroll> Payrolls { get; set; } = new List<Payroll>();
        public ICollection<Reimbursement> Reimbursements { get; set; } = new List<Reimbursement>();
        public ICollection<Loan> Loans { get; set; } = new List<Loan>();
        public ICollection<MedicalClaim> MedicalClaims { get; set; } = new List<MedicalClaim>();
        public ICollection<InsurancePolicy> InsurancePolicies { get; set; } = new List<InsurancePolicy>();
        public ICollection<InsuranceEnrollment> InsuranceEnrollments { get; set; } = new List<InsuranceEnrollment>();
        public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    }
}
