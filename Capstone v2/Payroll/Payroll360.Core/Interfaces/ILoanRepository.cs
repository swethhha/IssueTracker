using Payroll360.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface ILoanRepository
    {
        Task<Loan?> GetByIdAsync(int id);
        Task<IEnumerable<Loan>> GetByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<Loan>> GetAllAsync();
        Task AddAsync(Loan loan);
        void Update(Loan loan);
        void Delete(Loan loan);
        Task<int> SaveChangesAsync();
    }
}
