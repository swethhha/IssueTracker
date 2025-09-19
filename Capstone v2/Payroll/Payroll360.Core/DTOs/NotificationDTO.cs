namespace Payroll360.Core.DTOs
{
    public class NotificationDTO
    {
        public int Id { get; set; }
        public string Message { get; set; } = string.Empty;
        public int Type { get; set; }
        public string CreatedAt { get; set; } = string.Empty;
    }
}