namespace Payroll360.Core.DTOs
{
    public class PayrollSummaryDTO
    {
        public decimal TotalEarnings { get; set; }
        public decimal TotalDeductions { get; set; }
        public decimal NetPay { get; set; }
        public int PayrollCount { get; set; }
    }
}