namespace Payroll360.Core.DTOs
{
    public class ReimbursementResponseDTO
{
    public int RequestId { get; set; }
    public int EmployeeId { get; set; }
    public string EmployeeName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime RequestDate { get; set; }
    public string AttachmentPath { get; set; } = string.Empty;

    // Reflects combined approval workflow
    public bool? ManagerApproved { get; set; }
    public bool? FinanceApproved { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, ManagerApproved, FinanceApproved, Approved, Rejected, Paid
    public DateTime ProcessedDate { get; set; }
    public List<DocumentAttachmentDTO> Documents { get; set; } = new();
    }
}
