using System.Threading.Tasks;

namespace Payroll360.Core.Interfaces
{
    public interface IApprovalService<TEntity>
    {
        Task ApproveByManagerAsync(int entityId, int managerId, string? comments = null);
        Task ApproveByFinanceAsync(int entityId, int financeId, string? comments = null);
        Task RejectByManagerAsync(int entityId, int managerId, string reason);
        Task RejectByFinanceAsync(int entityId, int financeId, string reason);
    }
}
