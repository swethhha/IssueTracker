using Payroll360.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface IPayrollRepository
    {
        Task<Payroll?> GetByIdAsync(int id);
        Task<IEnumerable<Payroll>> GetByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<Payroll>> GetAllAsync();
        Task AddAsync(Payroll payroll);
        void Update(Payroll payroll);
        void Delete(Payroll payroll);
        Task<int> SaveChangesAsync();
    }
}
