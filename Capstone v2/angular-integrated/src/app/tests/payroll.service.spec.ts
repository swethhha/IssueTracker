import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PayrollService } from '../services/payroll.service';
import { PayrollResponse, PayrollSummary } from '../models/payroll.models';
import { environment } from '../../environments/environment';

describe('PayrollService', () => {
  let service: PayrollService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PayrollService]
    });

    service = TestBed.inject(PayrollService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get my payrolls', () => {
    const mockPayrolls: PayrollResponse[] = [
      {
        id: 1,
        employeeId: 1,
        employeeName: 'John Doe',
        basicSalary: 5000,
        netPay: 4500,
        payPeriodStart: new Date('2024-01-01'),
        payPeriodEnd: new Date('2024-01-31'),
        status: 'Approved'
      }
    ];

    service.getMyPayrolls().subscribe(payrolls => {
      expect(payrolls).toEqual(mockPayrolls);
      expect(payrolls.length).toBe(1);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/payroll/my-payrolls`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPayrolls);
  });

  it('should get payroll summary', () => {
    const mockSummary: PayrollSummary = {
      totalEarnings: 60000,
      totalNetPay: 54000,
      payrollCount: 12
    };

    service.getPayrollSummary().subscribe(summary => {
      expect(summary).toEqual(mockSummary);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/payroll/summary`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSummary);
  });

  it('should approve payroll by manager', () => {
    const payrollId = 1;
    const comments = 'Approved by manager';

    service.approveByManager(payrollId, comments).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/payroll/${payrollId}/approve-manager?comments=${encodeURIComponent(comments)}`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Payroll approved by manager.' });
  });

  it('should reject payroll by manager', () => {
    const payrollId = 1;
    const reason = 'Incorrect calculations';

    service.rejectByManager(payrollId, reason).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/payroll/${payrollId}/reject-manager?reason=${encodeURIComponent(reason)}`);
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Payroll rejected by manager.' });
  });

  it('should get pending manager approvals count', () => {
    const mockCount = { pendingApprovals: 5 };

    service.getPendingManagerApprovals().subscribe(result => {
      expect(result).toEqual(mockCount);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/payroll/pending-manager`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCount);
  });
});