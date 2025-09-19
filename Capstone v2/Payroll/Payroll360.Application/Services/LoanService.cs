using Microsoft.EntityFrameworkCore;
using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;

namespace Payroll360.Application.Services
{
    public class LoanService : ILoanService
    {
        private readonly Payroll360Context _context;


        public LoanService(Payroll360Context context)
        {
            _context = context;
        }

        public async Task<LoanResponseDTO> ApplyForLoanAsync(LoanRequestDTO request)
        {
            // Get employee details for response
            var employee = await _context.Employees.FindAsync(request.EmployeeId);
            if (employee == null)
                throw new ArgumentException("Employee not found");

            var loan = new Loan
            {
                EmployeeId = request.EmployeeId,
                LoanType = request.LoanType,
                Amount = request.Amount,
                TenureMonths = request.TenureMonths,
                Purpose = request.Purpose,
                AppliedDate = DateTime.UtcNow,
                ManagerApproved = null,
                FinanceApproved = null
            };

            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();

            return new LoanResponseDTO
            {
                LoanId = loan.Id,
                EmployeeId = loan.EmployeeId,
                EmployeeName = employee.FullName,
                LoanType = loan.LoanType,
                Amount = loan.Amount,
                TenureMonths = loan.TenureMonths,
                Purpose = loan.Purpose,
                AppliedDate = loan.AppliedDate,
                Status = "Pending",
                MonthlyInstallment = CalculateEMI(loan.Amount, loan.TenureMonths)
            };
        }

        private decimal CalculateEMI(decimal amount, int tenure)
        {
            decimal rate = 0.12m / 12; // 12% annual rate
            return (amount * rate * (decimal)Math.Pow(1 + (double)rate, tenure)) /
                   ((decimal)Math.Pow(1 + (double)rate, tenure) - 1);
        }

        public async Task<IEnumerable<LoanResponseDTO>> GetLoansByEmployeeAsync(int employeeId)
        {
            var loans = await _context.Loans
                .Where(l => l.EmployeeId == employeeId)
                .Select(l => new LoanResponseDTO
                {
                    LoanId = l.Id,
                    EmployeeId = l.EmployeeId,
                    EmployeeName = "Employee " + l.EmployeeId,
                    LoanType = l.LoanType,
                    Amount = l.Amount,
                    TenureMonths = l.TenureMonths,
                    Purpose = l.Purpose,
                    AppliedDate = l.AppliedDate,
                    Status = l.ManagerApproved == null ? "Pending" :
                             l.ManagerApproved == false ? "Rejected" :
                             l.FinanceApproved == null ? "ManagerApproved" :
                             l.FinanceApproved == true ? "Approved" : "Rejected",
                    MonthlyInstallment = CalculateEMI(l.Amount, l.TenureMonths),
                    ManagerApproved = l.ManagerApproved,
                    FinanceApproved = l.FinanceApproved
                })
                .ToListAsync();
            return loans;
        }

        public async Task<IEnumerable<LoanResponseDTO>> GetAllLoansAsync()
        {
            var loans = await _context.Loans
                .Include(l => l.Employee)
                .Select(l => new LoanResponseDTO
                {
                    LoanId = l.Id,
                    EmployeeId = l.EmployeeId,
                    EmployeeName = l.Employee.FullName,
                    LoanType = l.LoanType,
                    Amount = l.Amount,
                    TenureMonths = l.TenureMonths,
                    Purpose = l.Purpose,
                    AppliedDate = l.AppliedDate,
                    Status = l.ManagerApproved == null ? "Pending" :
                             l.ManagerApproved == false ? "Rejected" :
                             l.FinanceApproved == null ? "ManagerApproved" :
                             l.FinanceApproved == true ? "Approved" : "Rejected",
                    MonthlyInstallment = CalculateEMI(l.Amount, l.TenureMonths),
                    ManagerApproved = l.ManagerApproved,
                    FinanceApproved = l.FinanceApproved
                })
                .ToListAsync();
            return loans;
        }

