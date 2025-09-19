using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface IReimbursementService : IApprovalService<Reimbursement>
    {
        Task<ReimbursementResponseDTO> RequestReimbursementAsync(ReimbursementRequestDTO request);
        Task<IEnumerable<ReimbursementResponseDTO>> GetReimbursementsByEmployeeAsync(int employeeId);

        // Dashboard / Admin Methods
        Task<int> GetPendingManagerApprovalsAsync();
        Task<int> GetPendingFinanceApprovalsAsync();
        Task<int> GetTotalReimbursementsAsync();
        Task<int> GetPendingEmployeeReimbursementsCount(int employeeId);
        Task<IEnumerable<ReimbursementResponseDTO>> GetPendingManagerApprovals();
        Task<IEnumerable<ReimbursementResponseDTO>> GetPendingFinanceApprovals();
        Task<int> GetPendingManagerCount();
        Task<int> GetPendingEmployeeCountAsync(int employeeId);
        Task SeedSampleDataAsync();
        Task<IEnumerable<ReimbursementResponseDTO>> GetAllReimbursementsAsync();
    }
}
