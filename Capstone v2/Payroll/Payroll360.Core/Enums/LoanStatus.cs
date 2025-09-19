namespace Payroll360.Core.Enums
{
    public enum LoanStatus
    {
        Requested,                     // Employee submitted
        ManagerApprovedFinancePending,  // Manager approved, waiting for Finance
        Approved,                       // Both approved
        Rejected,                       // Rejected by Manager or Finance
        Active,
        Closed
    }
}
