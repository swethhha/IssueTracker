using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Payroll360.Core.Entities;
using Payroll360.Core.Enums;
using Payroll360.Infrastructure.Data;

namespace Payroll360.Application.Services
{
    public class SeedDataService
    {
        private readonly Payroll360Context _context;
        private readonly PasswordHasher<Employee> _passwordHasher;

        public SeedDataService(Payroll360Context context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<Employee>();
        }

        public async Task SeedAsync()
        {
            if (await _context.Employees.AnyAsync())
                return; // Data already seeded

            // Create sample employees
            var employees = new List<Employee>
            {
                new Employee
                {
                    FullName = "John Doe",
                    Email = "john.doe@payroll360.com",
                    Department = "Engineering",
                    Role = EmployeeRole.Employee,
                    BaseSalary = 50000
                },
                new Employee
                {
                    FullName = "Jane Smith",
                    Email = "jane.smith@payroll360.com",
                    Department = "Engineering",
                    Role = EmployeeRole.Manager,
                    BaseSalary = 75000
                },
                new Employee
                {
                    FullName = "Mike Johnson",
                    Email = "mike.johnson@payroll360.com",
                    Department = "Finance",
                    Role = EmployeeRole.FinanceAdmin,
                    BaseSalary = 65000
                },
                new Employee
                {
                    FullName = "Sarah Wilson",
                    Email = "sarah.wilson@payroll360.com",
                    Department = "HR",
                    Role = EmployeeRole.Employee,
                    BaseSalary = 45000
                },
                new Employee
                {
                    FullName = "David Brown",
                    Email = "david.brown@payroll360.com",
                    Department = "Sales",
                    Role = EmployeeRole.Employee,
                    BaseSalary = 48000
                }
            };

            // Hash passwords
            foreach (var employee in employees)
            {
                employee.PasswordHash = _passwordHasher.HashPassword(employee, "password123");
            }

            _context.Employees.AddRange(employees);
            await _context.SaveChangesAsync();

            // Create sample payrolls
            var payrolls = new List<Payroll360.Core.Entities.Payroll>();
            foreach (var employee in employees)
            {
                for (int i = 0; i < 6; i++) // 6 months of payroll
                {
                    var startDate = DateTime.Now.AddMonths(-i).AddDays(-DateTime.Now.Day + 1);
                    var endDate = startDate.AddMonths(1).AddDays(-1);

                    payrolls.Add(new Payroll360.Core.Entities.Payroll
                    {
                        EmployeeId = employee.Id,
                        BasicSalary = employee.BaseSalary,
                        Allowances = employee.BaseSalary * 0.1m,
                        Deductions = employee.BaseSalary * 0.15m,
                        NetSalary = employee.BaseSalary * 0.95m,
                        PeriodStart = startDate,
                        PeriodEnd = endDate,
                        ManagerApproved = i > 0 ? true : (bool?)null, // Current month pending
                        FinanceApproved = i > 1 ? true : (bool?)null
                    });
                }
            }

            _context.Payrolls.AddRange(payrolls);
            await _context.SaveChangesAsync();

            // Create sample insurance policies
            var policies = new List<InsurancePolicy>
            {
                new InsurancePolicy
                {
                    EmployeeId = employees[0].Id,
                    PolicyType = PolicyType.Health,
                    PremiumAmount = 2500,
                    SumInsured = 500000,
                    StartDate = DateTime.Now.AddMonths(-12),
                    EndDate = DateTime.Now.AddMonths(12)
                },
                new InsurancePolicy
                {
                    EmployeeId = employees[0].Id,
                    PolicyType = PolicyType.Life,
                    PremiumAmount = 1200,
                    SumInsured = 1000000,
                    StartDate = DateTime.Now.AddMonths(-12),
                    EndDate = DateTime.Now.AddMonths(12)
                }
            };

            _context.InsurancePolicies.AddRange(policies);
            await _context.SaveChangesAsync();

            // Create sample loans
            var loans = new List<Loan>
            {
                new Loan
                {
                    EmployeeId = employees[0].Id,
                    LoanType = "Personal",
                    Amount = 100000,
                    TenureMonths = 24,
                    Purpose = "Home renovation",
                    AppliedDate = DateTime.Now.AddDays(-5),
                    ManagerApproved = null,
                    FinanceApproved = null
                },
                new Loan
                {
                    EmployeeId = employees[3].Id,
                    LoanType = "Education",
                    Amount = 50000,
                    TenureMonths = 12,
                    Purpose = "Professional certification",
                    AppliedDate = DateTime.Now.AddDays(-3),
                    ManagerApproved = true,
                    FinanceApproved = null,
                    ManagerId = employees[1].Id
                }
            };

            _context.Loans.AddRange(loans);
            await _context.SaveChangesAsync();

            // Create sample reimbursements
            var reimbursements = new List<Reimbursement>
            {
                new Reimbursement
                {
                    EmployeeId = employees[0].Id,
                    EmployeeName = employees[0].FullName,
                    Category = "Travel",
                    Amount = 5000,
                    Description = "Client meeting travel expenses",
                    RequestedDate = DateTime.Now.AddDays(-2),
                    ManagerApproved = null,
                    FinanceApproved = null
                },
                new Reimbursement
                {
                    EmployeeId = employees[4].Id,
                    EmployeeName = employees[4].FullName,
                    Category = "Food",
                    Amount = 1500,
                    Description = "Team lunch expenses",
                    RequestedDate = DateTime.Now.AddDays(-4),
                    ManagerApproved = true,
                    FinanceApproved = null,
                    ManagerId = employees[1].Id
                }
            };

            _context.Reimbursements.AddRange(reimbursements);
            await _context.SaveChangesAsync();

            // Create sample medical claims
            var medicalClaims = new List<MedicalClaim>
            {
                new MedicalClaim
                {
                    EmployeeId = employees[0].Id,
                    Amount = 15000,
                    ClaimDate = DateTime.Now.AddDays(-1),
                    RequestedDate = DateTime.Now.AddDays(-1),
                    HospitalName = "City Hospital",
                    TreatmentType = "Surgery",
                    Description = "Minor surgical procedure",
                    ManagerApproved = null,
                    FinanceApproved = null
                }
            };

            _context.MedicalClaims.AddRange(medicalClaims);
            await _context.SaveChangesAsync();
        }
    }
}