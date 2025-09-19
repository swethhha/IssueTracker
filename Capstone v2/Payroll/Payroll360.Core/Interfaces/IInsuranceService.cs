using Payroll360.Core.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface IInsuranceService
    {
        Task<IEnumerable<InsurancePolicyResponseDTO>> GetInsurancePoliciesByEmployeeAsync(int employeeId);
        Task EnrollAsync(InsuranceEnrollmentRequestDTO enrollment);

        // Dashboard / Admin Methods
        Task<int> GetTotalPoliciesAsync();
        Task<int> GetActivePoliciesCountAsync(int employeeId);
        Task<int> GetPendingManagerApprovalsAsync();
        Task<IEnumerable<InsurancePolicyResponseDTO>> GetPendingManagerApprovals();
        Task<int> GetPendingEmployeeCountAsync(int employeeId);
        Task<int> GetPendingFinanceApprovalsAsync();
        Task<IEnumerable<InsurancePolicyResponseDTO>> GetPendingFinanceApprovals();
    }
}
