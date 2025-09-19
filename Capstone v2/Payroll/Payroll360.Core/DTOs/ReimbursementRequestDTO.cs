using System.ComponentModel.DataAnnotations;

namespace Payroll360.Core.DTOs
{
    public class ReimbursementRequestDTO
{
    public int EmployeeId { get; set; }
    
    [Required]
    public string Category { get; set; } = string.Empty;
    
    [Required]
    [Range(1, 50000)]
    public decimal Amount { get; set; }
    
    [Required]
    public DateTime ExpenseDate { get; set; }
    
    [Required]
    [MinLength(5)]
    public string Description { get; set; } = string.Empty;
    
    public DateTime RequestDate { get; set; } = DateTime.UtcNow;
    
    [Required]
    public bool AcceptTerms { get; set; }
    
    public List<string> DocumentPaths { get; set; } = new();
    }
}