using Microsoft.EntityFrameworkCore;
using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;

namespace Payroll360.Application.Services
{
    public class PayrollService : IPayrollService
    {
        private readonly Payroll360Context _context;

        public PayrollService(Payroll360Context context)
        {
            _context = context;
        }

        public async Task<IEnumerable<PayrollResponseDTO>> GetPayrollsByEmployeeAsync(int employeeId)
        {
            var payrolls = await _context.Payrolls
                .Include(p => p.Employee)
                .Where(p => p.EmployeeId == employeeId)
                .Select(p => new PayrollResponseDTO
                {
                    Id = p.Id,
                    EmployeeId = p.EmployeeId,
                    EmployeeName = p.Employee.FullName,
                    BasicSalary = p.BasicSalary,
                    NetPay = p.NetSalary,
                    PayPeriodStart = p.PeriodStart,
                    PayPeriodEnd = p.PeriodEnd,
                    Status = p.ManagerApproved == false ? "Pending" : 
                             p.FinanceApproved == true ? "Approved" : "ManagerApproved"
                })
                .ToListAsync();
            return payrolls;
        }

        public async Task<PayrollSummaryDTO> GetPayrollSummaryAsync(int employeeId)
        {
            var payrolls = await _context.Payrolls
                .Where(p => p.EmployeeId == employeeId)
                .ToListAsync();

            return new PayrollSummaryDTO
            {
                TotalEarnings = payrolls.Sum(p => p.BasicSalary + p.Allowances),
                TotalDeductions = payrolls.Sum(p => p.Deductions),
                NetPay = payrolls.Sum(p => p.NetSalary),
                PayrollCount = payrolls.Count
            };
        }

        public async Task ApproveByManagerAsync(int id, int managerId, string? comments = null)
        {
            var payroll = await _context.Payrolls.FindAsync(id);
            if (payroll != null)
            {
                payroll.ManagerApproved = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RejectByManagerAsync(int id, int managerId, string reason)
        {
            var payroll = await _context.Payrolls.FindAsync(id);
            if (payroll != null)
            {
                payroll.ManagerApproved = false;
                await _context.SaveChangesAsync();
            }
        }

        public async Task ApproveByFinanceAsync(int id, int financeId, string? comments = null)
        {
            var payroll = await _context.Payrolls.FindAsync(id);
            if (payroll != null)
            {
                payroll.FinanceApproved = true;
                await _context.SaveChangesAsync();
            }
        }

        public async Task RejectByFinanceAsync(int id, int financeId, string reason)
        {
            var payroll = await _context.Payrolls.FindAsync(id);
            if (payroll != null)
            {
                payroll.FinanceApproved = false;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<int> GetPendingManagerApprovalsAsync()
        {
            return await _context.Payrolls.CountAsync(p => p.ManagerApproved == false);
        }

        public async Task<int> GetPendingManagerCountAsync()
        {
            return await _context.Payrolls.CountAsync(p => p.ManagerApproved == false);
        }

        public async Task<int> GetPendingFinanceApprovalsAsync()
        {
            return await _context.Payrolls.CountAsync(p => p.ManagerApproved == true && p.FinanceApproved == false);
        }

        public async Task<int> GetTotalEmployeesAsync()
        {
            return await _context.Employees.CountAsync();
        }

        public async Task<int> GetTotalPayrollsAsync()
        {
            return await _context.Payrolls.CountAsync();
        }

        public async Task<decimal> GetTotalEarningsAsync(int employeeId)
        {
            var total = await _context.Payrolls
                .Where(p => p.EmployeeId == employeeId)
                .SumAsync(p => p.BasicSalary + p.Allowances);
            return total;
        }

        public async Task<decimal> GetTotalNetPayAsync(int employeeId)
        {
            var total = await _context.Payrolls
                .Where(p => p.EmployeeId == employeeId)
                .SumAsync(p => p.NetSalary);
            return total;
        }

        public async Task<IEnumerable<PayrollResponseDTO>> GetPendingApprovalsAsync()
        {
            var payrolls = await _context.Payrolls
                .Include(p => p.Employee)
                .Where(p => p.ManagerApproved == false)
                .Select(p => new PayrollResponseDTO
                {
                    Id = p.Id,
                    EmployeeId = p.EmployeeId,
                    EmployeeName = p.Employee.FullName,
                    BasicSalary = p.BasicSalary,
                    NetPay = p.NetSalary,
                    PayPeriodStart = p.PeriodStart,
                    PayPeriodEnd = p.PeriodEnd,
                    Status = "Pending"
                })
                .ToListAsync();
            return payrolls;
        }

        public async Task<IEnumerable<PayrollResponseDTO>> GetPendingManagerApprovals()
        {
            return await GetPendingApprovalsAsync();
        }

        public async Task<IEnumerable<PayrollResponseDTO>> GetRecentPayrollsAsync(int employeeId, int count)
        {
            var payrolls = await _context.Payrolls
                .Include(p => p.Employee)
                .Where(p => p.EmployeeId == employeeId)
                .OrderByDescending(p => p.PeriodEnd)
                .Take(count)
                .Select(p => new PayrollResponseDTO
                {
                    Id = p.Id,
                    EmployeeId = p.EmployeeId,
                    EmployeeName = p.Employee.FullName,
                    BasicSalary = p.BasicSalary,
                    NetPay = p.NetSalary,
                    PayPeriodStart = p.PeriodStart,
                    PayPeriodEnd = p.PeriodEnd,
                    Status = p.ManagerApproved == false ? "Pending" : 
                             p.FinanceApproved == true ? "Approved" : "ManagerApproved"
                })
                .ToListAsync();
            return payrolls;
        }

        public async Task<IEnumerable<PayrollResponseDTO>> GetPayrollHistoryAsync(int employeeId, int months)
        {
            var startDate = DateTime.Now.AddMonths(-months);
            var payrolls = await _context.Payrolls
                .Include(p => p.Employee)
                .Where(p => p.EmployeeId == employeeId && p.PeriodStart >= startDate)
                .OrderByDescending(p => p.PeriodEnd)
                .Select(p => new PayrollResponseDTO
                {
                    Id = p.Id,
                    EmployeeId = p.EmployeeId,
                    EmployeeName = p.Employee.FullName,
                    BasicSalary = p.BasicSalary,
                    NetPay = p.NetSalary,
                    PayPeriodStart = p.PeriodStart,
                    PayPeriodEnd = p.PeriodEnd,
                    Status = p.ManagerApproved == false ? "Pending" : 
                             p.FinanceApproved == true ? "Approved" : "ManagerApproved"
                })
                .ToListAsync();
            return payrolls;
        }

        public async Task<IEnumerable<PayrollResponseDTO>> GetPendingFinanceApprovals()
        {
            var payrolls = await _context.Payrolls
                .Include(p => p.Employee)
                .Where(p => p.ManagerApproved == true && p.FinanceApproved == false)
                .Select(p => new PayrollResponseDTO
                {
                    Id = p.Id,
                    EmployeeId = p.EmployeeId,
                    EmployeeName = p.Employee.FullName,
                    BasicSalary = p.BasicSalary,
                    NetPay = p.NetSalary,
                    PayPeriodStart = p.PeriodStart,
                    PayPeriodEnd = p.PeriodEnd,
                    Status = "ManagerApproved"
                })
                .ToListAsync();
            return payrolls;
        }
    }
}