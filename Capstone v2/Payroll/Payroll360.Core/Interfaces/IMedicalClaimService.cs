using Payroll360.Core.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface IMedicalClaimService
    {
        // Employee
        Task<MedicalClaimResponseDTO> RequestClaimAsync(MedicalClaimRequestDTO dto);
        Task<IEnumerable<MedicalClaimResponseDTO>> GetClaimsByEmployeeAsync(int employeeId);

        // Manager
        Task ApproveByManagerAsync(int claimId, int managerId, string? comments = null);
        Task RejectByManagerAsync(int claimId, int managerId, string reason);

        // Finance
        Task ApproveByFinanceAsync(int claimId, int financeId, string? comments = null);
        Task RejectByFinanceAsync(int claimId, int financeId, string reason);

        // Admin / Dashboard
        Task<int> GetPendingManagerApprovalsAsync();
        Task<int> GetPendingFinanceApprovalsAsync();
        Task<int> GetTotalClaimsAsync();
        Task<IEnumerable<MedicalClaimResponseDTO>> GetPendingManagerApprovals();
        Task<IEnumerable<MedicalClaimResponseDTO>> GetPendingFinanceApprovals();
        Task<int> GetPendingEmployeeCountAsync(int employeeId);
    }
}
