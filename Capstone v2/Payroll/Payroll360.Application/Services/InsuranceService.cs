using Microsoft.EntityFrameworkCore;
using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;

namespace Payroll360.Application.Services
{
    public class InsuranceService : IInsuranceService
    {
        private readonly Payroll360Context _context;

        public InsuranceService(Payroll360Context context)
        {
            _context = context;
        }

        public async Task<IEnumerable<InsurancePolicyResponseDTO>> GetInsurancePoliciesByEmployeeAsync(int employeeId)
        {
            var policies = await _context.InsurancePolicies
                .Include(p => p.Employee)
                .Where(p => employeeId == 0 || p.EmployeeId == employeeId)
                .Select(p => new InsurancePolicyResponseDTO
                {
                    Id = p.Id,
                    PolicyName = p.PolicyType.ToString(),
                    Description = $"{p.PolicyType} Insurance Policy",
                    Coverage = p.PremiumAmount.ToString("C")
                })
                .ToListAsync();
            return policies;
        }

        public async Task EnrollAsync(InsuranceEnrollmentRequestDTO enrollment)
        {
            var newEnrollment = new InsuranceEnrollment
            {
                EmployeeId = enrollment.EmployeeId,
                PolicyId = enrollment.PolicyId,
                EnrollmentStatus = "Pending",
                EnrolledOn = DateTime.UtcNow
            };

            _context.InsuranceEnrollments.Add(newEnrollment);
            await _context.SaveChangesAsync();
        }

        public async Task<int> GetTotalPoliciesAsync()
        {
            return await _context.InsurancePolicies.CountAsync();
        }

        public async Task<int> GetActivePoliciesCountAsync(int employeeId)
        {
            return await _context.InsuranceEnrollments
                .CountAsync(e => e.EmployeeId == employeeId && e.EnrollmentStatus == "Active");
        }

        public async Task<int> GetPendingManagerApprovalsAsync()
        {
            return await _context.InsuranceEnrollments
                .CountAsync(e => e.EnrollmentStatus == "Pending");
        }

        public async Task<IEnumerable<InsurancePolicyResponseDTO>> GetPendingManagerApprovals()
        {
            var pendingEnrollments = await _context.InsuranceEnrollments
                .Where(e => e.EnrollmentStatus == "Pending")
                .Join(_context.InsurancePolicies, e => e.PolicyId, p => p.Id, (e, p) => new InsurancePolicyResponseDTO
                {
                    Id = p.Id,
                    PolicyName = p.PolicyType.ToString(),
                    Description = $"{p.PolicyType} Insurance Policy - Pending Approval",
                    Coverage = p.PremiumAmount.ToString("C")
                })
                .ToListAsync();
            return pendingEnrollments;
        }

        public async Task<int> GetPendingEmployeeCountAsync(int employeeId)
        {
            return await _context.InsuranceEnrollments
                .CountAsync(e => e.EmployeeId == employeeId && e.EnrollmentStatus == "Pending");
        }

        public async Task<int> GetPendingFinanceApprovalsAsync()
        {
            return await _context.InsuranceEnrollments
                .CountAsync(e => e.EnrollmentStatus == "ManagerApproved");
        }

        public async Task<IEnumerable<InsurancePolicyResponseDTO>> GetPendingFinanceApprovals()
        {
            var pendingFinanceEnrollments = await _context.InsuranceEnrollments
                .Where(e => e.EnrollmentStatus == "ManagerApproved")
                .Join(_context.InsurancePolicies, e => e.PolicyId, p => p.Id, (e, p) => new InsurancePolicyResponseDTO
                {
                    Id = p.Id,
                    PolicyName = p.PolicyType.ToString(),
                    Description = $"{p.PolicyType} Insurance Policy - Pending Finance Approval",
                    Coverage = p.PremiumAmount.ToString("C")
                })
                .ToListAsync();
            return pendingFinanceEnrollments;
        }
    }
}