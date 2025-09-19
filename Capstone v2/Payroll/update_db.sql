-- Mark existing migrations as applied
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES 
('20250913135325_InitialCreate', '8.0.0'),
('20250913182828_UpdatedEntites', '8.0.0'),
('20250913183148_FixedDecimalPrecision', '8.0.0'),
('20250913184410_UpdatedDbContext', '8.0.0'),
('20250913185003_UpdatedDb', '8.0.0'),
('20250913185659_FixCascadeDeleteConflicts', '8.0.0'),
('20250914000454_FixInsuranceCascadeAndAddEnrollments', '8.0.0'),
('20250914001717_CreateInsuranceEnrollmentsWithRestrict', '8.0.0');

-- Add the new columns to Loans table
ALTER TABLE Loans ADD TenureMonths int NOT NULL DEFAULT 0;
ALTER TABLE Loans ADD Purpose nvarchar(max) NOT NULL DEFAULT '';
ALTER TABLE Loans ADD AppliedDate datetime2 NOT NULL DEFAULT GETDATE();

-- Mark the new migration as applied
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion]) VALUES 
('20250914175159_AddLoanFields', '8.0.0');