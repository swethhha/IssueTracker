using Microsoft.EntityFrameworkCore;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Payroll360.Infrastructure.Repositories
{
    public class InsuranceRepository : IInsuranceRepository
    {
        private readonly Payroll360Context _context;
        public InsuranceRepository(Payroll360Context context)
        {
            _context = context;
        }

        // Policies
        public async Task<InsurancePolicy?> GetByIdAsync(int id) =>
            await _context.InsurancePolicies
                          .Include(p => p.Employee)
                          .Include(p => p.Dependents)
                          .Include(p => p.Documents)
                          // .Include(p => p.Enrollments) // Temporarily disabled
                          .FirstOrDefaultAsync(p => p.Id == id);

        public async Task<IEnumerable<InsurancePolicy>> GetByEmployeeIdAsync(int employeeId) =>
            await _context.InsurancePolicies
                          .Include(p => p.Employee)
                          .Include(p => p.Dependents)
                          .Include(p => p.Documents)
                          // .Include(p => p.Enrollments) // Temporarily disabled
                          .Where(p => p.EmployeeId == employeeId)
                          .ToListAsync();

        public async Task<IEnumerable<InsurancePolicy>> GetAllAsync() =>
            await _context.InsurancePolicies
                          .Include(p => p.Employee)
                          .Include(p => p.Dependents)
                          .Include(p => p.Documents)
                          // .Include(p => p.Enrollments) // Temporarily disabled
                          .ToListAsync();

        public async Task AddAsync(InsurancePolicy policy) => await _context.InsurancePolicies.AddAsync(policy);

        public void Update(InsurancePolicy policy) => _context.InsurancePolicies.Update(policy);

        public void Delete(InsurancePolicy policy) => _context.InsurancePolicies.Remove(policy);

        // Enrollments
        public async Task<InsuranceEnrollment?> GetEnrollmentAsync(int employeeId, int policyId) =>
            await _context.InsuranceEnrollments
                          .FirstOrDefaultAsync(e => e.EmployeeId == employeeId && e.PolicyId == policyId);

        public async Task AddEnrollmentAsync(InsuranceEnrollment enrollment) =>
            await _context.InsuranceEnrollments.AddAsync(enrollment);

        public async Task<int> SaveChangesAsync() => await _context.SaveChangesAsync();

        // Fixed: Count active policies for an employee
        public async Task<int> CountActivePoliciesAsync(int employeeId)
        {
            return await _context.InsuranceEnrollments
                                 .Where(e => e.EmployeeId == employeeId && e.EnrollmentStatus == "Active")
                                 .CountAsync();
        }

        // Fixed: Count all policies (just count the policy entities)
        public async Task<int> CountAllPoliciesAsync()
        {
            return await _context.InsurancePolicies.CountAsync();
        }
    }
}
