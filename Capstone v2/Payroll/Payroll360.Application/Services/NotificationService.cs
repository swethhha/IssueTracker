using Microsoft.EntityFrameworkCore;
using Payroll360.Core.DTOs;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;

namespace Payroll360.Application.Services
{
    public class NotificationService : INotificationService
    {
        private readonly Payroll360Context _context;

        public NotificationService(Payroll360Context context)
        {
            _context = context;
        }

        public async Task<int> GetUnreadNotificationsCountAsync(int employeeId)
        {
            return await _context.Notifications.CountAsync(n => n.EmployeeId == employeeId);
        }

        public async Task<IEnumerable<NotificationDTO>> GetNotificationsAsync(int employeeId)
        {
            var notifications = await _context.Notifications
                .Where(n => n.EmployeeId == employeeId)
                .OrderByDescending(n => n.CreatedAt)
                .Select(n => new NotificationDTO
                {
                    Id = n.Id,
                    Message = n.Message,
                    Type = 0,
                    CreatedAt = n.CreatedAt.ToString()
                })
                .ToListAsync();
            return notifications;
        }

        public async Task SendNotificationAsync(int employeeId, string message)
        {
            var notification = new Notification
            {
                EmployeeId = employeeId,
                Message = message,
                Type = 0,
                CreatedAt = DateTime.Now
            };

            _context.Notifications.Add(notification);
            await _context.SaveChangesAsync();
        }

        public async Task MarkAsReadAsync(int notificationId, int employeeId)
        {
            var notification = await _context.Notifications
                .FirstOrDefaultAsync(n => n.Id == notificationId && n.EmployeeId == employeeId);
            
            if (notification != null)
            {
                // Add IsRead property logic here if needed
                await _context.SaveChangesAsync();
            }
        }
    }
}