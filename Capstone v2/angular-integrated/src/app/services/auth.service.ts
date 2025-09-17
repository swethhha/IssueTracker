import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, of } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, AuthResponse, User } from '../models/auth.model';
import { MockPayrollService } from './mock-payroll.service';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7101/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private useMockData = true; // Toggle for demo mode

  constructor(private http: HttpClient, private router: Router, private mockService: MockPayrollService) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    if (this.useMockData) {
      return this.mockService.login(credentials.email, credentials.password)
        .pipe(
          map(response => {
            if (response) {
              const mockUser = this.mockService.getCurrentUser();
              if (mockUser) {
                const user: User = {
                  id: mockUser.id,
                  fullName: mockUser.fullName,
                  email: mockUser.email,
                  role: mockUser.role,
                  department: mockUser.department
                };
                this.setMockSession(response, user);
                this.redirectBasedOnRole(user.role);
                return response;
              }
            }
            throw new Error('Invalid credentials');
          })
        );
    }
    
    // Fallback to real API
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setSession(response);
          const user = this.parseTokenForUser(response.token);
          this.redirectBasedOnRole(user.role);
        })
      );
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.API_URL}/auth/register`, userData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.mockService.logout();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  private setSession(authResponse: AuthResponse): void {
    localStorage.setItem('token', authResponse.token);
    const user = this.parseTokenForUser(authResponse.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private setMockSession(authResponse: any, user: User): void {
    localStorage.setItem('token', authResponse.token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  private parseTokenForUser(token: string): User {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: parseInt(payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']),
        fullName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        department: payload['Department']
      };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr && userStr !== 'undefined') {
      try {
        const user = JSON.parse(userStr);
        this.currentUserSubject.next(user);
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }

  private redirectBasedOnRole(role: string): void {
    this.router.navigate(['/dashboard']);
  }
}