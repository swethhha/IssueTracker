using Payroll360.Core.Enums;
using System;

namespace Payroll360.Core.Entities
{
    public class Notification
    {
        public int Id { get; set; }
        public int EmployeeId { get; set; }

        public string Message { get; set; } = string.Empty;
        public NotificationType Type { get; set; } = NotificationType.Info; // Info, Success, Warning, Error

        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public Employee? Employee { get; set; }
    }
}
