using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface ILoanService : IApprovalService<Loan>
    {
        Task<LoanResponseDTO> ApplyForLoanAsync(LoanRequestDTO request);
        Task<IEnumerable<LoanResponseDTO>> GetLoansByEmployeeAsync(int employeeId);

        // Manager Dashboard Methods
        Task<IEnumerable<LoanResponseDTO>> GetPendingManagerApprovalsAsync(int managerId);
        Task<int> GetPendingManagerCountAsync(int managerId);
        Task<int> GetPendingManagerApprovalsAsync();
        Task<int> GetPendingFinanceApprovalsAsync();
        Task<int> GetTotalLoansAsync();
        Task<int> GetActiveLoansCountAsync(int employeeId);

        // Document Management
        Task UploadDocumentsAsync(int loanId, int employeeId, List<object> documents);
        Task<LoanDocumentDTO> GetDocumentAsync(int documentId);
        Task<byte[]> GetDocumentFileAsync(string filePath);

        Task<IEnumerable<LoanResponseDTO>> GetAllLoansAsync();
        Task<int> GetPendingEmployeeCountAsync(int employeeId);
        Task<IEnumerable<LoanResponseDTO>> GetPendingFinanceApprovals();
    }
}
