using Microsoft.EntityFrameworkCore;
using Payroll360.Core.Entities;
using Payroll360.Core.Interfaces;
using Payroll360.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Payroll360.Infrastructure.Repositories
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly Payroll360Context _context;

        public NotificationRepository(Payroll360Context context)
        {
            _context = context;
        }

        // Get notification by ID
        public async Task<Notification?> GetByIdAsync(int id)
        {
            return await _context.Notifications
                                 .FirstOrDefaultAsync(n => n.Id == id);
        }

        // Get all notifications for an employee
        public async Task<IEnumerable<Notification>> GetByEmployeeIdAsync(int employeeId)
        {
            return await _context.Notifications
                                 .Where(n => n.EmployeeId == employeeId)
                                 .OrderByDescending(n => n.CreatedAt)
                                 .ToListAsync();
        }

        // Get all notifications
        public async Task<IEnumerable<Notification>> GetAllAsync()
        {
            return await _context.Notifications
                                 .OrderByDescending(n => n.CreatedAt)
                                 .ToListAsync();
        }

        // Add a new notification
        public async Task AddAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
        }

        // Update a notification (e.g., mark as read)
        public void Update(Notification notification)
        {
            _context.Notifications.Update(notification);
        }

        // Delete a notification
        public void Delete(Notification notification)
        {
            _context.Notifications.Remove(notification);
        }

        // Save changes to the database
        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }
    }
}
