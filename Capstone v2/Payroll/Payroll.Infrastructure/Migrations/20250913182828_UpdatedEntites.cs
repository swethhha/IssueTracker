using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Payroll360.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdatedEntites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalHistory_Loans_LoanId",
                table: "ApprovalHistory");

            migrationBuilder.DropColumn(
                name: "ApprovedDate",
                table: "Reimbursements");

            migrationBuilder.DropColumn(
                name: "PaidDate",
                table: "Reimbursements");

            migrationBuilder.DropColumn(
                name: "ApprovedDate",
                table: "MedicalClaims");

            migrationBuilder.DropColumn(
                name: "SettledDate",
                table: "MedicalClaims");

            migrationBuilder.DropColumn(
                name: "ApprovedDate",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "BalanceAmount",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "DurationMonths",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "MonthlyInstallment",
                table: "Loans");

            migrationBuilder.RenameColumn(
                name: "RequestDate",
                table: "Reimbursements",
                newName: "RequestedDate");

            migrationBuilder.RenameColumn(
                name: "Remarks",
                table: "Reimbursements",
                newName: "ManagerComments");

            migrationBuilder.RenameColumn(
                name: "Category",
                table: "Reimbursements",
                newName: "EmployeeName");

            migrationBuilder.RenameColumn(
                name: "Remarks",
                table: "MedicalClaims",
                newName: "ManagerComments");

            migrationBuilder.RenameColumn(
                name: "HospitalName",
                table: "MedicalClaims",
                newName: "EmployeeName");

            migrationBuilder.RenameColumn(
                name: "ClaimDate",
                table: "MedicalClaims",
                newName: "RequestedDate");

            migrationBuilder.RenameColumn(
                name: "ClaimAmount",
                table: "MedicalClaims",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "RequestDate",
                table: "Loans",
                newName: "IssueDate");

            migrationBuilder.RenameColumn(
                name: "PrincipalAmount",
                table: "Loans",
                newName: "Amount");

            migrationBuilder.RenameColumn(
                name: "DisbursedDate",
                table: "Loans",
                newName: "RepaymentDate");

            migrationBuilder.RenameColumn(
                name: "LoanId",
                table: "ApprovalHistory",
                newName: "PayrollId");

            migrationBuilder.RenameIndex(
                name: "IX_ApprovalHistory_LoanId",
                table: "ApprovalHistory",
                newName: "IX_ApprovalHistory_PayrollId");

            migrationBuilder.AddColumn<bool>(
                name: "FinanceApproved",
                table: "Reimbursements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinanceComments",
                table: "Reimbursements",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FinanceId",
                table: "Reimbursements",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ManagerApproved",
                table: "Reimbursements",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ManagerId",
                table: "Reimbursements",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "Payrolls",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<bool>(
                name: "FinanceApproved",
                table: "Payrolls",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinanceComments",
                table: "Payrolls",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FinanceId",
                table: "Payrolls",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ManagerApproved",
                table: "Payrolls",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ManagerComments",
                table: "Payrolls",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ManagerId",
                table: "Payrolls",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Type",
                table: "Notifications",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "MedicalClaims",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "FinanceApproved",
                table: "MedicalClaims",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinanceComments",
                table: "MedicalClaims",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FinanceId",
                table: "MedicalClaims",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ManagerApproved",
                table: "MedicalClaims",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ManagerId",
                table: "MedicalClaims",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FinanceApproved",
                table: "Loans",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "FinanceComments",
                table: "Loans",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "FinanceId",
                table: "Loans",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ManagerApproved",
                table: "Loans",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ManagerComments",
                table: "Loans",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ManagerId",
                table: "Loans",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "Status",
                table: "InsurancePolicies",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<int>(
                name: "PayrollId",
                table: "DocumentAttachment",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "InsuranceEnrollments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EmployeeId = table.Column<int>(type: "int", nullable: false),
                    PolicyId = table.Column<int>(type: "int", nullable: false),
                    EnrollmentStatus = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EnrolledOn = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InsuranceEnrollments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_InsuranceEnrollments_Employees_EmployeeId",
                        column: x => x.EmployeeId,
                        principalTable: "Employees",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_InsuranceEnrollments_InsurancePolicies_PolicyId",
                        column: x => x.PolicyId,
                        principalTable: "InsurancePolicies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DocumentAttachment_PayrollId",
                table: "DocumentAttachment",
                column: "PayrollId");

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceEnrollments_EmployeeId",
                table: "InsuranceEnrollments",
                column: "EmployeeId");

            migrationBuilder.CreateIndex(
                name: "IX_InsuranceEnrollments_PolicyId",
                table: "InsuranceEnrollments",
                column: "PolicyId");

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalHistory_Payrolls_PayrollId",
                table: "ApprovalHistory",
                column: "PayrollId",
                principalTable: "Payrolls",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_DocumentAttachment_Payrolls_PayrollId",
                table: "DocumentAttachment",
                column: "PayrollId",
                principalTable: "Payrolls",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ApprovalHistory_Payrolls_PayrollId",
                table: "ApprovalHistory");

            migrationBuilder.DropForeignKey(
                name: "FK_DocumentAttachment_Payrolls_PayrollId",
                table: "DocumentAttachment");

            migrationBuilder.DropTable(
                name: "InsuranceEnrollments");

            migrationBuilder.DropIndex(
                name: "IX_DocumentAttachment_PayrollId",
                table: "DocumentAttachment");

            migrationBuilder.DropColumn(
                name: "FinanceApproved",
                table: "Reimbursements");

            migrationBuilder.DropColumn(
                name: "FinanceComments",
                table: "Reimbursements");

            migrationBuilder.DropColumn(
                name: "FinanceId",
                table: "Reimbursements");

            migrationBuilder.DropColumn(
                name: "ManagerApproved",
                table: "Reimbursements");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "Reimbursements");

            migrationBuilder.DropColumn(
                name: "FinanceApproved",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "FinanceComments",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "FinanceId",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "ManagerApproved",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "ManagerComments",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "Payrolls");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "MedicalClaims");

            migrationBuilder.DropColumn(
                name: "FinanceApproved",
                table: "MedicalClaims");

            migrationBuilder.DropColumn(
                name: "FinanceComments",
                table: "MedicalClaims");

            migrationBuilder.DropColumn(
                name: "FinanceId",
                table: "MedicalClaims");

            migrationBuilder.DropColumn(
                name: "ManagerApproved",
                table: "MedicalClaims");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "MedicalClaims");

            migrationBuilder.DropColumn(
                name: "FinanceApproved",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "FinanceComments",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "FinanceId",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "ManagerApproved",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "ManagerComments",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "ManagerId",
                table: "Loans");

            migrationBuilder.DropColumn(
                name: "PayrollId",
                table: "DocumentAttachment");

            migrationBuilder.RenameColumn(
                name: "RequestedDate",
                table: "Reimbursements",
                newName: "RequestDate");

            migrationBuilder.RenameColumn(
                name: "ManagerComments",
                table: "Reimbursements",
                newName: "Remarks");

            migrationBuilder.RenameColumn(
                name: "EmployeeName",
                table: "Reimbursements",
                newName: "Category");

            migrationBuilder.RenameColumn(
                name: "RequestedDate",
                table: "MedicalClaims",
                newName: "ClaimDate");

            migrationBuilder.RenameColumn(
                name: "ManagerComments",
                table: "MedicalClaims",
                newName: "Remarks");

            migrationBuilder.RenameColumn(
                name: "EmployeeName",
                table: "MedicalClaims",
                newName: "HospitalName");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "MedicalClaims",
                newName: "ClaimAmount");

            migrationBuilder.RenameColumn(
                name: "RepaymentDate",
                table: "Loans",
                newName: "DisbursedDate");

            migrationBuilder.RenameColumn(
                name: "IssueDate",
                table: "Loans",
                newName: "RequestDate");

            migrationBuilder.RenameColumn(
                name: "Amount",
                table: "Loans",
                newName: "PrincipalAmount");

            migrationBuilder.RenameColumn(
                name: "PayrollId",
                table: "ApprovalHistory",
                newName: "LoanId");

            migrationBuilder.RenameIndex(
                name: "IX_ApprovalHistory_PayrollId",
                table: "ApprovalHistory",
                newName: "IX_ApprovalHistory_LoanId");

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedDate",
                table: "Reimbursements",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PaidDate",
                table: "Reimbursements",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "Payrolls",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "Type",
                table: "Notifications",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedDate",
                table: "MedicalClaims",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "SettledDate",
                table: "MedicalClaims",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "ApprovedDate",
                table: "Loans",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BalanceAmount",
                table: "Loans",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "DurationMonths",
                table: "Loans",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "MonthlyInstallment",
                table: "Loans",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AlterColumn<string>(
                name: "Status",
                table: "InsurancePolicies",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_ApprovalHistory_Loans_LoanId",
                table: "ApprovalHistory",
                column: "LoanId",
                principalTable: "Loans",
                principalColumn: "Id");
        }
    }
}
