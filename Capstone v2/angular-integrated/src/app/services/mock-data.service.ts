import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, delay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {
  private reimbursements: any[] = [];
  private loans: any[] = [];
  private users: any[] = [
    { id: 1, name: 'John Employee', role: 'Employee', email: 'employee@company.com' },
    { id: 2, name: 'Jane Manager', role: 'Manager', email: 'manager@company.com' },
    { id: 3, name: 'Bob Finance', role: 'FinanceAdmin', email: 'finance@company.com' }
  ];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    this.reimbursements = JSON.parse(localStorage.getItem('mock_reimbursements') || '[]');
    this.loans = JSON.parse(localStorage.getItem('mock_loans') || '[]');
  }

  private saveToStorage() {
    localStorage.setItem('mock_reimbursements', JSON.stringify(this.reimbursements));
    localStorage.setItem('mock_loans', JSON.stringify(this.loans));
  }

  // Reimbursement Methods
  submitReimbursement(data: any): Observable<any> {
    const reimbursement = {
      id: Date.now(),
      ...data,
      employeeId: 1,
      employeeName: 'John Employee',
      status: 'Pending',
      submittedDate: new Date(),
      managerApproved: null,
      financeApproved: null
    };
    
    this.reimbursements.push(reimbursement);
    this.saveToStorage();
    return of(reimbursement).pipe(delay(500));
  }

  getEmployeeReimbursements(employeeId: number): Observable<any[]> {
    return of(this.reimbursements.filter(r => r.employeeId === employeeId)).pipe(delay(300));
  }

  getPendingManagerApprovals(): Observable<any[]> {
    return of(this.reimbursements.filter(r => r.managerApproved === null)).pipe(delay(300));
  }

  getPendingFinanceApprovals(): Observable<any[]> {
    return of(this.reimbursements.filter(r => r.managerApproved === true && r.financeApproved === null)).pipe(delay(300));
  }

  approveByManager(id: number): Observable<any> {
    const item = this.reimbursements.find(r => r.id === id);
    if (item) {
      item.managerApproved = true;
      item.status = 'Manager Approved';
      this.saveToStorage();
    }
    return of(item).pipe(delay(500));
  }

  approveByFinance(id: number): Observable<any> {
    const item = this.reimbursements.find(r => r.id === id);
    if (item) {
      item.financeApproved = true;
      item.status = 'Approved';
      this.saveToStorage();
    }
    return of(item).pipe(delay(500));
  }

  // Loan Methods
  submitLoan(data: any): Observable<any> {
    const loan = {
      id: Date.now(),
      ...data,
      employeeId: 1,
      employeeName: 'John Employee',
      status: 'Pending',
      appliedDate: new Date(),
      managerApproved: null,
      financeApproved: null
    };
    
    this.loans.push(loan);
    this.saveToStorage();
    return of(loan).pipe(delay(500));
  }

  getEmployeeLoans(employeeId: number): Observable<any[]> {
    return of(this.loans.filter(l => l.employeeId === employeeId)).pipe(delay(300));
  }

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    return of({
      totalReimbursements: this.reimbursements.length,
      pendingManagerApprovals: this.reimbursements.filter(r => r.managerApproved === null).length,
      pendingFinanceApprovals: this.reimbursements.filter(r => r.managerApproved === true && r.financeApproved === null).length,
      totalLoans: this.loans.length
    }).pipe(delay(300));
  }
}