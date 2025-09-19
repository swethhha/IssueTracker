using Payroll360.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface IReimbursementRepository
    {
        Task<Reimbursement?> GetByIdAsync(int id);
        Task<IEnumerable<Reimbursement>> GetByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<Reimbursement>> GetAllAsync();
        Task AddAsync(Reimbursement reimbursement);
        void Update(Reimbursement reimbursement);
        void Delete(Reimbursement reimbursement);
        Task<int> SaveChangesAsync();
    }
}
