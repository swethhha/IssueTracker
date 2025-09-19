using Microsoft.EntityFrameworkCore;
using Payroll360.Core.Entities;
using PayrollEntity = Payroll360.Core.Entities.Payroll;

namespace Payroll360.Infrastructure.Data
{
    public partial class Payroll360Context : DbContext
    {
        public Payroll360Context() { }

        public Payroll360Context(DbContextOptions<Payroll360Context> options)
            : base(options) { }

        public virtual DbSet<Employee> Employees { get; set; }
        public virtual DbSet<PayrollEntity> Payrolls { get; set; }
        public virtual DbSet<Loan> Loans { get; set; }
        public virtual DbSet<MedicalClaim> MedicalClaims { get; set; }
        public virtual DbSet<Reimbursement> Reimbursements { get; set; }
        public virtual DbSet<InsurancePolicy> InsurancePolicies { get; set; }
        public virtual DbSet<InsuranceEnrollment> InsuranceEnrollments { get; set; }
        public virtual DbSet<Notification> Notifications { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(
                    "Server=localhost;Database=Payroll360DB;User Id=sa;Password=Swetha@06112004;TrustServerCertificate=True;"
                );
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // --- Precision settings ---
            modelBuilder.Entity<Employee>().Property(e => e.BaseSalary).HasPrecision(18, 2);
            modelBuilder.Entity<InsurancePolicy>().Property(i => i.PremiumAmount).HasPrecision(18, 2);
            modelBuilder.Entity<Loan>().Property(l => l.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<MedicalClaim>().Property(m => m.Amount).HasPrecision(18, 2);
            modelBuilder.Entity<PayrollEntity>().Property(p => p.BasicSalary).HasPrecision(18, 2);
            modelBuilder.Entity<PayrollEntity>().Property(p => p.Allowances).HasPrecision(18, 2);
            modelBuilder.Entity<PayrollEntity>().Property(p => p.Deductions).HasPrecision(18, 2);
            modelBuilder.Entity<PayrollEntity>().Property(p => p.NetSalary).HasPrecision(18, 2);
            modelBuilder.Entity<Reimbursement>().Property(r => r.Amount).HasPrecision(18, 2);

            // --- Relationships with navigation properties ---

            // Employee -> Payrolls (1-M)
            modelBuilder.Entity<PayrollEntity>()
                .HasOne(p => p.Employee)
                .WithMany(e => e.Payrolls)
                .HasForeignKey(p => p.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Employee -> Loans (1-M)
            modelBuilder.Entity<Loan>()
                .HasOne(l => l.Employee)
                .WithMany(e => e.Loans)
                .HasForeignKey(l => l.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Employee -> MedicalClaims (1-M)
            modelBuilder.Entity<MedicalClaim>()
                .HasOne(m => m.Employee)
                .WithMany(e => e.MedicalClaims)
                .HasForeignKey(m => m.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Employee -> Reimbursements (1-M)
            modelBuilder.Entity<Reimbursement>()
                .HasOne(r => r.Employee)
                .WithMany(e => e.Reimbursements)
                .HasForeignKey(r => r.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Employee -> InsurancePolicies (1-M)
            modelBuilder.Entity<InsurancePolicy>()
                .HasOne(p => p.Employee)
                .WithMany(e => e.InsurancePolicies)
                .HasForeignKey(p => p.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Employee -> InsuranceEnrollments (1-M)
            modelBuilder.Entity<InsuranceEnrollment>()
                .HasOne(e => e.Employee)
                .WithMany(e => e.InsuranceEnrollments)
                .HasForeignKey(e => e.EmployeeId)
                .OnDelete(DeleteBehavior.Restrict);

            // InsurancePolicy -> InsuranceEnrollments (1-M)
            modelBuilder.Entity<InsuranceEnrollment>()
                .HasOne(e => e.Policy)
                .WithMany(p => p.Enrollments)
                .HasForeignKey(e => e.PolicyId)
                .OnDelete(DeleteBehavior.Restrict);

            // Optional: Notification -> Employee (1-M)
            modelBuilder.Entity<Notification>()
                .HasOne(n => n.Employee)
                .WithMany(e => e.Notifications)
                .HasForeignKey(n => n.EmployeeId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
