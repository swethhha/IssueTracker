using Payroll360.Core.Entities;

public interface IInsuranceRepository
{
    // Policies
    Task<InsurancePolicy?> GetByIdAsync(int id);
    Task<IEnumerable<InsurancePolicy>> GetByEmployeeIdAsync(int employeeId);
    Task<IEnumerable<InsurancePolicy>> GetAllAsync();
    Task AddAsync(InsurancePolicy policy);
    void Update(InsurancePolicy policy);
    void Delete(InsurancePolicy policy);

    // Enrollment
    Task<InsuranceEnrollment?> GetEnrollmentAsync(int employeeId, int policyId);
    Task AddEnrollmentAsync(InsuranceEnrollment enrollment);

    Task<int> SaveChangesAsync();

    // Dashboard / Counts
    Task<int> CountActivePoliciesAsync(int employeeId);
    Task<int> CountAllPoliciesAsync();
}
