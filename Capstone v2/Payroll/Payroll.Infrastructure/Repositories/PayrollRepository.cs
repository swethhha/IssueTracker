using Microsoft.EntityFrameworkCore;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Payroll360.Infrastructure.Repositories
{
    public class PayrollRepository : IPayrollRepository
    {
        private readonly Payroll360Context _context;

        public PayrollRepository(Payroll360Context context)
        {
            _context = context;
        }

        public async Task AddAsync(Payroll360.Core.Entities.Payroll payroll)
        {
            await _context.Payrolls.AddAsync(payroll);
        }

        public void Update(Payroll360.Core.Entities.Payroll payroll)
        {
            _context.Payrolls.Update(payroll);
        }

        public void Delete(Payroll360.Core.Entities.Payroll payroll)
        {
            _context.Payrolls.Remove(payroll);
        }

        public async Task<Payroll360.Core.Entities.Payroll?> GetByIdAsync(int id)
        {
            return await _context.Payrolls
                                 .Include(p => p.Employee)
                                 .Include(p => p.Documents)
                                 .Include(p => p.ApprovalHistory)
                                 .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<IEnumerable<Payroll360.Core.Entities.Payroll>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context.Payrolls
                                 .Include(p => p.Employee)
                                 .Include(p => p.Documents)
                                 .Include(p => p.ApprovalHistory)
                                 .Where(p => p.EmployeeId == employeeId)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Payroll360.Core.Entities.Payroll>> GetAllAsync()
        {
            return await _context.Payrolls
                                 .Include(p => p.Employee)
                                 .Include(p => p.Documents)
                                 .Include(p => p.ApprovalHistory)
                                 .ToListAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
