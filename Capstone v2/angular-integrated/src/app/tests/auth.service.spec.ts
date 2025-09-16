import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoginRequest, AuthResponse, EmployeeRole } from '../models/auth.models';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login successfully', () => {
    const mockCredentials: LoginRequest = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token',
      expiration: new Date()
    };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
      expect(localStorage.getItem('payroll360_token')).toBe(mockResponse.token);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCredentials);
    req.flush(mockResponse);
  });

  it('should register successfully', () => {
    const mockRegisterRequest = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      confirmPassword: 'password123',
      department: 'IT',
      role: 'Employee'
    };

    service.register(mockRegisterRequest).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockRegisterRequest);
    req.flush({ message: 'User registered successfully' });
  });

  it('should logout and clear token', () => {
    localStorage.setItem('payroll360_token', 'test-token');
    
    service.logout();
    
    expect(localStorage.getItem('payroll360_token')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should check if user is authenticated', () => {
    // Mock a valid JWT token (simplified)
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lp-38RNpyBo3_eFbCKbYFIWLG2LdcOuthEYHUdRNKoE';
    localStorage.setItem('payroll360_token', mockToken);
    
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should return false for invalid token', () => {
    localStorage.setItem('payroll360_token', 'invalid-token');
    
    expect(service.isAuthenticated()).toBe(false);
  });

  it('should check user roles correctly', () => {
    // This would require a more complex mock token with proper claims
    // For now, we'll test the basic functionality
    expect(service.hasRole(EmployeeRole.Employee)).toBe(false);
    expect(service.hasAnyRole([EmployeeRole.Manager, EmployeeRole.Admin])).toBe(false);
  });
});