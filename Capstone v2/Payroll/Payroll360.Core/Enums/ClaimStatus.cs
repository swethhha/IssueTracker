namespace Payroll360.Core.Enums
{
    public enum ClaimStatus
    {
        PendingManagerApproval,         // Submitted, waiting for Manager
        ManagerApprovedFinancePending,  // Manager approved, waiting for Finance
        Approved,                       // Both approved
        Rejected,                       // Rejected at any stage
        Settled                         // Payment processed
    }
}
