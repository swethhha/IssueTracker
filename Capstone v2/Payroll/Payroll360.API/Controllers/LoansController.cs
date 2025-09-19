using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payroll360.Core.DTOs;
using Payroll360.Core.Interfaces;
using System.Security.Claims;
using System.Linq;

namespace Payroll360.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiExplorerSettings(GroupName = "loans")]
    public class LoansController : ControllerBase
    {
        private readonly ILoanService _loanService;
        private const string NameIdentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

        public LoansController(ILoanService loanService)
        {
            _loanService = loanService;
        }

        // ================= GET MY LOANS =================
        [HttpGet("my")]
        public async Task<ActionResult<IEnumerable<LoanResponseDTO>>> GetMyLoans()
        {
            var employeeLoans = await _loanService.GetLoansByEmployeeAsync(1);
            return Ok(employeeLoans);
        }

        [HttpGet("employee/{employeeId}")]
        public async Task<ActionResult<IEnumerable<LoanResponseDTO>>> GetEmployeeLoans(int employeeId)
        {
            var employeeLoans = await _loanService.GetLoansByEmployeeAsync(employeeId);
            return Ok(employeeLoans);
        }

        // ================= GET ALL LOANS =================
        [HttpGet]
        // [Authorize(Roles = "Admin,Manager,FinanceAdmin,Employee")] // Temporarily disabled
        public async Task<ActionResult<IEnumerable<LoanResponseDTO>>> GetAll()
        {
            var allLoans = await _loanService.GetAllLoansAsync();
            return Ok(allLoans);
        }

        // ================= GET LOAN BY ID =================
        [HttpGet("{id}", Name = "GetLoanById")]
        [Authorize(Roles = "Admin,Manager,FinanceAdmin,Employee")]
        public async Task<ActionResult<LoanResponseDTO>> GetById(int id)
        {
            var loan = (await _loanService.GetAllLoansAsync()).FirstOrDefault(l => l.LoanId == id);
            if (loan == null) return NotFound();

            if (User.IsInRole("Employee"))
            {
                var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
                if (!int.TryParse(userIdClaim, out int employeeId))
                    return BadRequest("Invalid user ID.");

                if (loan.EmployeeId != employeeId)
                    return Forbid();
            }

            return Ok(loan);
        }

        // ================= APPLY FOR LOAN =================
        [HttpPost("apply")]
        [Authorize(Roles = "Employee,Manager")]
        public async Task<ActionResult<LoanResponseDTO>> Apply([FromBody] LoanRequestDTO request)
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int employeeId))
                return BadRequest("Invalid employee ID.");

            request.EmployeeId = employeeId;

            if (!request.AcceptTerms)
                return BadRequest("Terms and conditions must be accepted.");

            var loan = await _loanService.ApplyForLoanAsync(request);
            return CreatedAtRoute("GetLoanById", new { id = loan.LoanId }, loan);
        }

        // ================= MANAGER APPROVAL =================
        [HttpPut("{id}/manager-approve")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> ApproveByManager(int id, [FromQuery] string? comments = null)
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int managerId))
                return BadRequest("Invalid manager ID.");

            await _loanService.ApproveByManagerAsync(id, managerId, comments);
            return Ok("Loan approved by manager.");
        }

        [HttpPut("{id}/manager-reject")]
        [Authorize(Roles = "Manager")]
        public async Task<IActionResult> RejectByManager(int id, [FromQuery] string reason)
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int managerId))
                return BadRequest("Invalid manager ID.");

            await _loanService.RejectByManagerAsync(id, managerId, reason);
            return Ok("Loan rejected by manager.");
        }

        // ================= FINANCE APPROVAL =================
        [HttpPut("{id}/finance-approve")]
        [Authorize(Roles = "FinanceAdmin")]
        public async Task<IActionResult> ApproveByFinance(int id, [FromQuery] string? comments = null)
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int financeId))
                return BadRequest("Invalid finance ID.");

            await _loanService.ApproveByFinanceAsync(id, financeId, comments);
            return Ok("Loan approved by finance.");
        }

        [HttpPut("{id}/finance-reject")]
        [Authorize(Roles = "FinanceAdmin")]
        public async Task<IActionResult> RejectByFinance(int id, [FromQuery] string reason)
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int financeId))
                return BadRequest("Invalid finance ID.");

            await _loanService.RejectByFinanceAsync(id, financeId, reason);
            return Ok("Loan rejected by finance.");
        }

        // ================= MANAGER DASHBOARD ENDPOINTS =================
        [HttpGet("pending-manager-approvals")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<IEnumerable<LoanResponseDTO>>> GetPendingManagerApprovals()
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int managerId))
                return BadRequest("Invalid manager ID.");

            var pendingLoans = await _loanService.GetPendingManagerApprovalsAsync(managerId);
            return Ok(pendingLoans);
        }

        [HttpGet("pending-manager-count")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<int>> GetPendingManagerCount()
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int managerId))
                return BadRequest("Invalid manager ID.");

            var count = await _loanService.GetPendingManagerCountAsync(managerId);
            return Ok(count);
        }

        // ================= DOCUMENT ENDPOINTS =================
        // Document upload functionality removed for simplicity

        [HttpGet("document/{documentId}")]
        [Authorize]
        public async Task<ActionResult> DownloadDocument(int documentId)
        {
            var document = await _loanService.GetDocumentAsync(documentId);
            if (document == null)
                return NotFound("Document not found.");

            var fileBytes = await _loanService.GetDocumentFileAsync(document.FilePath);
            return File(fileBytes, "application/octet-stream", document.FileName);
        }

        [HttpGet("pending-approvals")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<IEnumerable<LoanResponseDTO>>> GetPendingApprovals()
        {
            var userIdClaim = User.FindFirstValue(NameIdentifierClaim);
            if (!int.TryParse(userIdClaim, out int managerId))
                return BadRequest("Invalid manager ID.");

            var pendingLoans = await _loanService.GetPendingManagerApprovalsAsync(managerId);
            return Ok(pendingLoans);
        }

        // ================= FINANCE DASHBOARD ENDPOINTS =================
        [HttpGet("pending-finance-approvals")]
        [Authorize(Roles = "FinanceAdmin")]
        public async Task<ActionResult<IEnumerable<LoanResponseDTO>>> GetPendingFinanceApprovals()
        {
            var pendingLoans = await _loanService.GetPendingFinanceApprovals();
            return Ok(pendingLoans);
        }

        [HttpGet("pending-finance-count")]
        [Authorize(Roles = "FinanceAdmin")]
        public async Task<ActionResult<int>> GetPendingFinanceCount()
        {
            var count = await _loanService.GetPendingFinanceApprovalsAsync();
            return Ok(count);
        }

        // ================= DASHBOARD STATS =================
        [HttpGet("stats/total")]
        [Authorize(Roles = "Admin,Manager,FinanceAdmin")]
        public async Task<ActionResult<int>> GetTotalLoans()
        {
            var total = await _loanService.GetTotalLoansAsync();
            return Ok(total);
        }

        [HttpGet("stats/pending-manager")]
        [Authorize(Roles = "Admin,Manager")]
        public async Task<ActionResult<int>> GetPendingManagerApprovalsCount()
        {
            var count = await _loanService.GetPendingManagerApprovalsAsync();
            return Ok(count);
        }

        [HttpGet("stats/pending-finance")]
        [Authorize(Roles = "Admin,FinanceAdmin")]
        public async Task<ActionResult<int>> GetPendingFinanceApprovalsCount()
        {
            var count = await _loanService.GetPendingFinanceApprovalsAsync();
            return Ok(count);
        }

    }
}
