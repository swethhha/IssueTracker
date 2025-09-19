using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payroll360.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class FixCascadeDeleteConflicts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InsuranceEnrollments_Employees_EmployeeId",
                table: "InsuranceEnrollments");

            migrationBuilder.AddForeignKey(
                name: "FK_InsuranceEnrollments_Employees_EmployeeId",
                table: "InsuranceEnrollments",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InsuranceEnrollments_Employees_EmployeeId",
                table: "InsuranceEnrollments");

            migrationBuilder.AddForeignKey(
                name: "FK_InsuranceEnrollments_Employees_EmployeeId",
                table: "InsuranceEnrollments",
                column: "EmployeeId",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
