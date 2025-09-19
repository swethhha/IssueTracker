using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payroll360.Core.DTOs;
using Payroll360.Core.Interfaces;
using System.Security.Claims;

namespace Payroll360.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiExplorerSettings(GroupName = "medicalclaims")]
    public class MedicalClaimsController : ControllerBase
    {
        private readonly IMedicalClaimService _service;
        private const string NameIdentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

        public MedicalClaimsController(IMedicalClaimService service)
        {
            _service = service;
        }

        // ================= REQUEST MEDICAL CLAIM =================
        [HttpPost("request")]
        [Authorize(Roles = "Employee,Manager")]
        public async Task<ActionResult<MedicalClaimResponseDTO>> Request([FromBody] MedicalClaimRequestDTO dto)
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int employeeId))
                return Unauthorized("Invalid user identifier.");

            dto.EmployeeId = employeeId;
            
            if (!dto.Declaration)
                return BadRequest("Declaration must be accepted.");

            var claim = await _service.RequestClaimAsync(dto);
            return Ok(claim);
        }

        // ================= GET EMPLOYEE CLAIMS =================
        [HttpGet("my")]
        [Authorize(Roles = "Employee,Manager")]
        public async Task<ActionResult<IEnumerable<MedicalClaimResponseDTO>>> GetMyClaims()
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int employeeId))
                return Unauthorized("Invalid user identifier.");

            var claims = await _service.GetClaimsByEmployeeAsync(employeeId);
            return Ok(claims);
        }

        // ================= MANAGER APPROVAL =================
        [HttpPost("{id}/approve-manager")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult> ApproveByManager(int id, [FromBody] string? comments = null)
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int managerId))
                return Unauthorized("Invalid manager identifier.");

            await _service.ApproveByManagerAsync(id, managerId, comments);
            return Ok("Medical claim approved by manager.");
        }

        [HttpPost("{id}/reject-manager")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult> RejectByManager(int id, [FromBody] string reason)
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int managerId))
                return Unauthorized("Invalid manager identifier.");

            await _service.RejectByManagerAsync(id, managerId, reason);
            return Ok("Medical claim rejected by manager.");
        }

        // ================= FINANCE APPROVAL =================
        [HttpPost("{id}/approve-finance")]
        [Authorize(Roles = "FinanceAdmin")]
        public async Task<ActionResult> ApproveByFinance(int id, [FromBody] string? comments = null)
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int financeId))
                return Unauthorized("Invalid finance identifier.");

            await _service.ApproveByFinanceAsync(id, financeId, comments);
            return Ok("Medical claim approved by finance.");
        }

        [HttpPost("{id}/reject-finance")]
        [Authorize(Roles = "FinanceAdmin")]
        public async Task<ActionResult> RejectByFinance(int id, [FromBody] string reason)
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int financeId))
                return Unauthorized("Invalid finance identifier.");

            await _service.RejectByFinanceAsync(id, financeId, reason);
            return Ok("Medical claim rejected by finance.");
        }

        // ================= DASHBOARD / ADMIN =================
        [HttpGet("pending-manager-count")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<int>> GetPendingManagerCount()
        {
            var count = await _service.GetPendingManagerApprovalsAsync();
            return Ok(count);
        }

        [HttpGet("pending-finance-count")]
        [Authorize(Roles = "FinanceAdmin")]
        public async Task<ActionResult<int>> GetPendingFinanceCount()
        {
            var count = await _service.GetPendingFinanceApprovalsAsync();
            return Ok(count);
        }

        [HttpGet("my-pending-count")]
        [Authorize(Roles = "Employee")]
        public async Task<ActionResult<int>> GetMyPendingCount()
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int employeeId))
                return Unauthorized("Invalid user identifier.");

            var count = await _service.GetPendingEmployeeCountAsync(employeeId);
            return Ok(count);
        }

        [HttpGet("total")]
        [Authorize(Roles = "Admin,Manager,FinanceAdmin")]
        public async Task<ActionResult<int>> GetTotalClaims()
        {
            var count = await _service.GetTotalClaimsAsync();
            return Ok(count);
        }

        [HttpGet("pending-manager-approvals")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<IEnumerable<MedicalClaimResponseDTO>>> GetPendingManagerApprovals()
        {
            var claims = await _service.GetPendingManagerApprovals();
            return Ok(claims);
        }

        [HttpGet("pending-finance-approvals")]
        [Authorize(Roles = "FinanceAdmin")]
        public async Task<ActionResult<IEnumerable<MedicalClaimResponseDTO>>> GetPendingFinanceApprovals()
        {
            var claims = await _service.GetPendingFinanceApprovals();
            return Ok(claims);
        }
    }
}