using Payroll360.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface IMedicalClaimRepository
    {
        Task<MedicalClaim?> GetByIdAsync(int id);
        Task<IEnumerable<MedicalClaim>> GetByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<MedicalClaim>> GetAllAsync();
        Task AddAsync(MedicalClaim claim);
        void Update(MedicalClaim claim);
        void Delete(MedicalClaim claim);
        Task<int> SaveChangesAsync();
    }
}
