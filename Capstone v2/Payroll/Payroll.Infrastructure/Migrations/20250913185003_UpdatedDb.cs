using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payroll360.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InsuranceEnrollments_InsurancePolicies_PolicyId1",
                table: "InsuranceEnrollments");

            migrationBuilder.DropForeignKey(
                name: "FK_InsurancePolicies_Employees_EmployeeId1",
                table: "InsurancePolicies");

            migrationBuilder.DropIndex(
                name: "IX_InsurancePolicies_EmployeeId1",
                table: "InsurancePolicies");

            migrationBuilder.DropIndex(
                name: "IX_InsuranceEnrollments_PolicyId1",
                table: "InsuranceEnrollments");

            migrationBuilder.DropColumn(
                name: "EmployeeId1",
                table: "InsurancePolicies");

            migrationBuilder.DropColumn(
                name: "PolicyId1",
                table: "InsuranceEnrollments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "EmployeeId1",
                table: "InsurancePolicies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "PolicyId1",
                table: "InsuranceEnrollments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_InsurancePolicies_EmployeeId1",
                table: "InsurancePolicies",
                column: "EmployeeId1");

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceEnrollments_PolicyId1",
                table: "InsuranceEnrollments",
                column: "PolicyId1");

            migrationBuilder.AddForeignKey(
                name: "FK_InsuranceEnrollments_InsurancePolicies_PolicyId1",
                table: "InsuranceEnrollments",
                column: "PolicyId1",
                principalTable: "InsurancePolicies",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_InsurancePolicies_Employees_EmployeeId1",
                table: "InsurancePolicies",
                column: "EmployeeId1",
                principalTable: "Employees",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
