using Microsoft.EntityFrameworkCore;
using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;

namespace Payroll360.Application.Services
{
    public class ReimbursementService : IReimbursementService
    {
        private readonly Payroll360Context _context;

        public ReimbursementService(Payroll360Context context)
        {
            _context = context;
        }

        public async Task<ReimbursementResponseDTO> RequestReimbursementAsync(ReimbursementRequestDTO request)
        {
            var reimbursement = new Reimbursement
            {
                EmployeeId = request.EmployeeId,
                EmployeeName = "Employee " + request.EmployeeId,
                Category = request.Category,
                Amount = request.Amount,
                Description = request.Description,
                RequestedDate = DateTime.Now,
                ManagerApproved = null,
                FinanceApproved = null
            };

            _context.Reimbursements.Add(reimbursement);
            await _context.SaveChangesAsync();

            return new ReimbursementResponseDTO
            {
                RequestId = reimbursement.Id,
                EmployeeId = reimbursement.EmployeeId,
                EmployeeName = reimbursement.EmployeeName,
                Category = reimbursement.Category,
                Amount = reimbursement.Amount,
                Description = reimbursement.Description,
                RequestDate = reimbursement.RequestedDate,
                Status = "Pending",
                AttachmentPath = ""
            };
        }

        public async Task<IEnumerable<ReimbursementResponseDTO>> GetReimbursementsByEmployeeAsync(int employeeId)
        {
            var reimbursements = await _context.Reimbursements
                .Where(r => r.EmployeeId == employeeId)
                .Select(r => new ReimbursementResponseDTO
                {
                    RequestId = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.EmployeeName,
                    Category = r.Category,
                    Amount = r.Amount,
                    Description = r.Description,
                    RequestDate = r.RequestedDate,
                    Status = r.ManagerApproved == null ? "Pending" :
                             r.ManagerApproved == false ? "Rejected" :
                             r.FinanceApproved == null ? "ManagerApproved" :
                             r.FinanceApproved == true ? "Approved" : "Rejected",
                    ManagerApproved = r.ManagerApproved,
                    FinanceApproved = r.FinanceApproved,
                    AttachmentPath = ""
                })
                .ToListAsync();
            return reimbursements;
        }

