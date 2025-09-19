import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface MockUser {
  id: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: 'Employee' | 'Manager' | 'Finance' | 'Admin';
  department: string;
}

export interface MockLoan {
  loanId: number;
  employeeId: number;
  employeeName: string;
  loanType: string;
  amount: number;
  tenureMonths: number;
  purpose: string;
  appliedDate: string;
  status: 'Pending' | 'ManagerApproved' | 'Approved' | 'Rejected';
  monthlyInstallment: number;
  managerApproved?: boolean | null;
  financeApproved?: boolean | null;
  managerComments?: string;
  financeComments?: string;
  managerId?: number;
  financeId?: number;
  submittedAt?: string;
  managerApprovedAt?: string;
  financeApprovedAt?: string;
  documents?: string[];
}

export interface MockReimbursement {
  requestId: number;
  employeeId: number;
  employeeName: string;
  category: string;
  amount: number;
  description: string;
  requestDate: string;
  status: 'Pending' | 'ManagerApproved' | 'Approved' | 'Rejected';
  managerApproved?: boolean | null;
  financeApproved?: boolean | null;
  managerComments?: string;
  financeComments?: string;
  managerId?: number;
  financeId?: number;
  submittedAt?: string;
  managerApprovedAt?: string;
  financeApprovedAt?: string;
  documents?: string[];
}

export interface MockInsurance {
  id: number;
  employeeId: number;
  insuranceType: 'Health' | 'Dental' | 'Vision' | 'Life';
  provider: string;
  policyNumber: string;
  enrollmentDate: string;
  isActive: boolean;
  coverageAmount: number;
}

export interface MockMedicalClaim {
  claimId: number;
  employeeId: number;
  employeeName: string;
  claimAmount: number;
  claimDate: string;
  description: string;
  hospitalName: string;
  treatmentType: string;
  status: 'Pending' | 'ManagerApproved' | 'Approved' | 'Rejected';
  managerApproved?: boolean | null;
  financeApproved?: boolean | null;
  createdAt: string;
  managerComments?: string;
  financeComments?: string;
  managerId?: number;
  financeId?: number;
  submittedAt?: string;
  managerApprovedAt?: string;
  financeApprovedAt?: string;
  documents?: string[];
}

