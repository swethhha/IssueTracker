using System;

namespace Payroll360.Core.Entities
{
    public class ApprovalHistory
    {
        public int Id { get; set; }

        // Entity being approved: Reimbursement, Loan, Payroll, MedicalClaim
        public string EntityType { get; set; } = string.Empty;

        // Id of the entity record
        public int EntityId { get; set; }

        // Action performed: Approved, Rejected, Paid, Settled, etc.
        public string Action { get; set; } = string.Empty;

        // Who performed the action: Manager or Finance
        public string PerformedBy { get; set; } = string.Empty;

        // When the action was performed
        public DateTime ActionDate { get; set; } = DateTime.UtcNow;

        // Optional remarks/comments from the approver
        public string? Remarks { get; set; }
    }
}
