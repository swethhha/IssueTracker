using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Payroll360.Core.DTOs;
using Payroll360.Core.Interfaces;
using System.Security.Claims;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [ApiExplorerSettings(GroupName = "notifications")]
    public class NotificationsController : ControllerBase
    {
        private readonly INotificationService _service;

        public NotificationsController(INotificationService service)
        {
            _service = service;
        }

        // ================= GET ALL NOTIFICATIONS =================
        [HttpGet("my")]
        [Authorize(Roles = "Employee,Manager,FinanceAdmin")]
        public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetMyNotifications()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int employeeId))
                return Unauthorized("Invalid user identifier.");

            var notifications = await _service.GetNotificationsAsync(employeeId);
            return Ok(notifications);
        }

        // ================= GET UNREAD COUNT =================
        [HttpGet("my/unread-count")]
        [Authorize(Roles = "Employee,Manager,FinanceAdmin")]
        public async Task<ActionResult<int>> GetUnreadCount()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int employeeId))
                return Unauthorized("Invalid user identifier.");

            var count = await _service.GetUnreadNotificationsCountAsync(employeeId);
            return Ok(count);
        }

        // ================= MARK AS READ =================
        [HttpPut("{id}/mark-read")]
        [Authorize(Roles = "Employee,Manager,FinanceAdmin")]
        public async Task<ActionResult> MarkAsRead(int id)
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userIdClaim, out int employeeId))
                return Unauthorized("Invalid user identifier.");

            await _service.MarkAsReadAsync(id, employeeId);
            return Ok("Notification marked as read.");
        }

        // ================= SEND NOTIFICATION (ADMIN/HR/FINANCE) =================
        [HttpPost("send")]
        [Authorize(Roles = "Manager,FinanceAdmin")]
        public async Task<ActionResult> SendNotification([FromBody] NotificationRequestDTO dto)
        {
            if (dto == null || dto.EmployeeId <= 0 || string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest("Invalid request data.");

            await _service.SendNotificationAsync(dto.EmployeeId, dto.Message);
            return Ok("Notification sent successfully.");
        }
    }
}
