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
      const initialData = {
        users: [
          { id: 1, username: 'john.doe', password: 'password', fullName: 'John Doe', email: 'john.doe@company.com', role: 'Employee', department: 'IT' },
          { id: 2, username: 'jane.manager', password: 'password', fullName: 'Jane Manager', email: 'jane.manager@company.com', role: 'Manager', department: 'IT' },
          { id: 3, username: 'bob.finance', password: 'password', fullName: 'Bob Finance', email: 'bob.finance@company.com', role: 'Finance', department: 'Finance' },
          { id: 4, username: 'alice.emp', password: 'password', fullName: 'Alice Smith', email: 'alice.smith@company.com', role: 'Employee', department: 'HR' },
          { id: 5, username: 'mike.emp', password: 'password', fullName: 'Mike Johnson', email: 'mike.johnson@company.com', role: 'Employee', department: 'IT' }
        ],
        insurances: [
          { id: 1, employeeId: 1, insuranceType: 'Health', provider: 'Star Health', policyNumber: 'SH001234', enrollmentDate: '2024-01-01', isActive: true, coverageAmount: 500000 },
          { id: 2, employeeId: 1, insuranceType: 'Dental', provider: 'Dental Care Plus', policyNumber: 'DC001234', enrollmentDate: '2024-01-01', isActive: true, coverageAmount: 50000 },
          { id: 3, employeeId: 4, insuranceType: 'Health', provider: 'HDFC ERGO', policyNumber: 'HE005678', enrollmentDate: '2024-01-01', isActive: true, coverageAmount: 300000 }
        ],
        loans: [
          {
            loanId: 1, employeeId: 1, employeeName: 'John Doe', loanType: 'Personal', amount: 50000, tenureMonths: 24,
            purpose: 'Home renovation', appliedDate: '2024-01-15', status: 'Pending', monthlyInstallment: 2273,
            managerApproved: null, financeApproved: null
          },
          {
            loanId: 2, employeeId: 4, employeeName: 'Alice Smith', loanType: 'Education', amount: 75000, tenureMonths: 36,
            purpose: 'MBA Course', appliedDate: '2024-01-10', status: 'ManagerApproved', monthlyInstallment: 2386,
            managerApproved: true, financeApproved: null, managerId: 2, managerComments: 'Approved for education'
          },
          {
            loanId: 3, employeeId: 5, employeeName: 'Mike Johnson', loanType: 'Medical', amount: 25000, tenureMonths: 12,
            purpose: 'Surgery expenses', appliedDate: '2024-01-05', status: 'Approved', monthlyInstallment: 2273,
            managerApproved: true, financeApproved: true, managerId: 2, financeId: 3
          }
        ],
        reimbursements: [
          {
            requestId: 1, employeeId: 1, employeeName: 'John Doe', category: 'Travel', amount: 5000,
            description: 'Client meeting travel', requestDate: '2024-01-20', status: 'Pending',
            managerApproved: null, financeApproved: null
          },
          {
            requestId: 2, employeeId: 4, employeeName: 'Alice Smith', category: 'Training', amount: 3000,
            description: 'AWS certification course', requestDate: '2024-01-18', status: 'ManagerApproved',
            managerApproved: true, financeApproved: null, managerId: 2
          },
          {
            requestId: 3, employeeId: 5, employeeName: 'Mike Johnson', category: 'Food', amount: 1500,
            description: 'Team lunch expenses', requestDate: '2024-01-15', status: 'Approved',
            managerApproved: true, financeApproved: true, managerId: 2, financeId: 3
          }
        ],
        medicalClaims: [
          {
            claimId: 1, employeeId: 1, employeeName: 'John Doe', claimAmount: 15000,
            claimDate: '2024-01-22', description: 'Emergency surgery', hospitalName: 'City Hospital',
            treatmentType: 'Surgery', status: 'Pending', managerApproved: null, financeApproved: null,
            createdAt: '2024-01-22'
          },
          {
            claimId: 2, employeeId: 4, employeeName: 'Alice Smith', claimAmount: 2500,
            claimDate: '2024-01-19', description: 'Dental treatment', hospitalName: 'Dental Care',
            treatmentType: 'Dental', status: 'ManagerApproved', managerApproved: true, financeApproved: null,
            managerId: 2, createdAt: '2024-01-19'
          }
        ],
        payrolls: [
          {
            id: 1, employeeId: 1, employeeName: 'John Doe', basicSalary: 50000, allowances: 5000,
            deductions: 3000, netPay: 52000, payPeriodStart: '2024-01-01', payPeriodEnd: '2024-01-31',
            status: 'Approved', generatedDate: '2024-02-01'
          },
          {
            id: 2, employeeId: 4, employeeName: 'Alice Smith', basicSalary: 60000, allowances: 6000,
            deductions: 4000, netPay: 62000, payPeriodStart: '2024-01-01', payPeriodEnd: '2024-01-31',
            status: 'Approved', generatedDate: '2024-02-01'
          },
          {
            id: 3, employeeId: 5, employeeName: 'Mike Johnson', basicSalary: 45000, allowances: 4500,
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
    const user = data.users.find((u: MockUser) => u.email === email && u.password === password);
    
    if (user) {
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
      return of({ 
        token: 'mock-jwt-token-' + user.id, 
        expiration: new Date(Date.now() + 3600000).toISOString() 
      }).pipe(delay(500));
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
      financeApproved: null
    };

    this.updateData(data => {
      data.loans.push(newLoan);
    });

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
      }
    });

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
      }
    });

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
      financeApproved: null
    };

    this.updateData(data => {
      data.reimbursements.push(newReimbursement);
    });

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
      createdAt: new Date().toISOString().split('T')[0]
    };

    this.updateData(data => {
      data.medicalClaims.push(newClaim);
    });

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
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.CURRENT_USER_KEY);
    this.initializeData();
  }

  // Get all data for admin view
  getAllData(): Observable<any> {
    return of(this.loadData()).pipe(delay(300));
  }
}