using Payroll360.Core.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface INotificationService
    {
        Task SendNotificationAsync(int employeeId, string message);
        Task<IEnumerable<NotificationDTO>> GetNotificationsAsync(int employeeId);
        Task MarkAsReadAsync(int notificationId, int employeeId);

        // Dashboard / Employee Methods
        Task<int> GetUnreadNotificationsCountAsync(int employeeId);
    }
}