export interface MockPayroll {
  id: number;
  employeeId: number;
  employeeName: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  payPeriodStart: string;
  payPeriodEnd: string;
  status: string;
  generatedDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class MockPayrollService {
  private readonly STORAGE_KEY = 'payroll-demo-data';
  private readonly CURRENT_USER_KEY = 'current-user';
  
  private dataSubject = new BehaviorSubject<any>(this.loadData());
  public data$ = this.dataSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      const twoDaysAgo = new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000);
      const threeDaysAgo = new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const initialData = {
        users: [
          { id: 1, username: 'gayathri', password: 'password', fullName: 'Gayathri Krishnan', email: 'gayathri.employee@payroll360.com', role: 'Employee', department: 'IT' },
          { id: 2, username: 'jeff', password: 'password', fullName: 'Jeff Anderson', email: 'jeff.manager@payroll360.com', role: 'Manager', department: 'IT' },
          { id: 3, username: 'swetha', password: 'password', fullName: 'Swetha Ramesh', email: 'swetha.finance@payroll360.com', role: 'Finance', department: 'Finance' },
          { id: 4, username: 'priya', password: 'password', fullName: 'Priya Sharma', email: 'priya.employee@payroll360.com', role: 'Employee', department: 'HR' },
          { id: 5, username: 'arjun', password: 'password', fullName: 'Arjun Patel', email: 'arjun.employee@payroll360.com', role: 'Employee', department: 'IT' }
        ],
        insurances: [
          { id: 1, employeeId: 1, insuranceType: 'Health', provider: 'Star Health', policyNumber: 'SH001234', enrollmentDate: '2024-01-01', isActive: true, coverageAmount: 500000 },
          { id: 2, employeeId: 1, insuranceType: 'Dental', provider: 'Dental Care Plus', policyNumber: 'DC001234', enrollmentDate: '2024-01-01', isActive: true, coverageAmount: 50000 },
          { id: 3, employeeId: 4, insuranceType: 'Health', provider: 'HDFC ERGO', policyNumber: 'HE005678', enrollmentDate: '2024-01-01', isActive: true, coverageAmount: 300000 }
        ],
        loans: [
          // Fresh employee submissions (Manager needs to review)
          {
            loanId: 1, employeeId: 1, employeeName: 'Gayathri Krishnan', loanType: 'Personal', amount: 50000, tenureMonths: 24,
            purpose: 'Home renovation', appliedDate: today.toISOString().split('T')[0], status: 'Pending', monthlyInstallment: 2273,
            managerApproved: null, financeApproved: null, submittedAt: today.toISOString(),
            documents: ['salary_slip.pdf', 'id_proof.jpg', 'bank_statement.pdf']
          },
          {
            loanId: 6, employeeId: 5, employeeName: 'Arjun Patel', loanType: 'Education', amount: 80000, tenureMonths: 36,
            purpose: 'Professional certification course', appliedDate: '2024-01-29', status: 'Pending', monthlyInstallment: 2500,
            managerApproved: null, financeApproved: null, submittedAt: '2024-01-29 14:30:00',
            documents: ['course_details.pdf', 'fee_structure.pdf']
          },
          // Manager approved (Finance needs to review)
          {
            loanId: 2, employeeId: 4, employeeName: 'Priya Sharma', loanType: 'Education', amount: 75000, tenureMonths: 36,
            purpose: 'MBA Course', appliedDate: twoDaysAgo.toISOString().split('T')[0], status: 'ManagerApproved', monthlyInstallment: 2386,
            managerApproved: true, financeApproved: null, managerId: 2, 
            managerComments: 'Excellent academic record. Approved for MBA funding.',
            managerApprovedAt: yesterday.toISOString(), submittedAt: twoDaysAgo.toISOString(),
            documents: ['admission_letter.pdf', 'fee_receipt.pdf', 'academic_transcript.pdf']
          },
          {
            loanId: 4, employeeId: 1, employeeName: 'Gayathri Krishnan', loanType: 'Vehicle', amount: 150000, tenureMonths: 48,
            purpose: 'Two-wheeler purchase for commute', appliedDate: '2024-01-24', status: 'ManagerApproved', monthlyInstallment: 3500,
            managerApproved: true, financeApproved: null, managerId: 2,
            managerComments: 'Employee needs vehicle for field work. Approved.',
            managerApprovedAt: '2024-01-25 10:15:00', submittedAt: '2024-01-24 13:20:00',
            documents: ['vehicle_quotation.pdf', 'dealer_invoice.pdf']
          },
          // Completed workflow (Finance approved)
          {
            loanId: 3, employeeId: 5, employeeName: 'Arjun Patel', loanType: 'Medical', amount: 25000, tenureMonths: 12,
            purpose: 'Emergency surgery expenses', appliedDate: '2024-01-20', status: 'Approved', monthlyInstallment: 2273,
            managerApproved: true, financeApproved: true, managerId: 2, financeId: 3,
            managerComments: 'Medical emergency. Immediate approval required.',
            financeComments: 'Emergency case approved. Disbursement processed.',
            submittedAt: '2024-01-20 08:30:00', managerApprovedAt: '2024-01-20 10:45:00',
            financeApprovedAt: '2024-01-21 09:15:00', documents: ['medical_bills.pdf', 'doctor_prescription.pdf']
          }
        ],
        reimbursements: [
          // Fresh employee submissions (Manager needs to review)
          {
            requestId: 1, employeeId: 1, employeeName: 'Gayathri Krishnan', category: 'Travel', amount: 5000,
            description: 'Client meeting in Bangalore - flight and accommodation', requestDate: today.toISOString().split('T')[0], status: 'Pending',
            managerApproved: null, financeApproved: null, submittedAt: today.toISOString(),
            documents: ['flight_tickets.pdf', 'hotel_bill.pdf', 'taxi_receipts.jpg']
          },
          {
            requestId: 6, employeeId: 4, employeeName: 'Priya Sharma', category: 'Office Supplies', amount: 2500,
            description: 'Laptop accessories and stationery for remote work', requestDate: '2024-01-28', status: 'Pending',
            managerApproved: null, financeApproved: null, submittedAt: '2024-01-28 15:45:00',
            documents: ['purchase_receipts.pdf', 'vendor_invoice.pdf']
          },
          // Manager approved (Finance needs to review)
          {
            requestId: 2, employeeId: 4, employeeName: 'Priya Sharma', category: 'Training', amount: 3000,
            description: 'AWS certification course and exam fees', requestDate: '2024-01-26', status: 'ManagerApproved',
            managerApproved: true, financeApproved: null, managerId: 2,
            managerComments: 'Training aligns with project requirements. Approved.',
            managerApprovedAt: '2024-01-27 09:30:00', submittedAt: '2024-01-26 14:20:00',
            documents: ['course_certificate.pdf', 'payment_receipt.pdf']
          },
          {
            requestId: 4, employeeId: 5, employeeName: 'Arjun Patel', category: 'Travel', amount: 8000,
            description: 'Client visit to Mumbai - 3 days business trip', requestDate: '2024-01-25', status: 'ManagerApproved',
            managerApproved: true, financeApproved: null, managerId: 2,
            managerComments: 'Important client meeting. All expenses justified.',
            managerApprovedAt: '2024-01-26 16:15:00', submittedAt: '2024-01-25 10:30:00',
            documents: ['travel_itinerary.pdf', 'expense_summary.xlsx', 'receipts_folder.zip']
          },
          // Completed workflow (Finance approved)
          {
            requestId: 3, employeeId: 5, employeeName: 'Arjun Patel', category: 'Food', amount: 1500,
            description: 'Team celebration dinner after project completion', requestDate: '2024-01-22', status: 'Approved',
            managerApproved: true, financeApproved: true, managerId: 2, financeId: 3,
            managerComments: 'Team performed exceptionally. Approved for celebration.',
            financeComments: 'Within team budget limits. Payment processed.',
            submittedAt: '2024-01-22 18:00:00', managerApprovedAt: '2024-01-23 09:00:00',
            financeApprovedAt: '2024-01-24 11:30:00', documents: ['restaurant_bill.pdf']
          }
        ],
        medicalClaims: [
          // Fresh employee submissions (Manager needs to review)
          {
            claimId: 1, employeeId: 1, employeeName: 'Gayathri Krishnan', claimAmount: 15000,
            claimDate: yesterday.toISOString().split('T')[0], description: 'Emergency appendix surgery and hospitalization', hospitalName: 'City Hospital',
            treatmentType: 'Surgery', status: 'Pending', managerApproved: null, financeApproved: null,
            createdAt: today.toISOString().split('T')[0], submittedAt: today.toISOString(),
            documents: ['hospital_bill.pdf', 'discharge_summary.pdf', 'doctor_prescription.pdf']
          },
          {
            claimId: 5, employeeId: 4, employeeName: 'Priya Sharma', claimAmount: 4500,
            claimDate: '2024-01-27', description: 'Physiotherapy sessions for back pain', hospitalName: 'Wellness Clinic',
            treatmentType: 'Physiotherapy', status: 'Pending', managerApproved: null, financeApproved: null,
            createdAt: '2024-01-28', submittedAt: '2024-01-28 16:20:00',
            documents: ['treatment_plan.pdf', 'session_receipts.pdf']
          },
          // Manager approved (Finance needs to review)
          {
            claimId: 2, employeeId: 4, employeeName: 'Priya Sharma', claimAmount: 2500,
            claimDate: '2024-01-24', description: 'Root canal treatment and dental crown', hospitalName: 'Dental Care Center',
            treatmentType: 'Dental', status: 'ManagerApproved', managerApproved: true, financeApproved: null,
            managerId: 2, createdAt: '2024-01-25', managerComments: 'Dental treatment covered under policy.',
            managerApprovedAt: '2024-01-26 10:30:00', submittedAt: '2024-01-25 12:15:00',
            documents: ['dental_xray.jpg', 'treatment_bill.pdf', 'insurance_form.pdf']
          },
          {
            claimId: 3, employeeId: 5, employeeName: 'Arjun Patel', claimAmount: 12000,
            claimDate: '2024-01-23', description: 'Knee surgery and post-operative care', hospitalName: 'Apollo Hospital',
            treatmentType: 'Surgery', status: 'ManagerApproved', managerApproved: true, financeApproved: null,
            managerId: 2, createdAt: '2024-01-24', managerComments: 'Work-related injury. Approved for treatment.',
            managerApprovedAt: '2024-01-25 14:45:00', submittedAt: '2024-01-24 09:30:00',
            documents: ['surgery_report.pdf', 'medical_bills.pdf', 'follow_up_plan.pdf']
          },
          // Completed workflow (Finance approved)
          {
            claimId: 4, employeeId: 1, employeeName: 'Gayathri Krishnan', claimAmount: 8000,
            claimDate: '2024-01-20', description: 'Eye examination and corrective surgery', hospitalName: 'Vision Care Hospital',
            treatmentType: 'Eye Surgery', status: 'Approved', managerApproved: true, financeApproved: true,
            managerId: 2, financeId: 3, createdAt: '2024-01-21',
            managerComments: 'Vision correction needed for computer work. Approved.',
            financeComments: 'Covered under health insurance. Reimbursement processed.',
            submittedAt: '2024-01-21 11:00:00', managerApprovedAt: '2024-01-22 09:15:00',
            financeApprovedAt: '2024-01-23 15:30:00', documents: ['eye_test_report.pdf', 'surgery_bill.pdf']
          }
        ],
        payrolls: [
          // Employee payrolls
          {
            id: 1, employeeId: 1, employeeName: 'John Doe', basicSalary: 50000, allowances: 5000,
            deductions: 3000, netPay: 52000, payPeriodStart: '2024-01-01', payPeriodEnd: '2024-01-31',
            status: 'Approved', generatedDate: '2024-02-01'
          },
          {
            id: 4, employeeId: 1, employeeName: 'John Doe', basicSalary: 50000, allowances: 5200,
            deductions: 3100, netPay: 52100, payPeriodStart: '2024-02-01', payPeriodEnd: '2024-02-28',
            status: 'Approved', generatedDate: '2024-03-01'
          },
          {
            id: 5, employeeId: 1, employeeName: 'John Doe', basicSalary: 50000, allowances: 4800,
            deductions: 2900, netPay: 51900, payPeriodStart: '2024-03-01', payPeriodEnd: '2024-03-31',
            status: 'Approved', generatedDate: '2024-04-01'
          },
          // Manager payrolls (higher salary)
          {
            id: 2, employeeId: 2, employeeName: 'Jane Manager', basicSalary: 85000, allowances: 8500,
            deductions: 5500, netPay: 88000, payPeriodStart: '2024-01-01', payPeriodEnd: '2024-01-31',
            status: 'Approved', generatedDate: '2024-02-01'
          },
          {
            id: 6, employeeId: 2, employeeName: 'Jane Manager', basicSalary: 85000, allowances: 8700,
            deductions: 5600, netPay: 88100, payPeriodStart: '2024-02-01', payPeriodEnd: '2024-02-28',
            status: 'Approved', generatedDate: '2024-03-01'
          },
          {
            id: 7, employeeId: 2, employeeName: 'Jane Manager', basicSalary: 85000, allowances: 8300,
            deductions: 5400, netPay: 87900, payPeriodStart: '2024-03-01', payPeriodEnd: '2024-03-31',
            status: 'Approved', generatedDate: '2024-04-01'
          },
          // Finance payrolls
          {
            id: 8, employeeId: 3, employeeName: 'Bob Finance', basicSalary: 75000, allowances: 7500,
            deductions: 4800, netPay: 77700, payPeriodStart: '2024-01-01', payPeriodEnd: '2024-01-31',
            status: 'Approved', generatedDate: '2024-02-01'
          },
          {
            id: 9, employeeId: 3, employeeName: 'Bob Finance', basicSalary: 75000, allowances: 7600,
            deductions: 4900, netPay: 77700, payPeriodStart: '2024-02-01', payPeriodEnd: '2024-02-28',
            status: 'Approved', generatedDate: '2024-03-01'
          },
          // Other employees
          {
            id: 3, employeeId: 4, employeeName: 'Alice Smith', basicSalary: 60000, allowances: 6000,
            deductions: 4000, netPay: 62000, payPeriodStart: '2024-01-01', payPeriodEnd: '2024-01-31',
            status: 'Approved', generatedDate: '2024-02-01'
          },
          {
            id: 10, employeeId: 5, employeeName: 'Mike Johnson', basicSalary: 45000, allowances: 4500,
            deductions: 2500, netPay: 47000, payPeriodStart: '2024-01-01', payPeriodEnd: '2024-01-31',
            status: 'Approved', generatedDate: '2024-02-01'
          }
        ]
      };
      this.saveData(initialData);
    }
  }

  private loadData(): any {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  public getData(): any {
    return this.loadData();
  }

  private saveData(data: any): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    this.dataSubject.next(data);
  }

  private updateData(updateFn: (data: any) => void): void {
    const data = this.loadData();
    updateFn(data);
    this.saveData(data);
  }

  // Authentication
  login(email: string, password: string): Observable<any> {
    const data = this.loadData();
    if (!data || !data.users) {
      // Force reinitialize if data is corrupted
      this.initializeData();
      const freshData = this.loadData();
      const user = freshData.users?.find((u: MockUser) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        return of({ 
          token: 'mock-jwt-token-' + user.id, 
          expiration: new Date(Date.now() + 3600000).toISOString() 
        }).pipe(delay(500));
      }
    } else {
      const user = data.users.find((u: MockUser) => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
        return of({ 
          token: 'mock-jwt-token-' + user.id, 
          expiration: new Date(Date.now() + 3600000).toISOString() 
        }).pipe(delay(500));
      }
    }
    return of(null).pipe(delay(500));
  }

  getCurrentUser(): MockUser | null {
    const stored = localStorage.getItem(this.CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  }

  logout(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Loan Methods
  getMyLoans(): Observable<MockLoan[]> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return of([]);
    
    const data = this.loadData();
    const loans = data.loans.filter((l: MockLoan) => l.employeeId === currentUser.id);
    return of(loans).pipe(delay(300));
  }

  getLoansByEmployee(employeeId: number): Observable<MockLoan[]> {
    const data = this.loadData();
    const loans = data.loans.filter((l: MockLoan) => l.employeeId === employeeId);
    return of(loans).pipe(delay(300));
  }

  applyForLoan(loanData: any): Observable<MockLoan> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');

    const newLoan: MockLoan = {
      loanId: Date.now(),
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      loanType: loanData.loanType,
      amount: loanData.amount,
      tenureMonths: loanData.tenureMonths,
      purpose: loanData.purpose,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      monthlyInstallment: this.calculateEMI(loanData.amount, loanData.tenureMonths),
      managerApproved: null,
      financeApproved: null,
      submittedAt: new Date().toISOString(),
      documents: ['salary_slip.pdf', 'id_proof.jpg', 'bank_statement.pdf']
    };

    this.updateData(data => {
      data.loans.push(newLoan);
    });

    this.addAuditEntry('Loan Application Submitted', 'Loan', newLoan.loanId, currentUser.id, `${loanData.loanType} loan for ₹${loanData.amount}`);
    return of(newLoan).pipe(delay(500));
  }

  getPendingManagerApprovals(): Observable<MockLoan[]> {
    const data = this.loadData();
    const pendingLoans = data.loans.filter((l: MockLoan) => l.managerApproved === null);
    return of(pendingLoans).pipe(delay(300));
  }

  approveByManager(id: number, comments?: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Manager') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const loan = data.loans.find((l: MockLoan) => l.loanId === id);
      if (loan) {
        loan.managerApproved = true;
        loan.status = 'ManagerApproved';
        loan.managerId = currentUser.id;
        loan.managerComments = comments;
        loan.managerApprovedAt = new Date().toISOString();
      }
    });

    this.addAuditEntry('Manager Approved', 'Loan', id, currentUser.id, comments);
    return of({ success: true, message: 'Loan approved by manager' }).pipe(delay(500));
  }

  rejectByManager(id: number, reason: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Manager') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const loan = data.loans.find((l: MockLoan) => l.loanId === id);
      if (loan) {
        loan.managerApproved = false;
        loan.status = 'Rejected';
        loan.managerId = currentUser.id;
        loan.managerComments = reason;
      }
    });

    return of({ success: true, message: 'Loan rejected by manager' }).pipe(delay(500));
  }

  getPendingFinanceApprovals(): Observable<MockLoan[]> {
    const data = this.loadData();
    const pendingLoans = data.loans.filter((l: MockLoan) => 
      l.managerApproved === true && l.financeApproved === null
    );
    return of(pendingLoans).pipe(delay(300));
  }

  approveByFinance(id: number, comments?: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Finance') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const loan = data.loans.find((l: MockLoan) => l.loanId === id);
      if (loan) {
        loan.financeApproved = true;
        loan.status = 'Approved';
        loan.financeId = currentUser.id;
        loan.financeComments = comments;
        loan.financeApprovedAt = new Date().toISOString();
      }
    });

    this.addAuditEntry('Finance Approved', 'Loan', id, currentUser.id, comments);
    return of({ success: true, message: 'Loan approved by finance' }).pipe(delay(500));
  }

  rejectByFinance(id: number, reason: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Finance') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const loan = data.loans.find((l: MockLoan) => l.loanId === id);
      if (loan) {
        loan.financeApproved = false;
        loan.status = 'Rejected';
        loan.financeId = currentUser.id;
        loan.financeComments = reason;
      }
    });

    return of({ success: true, message: 'Loan rejected by finance' }).pipe(delay(500));
  }

  // Reimbursement Methods
  getMyReimbursements(): Observable<MockReimbursement[]> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return of([]);
    
    const data = this.loadData();
    const reimbursements = data.reimbursements.filter((r: MockReimbursement) => r.employeeId === currentUser.id);
    return of(reimbursements).pipe(delay(300));
  }

  getReimbursementsByEmployee(employeeId: number): Observable<MockReimbursement[]> {
    const data = this.loadData();
    const reimbursements = data.reimbursements.filter((r: MockReimbursement) => r.employeeId === employeeId);
    return of(reimbursements).pipe(delay(300));
  }

  requestReimbursement(reimbData: any): Observable<MockReimbursement> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');

    const newReimbursement: MockReimbursement = {
      requestId: Date.now(),
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      category: reimbData.category,
      amount: reimbData.amount,
      description: reimbData.description,
      requestDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      managerApproved: null,
      financeApproved: null,
      submittedAt: new Date().toISOString(),
      documents: ['receipt.pdf', 'supporting_document.pdf']
    };

    this.updateData(data => {
      data.reimbursements.push(newReimbursement);
    });

    this.addAuditEntry('Reimbursement Request Submitted', 'Reimbursement', newReimbursement.requestId, currentUser.id, `${reimbData.category} - ₹${reimbData.amount}`);
    return of(newReimbursement).pipe(delay(500));
  }

  getPendingReimbursementApprovals(): Observable<MockReimbursement[]> {
    const data = this.loadData();
    const pending = data.reimbursements.filter((r: MockReimbursement) => r.managerApproved === null);
    return of(pending).pipe(delay(300));
  }

  approveReimbursementByManager(id: number, comments?: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Manager') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const reimbursement = data.reimbursements.find((r: MockReimbursement) => r.requestId === id);
      if (reimbursement) {
        reimbursement.managerApproved = true;
        reimbursement.status = 'ManagerApproved';
        reimbursement.managerId = currentUser.id;
        reimbursement.managerComments = comments;
      }
    });

    return of({ success: true, message: 'Reimbursement approved by manager' }).pipe(delay(500));
  }

  rejectReimbursementByManager(id: number, reason: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Manager') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const reimbursement = data.reimbursements.find((r: MockReimbursement) => r.requestId === id);
      if (reimbursement) {
        reimbursement.managerApproved = false;
        reimbursement.status = 'Rejected';
        reimbursement.managerId = currentUser.id;
        reimbursement.managerComments = reason;
      }
    });

    return of({ success: true, message: 'Reimbursement rejected by manager' }).pipe(delay(500));
  }

  getPendingReimbursementFinanceApprovals(): Observable<MockReimbursement[]> {
    const data = this.loadData();
    const pending = data.reimbursements.filter((r: MockReimbursement) => 
      r.managerApproved === true && r.financeApproved === null
    );
    return of(pending).pipe(delay(300));
  }

  approveReimbursementByFinance(id: number, comments?: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Finance') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const reimbursement = data.reimbursements.find((r: MockReimbursement) => r.requestId === id);
      if (reimbursement) {
        reimbursement.financeApproved = true;
        reimbursement.status = 'Approved';
        reimbursement.financeId = currentUser.id;
        reimbursement.financeComments = comments;
      }
    });

    return of({ success: true, message: 'Reimbursement approved by finance' }).pipe(delay(500));
  }

  rejectReimbursementByFinance(id: number, reason: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Finance') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const reimbursement = data.reimbursements.find((r: MockReimbursement) => r.requestId === id);
      if (reimbursement) {
        reimbursement.financeApproved = false;
        reimbursement.status = 'Rejected';
        reimbursement.financeId = currentUser.id;
        reimbursement.financeComments = reason;
      }
    });

    return of({ success: true, message: 'Reimbursement rejected by finance' }).pipe(delay(500));
  }

  // Insurance Methods
  getMyInsurances(): Observable<MockInsurance[]> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return of([]);
    
    const data = this.loadData();
    const insurances = data.insurances?.filter((i: MockInsurance) => i.employeeId === currentUser.id && i.isActive) || [];
    return of(insurances).pipe(delay(300));
  }

  hasActiveInsurance(): Observable<boolean> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return of(false);
    
    const data = this.loadData();
    const hasInsurance = data.insurances?.some((i: MockInsurance) => i.employeeId === currentUser.id && i.isActive) || false;
    return of(hasInsurance).pipe(delay(200));
  }

  // Medical Claims Methods
  getMyMedicalClaims(): Observable<MockMedicalClaim[]> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return of([]);
    
    const data = this.loadData();
    const claims = data.medicalClaims.filter((c: MockMedicalClaim) => c.employeeId === currentUser.id);
    return of(claims).pipe(delay(300));
  }

  submitMedicalClaim(claimData: any): Observable<MockMedicalClaim> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) throw new Error('User not logged in');

    const newClaim: MockMedicalClaim = {
      claimId: Date.now(),
      employeeId: currentUser.id,
      employeeName: currentUser.fullName,
      claimAmount: claimData.claimAmount,
      claimDate: claimData.claimDate,
      description: claimData.description,
      hospitalName: claimData.hospitalName,
      treatmentType: claimData.treatmentType,
      status: 'Pending',
      managerApproved: null,
      financeApproved: null,
      createdAt: new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString(),
      documents: ['medical_bill.pdf', 'prescription.pdf', 'medical_report.pdf']
    };

    this.updateData(data => {
      data.medicalClaims.push(newClaim);
    });

    this.addAuditEntry('Medical Claim Submitted', 'MedicalClaim', newClaim.claimId, currentUser.id, `${claimData.treatmentType} - ₹${claimData.claimAmount}`);
    return of(newClaim).pipe(delay(500));
  }

  // Payroll Methods
  getEmployeePayrolls(employeeId: number): Observable<MockPayroll[]> {
    const data = this.loadData();
    const payrolls = data.payrolls.filter((p: MockPayroll) => p.employeeId === employeeId);
    return of(payrolls).pipe(delay(300));
  }

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return of({});

    const data = this.loadData();
    
    if (currentUser.role === 'Employee') {
      const myLoans = data.loans.filter((l: MockLoan) => l.employeeId === currentUser.id);
      const myReimbursements = data.reimbursements.filter((r: MockReimbursement) => r.employeeId === currentUser.id);
      const myClaims = data.medicalClaims.filter((c: MockMedicalClaim) => c.employeeId === currentUser.id);
      
      return of({
        activeLoans: myLoans.filter((l: MockLoan) => l.status === 'Approved').length,
        pendingRequests: myLoans.filter((l: MockLoan) => l.status === 'Pending').length + 
                        myReimbursements.filter((r: MockReimbursement) => r.status === 'Pending').length,
        totalReimbursements: myReimbursements.length,
        totalClaims: myClaims.length
      }).pipe(delay(300));
    }
    
    if (currentUser.role === 'Manager') {
      return of({
        pendingLoanApprovals: data.loans.filter((l: MockLoan) => l.managerApproved === null).length,
        pendingReimbursementApprovals: data.reimbursements.filter((r: MockReimbursement) => r.managerApproved === null).length,
        totalApproved: data.loans.filter((l: MockLoan) => l.managerApproved === true).length +
                      data.reimbursements.filter((r: MockReimbursement) => r.managerApproved === true).length,
        totalRejected: data.loans.filter((l: MockLoan) => l.managerApproved === false).length +
                      data.reimbursements.filter((r: MockReimbursement) => r.managerApproved === false).length
      }).pipe(delay(300));
    }
    
    if (currentUser.role === 'Finance') {
      return of({
        pendingLoanApprovals: data.loans.filter((l: MockLoan) => l.managerApproved === true && l.financeApproved === null).length,
        pendingReimbursementApprovals: data.reimbursements.filter((r: MockReimbursement) => r.managerApproved === true && r.financeApproved === null).length,
        totalApproved: data.loans.filter((l: MockLoan) => l.financeApproved === true).length +
                      data.reimbursements.filter((r: MockReimbursement) => r.financeApproved === true).length,
        totalAmount: data.loans.filter((l: MockLoan) => l.financeApproved === true).reduce((sum: number, l: MockLoan) => sum + l.amount, 0) +
                    data.reimbursements.filter((r: MockReimbursement) => r.financeApproved === true).reduce((sum: number, r: MockReimbursement) => sum + r.amount, 0)
      }).pipe(delay(300));
    }

    return of({}).pipe(delay(300));
  }

  // Utility Methods
  private calculateEMI(amount: number, tenure: number): number {
    const rate = 0.12 / 12; // 12% annual rate
    return Math.round((amount * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1));
  }

  // Count methods for dashboard
  getPendingManagerCount(): Observable<number> {
    const data = this.loadData();
    const count = data.loans.filter((l: MockLoan) => l.managerApproved === null).length;
    return of(count).pipe(delay(200));
  }

  getPendingFinanceCount(): Observable<number> {
    const data = this.loadData();
    const count = data.loans.filter((l: MockLoan) => l.managerApproved === true && l.financeApproved === null).length;
    return of(count).pipe(delay(200));
  }

  getPendingReimbursementManagerCount(): Observable<number> {
    const data = this.loadData();
    const count = data.reimbursements.filter((r: MockReimbursement) => r.managerApproved === null).length;
    return of(count).pipe(delay(200));
  }

  getPendingReimbursementFinanceCount(): Observable<number> {
    const data = this.loadData();
    const count = data.reimbursements.filter((r: MockReimbursement) => r.managerApproved === true && r.financeApproved === null).length;
    return of(count).pipe(delay(200));
  }

  // Reset demo data (useful for presentations)
  resetDemoData(): void {
    const currentUser = this.getCurrentUser(); // Save current user
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY); // Clear user session too
    this.initializeData();
    this.dataSubject.next(this.loadData());
  }

  // Add audit trail entry
  addAuditEntry(action: string, entityType: string, entityId: number, userId: number, comments?: string): void {
    this.updateData(data => {
      if (!data.auditTrail) data.auditTrail = [];
      data.auditTrail.push({
        id: Date.now(),
        action,
        entityType,
        entityId,
        userId,
        timestamp: new Date().toISOString(),
        comments: comments || ''
      });
    });
  }

  // Get audit trail for entity
  getAuditTrail(entityType: string, entityId: number): any[] {
    const data = this.loadData();
    return data.auditTrail?.filter((entry: any) => 
      entry.entityType === entityType && entry.entityId === entityId
    ) || [];
  }

  // Medical Claims Manager/Finance Approval Methods
  getPendingMedicalClaimApprovals(): Observable<MockMedicalClaim[]> {
    const data = this.loadData();
    const pending = data.medicalClaims.filter((c: MockMedicalClaim) => c.managerApproved === null);
    return of(pending).pipe(delay(300));
  }

  approveMedicalClaimByManager(id: number, comments?: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Manager') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const claim = data.medicalClaims.find((c: MockMedicalClaim) => c.claimId === id);
      if (claim) {
        claim.managerApproved = true;
        claim.status = 'ManagerApproved';
        claim.managerId = currentUser.id;
        claim.managerComments = comments;
        claim.managerApprovedAt = new Date().toISOString();
      }
    });

    return of({ success: true, message: 'Medical claim approved by manager' }).pipe(delay(500));
  }

  rejectMedicalClaimByManager(id: number, reason: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Manager') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const claim = data.medicalClaims.find((c: MockMedicalClaim) => c.claimId === id);
      if (claim) {
        claim.managerApproved = false;
        claim.status = 'Rejected';
        claim.managerId = currentUser.id;
        claim.managerComments = reason;
      }
    });

    return of({ success: true, message: 'Medical claim rejected by manager' }).pipe(delay(500));
  }

  getPendingMedicalClaimFinanceApprovals(): Observable<MockMedicalClaim[]> {
    const data = this.loadData();
    const pending = data.medicalClaims.filter((c: MockMedicalClaim) => 
      c.managerApproved === true && c.financeApproved === null
    );
    return of(pending).pipe(delay(300));
  }

  approveMedicalClaimByFinance(id: number, comments?: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Finance') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const claim = data.medicalClaims.find((c: MockMedicalClaim) => c.claimId === id);
      if (claim) {
        claim.financeApproved = true;
        claim.status = 'Approved';
        claim.financeId = currentUser.id;
        claim.financeComments = comments;
        claim.financeApprovedAt = new Date().toISOString();
      }
    });

    return of({ success: true, message: 'Medical claim approved by finance' }).pipe(delay(500));
  }

  rejectMedicalClaimByFinance(id: number, reason: string): Observable<any> {
    const currentUser = this.getCurrentUser();
    if (!currentUser || currentUser.role !== 'Finance') {
      throw new Error('Unauthorized');
    }

    this.updateData(data => {
      const claim = data.medicalClaims.find((c: MockMedicalClaim) => c.claimId === id);
      if (claim) {
        claim.financeApproved = false;
        claim.status = 'Rejected';
        claim.financeId = currentUser.id;
        claim.financeComments = reason;
      }
    });

    return of({ success: true, message: 'Medical claim rejected by finance' }).pipe(delay(500));
  }

  // Get all data for admin view
  getAllData(): Observable<any> {
    return of(this.loadData()).pipe(delay(300));
  }
}