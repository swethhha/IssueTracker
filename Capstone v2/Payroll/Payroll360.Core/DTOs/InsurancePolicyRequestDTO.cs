using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Payroll360.Core.DTOs
{
    public class InsurancePolicyRequestDTO
    {
        public int EmployeeId { get; set; }
        public string PolicyName { get; set; } = string.Empty;
        public string Provider { get; set; } = string.Empty;
        public decimal CoverageAmount { get; set; }
        public string PolicyType { get; set; } = string.Empty;
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpiryDate { get; set; }
    }

}
