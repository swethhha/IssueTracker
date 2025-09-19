using Microsoft.EntityFrameworkCore;
using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;

namespace Payroll360.Application.Services
{
    public class MedicalClaimService : IMedicalClaimService
    {
        private readonly Payroll360Context _context;

        public MedicalClaimService(Payroll360Context context)
        {
            _context = context;
        }

        public async Task<MedicalClaimResponseDTO> RequestClaimAsync(MedicalClaimRequestDTO request)
        {
            // Get employee details for response
            var employee = await _context.Employees.FindAsync(request.EmployeeId);
            if (employee == null)
                throw new ArgumentException("Employee not found");

            var claim = new MedicalClaim
            {
                EmployeeId = request.EmployeeId,
                Amount = request.Amount ?? request.ClaimAmount,
                ClaimDate = request.ClaimDate ?? DateTime.Now,
                RequestedDate = DateTime.Now,
                HospitalName = request.HospitalName ?? "Unknown Hospital",
                TreatmentType = request.TreatmentType ?? "General",
                Description = request.Description ?? "",
                ManagerApproved = null,
                FinanceApproved = null
            };

            _context.MedicalClaims.Add(claim);
            await _context.SaveChangesAsync();

            return new MedicalClaimResponseDTO
            {
                ClaimId = claim.Id,
                EmployeeId = claim.EmployeeId,
                EmployeeName = employee.FullName,
                ClaimAmount = claim.Amount,
                ClaimDate = claim.ClaimDate,
                HospitalName = claim.HospitalName,
                TreatmentType = claim.TreatmentType,
                Description = claim.Description,
                Status = "Pending",
                CreatedAt = claim.ClaimDate
            };
        }

        public async Task<IEnumerable<MedicalClaimResponseDTO>> GetClaimsByEmployeeAsync(int employeeId)
        {
            var claims = await _context.MedicalClaims
                .Include(c => c.Employee)
                .Where(c => c.EmployeeId == employeeId)
                .Select(c => new MedicalClaimResponseDTO
                {
                    ClaimId = c.Id,
                    EmployeeId = c.EmployeeId,
                    EmployeeName = c.Employee.FullName,
                    ClaimAmount = c.Amount,
                    ClaimDate = c.ClaimDate,
                    HospitalName = c.HospitalName,
                    TreatmentType = c.TreatmentType,
                    Description = c.Description,
                    Status = c.ManagerApproved == null ? "Pending" :
                             c.ManagerApproved == false ? "Rejected" :
                             c.FinanceApproved == null ? "ManagerApproved" :
                             c.FinanceApproved == true ? "Approved" : "Rejected",
                    CreatedAt = c.ClaimDate
                })
                .ToListAsync();
            return claims;
        }

        public async Task ApproveByManagerAsync(int id, int managerId, string? comments = null)
        {
            var claim = await _context.MedicalClaims.FindAsync(id);
            if (claim != null)
            {
                claim.ManagerApproved = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RejectByManagerAsync(int id, int managerId, string reason)
        {
            var claim = await _context.MedicalClaims.FindAsync(id);
            if (claim != null)
            {
                claim.ManagerApproved = false;
                await _context.SaveChangesAsync();
            }
        }

        public async Task ApproveByFinanceAsync(int id, int financeId, string? comments = null)
        {
            var claim = await _context.MedicalClaims.FindAsync(id);
            if (claim != null)
            {
                claim.FinanceApproved = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RejectByFinanceAsync(int id, int financeId, string reason)
        {
            var claim = await _context.MedicalClaims.FindAsync(id);
            if (claim != null)
            {
                claim.FinanceApproved = false;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetPendingManagerApprovalsAsync()
        {
            return await _context.MedicalClaims.CountAsync(c => c.ManagerApproved == null);
        }

        public async Task<int> GetPendingFinanceApprovalsAsync()
        {
            return await _context.MedicalClaims.CountAsync(c => c.ManagerApproved == true && c.FinanceApproved == null);
        }

        public async Task<int> GetTotalClaimsAsync()
        {
            return await _context.MedicalClaims.CountAsync();
        }

        public async Task<IEnumerable<MedicalClaimResponseDTO>> GetPendingManagerApprovals()
        {
            var claims = await _context.MedicalClaims
                .Include(c => c.Employee)
                .Where(c => c.ManagerApproved == null)
                .Select(c => new MedicalClaimResponseDTO
                {
                    ClaimId = c.Id,
                    EmployeeId = c.EmployeeId,
                    EmployeeName = c.Employee.FullName,
                    ClaimAmount = c.Amount,
                    ClaimDate = c.ClaimDate,
                    HospitalName = c.HospitalName,
                    TreatmentType = c.TreatmentType,
                    Description = c.Description,
                    Status = "Pending",
                    CreatedAt = c.ClaimDate
                })
                .ToListAsync();
            return claims;
        }

        public async Task<IEnumerable<MedicalClaimResponseDTO>> GetPendingFinanceApprovals()
        {
            var claims = await _context.MedicalClaims
                .Include(c => c.Employee)
                .Where(c => c.ManagerApproved == true && c.FinanceApproved == null)
                .Select(c => new MedicalClaimResponseDTO
                {
                    ClaimId = c.Id,
                    EmployeeId = c.EmployeeId,
                    EmployeeName = c.Employee.FullName,
                    ClaimAmount = c.Amount,
                    ClaimDate = c.ClaimDate,
                    HospitalName = c.HospitalName,
                    TreatmentType = c.TreatmentType,
                    Description = c.Description,
                    Status = "ManagerApproved",
                    CreatedAt = c.ClaimDate
                })
                .ToListAsync();
            return claims;
        }

        public async Task<int> GetPendingEmployeeCountAsync(int employeeId)
        {
            return await _context.MedicalClaims.CountAsync(c => c.EmployeeId == employeeId && c.ManagerApproved == null);
        }
    }
}