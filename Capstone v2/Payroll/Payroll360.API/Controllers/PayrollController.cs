using Microsoft.AspNetCore.Mvc;
using Payroll360.Core.DTOs;
using Payroll360.Core.Interfaces;

namespace Payroll360.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PayrollController : ControllerBase
    {
        private readonly IPayrollService _payrollService;

        public PayrollController(IPayrollService payrollService)
        {
            _payrollService = payrollService;
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<ActionResult<IEnumerable<PayrollResponseDTO>>> GetEmployeePayrolls(int employeeId)
        {
            var payrolls = await _payrollService.GetPayrollsByEmployeeAsync(employeeId);
            return Ok(payrolls);
        }

        [HttpGet("pending-manager-approvals")]
        public async Task<ActionResult<IEnumerable<PayrollResponseDTO>>> GetPendingManagerApprovals()
        {
            var payrolls = await _payrollService.GetPendingManagerApprovalsAsync();
            return Ok(payrolls);
        }

        [HttpGet("pending-manager-count")]
        public async Task<ActionResult<int>> GetPendingManagerCount()
        {
            var count = await _payrollService.GetPendingManagerCountAsync();
            return Ok(count);
        }

        [HttpPost("{id}/approve-manager")]
        public async Task<IActionResult> ApproveByManager(int id, [FromQuery] string? comments = null)
        {
            await _payrollService.ApproveByManagerAsync(id, 1, comments);
            return Ok();
        }

        [HttpPost("{id}/reject-manager")]
        public async Task<IActionResult> RejectByManager(int id, [FromQuery] string reason)
        {
            await _payrollService.RejectByManagerAsync(id, 1, reason);
            return Ok();
        }
    }
}