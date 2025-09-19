-- Seed data for Payroll360 database

-- Insert sample employees
INSERT INTO Employees (FullName, Email, Role, Department, HireDate, Salary, IsActive) VALUES
('John Doe', 'john.doe@company.com', 'Employee', 'Engineering', '2023-01-15', 75000, 1),
('Jane Smith', 'jane.smith@company.com', 'Manager', 'Engineering', '2022-03-10', 95000, 1),
('Mike Johnson', 'mike.johnson@company.com', 'FinanceAdmin', 'Finance', '2021-06-20', 85000, 1),
('Sarah Wilson', 'sarah.wilson@company.com', 'Admin', 'HR', '2020-09-05', 90000, 1),
('David Brown', 'david.brown@company.com', 'Employee', 'Marketing', '2023-05-12', 65000, 1);

-- Insert sample reimbursements
INSERT INTO Reimbursements (EmployeeId, Category, Amount, Description, RequestedDate, ManagerApproved, FinanceApproved) VALUES
(1, 'Travel', 2500.00, 'Client meeting travel expenses', DATEADD(day, -5, GETDATE()), NULL, NULL),
(1, 'Food', 800.00, 'Team lunch during project meeting', DATEADD(day, -10, GETDATE()), 1, 1),
(5, 'Office Supplies', 1200.00, 'Laptop accessories and stationery', DATEADD(day, -3, GETDATE()), NULL, NULL),
(1, 'Medical', 3500.00, 'Medical checkup reimbursement', DATEADD(day, -7, GETDATE()), 1, NULL);

-- Insert sample loans
INSERT INTO Loans (EmployeeId, LoanType, Amount, TenureMonths, Purpose, AppliedDate, ManagerApproved, FinanceApproved) VALUES
(1, 'Personal', 50000.00, 12, 'Home renovation and repairs', DATEADD(day, -10, GETDATE()), NULL, NULL),
(5, 'Education', 100000.00, 24, 'MBA course fees and expenses', DATEADD(day, -15, GETDATE()), 1, NULL),
(1, 'Emergency', 25000.00, 6, 'Medical emergency expenses', DATEADD(day, -5, GETDATE()), NULL, NULL);

-- Insert sample medical claims
INSERT INTO MedicalClaims (EmployeeId, ClaimAmount, ClaimDate, HospitalName, TreatmentType, Description, Status, CreatedAt) VALUES
(1, 5000.00, DATEADD(day, -15, GETDATE()), 'City Hospital', 'OPD', 'Regular checkup and consultation', 'Pending', DATEADD(day, -15, GETDATE())),
(1, 15000.00, DATEADD(day, -10, GETDATE()), 'Metro Medical Center', 'Diagnostic', 'Blood tests and X-ray', 'Approved', DATEADD(day, -10, GETDATE())),
(5, 25000.00, DATEADD(day, -5, GETDATE()), 'General Hospital', 'Emergency', 'Emergency treatment for accident', 'Pending', DATEADD(day, -5, GETDATE()));

-- Insert insurance policies
INSERT INTO InsurancePolicies (PolicyName, Description, Coverage, Premium, IsActive) VALUES
('Group Health Insurance (GHI)', 'Covers hospitalization expenses for employee + family.', '₹5 Lakhs', 500.00, 1),
('Group Term Life Insurance', 'Provides financial security to employee''s family in case of death.', '3x Annual Salary', 300.00, 1),
('Accidental Death & Disability Insurance (AD&D)', 'Covers accidental death or permanent disability.', '₹10 Lakhs', 200.00, 1),
('Critical Illness Insurance', 'Lump-sum payout on diagnosis of critical illnesses.', '₹5 Lakhs', 400.00, 1);

-- Insert sample insurance enrollments
INSERT INTO InsuranceEnrollments (EmployeeId, PolicyId, EnrollmentDate, Status) VALUES
(1, 1, DATEADD(day, -5, GETDATE()), 'Pending'),
(5, 2, DATEADD(day, -10, GETDATE()), 'Approved');

-- Insert sample payrolls
INSERT INTO Payrolls (EmployeeId, BaseSalary, Allowances, Deductions, PayPeriodStart, PayPeriodEnd, Status, GeneratedDate) VALUES
(1, 75000.00, 5000.00, 8000.00, '2024-01-01', '2024-01-31', 'Approved', '2024-01-31'),
(1, 75000.00, 5000.00, 8000.00, '2024-02-01', '2024-02-29', 'Pending', '2024-02-29'),
(5, 65000.00, 3000.00, 6000.00, '2024-01-01', '2024-01-31', 'Approved', '2024-01-31');

-- Insert sample notifications
INSERT INTO Notifications (EmployeeId, Title, Message, Type, IsRead, CreatedAt) VALUES
(2, 'New Reimbursement Request', 'John Doe submitted a reimbursement request for ₹2,500', 'Approval', 0, DATEADD(day, -5, GETDATE())),
(2, 'New Loan Application', 'John Doe applied for a personal loan of ₹50,000', 'Approval', 0, DATEADD(day, -10, GETDATE())),
(1, 'Reimbursement Approved', 'Your food reimbursement of ₹800 has been approved', 'Info', 0, DATEADD(day, -8, GETDATE()));