using Payroll360.Core.DTOs;

namespace Payroll360.Core.Interfaces
{
    public interface IDashboardService
    {
        Task<DashboardDTO> GetDashboardAsync(int employeeId, string role);
    }
}
