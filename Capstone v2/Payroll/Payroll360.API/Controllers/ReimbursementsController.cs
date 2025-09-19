using Microsoft.AspNetCore.Mvc;
using Payroll360.Core.DTOs;
using Payroll360.Core.Interfaces;

namespace Payroll360.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReimbursementsController : ControllerBase
    {
        private readonly IReimbursementService _reimbursementService;

        public ReimbursementsController(IReimbursementService reimbursementService)
        {
            _reimbursementService = reimbursementService;
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<ActionResult<IEnumerable<ReimbursementResponseDTO>>> GetEmployeeReimbursements(int employeeId)
        {
            var reimbursements = await _reimbursementService.GetReimbursementsByEmployeeAsync(employeeId);
            return Ok(reimbursements);
        }

        [HttpPost("request")]
        public async Task<ActionResult<ReimbursementResponseDTO>> RequestReimbursement([FromBody] ReimbursementRequestDTO request)
        {
            try
            {
                var result = await _reimbursementService.RequestReimbursementAsync(request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message, details = ex.InnerException?.Message });
            }
        }

        [HttpGet("pending-manager-approvals")]
        public async Task<ActionResult<IEnumerable<ReimbursementResponseDTO>>> GetPendingManagerApprovals()
        {
            var reimbursements = await _reimbursementService.GetPendingManagerApprovals();
            return Ok(reimbursements);
        }

        [HttpGet("pending-manager-count")]
        public async Task<ActionResult<int>> GetPendingManagerCount()
        {
            var count = await _reimbursementService.GetPendingManagerCount();
            return Ok(count);
        }

        [HttpPost("{id}/approve-manager")]
        public async Task<IActionResult> ApproveByManager(int id, [FromQuery] string? comments = null)
        {
            await _reimbursementService.ApproveByManagerAsync(id, 1, comments);
            return Ok();
        }

        [HttpPost("{id}/reject-manager")]
        public async Task<IActionResult> RejectByManager(int id, [FromQuery] string reason)
        {
            await _reimbursementService.RejectByManagerAsync(id, 1, reason);
            return Ok();
        }

        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<ReimbursementResponseDTO>>> GetMyReimbursements()
        {
            var reimbursements = await _reimbursementService.GetReimbursementsByEmployeeAsync(1);
            return Ok(reimbursements);
        }

        [HttpGet("my-pending-count")]
        public async Task<ActionResult<int>> GetMyPendingCount()
        {
            var count = await _reimbursementService.GetPendingEmployeeCountAsync(1);
            return Ok(count);
        }

        [HttpGet("pending-approvals")]
        public async Task<ActionResult<IEnumerable<ReimbursementResponseDTO>>> GetPendingApprovals()
        {
            var reimbursements = await _reimbursementService.GetPendingManagerApprovals();
            return Ok(reimbursements);
        }

        [HttpGet("pending-finance-count")]
        public async Task<ActionResult<int>> GetPendingFinanceCount()
        {
            var count = await _reimbursementService.GetPendingFinanceApprovalsAsync();
            return Ok(count);
        }

        [HttpGet("total")]
        public async Task<ActionResult<int>> GetTotalReimbursements()
        {
            var count = await _reimbursementService.GetTotalReimbursementsAsync();
            return Ok(count);
        }

        [HttpPost("{id}/approve-finance")]
        public async Task<IActionResult> ApproveByFinance(int id, [FromQuery] string? comments = null)
        {
            await _reimbursementService.ApproveByFinanceAsync(id, 1, comments);
            return Ok();
        }

        [HttpPost("{id}/reject-finance")]
        public async Task<IActionResult> RejectByFinance(int id, [FromQuery] string reason)
        {
            await _reimbursementService.RejectByFinanceAsync(id, 1, reason);
            return Ok();
        }

        [HttpGet("pending-finance-approvals")]
        public async Task<ActionResult<IEnumerable<ReimbursementResponseDTO>>> GetPendingFinanceApprovals()
        {
            var reimbursements = await _reimbursementService.GetPendingFinanceApprovals();
            return Ok(reimbursements);
        }

        [HttpPost("seed-data")]
        public async Task<IActionResult> SeedData()
        {
            await _reimbursementService.SeedSampleDataAsync();
            return Ok("Sample data seeded successfully");
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<ReimbursementResponseDTO>>> GetAllReimbursements()
        {
            var reimbursements = await _reimbursementService.GetAllReimbursementsAsync();
            return Ok(reimbursements);
        }
    }
}