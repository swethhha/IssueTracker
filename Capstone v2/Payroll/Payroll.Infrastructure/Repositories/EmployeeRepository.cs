using Microsoft.EntityFrameworkCore;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Payroll360.Infrastructure.Repositories
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly Payroll360Context _context;

        public EmployeeRepository(Payroll360Context context)
        {
            _context = context;
        }

        public async Task<Employee?> GetByIdAsync(int id)
        {
            return await _context.Employees
                .Include(e => e.Payrolls)
                    .ThenInclude(p => p.ApprovalHistory)
                .Include(e => e.Payrolls)
                    .ThenInclude(p => p.Documents)
                .Include(e => e.Loans)
                    .ThenInclude(l => l.Documents)
                .Include(e => e.MedicalClaims)
                    .ThenInclude(mc => mc.ApprovalHistory)
                .Include(e => e.MedicalClaims)
                    .ThenInclude(mc => mc.Documents)
                .Include(e => e.Reimbursements)
                    .ThenInclude(r => r.ApprovalHistory)
                .Include(e => e.Reimbursements)
                    .ThenInclude(r => r.Documents)
                .Include(e => e.InsurancePolicies)
                    .ThenInclude(ip => ip.Documents)
                .Include(e => e.InsurancePolicies)
                    .ThenInclude(ip => ip.Dependents)
                .Include(e => e.Notifications)
                .FirstOrDefaultAsync(e => e.Id == id);
        }

        public async Task<Employee?> GetByEmailAsync(string email)
        {
            return await _context.Employees
                .Include(e => e.Payrolls)
                    .ThenInclude(p => p.ApprovalHistory)
                .Include(e => e.Payrolls)
                    .ThenInclude(p => p.Documents)
                .Include(e => e.Loans)
                    .ThenInclude(l => l.Documents)
                .Include(e => e.MedicalClaims)
                    .ThenInclude(mc => mc.ApprovalHistory)
                .Include(e => e.MedicalClaims)
                    .ThenInclude(mc => mc.Documents)
                .Include(e => e.Reimbursements)
                    .ThenInclude(r => r.ApprovalHistory)
                .Include(e => e.Reimbursements)
                    .ThenInclude(r => r.Documents)
                .Include(e => e.InsurancePolicies)
                    .ThenInclude(ip => ip.Documents)
                .Include(e => e.InsurancePolicies)
                    .ThenInclude(ip => ip.Dependents)
                .Include(e => e.Notifications)
                .FirstOrDefaultAsync(e => e.Email == email);
        }

        public async Task<IEnumerable<Employee>> GetAllAsync()
        {
            return await _context.Employees
                .Include(e => e.Payrolls)
                    .ThenInclude(p => p.ApprovalHistory)
                .Include(e => e.Payrolls)
                    .ThenInclude(p => p.Documents)
                .Include(e => e.Loans)
                    .ThenInclude(l => l.Documents)
                .Include(e => e.MedicalClaims)
                    .ThenInclude(mc => mc.ApprovalHistory)
                .Include(e => e.MedicalClaims)
                    .ThenInclude(mc => mc.Documents)
                .Include(e => e.Reimbursements)
                    .ThenInclude(r => r.ApprovalHistory)
                .Include(e => e.Reimbursements)
                    .ThenInclude(r => r.Documents)
                .Include(e => e.InsurancePolicies)
                    .ThenInclude(ip => ip.Documents)
                .Include(e => e.InsurancePolicies)
                    .ThenInclude(ip => ip.Dependents)
                .Include(e => e.Notifications)
                .ToListAsync();
        }

        public async Task AddAsync(Employee employee)
        {
            await _context.Employees.AddAsync(employee);
        }

        public void Update(Employee employee)
        {
            _context.Employees.Update(employee);
        }

        public void Delete(Employee employee)
        {
            _context.Employees.Remove(employee);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