        public async Task ApproveByManagerAsync(int id, int managerId, string? comments = null)
        {
            var reimbursement = await _context.Reimbursements.FindAsync(id);
            if (reimbursement != null)
            {
                reimbursement.ManagerApproved = true;
                reimbursement.ManagerId = managerId;
                reimbursement.ManagerComments = comments;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RejectByManagerAsync(int id, int managerId, string reason)
        {
            var reimbursement = await _context.Reimbursements.FindAsync(id);
            if (reimbursement != null)
            {
                reimbursement.ManagerApproved = false;
                reimbursement.ManagerId = managerId;
                reimbursement.ManagerComments = reason;
                await _context.SaveChangesAsync();
            }
        }

        public async Task ApproveByFinanceAsync(int id, int financeId, string? comments = null)
        {
            var reimbursement = await _context.Reimbursements.FindAsync(id);
            if (reimbursement != null)
            {
                reimbursement.FinanceApproved = true;
                reimbursement.FinanceId = financeId;
                reimbursement.FinanceComments = comments;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RejectByFinanceAsync(int id, int financeId, string reason)
        {
            var reimbursement = await _context.Reimbursements.FindAsync(id);
            if (reimbursement != null)
            {
                reimbursement.FinanceApproved = false;
                reimbursement.FinanceId = financeId;
                reimbursement.FinanceComments = reason;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetPendingManagerApprovalsAsync()
        {
            return await _context.Reimbursements.CountAsync(r => r.ManagerApproved == null);
        }

        public async Task<int> GetPendingFinanceApprovalsAsync()
        {
            return await _context.Reimbursements.CountAsync(r => r.ManagerApproved == true && r.FinanceApproved == null);
        }

        public async Task<int> GetTotalReimbursementsAsync()
        {
            return await _context.Reimbursements.CountAsync();
        }

        public async Task<int> GetPendingEmployeeReimbursementsCount(int employeeId)
        {
            return await _context.Reimbursements.CountAsync(r => r.EmployeeId == employeeId && r.ManagerApproved == null);
        }

        public async Task<IEnumerable<ReimbursementResponseDTO>> GetPendingManagerApprovals()
        {
            var reimbursements = await _context.Reimbursements
                .Where(r => r.ManagerApproved == null)
                .Select(r => new ReimbursementResponseDTO
                {
                    RequestId = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.EmployeeName,
                    Category = r.Category,
                    Amount = r.Amount,
                    Description = r.Description,
                    RequestDate = r.RequestedDate,
                    Status = "Pending",
                    AttachmentPath = ""
                })
                .ToListAsync();
            return reimbursements;
        }

        public async Task<int> GetPendingManagerCount()
        {
            return await _context.Reimbursements.CountAsync(r => r.ManagerApproved == null);
        }

        public async Task<IEnumerable<ReimbursementResponseDTO>> GetPendingFinanceApprovals()
        {
            var reimbursements = await _context.Reimbursements
                .Where(r => r.ManagerApproved == true && r.FinanceApproved == null)
                .Select(r => new ReimbursementResponseDTO
                {
                    RequestId = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.EmployeeName,
                    Category = r.Category,
                    Amount = r.Amount,
                    Description = r.Description,
                    RequestDate = r.RequestedDate,
                    Status = "ManagerApproved",
                    AttachmentPath = ""
                })
                .ToListAsync();
            return reimbursements;
        }

        public async Task<int> GetPendingEmployeeCountAsync(int employeeId)
        {
            return await _context.Reimbursements.CountAsync(r => r.EmployeeId == employeeId && r.ManagerApproved == null);
        }

        public async Task SeedSampleDataAsync()
        {
            if (!await _context.Reimbursements.AnyAsync())
            {
                var sampleReimbursements = new List<Reimbursement>
                {
                    new Reimbursement { EmployeeId = 1, EmployeeName = "John Doe", Category = "Travel", Amount = 2500, Description = "Business trip to Mumbai", RequestedDate = DateTime.Now.AddDays(-5), ManagerApproved = null, FinanceApproved = null },
                    new Reimbursement { EmployeeId = 1, EmployeeName = "John Doe", Category = "Food", Amount = 850, Description = "Client dinner meeting", RequestedDate = DateTime.Now.AddDays(-3), ManagerApproved = true, FinanceApproved = null },
                    new Reimbursement { EmployeeId = 2, EmployeeName = "Jane Smith", Category = "Office Supplies", Amount = 1200, Description = "Laptop accessories", RequestedDate = DateTime.Now.AddDays(-7), ManagerApproved = null, FinanceApproved = null },
                    new Reimbursement { EmployeeId = 2, EmployeeName = "Jane Smith", Category = "Training", Amount = 5000, Description = "AWS certification course", RequestedDate = DateTime.Now.AddDays(-10), ManagerApproved = true, FinanceApproved = true },
                    new Reimbursement { EmployeeId = 3, EmployeeName = "Mike Johnson", Category = "Communication", Amount = 300, Description = "Mobile bill reimbursement", RequestedDate = DateTime.Now.AddDays(-2), ManagerApproved = null, FinanceApproved = null },
                    new Reimbursement { EmployeeId = 3, EmployeeName = "Mike Johnson", Category = "Travel", Amount = 1800, Description = "Conference travel expenses", RequestedDate = DateTime.Now.AddDays(-8), ManagerApproved = true, FinanceApproved = null },
                    new Reimbursement { EmployeeId = 4, EmployeeName = "Sarah Wilson", Category = "Other", Amount = 450, Description = "Software license", RequestedDate = DateTime.Now.AddDays(-1), ManagerApproved = null, FinanceApproved = null }
                };

                _context.Reimbursements.AddRange(sampleReimbursements);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<IEnumerable<ReimbursementResponseDTO>> GetAllReimbursementsAsync()
        {
            var reimbursements = await _context.Reimbursements
                .Select(r => new ReimbursementResponseDTO
                {
                    RequestId = r.Id,
                    EmployeeId = r.EmployeeId,
                    EmployeeName = r.EmployeeName,
                    Category = r.Category,
                    Amount = r.Amount,
                    Description = r.Description,
                    RequestDate = r.RequestedDate,
                    Status = r.ManagerApproved == null ? "Pending" :
                             r.ManagerApproved == false ? "Rejected" :
                             r.FinanceApproved == null ? "ManagerApproved" :
                             r.FinanceApproved == true ? "Approved" : "Rejected",
                    ManagerApproved = r.ManagerApproved,
                    FinanceApproved = r.FinanceApproved,
                    AttachmentPath = ""
                })
                .OrderByDescending(r => r.RequestDate)
                .ToListAsync();
            return reimbursements;
        }
    }
}
