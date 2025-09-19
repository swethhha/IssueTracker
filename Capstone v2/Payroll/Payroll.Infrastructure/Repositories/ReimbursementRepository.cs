using Microsoft.EntityFrameworkCore;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Payroll360.Infrastructure.Repositories
{
    public class ReimbursementRepository : IReimbursementRepository
    {
        private readonly Payroll360Context _context;

        public ReimbursementRepository(Payroll360Context context)
        {
            _context = context;
        }

        public async Task AddAsync(Reimbursement reimbursement)
        {
            await _context.Reimbursements.AddAsync(reimbursement);
        }

        public void Update(Reimbursement reimbursement)
        {
            _context.Reimbursements.Update(reimbursement);
        }

        public void Delete(Reimbursement reimbursement)
        {
            _context.Reimbursements.Remove(reimbursement);
        }

        public async Task<Reimbursement?> GetByIdAsync(int id)
        {
            return await _context.Reimbursements
                                 .Include(r => r.Employee)
                                 .Include(r => r.Documents)
                                 .Include(r => r.ApprovalHistory)
                                 .FirstOrDefaultAsync(r => r.Id == id);
        }

        public async Task<IEnumerable<Reimbursement>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context.Reimbursements
                                 .Include(r => r.Employee)
                                 .Include(r => r.Documents)
                                 .Include(r => r.ApprovalHistory)
                                 .Where(r => r.EmployeeId == employeeId)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Reimbursement>> GetAllAsync()
        {
            return await _context.Reimbursements
                                 .Include(r => r.Employee)
                                 .Include(r => r.Documents)
                                 .Include(r => r.ApprovalHistory)
                                 .ToListAsync();
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
