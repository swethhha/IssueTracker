using Microsoft.EntityFrameworkCore;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Infrastructure.Repositories
{
    public class MedicalClaimRepository : IMedicalClaimRepository
    {
        private readonly Payroll360Context _context;

        public MedicalClaimRepository(Payroll360Context context)
        {
            _context = context;
        }

        public async Task<MedicalClaim?> GetByIdAsync(int id)
        {
            return await _context.MedicalClaims
                                 .Include(mc => mc.Employee)
                                 .Include(mc => mc.Documents)
                                 .Include(mc => mc.ApprovalHistory)
                                 .FirstOrDefaultAsync(mc => mc.Id == id);
        }

        public async Task<IEnumerable<MedicalClaim>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context.MedicalClaims
                                 .Include(mc => mc.Employee)
                                 .Include(mc => mc.Documents)
                                 .Include(mc => mc.ApprovalHistory)
                                 .Where(mc => mc.EmployeeId == employeeId)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<MedicalClaim>> GetAllAsync()
        {
            return await _context.MedicalClaims
                                 .Include(mc => mc.Employee)
                                 .Include(mc => mc.Documents)
                                 .Include(mc => mc.ApprovalHistory)
                                 .ToListAsync();
        }

        public async Task AddAsync(MedicalClaim claim)
        {
            await _context.MedicalClaims.AddAsync(claim);
        }

        public void Update(MedicalClaim claim)
        {
            _context.MedicalClaims.Update(claim);
        }

        public void Delete(MedicalClaim claim)
        {
            _context.MedicalClaims.Remove(claim);
        }

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
