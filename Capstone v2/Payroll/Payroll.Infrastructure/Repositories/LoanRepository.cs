using Microsoft.EntityFrameworkCore;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Payroll360.Infrastructure.Repositories
{
    public class LoanRepository : ILoanRepository
    {
        private readonly Payroll360Context _context;

        public LoanRepository(Payroll360Context context)
        {
            _context = context;
        }

        public async Task<Loan?> GetByIdAsync(int id)
        {
            return await _context.Loans
                                 .Include(l => l.Employee)
                                 .Include(l => l.Documents)
                                 .FirstOrDefaultAsync(l => l.Id == id);
        }

        public async Task<IEnumerable<Loan>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context.Loans
                                 .Include(l => l.Employee)
                                 .Include(l => l.Documents)
                                 .Where(l => l.EmployeeId == employeeId)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Loan>> GetAllAsync()
        {
            return await _context.Loans
                                 .Include(l => l.Employee)
                                 .Include(l => l.Documents)
                                 .ToListAsync();
        }

        public async Task AddAsync(Loan loan)
        {
            await _context.Loans.AddAsync(loan);
        }

        public void Update(Loan loan)
        {
            _context.Loans.Update(loan);
        }

        public void Delete(Loan loan)
        {
            _context.Loans.Remove(loan);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
