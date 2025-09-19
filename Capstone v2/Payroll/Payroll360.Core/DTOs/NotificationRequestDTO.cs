namespace Payroll360.Core.DTOs
{
    public class NotificationRequestDTO
    {
        public int EmployeeId { get; set; }
        public string Message { get; set; } = string.Empty;
    }
}