using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payroll360.Core.DTOs;
using Payroll360.Core.Interfaces;
using System.Security.Claims;

namespace Payroll360.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiExplorerSettings(GroupName = "insurance")]
    public class InsuranceController : ControllerBase
    {
        private readonly IInsuranceService _insuranceService;
        private const string NameIdentifierClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

        public InsuranceController(IInsuranceService insuranceService)
        {
            _insuranceService = insuranceService;
        }

        // ================= GET ALL POLICIES =================
        [HttpGet("policies")]
        // [Authorize(Roles = "Admin,Employee")] // Temporarily disabled
        public async Task<ActionResult<IEnumerable<InsurancePolicyResponseDTO>>> GetPolicies()
        {
            var policies = await _insuranceService.GetInsurancePoliciesByEmployeeAsync(1);
            return Ok(policies);
        }

        // ================= GET MY ENROLLMENTS =================
        [HttpGet("my-enrollments")]
        // [Authorize(Roles = "Employee")] // Temporarily disabled
        public async Task<ActionResult<IEnumerable<InsurancePolicyResponseDTO>>> GetMyEnrollments()
        {
            var enrollments = await _insuranceService.GetInsurancePoliciesByEmployeeAsync(1);
            return Ok(enrollments);
        }

        // ================= GET ALL POLICIES FOR EMPLOYEE (OLD) =================
        [HttpGet]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<ActionResult<IEnumerable<InsurancePolicyResponseDTO>>> GetPoliciesOld()
        {
            int employeeId;

            if (User.IsInRole("Employee"))
            {
                var userIdString = User.FindFirstValue(NameIdentifierClaim);
                if (!int.TryParse(userIdString, out employeeId))
                    return BadRequest("Invalid employee ID.");

                var policies = await _insuranceService.GetInsurancePoliciesByEmployeeAsync(employeeId);
                return Ok(policies);
            }

            // Admin: optionally get policies for all employees
            return Ok(await _insuranceService.GetInsurancePoliciesByEmployeeAsync(0)); // 0 or implement GetAllPoliciesAsync in service
        }

        // ================= ENROLL EMPLOYEE IN POLICY =================
        [HttpPost("enroll")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<ActionResult> Enroll([FromBody] InsuranceEnrollmentRequestDTO enrollmentRequest)
        {
            if (enrollmentRequest == null)
                return BadRequest("Invalid request.");

            // Employee can only enroll self
            if (User.IsInRole("Employee"))
            {
                var userIdString = User.FindFirstValue(NameIdentifierClaim);
                if (!int.TryParse(userIdString, out int employeeId))
                    return BadRequest("Invalid employee ID.");

                enrollmentRequest.EmployeeId = employeeId;
            }

            try
            {
                await _insuranceService.EnrollAsync(enrollmentRequest);
                return Ok("Enrollment successful.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // ================= DASHBOARD: TOTAL POLICIES =================
        [HttpGet("total-policies")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> GetTotalPolicies()
        {
            var total = await _insuranceService.GetTotalPoliciesAsync();
            return Ok(total);
        }

        // ================= DASHBOARD: ACTIVE POLICIES FOR EMPLOYEE =================
        [HttpGet("active-count")]
        [Authorize(Roles = "Admin,Employee")]
        public async Task<ActionResult<int>> GetActivePoliciesCount()
        {
            int employeeId;

            if (User.IsInRole("Employee"))
            {
                var userIdString = User.FindFirstValue(NameIdentifierClaim);
                if (!int.TryParse(userIdString, out employeeId))
                    return BadRequest("Invalid employee ID.");
            }
            else
            {
                // Admin: optionally provide employeeId via query param
                employeeId = int.Parse(Request.Query["employeeId"]);
            }

            var count = await _insuranceService.GetActivePoliciesCountAsync(employeeId);
            return Ok(count);
        }

        [HttpGet("pending-manager-count")]
        [Authorize(Roles = "Manager")]
        public async Task<ActionResult<int>> GetPendingManagerCount()
        {
            var count = await _insuranceService.GetPendingManagerApprovalsAsync();
            return Ok(count);
        }
    }
}