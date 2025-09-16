import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="brand-logo">
            <span class="material-icons">account_balance</span>
            <h1>Payroll360</h1>
          </div>
          <p class="auth-subtitle">Sign in to your account</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              class="form-control"
              formControlName="email"
              placeholder="Enter your email address"
              autocomplete="email"
            >
            <div class="form-error" *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">Email is required</span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">Please enter a valid email</span>
            </div>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password"
              class="form-control"
              formControlName="password"
              placeholder="Enter your password"
              autocomplete="current-password"
            >
            <div class="form-error" *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">Password is required</span>
            </div>
          </div>

          <div class="form-error" *ngIf="errorMessage">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-lg"
            [disabled]="loginForm.invalid || isLoading"
          >
            <span class="spinner" *ngIf="isLoading"></span>
            {{ isLoading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>Don't have an account? 
            <a routerLink="/register" class="auth-link">Create one here</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--primary-500) 0%, var(--secondary-500) 100%);
      padding: var(--spacing-lg);
    }
    
    .auth-card {
      background: var(--surface);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-4);
      padding: var(--spacing-3xl);
      width: 100%;
      max-width: 420px;
      backdrop-filter: blur(10px);
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }
    
    .brand-logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }
    
    .brand-logo .material-icons {
      font-size: 32px;
      color: var(--primary-500);
    }
    
    .brand-logo h1 {
      margin: 0;
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      background: linear-gradient(135deg, var(--primary-500), var(--secondary-500));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .auth-subtitle {
      color: var(--on-surface-variant);
      font-size: var(--font-size-base);
      margin: 0;
    }
    
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }
    
    .form-group label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--on-surface);
    }
    
    .form-control {
      padding: var(--spacing-md);
      border: 1px solid var(--outline);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      transition: all 0.2s ease;
      background-color: var(--surface);
    }
    
    .form-control:focus {
      outline: none;
      border-color: var(--primary-500);
      box-shadow: 0 0 0 3px var(--primary-100);
    }
    
    .form-error {
      color: var(--error-500);
      font-size: var(--font-size-sm);
      margin-top: var(--spacing-xs);
    }
    
    .btn {
      padding: var(--spacing-md) var(--spacing-lg);
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      min-height: 48px;
      width: 100%;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, var(--primary-500), var(--primary-600));
      color: white;
      box-shadow: var(--shadow-2);
    }
    
    .btn-primary:hover:not(:disabled) {
      background: linear-gradient(135deg, var(--primary-600), var(--primary-700));
      box-shadow: var(--shadow-3);
      transform: translateY(-1px);
    }
    
    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: var(--spacing-lg);
    }
    
    .auth-footer p {
      color: var(--on-surface-variant);
      font-size: var(--font-size-sm);
      margin: 0;
    }
    
    .auth-link {
      color: var(--primary-500);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
      transition: color 0.2s ease;
    }
    
    .auth-link:hover {
      color: var(--primary-700);
      text-decoration: underline;
    }
    
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 480px) {
      .auth-container {
        padding: var(--spacing-md);
      }
      
      .auth-card {
        padding: var(--spacing-2xl);
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        }
      });
    }
  }
}