        public async Task<IEnumerable<LoanResponseDTO>> GetPendingManagerApprovalsAsync(int managerId)
        {
            var loans = await _context.Loans
                .Where(l => l.ManagerApproved == null)
                .Select(l => new LoanResponseDTO
                {
                    LoanId = l.Id,
                    EmployeeId = l.EmployeeId,
                    EmployeeName = "Employee " + l.EmployeeId,
                    LoanType = l.LoanType,
                    Amount = l.Amount,
                    TenureMonths = l.TenureMonths,
                    Purpose = l.Purpose,
                    AppliedDate = l.AppliedDate,
                    Status = "Pending",
                    MonthlyInstallment = CalculateEMI(l.Amount, l.TenureMonths)
                })
                .ToListAsync();
            return loans;
        }

        public async Task<int> GetPendingManagerCountAsync(int managerId)
        {
            return await _context.Loans.CountAsync(l => l.ManagerApproved == null);
        }

        public async Task UploadDocumentsAsync(int loanId, int employeeId, List<object> documents)
        {
            // Mock implementation for document upload
            await Task.CompletedTask;
        }

        public async Task<LoanDocumentDTO> GetDocumentAsync(int documentId)
        {
            // Mock implementation
            return await Task.FromResult(new LoanDocumentDTO { Id = documentId, FileName = "document.pdf" });
        }

        public async Task<byte[]> GetDocumentFileAsync(string filePath)
        {
            // Mock implementation
            return await Task.FromResult(new byte[0]);
        }

        public async Task ApproveByManagerAsync(int id, int managerId, string? comments = null)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan != null)
            {
                loan.ManagerApproved = true;
                loan.ManagerId = managerId;
                loan.ManagerComments = comments;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RejectByManagerAsync(int id, int managerId, string reason)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan != null)
            {
                loan.ManagerApproved = false;
                loan.ManagerId = managerId;
                loan.ManagerComments = reason;
                await _context.SaveChangesAsync();
            }
        }

        public async Task ApproveByFinanceAsync(int id, int financeId, string? comments = null)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan != null)
            {
                loan.FinanceApproved = true;
                loan.FinanceId = financeId;
                loan.FinanceComments = comments;
                loan.ApprovedDate = DateTime.Now;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RejectByFinanceAsync(int id, int financeId, string reason)
        {
            var loan = await _context.Loans.FindAsync(id);
            if (loan != null)
            {
                loan.FinanceApproved = false;
                loan.FinanceId = financeId;
                loan.FinanceComments = reason;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetPendingManagerApprovalsAsync()
        {
            return await _context.Loans.CountAsync(l => l.ManagerApproved == null);
        }

        public async Task<int> GetPendingFinanceApprovalsAsync()
        {
            return await _context.Loans.CountAsync(l => l.ManagerApproved == true && l.FinanceApproved == null);
        }

        public async Task<int> GetTotalLoansAsync()
        {
            return await _context.Loans.CountAsync();
        }

        public async Task<int> GetActiveLoansCountAsync(int employeeId)
        {
            return await _context.Loans.CountAsync(l => l.EmployeeId == employeeId && l.FinanceApproved == true);
        }

        public async Task<int> GetPendingEmployeeCountAsync(int employeeId)
        {
            return await _context.Loans.CountAsync(l => l.EmployeeId == employeeId && l.ManagerApproved == null);
        }

        public async Task<IEnumerable<LoanResponseDTO>> GetPendingFinanceApprovals()
        {
            var loans = await _context.Loans
                .Include(l => l.Employee)
                .Where(l => l.ManagerApproved == true && l.FinanceApproved == null)
                .Select(l => new LoanResponseDTO
                {
                    LoanId = l.Id,
                    EmployeeId = l.EmployeeId,
                    EmployeeName = l.Employee.FullName,
                    LoanType = l.LoanType,
                    Amount = l.Amount,
                    TenureMonths = l.TenureMonths,
                    Purpose = l.Purpose,
                    AppliedDate = l.AppliedDate,
                    Status = "ManagerApproved",
                    MonthlyInstallment = CalculateEMI(l.Amount, l.TenureMonths)
                })
                .ToListAsync();
            return loans;
        }
    }
}


