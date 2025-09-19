using Payroll360.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface INotificationRepository
    {
        Task<Notification?> GetByIdAsync(int id);
        Task<IEnumerable<Notification>> GetByEmployeeIdAsync(int employeeId);
        Task<IEnumerable<Notification>> GetAllAsync();
        Task AddAsync(Notification notification);
        void Update(Notification notification);
        void Delete(Notification notification);
        Task<int> SaveChangesAsync();
    }
}
