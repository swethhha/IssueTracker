using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payroll360.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixInsuranceCascadeAndAddEnrollments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InsurancePolicies_Employees_EmployeeId",
                table: "InsurancePolicies");

            migrationBuilder.AddForeignKey(
                name: "FK_InsurancePolicies_Employees_EmployeeId",
                table: "InsurancePolicies",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InsurancePolicies_Employees_EmployeeId",
                table: "InsurancePolicies");

            migrationBuilder.AddForeignKey(
                name: "FK_InsurancePolicies_Employees_EmployeeId",
                table: "InsurancePolicies",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
