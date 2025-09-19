using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface IPayrollService : IApprovalService<Payroll>
    {
        Task<IEnumerable<PayrollResponseDTO>> GetPayrollsByEmployeeAsync(int employeeId);
        Task<PayrollSummaryDTO> GetPayrollSummaryAsync(int employeeId);

        // Dashboard / Admin Methods
        Task<decimal> GetTotalEarningsAsync(int employeeId);
        Task<decimal> GetTotalNetPayAsync(int employeeId);
        Task<int> GetPendingManagerApprovalsAsync();
        Task<int> GetPendingManagerCountAsync();
        Task<int> GetPendingFinanceApprovalsAsync();
        Task<int> GetTotalEmployeesAsync();
        Task<int> GetTotalPayrollsAsync();
        Task<IEnumerable<PayrollResponseDTO>> GetPendingApprovalsAsync();
        Task<IEnumerable<PayrollResponseDTO>> GetPendingManagerApprovals();
        Task<IEnumerable<PayrollResponseDTO>> GetRecentPayrollsAsync(int employeeId, int count);
        Task<IEnumerable<PayrollResponseDTO>> GetPayrollHistoryAsync(int employeeId, int months);
        Task<IEnumerable<PayrollResponseDTO>> GetPendingFinanceApprovals();
    }
}
